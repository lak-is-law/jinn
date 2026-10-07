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
// Magical Golden Lamp SVG
const LAMP_SVG = `<svg class="lampsvg" viewBox="0 0 200 80">
  <path d="M30 40C30 66 70 76 100 76C130 76 170 66 170 40Z" fill="#c9922c"/>
  <path d="M26 38H174" stroke="#f0c860" stroke-width="6" stroke-linecap="round"/>
  <path d="M170 40C186 34 192 22 196 12C184 20 176 24 168 28Z" fill="#c9922c"/>
  <path d="M30 42C10 40 6 24 18 18" stroke="#c9922c" stroke-width="6" fill="none"/>
  <ellipse cx="100" cy="40" rx="30" ry="6" fill="#f0c860"/>
  <path d="M70 60Q100 70 130 60" stroke="#8a5f1a" stroke-width="3" fill="none"/>
</svg>`;

// Mascot SVG Generator (Genie with Lamp & Bottom Smoke OR Gold/Platinum/Black Eye of Providence)
function renderMascot(emotion = 'idle') {
  const isIlluminati = document.body.classList.contains('theme-illuminati');

  if (isIlluminati) {
    // Pure Gold, Black, and Platinum Illuminati Pyramid & All-Seeing Eye
    const eyeStroke = emotion === 'win' ? '#f5d061' : emotion === 'lose' ? '#cbd5e1' : '#e6b84a';
    return `<div class="mascot-chamber">
      <svg class="mascot-svg mascot-illuminati" viewBox="0 0 200 240" fill="none" style="overflow:visible">
        <defs>
          <radialGradient id="illumGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#f5d061" stop-opacity="0.6"/>
            <stop offset="100%" stop-color="#d4af37" stop-opacity="0"/>
          </radialGradient>
          <linearGradient id="pyrGradGold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#18181f"/>
            <stop offset="100%" stop-color="#08080a"/>
          </linearGradient>
          <linearGradient id="goldMetallic" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#fdf0cd"/>
            <stop offset="50%" stop-color="#d4af37"/>
            <stop offset="100%" stop-color="#997210"/>
          </linearGradient>
          <linearGradient id="platinumMetallic" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="50%" stop-color="#e2e8f0"/>
            <stop offset="100%" stop-color="#94a3b8"/>
          </linearGradient>
          <filter id="goldShine">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
        </defs>
        <!-- Sacred Geometry Platinum Ring -->
        <circle cx="100" cy="115" r="88" stroke="url(#platinumMetallic)" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.6"/>
        <circle cx="100" cy="115" r="72" fill="url(#illumGlow)" opacity="0.4"/>
        <!-- Great Obsidian Pyramid Base -->
        <polygon points="100,22 24,182 176,182" fill="url(#pyrGradGold)" stroke="url(#goldMetallic)" stroke-width="2.5"/>
        <!-- Platinum Masonry Mortar Lines -->
        <line x1="44" y1="148" x2="156" y2="148" stroke="url(#platinumMetallic)" stroke-width="1.2" opacity="0.7"/>
        <line x1="58" y1="120" x2="142" y2="120" stroke="url(#platinumMetallic)" stroke-width="1.2" opacity="0.7"/>
        <line x1="72" y1="94" x2="128" y2="94" stroke="url(#platinumMetallic)" stroke-width="1.2" opacity="0.7"/>
        <!-- Floating Golden Capstone -->
        <polygon points="100,22 66,88 134,88" fill="#121218" stroke="url(#goldMetallic)" stroke-width="2.5" filter="url(#goldShine)"/>
        <!-- Eye of Providence -->
        <g class="genie-eyes" transform="translate(0, 4)">
          <path d="M78 64Q100 46 122 64Q100 82 78 64Z" fill="#08080c" stroke="url(#platinumMetallic)" stroke-width="2"/>
          <circle cx="100" cy="64" r="8.5" fill="url(#goldMetallic)"/>
          <ellipse cx="100" cy="64" rx="3.5" ry="7.5" fill="#000"/>
          <circle cx="98" cy="62" r="1.8" fill="#fff"/>
        </g>
        <!-- Golden Meridian Compass Lines -->
        <line x1="100" y1="184" x2="100" y2="224" stroke="url(#goldMetallic)" stroke-width="2" opacity="0.8"/>
        <line x1="24" y1="182" x2="10" y2="212" stroke="url(#platinumMetallic)" stroke-width="1.8" opacity="0.6"/>
        <line x1="176" y1="182" x2="190" y2="212" stroke="url(#platinumMetallic)" stroke-width="1.8" opacity="0.6"/>
        <circle cx="100" cy="226" r="4.5" fill="url(#goldMetallic)"/>
      </svg>
    </div>`;
  }

  // Classic Genie Mascot with Golden Lamp & Volumetric Smoke
  const mouthPaths = {
    win: 'M80 92Q100 114 120 92Z',
    lose: 'M82 98Q100 90 118 98',
    guess: 'M80 90Q100 106 120 90Z',
    idle: 'M82 92Q100 100 118 92'
  };
  const mouth = mouthPaths[emotion] || mouthPaths.idle;

  return `<div class="mascot-chamber">
    <svg class="mascot-svg" viewBox="0 0 200 250" style="overflow:visible">
      <defs>
        <linearGradient id="smkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#27407a"/>
          <stop offset="100%" stop-color="#6f8fd0" stop-opacity="0.9"/>
        </linearGradient>
        <radialGradient id="genieHead" cx="0.4" cy="0.3">
          <stop offset="0%" stop-color="#8fb0d4"/>
          <stop offset="100%" stop-color="#3a527f"/>
        </radialGradient>
        <radialGradient id="genieAura">
          <stop offset="0%" stop-color="#1fa6a0" stop-opacity="0.35"/>
          <stop offset="60%" stop-color="#d9341c" stop-opacity="0.12"/>
          <stop offset="100%" stop-color="#000" stop-opacity="0"/>
        </radialGradient>
        <filter id="smokeTurb" x="-40%" y="-10%" width="180%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency="0.015 0.035" numOctaves="2" seed="3">
            <animate attributeName="baseFrequency" dur="8s" values="0.015 0.035;0.025 0.055;0.015 0.035" repeatCount="indefinite"/>
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" scale="18"/>
          <feGaussianBlur stdDeviation="2"/>
        </filter>
        <filter id="smokeBlur">
          <feGaussianBlur stdDeviation="4"/>
        </filter>
      </defs>

      <!-- Mystic Aura -->
      <circle cx="100" cy="95" r="95" fill="url(#genieAura)"/>

      <!-- Rising Smoke Tail Connecting to Lamp -->
      <g filter="url(#smokeTurb)" class="genie-tail">
        <path d="M68 148C52 182 76 202 92 222C100 234 94 246 100 254C106 246 100 234 108 222C124 202 148 182 132 148Z" fill="url(#smkGrad)"/>
        <path d="M72 150C60 180 80 200 100 214C112 222 104 240 112 252C88 246 84 224 78 206C72 190 70 168 72 150Z" fill="#4a64b0" opacity="0.75" class="genie-puff2"/>
      </g>

      <!-- Ambient Smoke Puffs -->
      <g class="genie-smoke-particles" fill="#8aa6d8" filter="url(#smokeBlur)">
        <circle cx="46" cy="150" r="14"/>
        <circle cx="154" cy="146" r="12" style="animation-delay:1.3s"/>
        <circle cx="100" cy="200" r="16" style="animation-delay:2.1s"/>
        <circle cx="68" cy="218" r="12" style="animation-delay:0.7s"/>
        <circle cx="134" cy="220" r="13" style="animation-delay:2.8s"/>
      </g>

      <!-- Robe & Vest -->
      <path d="M62 150Q60 112 100 106Q140 112 138 150Z" fill="#27407a"/>
      <path d="M64 120Q100 156 136 120L128 116Q100 140 72 116Z" fill="#E2B54A"/>
      <path d="M58 140Q100 118 142 140Q144 154 132 154Q100 138 68 154Q56 154 58 140Z" fill="#3a5694"/>
      <rect x="60" y="141" width="8" height="12" fill="#E2B54A"/>
      <rect x="132" y="141" width="8" height="12" fill="#E2B54A"/>

      <!-- Turban Wings & Gem -->
      <path d="M70 40L52 112L76 106L80 58Z M130 40L148 112L124 106L120 58Z" fill="#E2B54A"/>
      <g stroke="#1fa6a0" stroke-width="3">
        <path d="M64 70L78 66M60 86L77 82M56 102L76 98M136 70L122 66M140 86L123 82M144 102L124 98"/>
      </g>

      <!-- Head & Golden Earrings -->
      <ellipse cx="100" cy="66" rx="31" ry="35" fill="url(#genieHead)"/>
      <circle cx="68" cy="78" r="5" fill="none" stroke="#E2B54A" stroke-width="2"/>
      <circle cx="132" cy="78" r="5" fill="none" stroke="#E2B54A" stroke-width="2"/>

      <!-- Eyes & Brow -->
      <g class="genie-eyes">
        <path d="M76 62Q86 54 96 62Q86 70 76 62ZM104 62Q114 54 124 62Q114 70 104 62Z" fill="#fff" stroke="#000" stroke-width="2.5"/>
        <path d="M73 62L62 57M127 62L138 57" stroke="#000" stroke-width="3"/>
        <g id="geniePupils">
          <circle cx="86" cy="62" r="4.5" fill="#D9341C"/>
          <circle cx="114" cy="62" r="4.5" fill="#D9341C"/>
          <circle cx="86" cy="62" r="1.8" fill="#000"/>
          <circle cx="114" cy="62" r="1.8" fill="#000"/>
        </g>
      </g>
      <path d="M72 50L96 57M128 50L104 57" stroke="#0E0908" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M100 66L96 79Q100 81 104 79" stroke="#243456" fill="none" stroke-width="2"/>

      <!-- Mouth Expression -->
      <path d="${mouth}" fill="${emotion === 'win' ? '#fff' : 'none'}" stroke="#0E0908" stroke-width="3" stroke-linejoin="round"/>
      <path d="M94 98H106L104 124H96Z" fill="#E2B54A"/>
      <path d="M95 108H105M95 116H105" stroke="#1fa6a0" stroke-width="2"/>

      <!-- Turban Dome & Ruby -->
      <path d="M68 52Q70 20 100 20Q130 20 132 52Q100 38 68 52Z" fill="#E2B54A"/>
      <path d="M70 45Q100 31 130 45" stroke="#1fa6a0" stroke-width="3" fill="none"/>
      <path d="M100 12Q92 20 96 30Q100 36 104 30Q108 20 100 12Z" fill="#D9341C" stroke="#E2B54A" stroke-width="2"/>
    </svg>
    ${LAMP_SVG}
  </div>`;
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
      if (typeof triggerFx === 'function') triggerFx('eye');
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
      if (typeof triggerFx === 'function') triggerFx('eye');
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
      ${renderMascot(STATE.screen)}
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

// ==========================================================================
// CINEMATIC INTRO SPLASH & TITLE ENGINE
// ==========================================================================
const op = document.getElementById('op');
const optitle = document.getElementById('optitle');
let ot = optitle ? optitle.getContext('2d') : null;
const om = document.getElementById('om');
if (om) {
  om.innerHTML = renderMascot('idle');
}

// Procedural Lava Title Canvas
let tLava = 0;
const pl = document.createElement('canvas');
pl.width = 112;
pl.height = 33;
const pc = pl.getContext('2d');
const im = pc ? pc.createImageData(112, 33) : null;
const JP = new Path2D('M173 6L231 6L231 179A75 75 0 0 1 81 179L139 179A17 17 0 0 0 173 179Z M281 6H339V254H281Z M389 254L389 6L449 6L521 150L521 6L579 6L579 254L519 254L447 110L447 254Z M629 254L629 6L689 6L761 150L761 6L819 6L819 254L759 254L687 110L687 254Z');

function renderLavaTitle() {
  if (!ot || !im) return;
  tLava += 0.02;
  const d = im.data;
  for (let y = 0; y < 33; y++) {
    for (let x = 0; x < 112; x++) {
      const v = (Math.sin(x * 0.16 + tLava) + Math.sin(y * 0.24 - tLava * 1.3) + Math.sin((x + y) * 0.1 + tLava * 0.7) + Math.sin(Math.hypot(x - 56, y - 16) * 0.2 - tLava) + 4) / 8;
      const c = Math.min(1, v * v * 1.6);
      const k = (y * 112 + x) * 4;
      d[k] = 45 + 195 * c;
      d[k + 1] = 5 + 175 * c * c * c;
      d[k + 2] = 4 + 45 * Math.pow(c, 4);
      d[k + 3] = 255;
    }
  }
  pc.putImageData(im, 0, 0);
  ot.clearRect(0, 0, 900, 260);
  ot.imageSmoothingEnabled = true;
  ot.drawImage(pl, 0, 0, 900, 260);
  ot.globalCompositeOperation = 'destination-in';
  ot.fillStyle = '#000';
  ot.fill(JP);
  ot.globalCompositeOperation = 'source-over';
}

// Intro Cosmic Spark Particles
const of = document.getElementById('opfx');
const oc = of ? of.getContext('2d') : null;
const P = [];
if (of) {
  of.width = window.innerWidth;
  of.height = window.innerHeight;
  for (let i = 0; i < 170; i++) {
    P.push({
      a: Math.random() * 6.28,
      r: 0.4 + Math.random() * 0.7,
      s: (Math.random() - 0.5) * 2,
      z: 1 + Math.random() * 2.6,
      u: Math.random()
    });
  }
}
const t0 = performance.now();

function animateIntro(ts) {
  if (!op || !op.isConnected || op.classList.contains('out')) return;
  requestAnimationFrame(animateIntro);
  renderLavaTitle();
  if (!oc || !of) return;
  const tt = (ts - t0) / 1000;
  const w = of.width;
  const h = of.height;
  const cx = w / 2;
  const cy = h * 0.44;
  const R = Math.hypot(w, h) / 2;
  oc.clearRect(0, 0, w, h);
  for (const p of P) {
    let x, y, al;
    if (tt < 1.7) {
      const k = tt / 1.7;
      x = cx + Math.cos(p.a + p.s * k * 3) * R * p.r * (1 - k * k * 0.97);
      y = cy + Math.sin(p.a + p.s * k * 3) * R * p.r * (1 - k * k * 0.97) * 0.6;
      al = 0.2 + 0.8 * k;
    } else {
      const k = tt - 1.7;
      const sp = p.r * 300 * (1 - Math.exp(-k * 1.8)) + k * 14;
      x = cx + Math.cos(p.a) * sp * 1.2;
      y = cy + Math.sin(p.a) * sp * 0.7 - k * k * 16 * p.z;
      al = Math.max(0, 1 - k / 3.4) * 0.9;
    }
    oc.fillStyle = `rgba(${p.u > 0.5 ? '226,181,74' : '217,52,28'},${al})`;
    oc.fillRect(x, y, p.z, p.z);
  }
}
if (op) {
  requestAnimationFrame(animateIntro);
}

// ==========================================================================
// ASCII SCENE & SACRED EYE MIND-READING PORTAL ANIMATION
// ==========================================================================
const bg = document.getElementById('bg');
const bx = bg ? bg.getContext('2d') : null;
const sc = document.createElement('canvas');
const sx = sc.getContext('2d', { willReadFrequently: true });
let W = window.innerWidth, H = window.innerHeight;
let cs = 14, ch = 18, gw = 80, gh = 50;
let mx = 0, my = 0, tx = 0, ty = 0, lastFrameTime = 0;
const ASCII_COL = ['#3a0d08', '#6b160c', '#9c2412', '#c4521a', '#e2b54a', '#fff1c0'];

function resizeAscii() {
  if (!bg) return;
  W = bg.width = window.innerWidth;
  H = bg.height = window.innerHeight;
  cs = Math.max(11, Math.round(W / 115));
  ch = cs * 1.3;
  gw = Math.ceil(W / cs);
  gh = Math.ceil(H / ch);
  sc.width = gw;
  sc.height = gh;
}
resizeAscii();
window.addEventListener('resize', resizeAscii);

// Interactive Pupil Mouse / Pointer Tracking
window.addEventListener('pointermove', e => {
  tx = e.clientX / W - 0.5;
  ty = e.clientY / H - 0.5;
  const pupilG = document.getElementById('geniePupils');
  if (pupilG) {
    pupilG.setAttribute('transform', `translate(${tx * 7}, ${ty * 3})`);
  }
});

function drawScene(t) {
  const w = gw, h = gh, cx = w / 2, hz = h * 0.74;
  const R = h * 0.3 + Math.sin(t / 1400) * 1.2;
  const ey = hz - h * 0.3;

  sx.fillStyle = '#000';
  sx.fillRect(0, 0, w, h);
  let g = sx.createLinearGradient(0, 0, 0, hz);
  g.addColorStop(0, '#050505');
  g.addColorStop(1, '#606060');
  sx.fillStyle = g;
  sx.fillRect(0, 0, w, hz);

  // Outer Iris Aura
  sx.fillStyle = '#8c8c8c';
  sx.beginPath();
  sx.arc(cx, ey, R, 0, 7);
  sx.fill();

  // Eye of Providence Contour
  sx.fillStyle = '#000';
  sx.beginPath();
  sx.moveTo(cx - R * 0.92, ey);
  sx.quadraticCurveTo(cx, ey - R * 0.95, cx + R * 0.92, ey);
  sx.quadraticCurveTo(cx, ey + R * 0.95, cx - R * 0.92, ey);
  sx.fill();

  sx.strokeStyle = '#fff';
  sx.lineWidth = 1.3;
  sx.stroke();
  sx.beginPath();
  sx.moveTo(cx - R * 0.8, ey - R * 0.45);
  sx.quadraticCurveTo(cx, ey - R * 1.2, cx + R * 0.8, ey - R * 0.45);
  sx.stroke();

  sx.beginPath();
  sx.moveTo(cx - R * 0.1, ey + R * 0.55);
  sx.lineTo(cx - R * 0.2, ey + R * 1.1);
  sx.moveTo(cx - R * 0.55, ey + R * 0.3);
  sx.quadraticCurveTo(cx - R * 0.9, ey + R * 0.6, cx - R * 0.7, ey + R * 1.05);
  sx.stroke();

  // Looking Pupil
  const ix = cx + mx * R * 0.35, iy = ey + my * R * 0.18;
  sx.fillStyle = '#fff';
  sx.beginPath();
  sx.arc(ix, iy, R * 0.3, 0, 7);
  sx.fill();
  sx.fillStyle = '#000';
  sx.beginPath();
  sx.ellipse(ix, iy, R * 0.05, R * 0.25, 0, 0, 7);
  sx.fill();

  // Mountain / Sand Dunes Silhouette
  sx.fillStyle = '#000';
  [[-0.02, 0.36, 0.17, 0.24], [0.46, 0.74, 0.6, 0.1], [0.6, 1.02, 0.82, 0.2]].forEach(p => {
    sx.beginPath();
    sx.moveTo(w * p[0], hz + 2);
    sx.lineTo(w * p[2], hz - h * p[3]);
    sx.lineTo(w * p[1], hz + 2);
    sx.fill();
  });

  sx.fillStyle = '#1a1a1a';
  sx.fillRect(0, hz, w, h - hz);
  sx.strokeStyle = '#4a4a4a';
  sx.lineWidth = 1;
  for (let k = 1; k < 4; k++) {
    sx.beginPath();
    for (let x = 0; x <= w; x += 2) {
      const y = hz + k * h * 0.07 + Math.sin(x * 0.12 + k + t / 2500) * 1.4;
      x ? sx.lineTo(x, y) : sx.moveTo(x, y);
    }
    sx.stroke();
  }
}

let FX = null, dirty = 0;

function triggerFx(mode, cb) {
  const durMap = { wipe: 950, eye: 1900, rain: 2300 };
  FX = { mode, cb, t0: performance.now(), dur: durMap[mode] || 1500, done: 0 };
}

function fxFrame(ts) {
  requestAnimationFrame(fxFrame);
  if (ts - lastFrameTime < 30) return;
  lastFrameTime = ts;
  mx += (tx - mx) * 0.12;
  my += (ty - my) * 0.12;

  if (!bx) return;
  if (!FX) {
    if (dirty) {
      bx.clearRect(0, 0, W, H);
      dirty = 0;
    }
    return;
  }
  dirty = 1;

  const p = (ts - FX.t0) / FX.dur;
  if (p >= 1) {
    const th = FX.then;
    FX = null;
    bx.clearRect(0, 0, W, H);
    if (th) triggerFx(th);
    return;
  }

  const st = (ts / 150) | 0;
  const B = [[], [], [], [], [], []];
  const put = (i, j, l, hh) => {
    const r = (hh % 1000) / 1000;
    l *= 0.8 + 0.4 * r;
    if (l < 0.08) return;
    B[Math.min(5, (l * 6) | 0)].push(i * cs, j * ch, l > 0.8 && r > 0.88 ? '*' : (hh & 1 ? '1' : '0'));
  };
  const hs = (i, j) => ((i * 73856093) ^ (j * 19349663) ^ (st * 83492791)) >>> 0;
  let cov = 0;

  if (FX.mode === 'wipe') {
    cov = p < 0.5 ? p * 2 : (1 - p) * 2;
    if (p >= 0.5 && !FX.done) {
      FX.done = 1;
      FX.cb && FX.cb();
      if (STATE.screen === 'guess') FX.then = 'eye';
    }
    const R = cov * 1.25;
    for (let j = 0; j < gh; j++) {
      for (let i = 0; i < gw; i++) {
        const d = Math.hypot((i / gw - 0.5) * 1.7, j / gh - 0.5);
        if (d > R) continue;
        const e = Math.max(0, 1 - (R - d) * 9);
        put(i, j, 0.3 + 0.7 * e, hs(i, j));
      }
    }
  }

  if (FX.mode === 'eye') {
    cov = Math.sin(p * Math.PI);
    drawScene(ts);
    const d = sx.getImageData(0, 0, gw, gh).data;
    for (let j = 0; j < gh; j++) {
      for (let i = 0; i < gw; i++) {
        put(i, j, (d[(j * gw + i) * 4] / 255) * Math.min(1, cov * 1.6), hs(i, j));
      }
    }
    cov *= 0.9;
  }

  bx.clearRect(0, 0, W, H);
  bx.fillStyle = `rgba(6, 3, 2, ${Math.min(0.94, cov * 1.5)})`;
  bx.fillRect(0, 0, W, H);
  bx.font = `${cs}px "Courier New", monospace`;
  bx.textBaseline = 'top';
  B.forEach((a, b) => {
    bx.fillStyle = ASCII_COL[b];
    for (let k = 0; k < a.length; k += 3) {
      bx.fillText(a[k + 2], a[k], a[k + 1]);
    }
  });
}

if (bg) {
  requestAnimationFrame(fxFrame);
}

// User Enters via Tap
function enterApp() {
  if (!op || op.classList.contains('out')) return;
  op.classList.add('out');
  // Auto-play the Arabian instrumental track on user tap
  if (!isMusicActive) {
    toggleMusic();
  }
  triggerFx('wipe', () => {
    if (op && op.parentNode) op.remove();
    ot = null;
  });
}

if (op) {
  op.onclick = enterApp;
}

// Initial Boot
if (PROFILE) {
  const profileLabel = document.getElementById('profileName');
  if (profileLabel) profileLabel.textContent = PROFILE.name;
}
applyTheme(currentThemeIndex);
