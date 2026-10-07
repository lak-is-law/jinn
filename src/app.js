/* ==========================================================================
   JINN ORACLE 2.0 — MODERN REACTIVE CLIENT ARCHITECTURE
   ========================================================================== */

// Offline Static Fallback Archive (used only if server connection drops)
const STATIC_ARCHIVE = `Albert Einstein|Physicist who reshaped space and time
Marie Curie|Pioneer of radioactivity, two Nobel Prizes
Isaac Newton|Father of classical mechanics
Nikola Tesla|Inventor of AC power systems
Leonardo da Vinci|Renaissance painter and polymath
Pablo Picasso|Co-founder of Cubism
Vincent van Gogh|Post-impressionist painter
William Shakespeare|Playwright of Hamlet and Macbeth
Wolfgang Mozart|Classical composer prodigy
Michael Jackson|King of Pop
Beyoncé|Global pop and R&B icon
Taylor Swift|Songwriter and stadium-filling pop star
Mahatma Gandhi|Led India's non-violent independence movement
Nelson Mandela|Ended apartheid, became president
Martin Luther King Jr.|Civil rights leader
Abraham Lincoln|16th US president
Napoleon Bonaparte|French emperor and military genius
Cleopatra|Last active pharaoh of Egypt
Steve Jobs|Co-founder of Apple
Elon Musk|Founder of Tesla and SpaceX
Bill Gates|Co-founder of Microsoft
Lionel Messi|Argentine football superstar
Cristiano Ronaldo|Portuguese football superstar
Sachin Tendulkar|Legendary cricketer from India
Aftab Iqbal|Pakistani television host and satirist
Hamid Mir|Pakistani journalist and news anchor
Malala Yousafzai|Youngest Nobel Peace laureate
Gautama Buddha|Founder of Buddhism
Stephen Hawking|Cosmologist and theoretical physicist
Frida Kahlo|Iconic Mexican painter
Charlie Chaplin|Legend of silent cinema
Steven Spielberg|Acclaimed Hollywood film director
Barack Obama|44th US president`.split('\n').map(l => {
  const [n, d] = l.split('|');
  return { n, d };
});

// State Management
const STATE = {
  screen: 'intro', // 'intro' | 'ask' | 'think' | 'guess' | 'win' | 'lose'
  answers: [],     // [[questionText, answerIdx]]
  rejected: [],    // [rejectedCandidateNames]
  currentQuestion: null,
  currentCandidate: null,
  notice: ''
};

// Player Stats & Local Storage
let STATS = { games: 0, wins: 0, stumped: 0, history: [] };
let PROFILE = null;

try {
  const savedStats = localStorage.getItem('jinn:stats:v2');
  if (savedStats) STATS = JSON.parse(savedStats);
  const savedProfile = localStorage.getItem('jinn:profile');
  if (savedProfile) PROFILE = JSON.parse(savedProfile);
} catch (e) {
  console.warn('Storage read warning', e);
}

function saveStats() {
  try {
    localStorage.setItem('jinn:stats:v2', JSON.stringify(STATS));
  } catch (e) {}
}

// Themes Configuration
const THEMES = [
  { id: 'theme-midnight', name: 'Midnight Tomb' },
  { id: 'theme-illuminati', name: 'Illuminati Order' },
  { id: 'theme-desert', name: 'Desert Sunset' },
  { id: 'theme-oasis', name: 'Oasis Emerald' },
  { id: 'theme-amethyst', name: 'Royal Sultan' }
];
let currentThemeIndex = 0;

try {
  const savedTheme = localStorage.getItem('jinn:theme');
  if (savedTheme) {
    const idx = THEMES.findIndex(t => t.id === savedTheme);
    if (idx !== -1) currentThemeIndex = idx;
  }
} catch (e) {}

function applyTheme(idx) {
  currentThemeIndex = (idx + THEMES.length) % THEMES.length;
  const theme = THEMES[currentThemeIndex];
  THEMES.forEach(t => document.body.classList.remove(t.id));
  document.body.classList.add(theme.id);
  try { localStorage.setItem('jinn:theme', theme.id); } catch (e) {}
  const themeLabel = document.getElementById('themeName');
  if (themeLabel) themeLabel.textContent = theme.name;
  render();
}

// Audio Engine (Authentic Middle Eastern Instrumental BGM)
const bgm = new Audio('/audio/arabian-nights.mp3');
bgm.loop = true;
bgm.volume = 0.32;
let isMusicActive = false;

function toggleMusic() {
  const btn = document.getElementById('musicBtn');
  const label = document.getElementById('musicLabel');
  if (isMusicActive) {
    bgm.pause();
    isMusicActive = false;
    if (btn) btn.classList.remove('active');
    if (label) label.textContent = 'Music';
  } else {
    bgm.play().then(() => {
      isMusicActive = true;
      if (btn) btn.classList.add('active');
      if (label) label.textContent = 'Playing';
    }).catch(e => console.log('Autoplay restriction:', e));
  }
}

// Mascot SVG Generator (Genie / All-Seeing Eye of Providence)
function renderMascot(emotion = 'idle') {
  const isIlluminati = document.body.classList.contains('theme-illuminati');

  if (isIlluminati) {
    return `<svg class="mascot-svg" viewBox="0 0 200 240" fill="none">
      <defs>
        <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#00ff9d" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#00ff9d" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="pyrGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0d3822"/>
          <stop offset="100%" stop-color="#02140a"/>
        </linearGradient>
      </defs>
      <circle cx="100" cy="110" r="85" stroke="rgba(0,255,157,0.2)" stroke-width="1.5" stroke-dasharray="4,4"/>
      <circle cx="100" cy="110" r="70" fill="url(#eyeGlow)" opacity="0.3"/>
      <!-- Pyramid Base -->
      <polygon points="100,20 25,180 175,180" fill="url(#pyrGrad)" stroke="#00ff9d" stroke-width="2"/>
      <line x1="45" y1="140" x2="155" y2="140" stroke="rgba(0,255,157,0.3)" stroke-width="1.5"/>
      <line x1="60" y1="110" x2="140" y2="110" stroke="rgba(0,255,157,0.3)" stroke-width="1.5"/>
      <!-- Floating Eye of Providence -->
      <polygon points="100,20 65,85 135,85" fill="#031f10" stroke="#00ff9d" stroke-width="2.5"/>
      <path d="M78 62Q100 44 122 62Q100 80 78 62Z" fill="#021208" stroke="#00ff9d" stroke-width="2"/>
      <circle cx="100" cy="62" r="8" fill="#00ff9d"/>
      <circle cx="100" cy="62" r="3.5" fill="#021208"/>
      <circle cx="98" cy="60" r="1.5" fill="#fff"/>
    </svg>`;
  }

  // Classic Genie Mascot
  const mouthPaths = {
    win: 'M80 92Q100 114 120 92Z',
    lose: 'M82 98Q100 90 118 98',
    guess: 'M80 90Q100 106 120 90Z',
    idle: 'M82 92Q100 100 118 92'
  };
  const mouth = mouthPaths[emotion] || mouthPaths.idle;

  return `<svg class="mascot-svg" viewBox="0 0 200 240">
    <defs>
      <radialGradient id="genieSkin" cx="40%" cy="30%">
        <stop offset="0%" stop-color="#93c5fd"/>
        <stop offset="100%" stop-color="#2563eb"/>
      </radialGradient>
      <radialGradient id="turbanGrad" cx="50%" cy="30%">
        <stop offset="0%" stop-color="#fde047"/>
        <stop offset="100%" stop-color="#ca8a04"/>
      </radialGradient>
      <radialGradient id="smokeAura">
        <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="#38bdf8" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <!-- Aura -->
    <circle cx="100" cy="95" r="90" fill="url(#smokeAura)"/>
    <!-- Tail Smoke -->
    <path d="M70 145C50 175 75 195 95 215C102 225 96 235 100 240C104 235 98 225 105 215C125 195 150 175 130 145Z" fill="#3b82f6" opacity="0.85"/>
    <!-- Body & Vest -->
    <path d="M60 145Q60 110 100 105Q140 110 140 145Z" fill="#1e3a8a"/>
    <path d="M62 120Q100 152 138 120L130 115Q100 138 70 115Z" fill="url(#turbanGrad)"/>
    <!-- Head -->
    <ellipse cx="100" cy="68" rx="30" ry="34" fill="url(#genieSkin)"/>
    <!-- Eyes -->
    <g>
      <path d="M78 62Q88 54 98 62Q88 70 78 62Z" fill="#fff" stroke="#0f172a" stroke-width="2"/>
      <path d="M102 62Q112 54 122 62Q112 70 102 62Z" fill="#fff" stroke="#0f172a" stroke-width="2"/>
      <circle cx="88" cy="62" r="4.5" fill="#e11d48"/>
      <circle cx="112" cy="62" r="4.5" fill="#e11d48"/>
      <circle cx="88" cy="62" r="2" fill="#000"/>
      <circle cx="112" cy="62" r="2" fill="#000"/>
    </g>
    <!-- Eyebrows & Nose -->
    <path d="M74 52L96 58M126 52L104 58" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>
    <path d="M100 66L96 78Q100 80 104 78" stroke="#1e40af" fill="none" stroke-width="2"/>
    <!-- Mouth -->
    <path d="${mouth}" fill="${emotion === 'win' ? '#fff' : 'none'}" stroke="#0f172a" stroke-width="3" stroke-linejoin="round"/>
    <!-- Turban & Ruby -->
    <path d="M68 50Q70 18 100 18Q130 18 132 50Q100 36 68 50Z" fill="url(#turbanGrad)"/>
    <path d="M100 12Q94 20 96 28Q100 34 104 28Q106 20 100 12Z" fill="#e11d48" stroke="#ca8a04" stroke-width="2"/>
  </svg>`;
}

// Lore Dialogues
const LORE = {
  standard: {
    intro: 'Hold any living or historical soul firmly in thought. I shall deduce who they are within 20 questions.',
    thinking: 'Scanning the global records… eliminating contradictions…',
    guess: 'The sands have cleared. I gaze into your thoughts…',
    win: 'Another mind unveiled. None elude the Jinn.',
    lose: 'Incredible… your subject transcends my knowledge. You have triumphed!'
  },
  illuminati: {
    intro: 'The All-Seeing Eye awakens. Think of any person worldwide; the secret dossier already holds their name.',
    thinking: 'Accessing classified intelligence network… filtering subjects…',
    guess: 'The Order has decrypted your consciousness. The subject is verified…',
    win: 'The Grand Architect is never mistaken. Dossier finalized.',
    lose: 'An anomaly in the archives… you have slipped through our observation!'
  }
};

// API Deduction Engine Dispatcher
async function fetchDeduction() {
  const response = await fetch('/api/jinn', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ans: STATE.answers,
      rej: STATE.rejected
    })
  });
  if (!response.ok) throw new Error('API ' + response.status);
  return await response.json();
}

// Next Step Controller
async function progressTurn() {
  if (STATE.rejected.length >= 4) {
    STATE.screen = 'lose';
    STATS.games++;
    STATS.stumped++;
    saveStats();
    render();
    return;
  }

  STATE.screen = 'think';
  render();

  try {
    const data = await fetchDeduction();
    if (data.type === 'guess' && data.name) {
      STATE.currentCandidate = { name: data.name, description: data.description || '' };
      STATE.screen = 'guess';
    } else if (data.text) {
      STATE.currentQuestion = data.text;
      STATE.screen = 'ask';
    } else {
      throw new Error('Malformed AI response');
    }
  } catch (err) {
    console.warn('API fallback engaged:', err);
    // Offline deterministic bisection fallback
    const qCount = STATE.answers.length;
    if (qCount >= 12 || qCount >= STATIC_ARCHIVE.length) {
      const match = STATIC_ARCHIVE.find(c => !STATE.rejected.includes(c.n)) || STATIC_ARCHIVE[0];
      STATE.currentCandidate = { name: match.n, description: match.d };
      STATE.screen = 'guess';
    } else {
      const questions = [
        "Is your person alive today?",
        "Are they male?",
        "Are they from Asia or the Middle East?",
        "Are they known for entertainment, arts or media?",
        "Are they a politician or world leader?",
        "Are they known for professional sports?",
        "Are they a scientist or business founder?"
      ];
      STATE.currentQuestion = questions[qCount % questions.length];
      STATE.screen = 'ask';
    }
  }

  render();
}

// Reactive Render Loop
function render() {
  const container = document.getElementById('game-card');
  if (!container) return;

  const isIlluminati = document.body.classList.contains('theme-illuminati');
  const dialogue = isIlluminati ? LORE.illuminati : LORE.standard;
  const qNum = STATE.answers.length;
  const isPlaying = STATE.screen === 'ask' || STATE.screen === 'think';

  // Status Bar Markup
  let headerHtml = `
    <div class="status-bar">
      <div class="progress-info">
        <span class="question-badge">${isPlaying ? `Q ${Math.min(20, qNum + 1)} / 20` : 'ORACLE'}</span>
        <div class="confidence-tracker">
          ${Array.from({ length: 10 }).map((_, i) => `<span class="tracker-cell ${i < Math.min(10, Math.floor(qNum / 2) + 1) ? 'filled' : ''}"></span>`).join('')}
        </div>
      </div>
      <div class="brand-sub">${isIlluminati ? 'ORDER OF PROVIDENCE' : 'EGYPTIAN BISECTION'}</div>
    </div>
  `;

  let bodyHtml = '';

  if (STATE.screen === 'intro') {
    bodyHtml = `
      <div class="inscription-capsule">
        <div class="inscription-text">${PROFILE ? `Welcome, ${PROFILE.name}. ` : ''}${dialogue.intro}</div>
      </div>
      <div class="stats-strip">
        <div class="stat-item"><span class="stat-num">${STATS.games}</span><span class="stat-label">Rounds</span></div>
        <div class="stat-item"><span class="stat-num">${STATS.wins}</span><span class="stat-label">Deduced</span></div>
        <div class="stat-item"><span class="stat-num">${STATS.stumped}</span><span class="stat-label">Stumped</span></div>
      </div>
      <button class="btn-primary" id="btn-start">Begin Deduction</button>
    `;
  }

  if (STATE.screen === 'ask') {
    const options = ["Yes", "Probably", "Probably not", "No"];
    bodyHtml = `
      <div class="inscription-capsule">
        <div class="inscription-text">${STATE.currentQuestion || 'Focusing thoughts…'}</div>
      </div>
      <div class="answer-grid">
        ${options.map((opt, idx) => `
          <button class="answer-card ans-${idx}" data-choice="${idx}">
            <span class="card-key">${idx + 1}</span>
            <span class="card-label">${opt}</span>
          </button>
        `).join('')}
      </div>
      <div class="control-footer">
        <button id="btn-undo" class="footer-btn" ${qNum === 0 ? 'disabled' : ''}>← Undo</button>
        <button id="btn-restart" class="footer-btn danger">Restart</button>
      </div>
    `;
  }

  if (STATE.screen === 'think') {
    bodyHtml = `
      <div class="inscription-capsule">
        <div class="inscription-text">${dialogue.thinking}</div>
      </div>
      <div class="pulse-indicator">
        <span class="pulse-dot"></span>
        <span class="pulse-dot"></span>
        <span class="pulse-dot"></span>
      </div>
    `;
  }

  if (STATE.screen === 'guess') {
    bodyHtml = `
      <div class="inscription-capsule">
        <div class="inscription-text">${dialogue.guess}</div>
      </div>
      <div class="guess-cartouche">
        <h2 class="guess-name">${STATE.currentCandidate?.name || 'Unknown'}</h2>
        <p class="guess-desc">${STATE.currentCandidate?.description || ''}</p>
      </div>
      <div class="action-row-split">
        <button class="btn-primary" id="btn-guess-yes">Yes, That Is Them</button>
        <button class="btn-secondary" id="btn-guess-no">No, Keep Guessing</button>
      </div>
    `;
  }

  if (STATE.screen === 'win') {
    bodyHtml = `
      <div class="inscription-capsule">
        <div class="inscription-text">${dialogue.win}</div>
      </div>
      <div class="guess-cartouche">
        <h2 class="guess-name">${STATE.currentCandidate?.name}</h2>
        <p class="guess-desc">Unearthed in ${qNum} questions.</p>
      </div>
      <div class="action-row-split">
        <button class="btn-primary" id="btn-replay">Play Again</button>
        <button class="btn-secondary" id="btn-share">Share Result</button>
      </div>
    `;
  }

  if (STATE.screen === 'lose') {
    bodyHtml = `
      <div class="inscription-capsule">
        <div class="inscription-text">${dialogue.lose}</div>
      </div>
      <button class="btn-primary" id="btn-replay">Play Again</button>
    `;
  }

  // Assemble Complete Workspace
  container.innerHTML = `
    ${headerHtml}
    <div class="oracle-stage">
      <div class="mascot-chamber">
        ${renderMascot(STATE.screen)}
      </div>
      <div class="interactive-panel">
        ${bodyHtml}
      </div>
    </div>
  `;

  attachEventHandlers();
}

// Event Bindings
function attachEventHandlers() {
  const on = (id, fn) => {
    const el = document.getElementById(id);
    if (el) el.onclick = fn;
  };

  on('btn-start', () => {
    if (!isMusicActive) toggleMusic();
    STATE.screen = 'ask';
    STATE.answers = [];
    STATE.rejected = [];
    progressTurn();
  });

  document.querySelectorAll('[data-choice]').forEach(btn => {
    btn.onclick = () => {
      const choice = parseInt(btn.dataset.choice, 10);
      STATE.answers.push([STATE.currentQuestion, choice]);
      progressTurn();
    };
  });

  on('btn-undo', () => {
    if (STATE.answers.length > 0) {
      STATE.answers.pop();
      progressTurn();
    }
  });

  on('btn-restart', () => {
    STATE.screen = 'intro';
    STATE.answers = [];
    STATE.rejected = [];
    STATE.currentCandidate = null;
    render();
  });

  on('btn-guess-yes', () => {
    STATS.games++;
    STATS.wins++;
    STATS.history.unshift({ name: STATE.currentCandidate.name, questions: STATE.answers.length });
    STATS.history = STATS.history.slice(0, 10);
    saveStats();
    STATE.screen = 'win';
    render();
  });

  on('btn-guess-no', () => {
    if (STATE.currentCandidate) {
      STATE.rejected.push(STATE.currentCandidate.name);
    }
    progressTurn();
  });

  on('btn-replay', () => {
    STATE.screen = 'intro';
    STATE.answers = [];
    STATE.rejected = [];
    STATE.currentCandidate = null;
    render();
  });

  on('btn-share', () => {
    const text = `The Jinn unearthed ${STATE.currentCandidate?.name} in ${STATE.answers.length} questions on jinn.lakshya.uk!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById('btn-share');
        if (btn) btn.textContent = 'Copied to Clipboard';
      });
    }
  });
}

// Global Nav Listeners
document.getElementById('themeBtn')?.addEventListener('click', () => applyTheme(currentThemeIndex + 1));
document.getElementById('musicBtn')?.addEventListener('click', toggleMusic);

// Keyboard Shortcuts (1-4 for answers)
window.addEventListener('keydown', e => {
  if (STATE.screen === 'ask' && /^[1-4]$/.test(e.key)) {
    const btn = document.querySelector(`[data-choice="${parseInt(e.key, 10) - 1}"]`);
    if (btn) btn.click();
  }
});

// Modal Controller
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');

function openModal(title, content) {
  if (modalTitle) modalTitle.textContent = title;
  if (modalBody) modalBody.innerHTML = content;
  if (modal) modal.classList.add('active');
}

function closeModal() {
  if (modal) modal.classList.remove('active');
}

document.querySelectorAll('[data-close]').forEach(b => b.onclick = closeModal);
modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });

document.querySelector('[data-action="how"]')?.addEventListener('click', () => {
  openModal('Oracle Rules', `
    <p>1. Think of any famous or notable person (living or historical, from any country on Earth).</p>
    <p>2. Answer the Jinn truthfully using the 4 options: <b>Yes</b>, <b>Probably</b>, <b>Probably not</b>, or <b>No</b> (keys 1-4).</p>
    <p>3. The Jinn uses mathematical bisection and deductive reasoning to guess your subject within 20 questions.</p>
  `);
});

document.querySelector('[data-action="stats"]')?.addEventListener('click', () => {
  const accuracy = STATS.games ? Math.round((STATS.wins / STATS.games) * 100) : 0;
  const recent = STATS.history.map(h => `<p style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.06)"><span>${h.name}</span><span style="opacity:0.6">${h.questions} questions</span></p>`).join('') || '<p style="opacity:0.6">No games recorded yet.</p>';
  openModal('Tomb Archives', `
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;text-align:center;margin-bottom:18px;">
      <div style="padding:10px;background:rgba(255,255,255,0.04);border-radius:8px"><b>${STATS.games}</b><div style="font-size:11px;opacity:0.6">Games</div></div>
      <div style="padding:10px;background:rgba(255,255,255,0.04);border-radius:8px"><b>${STATS.wins}</b><div style="font-size:11px;opacity:0.6">Guessed</div></div>
      <div style="padding:10px;background:rgba(255,255,255,0.04);border-radius:8px"><b>${accuracy}%</b><div style="font-size:11px;opacity:0.6">Accuracy</div></div>
    </div>
    <h4 style="font-size:12px;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:8px;opacity:0.8">Recent Souls</h4>
    ${recent}
  `);
});

document.getElementById('loginBtn')?.addEventListener('click', () => {
  if (PROFILE) {
    openModal('Account Profile', `
      <p>Logged in as <b>${PROFILE.name}</b></p>
      <button class="btn-secondary" id="btn-logout" style="margin-top:12px">Sign Out</button>
    `);
    document.getElementById('btn-logout')?.addEventListener('click', () => {
      PROFILE = null;
      localStorage.removeItem('jinn:profile');
      document.getElementById('profileName').textContent = 'Sign In';
      closeModal();
      render();
    });
  } else {
    openModal('Traveler Profile', `
      <p>Save your archives and history to this device.</p>
      <input type="text" id="input-username" class="modal-input" placeholder="Enter your name" maxlength="20" />
      <button class="btn-primary" id="btn-save-profile">Create Profile</button>
    `);
    document.getElementById('btn-save-profile')?.addEventListener('click', () => {
      const name = (document.getElementById('input-username')?.value || '').trim();
      if (!name) return;
      PROFILE = { name };
      localStorage.setItem('jinn:profile', JSON.stringify(PROFILE));
      document.getElementById('profileName').textContent = name;
      closeModal();
      render();
    });
  }
});

// Ambient Canvas Particle Generator
const canvas = document.getElementById('ambient-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = Array.from({ length: 45 }).map(() => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 2 + 0.5,
    speedY: -Math.random() * 0.4 - 0.1,
    opacity: Math.random() * 0.6 + 0.2
  }));

  function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#fff';
    particles.forEach(p => {
      p.y += p.speedY;
      if (p.y < 0) { p.y = height; p.x = Math.random() * width; }
      ctx.globalAlpha = p.opacity;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

// Initial Boot
if (PROFILE) {
  const profileLabel = document.getElementById('profileName');
  if (profileLabel) profileLabel.textContent = PROFILE.name;
}
applyTheme(currentThemeIndex);
