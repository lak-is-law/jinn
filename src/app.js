const Q={M:"Is your person male?",L:"Is your person alive today?",S:"Are they known for science, maths or invention?",R:"Are they known for art, literature or music?",P:"Did they lead, rule or campaign in politics?",T:"Are they famous as an athlete?",E:"Are they from Europe?",I:"Are they from Asia?",U:"Are they from the Americas?",K:"Are they from Africa or the Middle East?",O:"Were they born before 1900?",B:"Did they win a Nobel Prize?",F:"Did they found a company?",H:"Are they known for acting or performing?",G:"Are they tied to religion or spirituality?",W:"Did they fight or command in wars?",C:"Are they famous for music?"};
const D=`Albert Einstein|Physicist who reshaped space and time|MSEOB
Marie Curie|Pioneer of radioactivity, two Nobel Prizes|SEOB
Isaac Newton|Father of classical mechanics|MSEO
Nikola Tesla|Inventor of AC power systems|MSEUO
Leonardo da Vinci|Renaissance painter and polymath|MSREO
Pablo Picasso|Co-founder of Cubism|MREO
Vincent van Gogh|Post-impressionist painter|MREO
William Shakespeare|Playwright of Hamlet and Macbeth|MREO
Wolfgang Mozart|Classical composer prodigy|MREOC
Michael Jackson|King of Pop|MURHC
Beyoncé|Global pop and R&B icon|LURHC
Taylor Swift|Songwriter and stadium-filling pop star|LURCH
Bob Marley|Reggae legend|MURC
Mahatma Gandhi|Led India's non-violent independence movement|MPIOG
Nelson Mandela|Ended apartheid, became president|MPKB
Martin Luther King Jr.|Civil rights leader|MPUBG
Abraham Lincoln|16th US president|MPUO
Napoleon Bonaparte|French emperor and military genius|MPEWO
Cleopatra|Last active pharaoh of Egypt|PKO
Winston Churchill|Wartime British prime minister|MPEWOB
Steve Jobs|Co-founder of Apple|MUF
Elon Musk|Founder of Tesla and SpaceX|MLUFK
Bill Gates|Co-founder of Microsoft|MLUF
Oprah Winfrey|Media mogul and talk-show host|LUH
Muhammad Ali|The Greatest, heavyweight champion|MUT
Lionel Messi|Argentine football genius|MLTU
Cristiano Ronaldo|Portuguese football superstar|MLTE
Serena Williams|Tennis champion with 23 Grand Slams|LTU
Pelé|Brazilian football king|MTU
Sachin Tendulkar|The god of cricket|MLTI
Bruce Lee|Martial artist and film icon|MTIH
Malala Yousafzai|Youngest Nobel laureate, education activist|LPIB
Mother Teresa|Missionary who served the poor|GEB
Gautama Buddha|Founder of Buddhism|MIOG
Rabindranath Tagore|Poet, first Asian Nobel laureate|MRIOB
APJ Abdul Kalam|India's Missile Man and president|MSPI
Srinivasa Ramanujan|Self-taught mathematical genius|MSIO
Stephen Hawking|Cosmologist of black holes|MSE
Charles Darwin|Father of evolution theory|MSEO
Frida Kahlo|Iconic Mexican painter|RU
Charlie Chaplin|Silent film comedian|MEHRO
Walt Disney|Animation pioneer and theme-park builder|MUFHR
Steven Spielberg|Blockbuster film director|MLUHR
Genghis Khan|Founder of the Mongol Empire|MPIWO
Jack Ma|Co-founder of Alibaba|MLIF
Amitabh Bachchan|Bollywood's Shahenshah|MLIH
Greta Thunberg|Climate activist|LPE
Barack Obama|44th US president|MLPUB
Ada Lovelace|First computer programmer|SEO`.split('\n').map(l=>{const[n,d,t]=l.split('|');return{n,d,t}});

let EYE;
function M(m){
  if (document.body.classList.contains('theme-illuminati')) {
    // Occult Illuminati Pyramid with the All-Seeing Eye of Providence
    const mo={win:'#00ff9d',lose:'#ff3366',guess:'#00ff9d'}[m]||'#00ff9d';
    return `<svg class="orb orb-illuminati" viewBox="0 0 200 250" style="overflow:visible"><defs>
      <linearGradient id="illGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#052e16"/><stop offset="1" stop-color="#02130b"/></linearGradient>
      <linearGradient id="pyrCap" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#00ff9d"/><stop offset="1" stop-color="#059669"/></linearGradient>
      <radialGradient id="eyeGlow"><stop offset="0" stop-color="#00ff9d" stop-opacity=".7"/><stop offset="1" stop-color="#00ff9d" stop-opacity="0"/></radialGradient>
      <filter id="illGlow"><feGaussianBlur stdDeviation="4"/><feComposite in="SourceGraphic"/></filter>
    </defs>
    <!-- Sacred Geometry Halo -->
    <circle cx="100" cy="115" r="92" fill="none" stroke="rgba(0,255,157,0.25)" stroke-width="1.5" stroke-dasharray="6,4"/>
    <circle cx="100" cy="115" r="76" fill="url(#eyeGlow)" opacity=".45"/>
    <polygon points="100,20 20,185 180,185" fill="none" stroke="rgba(0,255,157,0.3)" stroke-width="1.5"/>
    <!-- Great Pyramid Base & Layers -->
    <polygon points="100,25 28,180 172,180" fill="url(#illGrad)" stroke="#00ff9d" stroke-width="2.5"/>
    <!-- Masonry Brick Lines -->
    <line x1="45" y1="150" x2="155" y2="150" stroke="rgba(0,255,157,0.35)" stroke-width="1.5"/>
    <line x1="58" y1="125" x2="142" y2="125" stroke="rgba(0,255,157,0.35)" stroke-width="1.5"/>
    <line x1="72" y1="100" x2="128" y2="100" stroke="rgba(0,255,157,0.35)" stroke-width="1.5"/>
    <!-- Floating Capstone with The Eye of Providence -->
    <polygon points="100,25 68,90 132,90" fill="#041a0f" stroke="#00ff9d" stroke-width="2.5" filter="url(#illGlow)"/>
    <!-- Golden Occult Eye -->
    <g class="eyes" transform="translate(0, 5)">
      <path d="M78 68Q100 48 122 68Q100 88 78 68Z" fill="#02130b" stroke="#00ff9d" stroke-width="2"/>
      <circle cx="100" cy="68" r="9" fill="url(#pyrCap)"/>
      <ellipse cx="100" cy="68" rx="3.5" ry="8" fill="#000"/>
      <circle cx="98" cy="66" r="2" fill="#fff"/>
    </g>
    <!-- Occult Runes / Compass rays -->
    <path d="M100 185L100 230M28 180L10 215M172 180L190 215" stroke="rgba(0,255,157,0.4)" stroke-width="2"/>
    <circle cx="100" cy="232" r="4" fill="${mo}"/>
    </svg>`;
  }
  const mo={win:'M80 90Q100 116 120 90Z',lose:'M84 99Q100 90 116 99',guess:'M80 90Q100 108 120 89'}[m]||'M82 93Q100 101 118 91';
  return `<svg class="orb" viewBox="0 0 200 250" style="overflow:visible"><defs><linearGradient id="sm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#27407a"/><stop offset="1" stop-color="#6f8fd0" stop-opacity=".9"/></linearGradient><radialGradient id="hd" cx=".4" cy=".3"><stop offset="0" stop-color="#8fb0d4"/><stop offset="1" stop-color="#3a527f"/></radialGradient><radialGradient id="au"><stop offset="0" stop-color="#1fa6a0" stop-opacity=".28"/><stop offset=".6" stop-color="#D9341C" stop-opacity=".12"/><stop offset="1" stop-opacity="0"/></radialGradient><filter id="sk" x="-40%" y="-10%" width="180%" height="130%"><feTurbulence type="fractalNoise" baseFrequency=".012 .03" numOctaves="2" seed="3"><animate attributeName="baseFrequency" dur="9s" values=".012 .03;.022 .05;.012 .03" repeatCount="indefinite"/></feTurbulence><feDisplacementMap in="SourceGraphic" scale="22"/><feGaussianBlur stdDeviation="2"/></filter><filter id="sk2"><feGaussianBlur stdDeviation="5"/></filter></defs>
<circle cx="100" cy="95" r="95" fill="url(#au)"/><g filter="url(#sk)" class="tail"><path d="M68 148C52 182 76 202 92 222C100 234 94 246 100 254C106 246 100 234 108 222C124 202 148 182 132 148Z" fill="url(#sm)"/><path d="M72 150C60 180 80 200 100 214C112 222 104 240 112 252C88 246 84 224 78 206C72 190 70 168 72 150Z" fill="#4a64b0" opacity=".7" class="puff2"/></g><g class="smk" fill="#8aa6d8" filter="url(#sk2)"><circle cx="46" cy="150" r="14"/><circle cx="154" cy="146" r="12" style="animation-delay:1.3s"/><circle cx="100" cy="200" r="16" style="animation-delay:2.1s"/><circle cx="68" cy="218" r="12" style="animation-delay:.7s"/><circle cx="134" cy="220" r="13" style="animation-delay:2.8s"/></g>
<path d="M62 150Q60 112 100 106Q140 112 138 150Z" fill="#27407a"/><path d="M64 120Q100 156 136 120L128 116Q100 140 72 116Z" fill="#E2B54A"/>
<path d="M58 140Q100 118 142 140Q144 154 132 154Q100 138 68 154Q56 154 58 140Z" fill="#3a5694"/><rect x="60" y="141" width="8" height="12" fill="#E2B54A"/><rect x="132" y="141" width="8" height="12" fill="#E2B54A"/>
<path d="M70 40L52 112L76 106L80 58Z M130 40L148 112L124 106L120 58Z" fill="#E2B54A"/><g stroke="#1fa6a0" stroke-width="3"><path d="M64 70L78 66M60 86L77 82M56 102L76 98M136 70L122 66M140 86L123 82M144 102L124 98"/></g>
<ellipse cx="100" cy="66" rx="31" ry="35" fill="url(#hd)"/><circle cx="68" cy="78" r="5" fill="none" stroke="#E2B54A" stroke-width="2"/><circle cx="132" cy="78" r="5" fill="none" stroke="#E2B54A" stroke-width="2"/>
<g class="eyes"><path d="M76 62Q86 54 96 62Q86 70 76 62ZM104 62Q114 54 124 62Q114 70 104 62Z" fill="#fff" stroke="#000" stroke-width="2.5"/><path d="M73 62L62 57M127 62L138 57" stroke="#000" stroke-width="3"/><g id="ey"><circle cx="86" cy="62" r="4.5" fill="#D9341C"/><circle cx="114" cy="62" r="4.5" fill="#D9341C"/><circle cx="86" cy="62" r="1.8" fill="#000"/><circle cx="114" cy="62" r="1.8" fill="#000"/></g></g>
<path d="M72 50L96 57M128 50L104 57" stroke="#0E0908" stroke-width="3.5"/><path d="M100 66L96 79Q100 81 104 79" stroke="#243456" fill="none" stroke-width="2"/>
<path d="${mo}" fill="${m=='win'?'#fff':'none'}" stroke="#0E0908" stroke-width="3" stroke-linejoin="round"/>
<path d="M94 98H106L104 124H96Z" fill="#E2B54A"/><path d="M95 108H105M95 116H105" stroke="#1fa6a0" stroke-width="2"/>
<path d="M68 52Q70 20 100 20Q130 20 132 52Q100 38 68 52Z" fill="#E2B54A"/><path d="M70 45Q100 31 130 45" stroke="#1fa6a0" stroke-width="3" fill="none"/>
<path d="M100 12Q92 20 96 30Q100 36 104 30Q108 20 100 12Z" fill="#D9341C" stroke="#E2B54A" stroke-width="2"/></svg>`;
}

const OPT=["Yes","Probably","Probably not","No"],LK=[[1,.65,.3,.05],[.05,.3,.65,1]];
let sample=null;

/* Background Arabian Music Player using Desert City by Kevin MacLeod */
const bgm = new Audio('/audio/arabian-nights.mp3');
bgm.loop = true;
bgm.volume = 0.35;
let musicPlaying = false;

function updateMusicBtn() {
  const btn = document.getElementById('musicBtn');
  if (!btn) return;
  if (musicPlaying) {
    btn.innerHTML = '<img src="assets/icons/music-on.svg" class="nav-icon" alt="" /> <span>Music: On</span>';
    btn.classList.add('active');
  } else {
    btn.innerHTML = '<img src="assets/icons/music-off.svg" class="nav-icon" alt="" /> <span>Music: Off</span>';
    btn.classList.remove('active');
  }
}

function toggleMusic() {
  if (musicPlaying) {
    bgm.pause();
    musicPlaying = false;
    updateMusicBtn();
  } else {
    bgm.play().then(() => {
      musicPlaying = true;
      updateMusicBtn();
    }).catch(e => console.log('Autoplay restriction:', e));
  }
}

/* Theme Switcher */
const THEMES = [
  { id: 'theme-midnight', name: 'Midnight Tomb' },
  { id: 'theme-illuminati', name: 'Illuminati Order' },
  { id: 'theme-desert', name: 'Desert Sunset' },
  { id: 'theme-oasis', name: 'Oasis Emerald' },
  { id: 'theme-amethyst', name: 'Royal Sultan' }
];
let currentThemeIdx = 0;
try {
  const saved = localStorage.getItem('jinn:theme');
  if (saved) {
    const idx = THEMES.findIndex(t => t.id === saved);
    if (idx !== -1) currentThemeIdx = idx;
  }
} catch(e) {}

function applyTheme(idx) {
  currentThemeIdx = (idx + THEMES.length) % THEMES.length;
  const theme = THEMES[currentThemeIdx];
  THEMES.forEach(t => document.body.classList.remove(t.id));
  document.body.classList.add(theme.id);
  try { localStorage.setItem('jinn:theme', theme.id); } catch(e) {}
  const btn = document.getElementById('themeBtn');
  if (btn) btn.innerHTML = `<img src="assets/icons/palette.svg" class="nav-icon" alt="" /> <span>${theme.name}</span>`;
  if (typeof render === 'function' && document.getElementById('card')?.innerHTML) render();
}
applyTheme(currentThemeIdx);

const apiShim={
  json: async () => {
    const r = await fetch('/api/jinn', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ans: S.ans, rej: S.rej })
    });
    if(!r.ok) throw new Error('api ' + r.status);
    return JSON.parse(await r.text());
  }
};
if(!window.claude) sample=apiShim;

async function go(){
  if(S.ai){
    if(S.rej.length>=4){
      S.scr='lose';
    } else {
      S.scr='think';
      render();
      try {
        const r = await sample.json();
        if(r.type=='guess' && r.name){
          S.cur = { n: r.name, d: r.description || '' };
          S.scr = 'guess';
          if(FX) FX.then='eye'; else fx('eye');
        } else if(r.text){
          S.cur = r.text;
          S.scr = 'ask';
        } else throw 0;
      } catch(e) {
        console.error("AI error:", e);
        S.note = 'The sands are clouded. Retrying...';
        next();
      }
    }
  } else {
    next();
  }
  if(S.scr==='lose'){ ST.g++; ST.s++; save(); }
  render();
}

let S={scr:'intro',ans:[],rej:[],cur:null},ST={g:0,w:0,s:0};
try{ST=JSON.parse(localStorage.getItem('jinn')||'')||ST}catch(e){}
const save=()=>{try{localStorage.setItem(KEY(),JSON.stringify(ST))}catch(e){}};
const card=document.getElementById('card'),$=s=>document.querySelector(s);

function weights(){return D.map(p=>{if(S.rej.includes(p.n))return 0;let w=1;for(const[t,a]of S.ans)w*=LK[p.t.includes(t)?0:1][a];return w})}
function next(){const w=weights(),sum=w.reduce((a,b)=>a+b,0)||1,asked=S.ans.map(a=>a[0]);
 const top=Math.max(...w),ti=w.indexOf(top);let best=null,bs=9;
 for(const t in Q){if(asked.includes(t))continue;let p=0;D.forEach((d,i)=>{if(d.t.includes(t))p+=w[i]});p/=sum;const sc=Math.abs(p-.5);if(p>.02&&p<.98&&sc<bs){bs=sc;best=t}}
 const n=S.ans.length;
 if(!best||n>=20||(n>=7&&top/sum>.55)||(n>=5&&w.filter(x=>x>top*.02).length<=1)){
  if(S.rej.length>=4)return S.scr='lose';
  S.cur=D[ti];S.scr='guess'}else{S.cur=best;S.scr='ask'}}

function bar(){
  const n=S.ans.length,sz=[2,3,4,5,6],st=[18,15,11,6,0];
  return `<div class="pyr" role="img" aria-label="${n} of 20 questions asked">`+sz.map((c,r)=>'<div class="pr">'+Array.from({length:c},(_,k)=>`<span class="${st[r]+k<n?'on':''}"></span>`).join('')+'</div>').join('')+'</div>';
}

let PR=null,usr=null;try{PR=JSON.parse(localStorage.getItem('jinn:profile')||'null')}catch(e){}
const KEY=()=>'jinn'+(PR?':'+PR.id:'');
function loadST(){try{ST=JSON.parse(localStorage.getItem(KEY())||'')||{g:0,w:0,s:0}}catch(e){ST={g:0,w:0,s:0}}}

const md=document.getElementById('modal'),mb=document.getElementById('mbody');
function modal(h){mb.innerHTML=h;md.classList.add('on');}
function closeM(){md.classList.remove('on');}

function navBtn(){
  const b=document.getElementById('loginBtn');
  b.innerHTML=PR?`<img src="assets/icons/ankh.svg" class="nav-icon" alt="" /> <span>${esc(PR.name.slice(0,12))}</span>`:'Login';
  b.classList.toggle('gold',!!PR);
}
function afterAuth(){loadST();navBtn();closeM();if(S.scr==='intro')render();}
function setProf(){try{localStorage.setItem('jinn:profile',JSON.stringify(PR))}catch(e){}afterAuth();}

function loginView(){modal(PR?`<h3>Welcome, ${esc(PR.name)}</h3><p>Signed in ${PR.via==='claude'?'with Claude':'on this device'}. Your stats and history belong to this profile.</p><div class="mrow"><button class="big alt" data-do="out">Sign out</button></div>`:`<h3>Enter the tomb</h3><p>Sign in to keep your own stats and history.</p>${usr?'<button class="big" data-do="claude">Continue with Claude</button><p class="or">or</p>':''}<input id="pname" maxlength="20" placeholder="Choose a name"><div class="mrow"><button class="big alt" data-do="local">Create profile</button><button class="big alt" data-x>Stay a guest</button></div><p class="small">Profiles are saved on this device only.</p>`)}
function statsView(){const acc=ST.g?Math.round(ST.w/ST.g*100):0;modal(`<h3>${PR?esc(PR.name)+"'s ":''}Stats</h3><div class="mstats"><div><b>${ST.g}</b>games</div><div><b>${ST.w}</b>guessed</div><div><b>${ST.s}</b>stumped</div><div><b>${acc}%</b>accuracy</div></div><h4>Recent souls</h4>${(ST.h||[]).slice().reverse().map(x=>`<p class="hr">${esc(x.n)}<i>${x.q} questions</i></p>`).join('')||'<p class="small">None yet. Play a round.</p>'}`)}

md.onclick=async e=>{
  const t=e.target,d=t.dataset&&t.dataset.do;
  if(t===md||(t.dataset&&t.dataset.x!=null))return closeM();
  if(d==='out'){PR=null;try{localStorage.removeItem('jinn:profile')}catch(x){}afterAuth()}
  if(d==='local'){const n=(document.getElementById('pname').value||'').trim();if(!n)return;PR={id:'l_'+n.toLowerCase().replace(/\W+/g,'-'),name:n,via:'local'};setProf()}
  if(d==='claude'){try{const id=await usr.id(),p=(await usr.profiles([id]))[id];PR={id:'c_'+id,name:(p&&p.name)||'Traveller',via:'claude'};setProf()}catch(x){}}
};

addEventListener('keydown',e=>{if(e.key==='Escape')closeM()});

document.querySelector('.nav').onclick=e=>{
  const k=e.target.dataset.n;
  if(!k)return;
  if(k==='music') toggleMusic();
  if(k==='theme') applyTheme(currentThemeIdx + 1);
  if(k==='home'){if(FX||S.scr==='intro'||S.scr==='think')return;fx('wipe',()=>{S={scr:'intro',ans:[],rej:[],cur:null};render()})}
  if(k==='how')modal('<h3>How to play</h3><p>Think of any famous or historic person. The Jinn asks up to 20 questions to deduce who you have in mind.</p><p>Answer truthfully: Yes, Probably, Probably not, or No. Keys 1 to 4 work as shortcuts.</p><p>If a guess is wrong, tell the Jinn and he will try again.</p>');
  if(k==='stats')statsView();
  if(k==='login')loginView();
};

function esc(x){return String(x).replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';')}
const SAY={
  intro:'I am the Jinn of the Thousand and One Questions. Bind any soul in thought, and I shall unearth them.',
  think:'The sands stir… I peer into the archives of memory…',
  guess:'The sands have spoken! I see into your mind…',
  win:'Another secret unearthed. None escape me.',
  lose:'Impossible… your soul lies beyond the tomb. You have stumped the Jinn!'
};
const SAY_ILLUMINATI={
  intro:'The All-Seeing Eye awakens. Hold any human soul in your consciousness; our secret archives already know.',
  think:'Accessing the classified dossier… scanning global records…',
  guess:'The Order has intercepted your thoughts! The subject is revealed…',
  win:'The Grand Architect never fails. Another soul catalogued.',
  lose:'An anomaly in the archives… you have evaded the All-Seeing Eye!'
};
const LAMP='<svg class="lampsvg" viewBox="0 0 200 80"><path d="M30 40C30 66 70 76 100 76C130 76 170 66 170 40Z" fill="#c9922c"/><path d="M26 38H174" stroke="#f0c860" stroke-width="6" stroke-linecap="round"/><path d="M170 40C186 34 192 22 196 12C184 20 176 24 168 28Z" fill="#c9922c"/><path d="M30 42C10 40 6 24 18 18" stroke="#c9922c" stroke-width="6" fill="none"/><ellipse cx="100" cy="40" rx="30" ry="6" fill="#f0c860"/><path d="M70 60Q100 70 130 60" stroke="#8a5f1a" stroke-width="3" fill="none"/></svg>';

function render(){
  EYE=M(S.scr);
  const sc=S.scr,intro=sc==='intro',n=S.ans.length,play=sc=='ask'||sc=='think';
  card.className='gm';
  const isIllum = document.body.classList.contains('theme-illuminati');
  const sayMap = isIllum ? SAY_ILLUMINATI : SAY;
  
  let txt=sc==='ask'?(S.ai?S.cur:Q[S.cur]):(sc==='intro'&&PR?`Welcome back, ${PR.name}. Bind a soul in thought, and I shall unearth it.`:sayMap[sc])||'';
  const scr=`<div class="scroll" data-t="${esc(txt)}">${esc(txt)}</div>`;
  const mas=`<div class="mas">${sc==='ask'?EYE.replace('class="orb"','class="orb" id="orb"'):EYE}${LAMP}</div>`;
  const cart=`<div class="cart"><div class="name">${esc(S.cur&&S.cur.n||'')}</div></div><p class="d">${esc(S.cur&&S.cur.d||'')}</p>`;
  
  let h=`<div class="tb">
    <div class="hero"><canvas id="title" width="900" height="260"></canvas></div>
    <div class="header-meta">
      ${play?`<span class="qn">Q ${Math.min(20,n+(sc=='ask'?1:0))} / 20</span>`:''}
      ${bar()}
    </div>
  </div>`, side='';
  
  if(intro) {
    side=`${scr}
    <div class="stats">
      <div><b>${ST.g}</b>games</div>
      <div><b>${ST.w}</b>guessed</div>
      <div><b>${ST.s}</b>stumped</div>
    </div>
    <div><button class="big" id="start" style="width:100%">Wake the Jinn</button></div>
    <p class="note">${sample?'The Jinn knows every soul on Earth':'Archive mode · 50 souls'}</p>`;
  }
  
  if(sc==='ask') {
    side=`${scr}
    <div class="ans">
      ${OPT.map((o,i)=>`<button class="a${i}" data-a="${i}"><span>${o}</span><i>${i+1}</i></button>`).join('')}
    </div>
    <div class="ft">
      <button id="back" ${n?'':'disabled style="opacity:.3"'}>← Undo</button>
      <button id="quit">Restart</button>
    </div>
    ${S.note?`<p class="note">${esc(S.note)}</p>`:''}`;
  }
  
  if(sc==='think') {
    side=`${scr}
    <div class="dots"><span></span><span></span><span></span></div>`;
  }
  
  if(sc==='guess') {
    side=`${scr}${cart}
    <div class="gap">
      <button class="big" id="yes" style="flex:1">Yes, that is them</button>
      <button class="big alt" id="no" style="flex:1">No, try again</button>
    </div>`;
  }
  
  if(sc==='win') {
    side=`${scr}${cart}
    <p class="d" style="font-weight:700;color:var(--gold-glow)">Unearthed in ${n} questions.</p>
    <div class="gap">
      <button class="big" id="again" style="flex:1">Play again</button>
      <button class="big alt" id="share" style="flex:1">Share result</button>
    </div>`;
  }
  
  if(sc==='lose') {
    side=`${scr}<p class="d">Your soul lies beyond the tomb. The Jinn bows to your cunning.</p>
    <div class="gap"><button class="big" id="again" style="width:100%">Play again</button></div>`;
  }
  
  h+=`<div class="stage">${mas}<div class="side">${side}</div></div>`;
  card.innerHTML=h;
  
  ct=$('#title').getContext('2d');
  clearInterval(window.tw);
  const bb=$('.scroll');
  if(bb&&bb.dataset.t&&!matchMedia('(prefers-reduced-motion:reduce)').matches){
    const t=bb.dataset.t;
    let i=0;
    bb.textContent='';
    window.tw=setInterval(()=>{
      bb.textContent=t.slice(0,++i);
      if(i>=t.length)clearInterval(window.tw);
    }, 16);
  }
  
  const on=(s,f)=>{const e=$(s);if(e)e.onclick=f};
  on('#start',()=> {
    // Start authentic background music if not already playing
    if(!musicPlaying) {
      bgm.play().then(() => {
        musicPlaying = true;
        updateMusicBtn();
      }).catch(() => {});
    }
    fx('wipe',()=>{S={scr:'ask',ans:[],rej:[],cur:null,ai:!!sample};go()});
  });
  
  document.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{
    if(FX)return;
    $('#orb').classList.add('hit');
    S.ans.push([S.cur,+b.dataset.a]);
    fx('wipe',go);
  });
  
  on('#back',()=>{
    if(!S.ans.length||FX)return;
    if(S.ai){S.cur=S.ans.pop()[0];S.scr='ask';render()}else{S.ans.pop();S.rej=[];next();render()}
  });
  
  on('#quit',()=>{
    S={scr:'intro',ans:[],rej:[],cur:null};
    render();
  });
  
  on('#yes',()=>{
    ST.g++;ST.w++;ST.h=[...(ST.h||[]),{n:S.cur.n,q:S.ans.length}].slice(-8);save();
    S.scr='win';render();fx('rain');
  });
  
  on('#no',()=>{
    S.rej.push(S.cur.n);
    fx('wipe',go);
  });
  
  on('#again',()=>fx('wipe',()=>{S={scr:'ask',ans:[],rej:[],cur:null,ai:!!sample};go()}));
  
  on('#share',()=>{
    const t=`The Jinn unearthed ${S.cur.n} in ${S.ans.length} questions on jinn.lakshya.uk`;
    navigator.clipboard&&navigator.clipboard.writeText(t).then(()=>$('#share').innerHTML='Copied').catch(()=>{});
  });
}

/* lava title */
let ct,ot,t=0;const pl=document.createElement('canvas');pl.width=112;pl.height=33;const pc=pl.getContext('2d'),im=pc.createImageData(112,33);
const rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
const JP=new Path2D('M173 6L231 6L231 179A75 75 0 0 1 81 179L139 179A17 17 0 0 0 173 179Z M281 6H339V254H281Z M389 254L389 6L449 6L521 150L521 6L579 6L579 254L519 254L447 110L447 254Z M629 254L629 6L689 6L761 150L761 6L819 6L819 254L759 254L687 110L687 254Z');
function title(){t+=rm?0:.02;const d=im.data;
 for(let y=0;y<33;y++)for(let x=0;x<112;x++){const v=(Math.sin(x*.16+t)+Math.sin(y*.24-t*1.3)+Math.sin((x+y)*.1+t*.7)+Math.sin(Math.hypot(x-56,y-16)*.2-t)+4)/8,c=Math.min(1,v*v*1.6),k=(y*112+x)*4;d[k]=45+195*c;d[k+1]=5+175*c*c*c;d[k+2]=4+45*c**4;d[k+3]=255}
 pc.putImageData(im,0,0);[ct,ot].forEach(c=>{if(!c)return;c.clearRect(0,0,900,260);c.imageSmoothingEnabled=true;c.drawImage(pl,0,0,900,260);c.globalCompositeOperation='destination-in';c.fillStyle='#000';c.fill(JP);c.globalCompositeOperation='source-over'})}

/* ASCII scene — 21st.dev style: binary charset, flicker, bloom, scanlines, grain, vignette, glitch */
const bg=document.getElementById('bg'),bx=bg.getContext('2d'),sc=document.createElement('canvas'),sx=sc.getContext('2d',{willReadFrequently:true});
let W,H,cs,ch,gw,gh,mx=0,my=0,tx=0,ty=0,last=0;
const COL=['#3a0d08','#6b160c','#9c2412','#c4521a','#e2b54a','#fff1c0'];
function rs(){W=bg.width=innerWidth;H=bg.height=innerHeight;cs=Math.max(11,Math.round(W/115));ch=cs*1.3;gw=Math.ceil(W/cs);gh=Math.ceil(H/ch);sc.width=gw;sc.height=gh}rs();addEventListener('resize',rs);
addEventListener('pointermove',e=>{tx=e.clientX/W-.5;ty=e.clientY/H-.5;const ey=document.getElementById('ey');if(ey)ey.style.transform=`translate(${tx*7}px,${ty*3}px)`;});
function scene(t){const w=gw,h=gh,cx=w/2,hz=h*.74,R=h*.3+Math.sin(t/1400)*1.2,ey=hz-h*.3;
 sx.fillStyle='#000';sx.fillRect(0,0,w,h);let g=sx.createLinearGradient(0,0,0,hz);g.addColorStop(0,'#050505');g.addColorStop(1,'#606060');sx.fillStyle=g;sx.fillRect(0,0,w,hz);
 sx.fillStyle='#8c8c8c';sx.beginPath();sx.arc(cx,ey,R,0,7);sx.fill();
 sx.fillStyle='#000';sx.beginPath();sx.moveTo(cx-R*.92,ey);sx.quadraticCurveTo(cx,ey-R*.95,cx+R*.92,ey);sx.quadraticCurveTo(cx,ey+R*.95,cx-R*.92,ey);sx.fill();
 sx.strokeStyle='#fff';sx.lineWidth=1.3;sx.stroke();sx.beginPath();sx.moveTo(cx-R*.8,ey-R*.45);sx.quadraticCurveTo(cx,ey-R*1.2,cx+R*.8,ey-R*.45);sx.stroke();
 sx.beginPath();sx.moveTo(cx-R*.1,ey+R*.55);sx.lineTo(cx-R*.2,ey+R*1.1);sx.moveTo(cx-R*.55,ey+R*.3);sx.quadraticCurveTo(cx-R*.9,ey+R*.6,cx-R*.7,ey+R*1.05);sx.stroke();
 const ix=cx+mx*R*.35,iy=ey+my*R*.18;sx.fillStyle='#fff';sx.beginPath();sx.arc(ix,iy,R*.3,0,7);sx.fill();sx.fillStyle='#000';sx.beginPath();sx.ellipse(ix,iy,R*.05,R*.25,0,0,7);sx.fill();
 sx.fillStyle='#000';[[-.02,.36,.17,.24],[.46,.74,.6,.1],[.6,1.02,.82,.2]].forEach(p=>{sx.beginPath();sx.moveTo(w*p[0],hz+2);sx.lineTo(w*p[2],hz-h*p[3]);sx.lineTo(w*p[1],hz+2);sx.fill()});
 sx.fillStyle='#1a1a1a';sx.fillRect(0,hz,w,h-hz);sx.strokeStyle='#4a4a4a';sx.lineWidth=1;for(let k=1;k<4;k++){sx.beginPath();for(let x=0;x<=w;x+=2){const y=hz+k*h*.07+Math.sin(x*.12+k+t/2500)*1.4;x?sx.lineTo(x,y):sx.moveTo(x,y)}sx.stroke()}}

let FX=null,dirty=0;
function fx(mode,cb){FX={mode,cb,t0:performance.now(),dur:{wipe:950,eye:1800,rain:2300}[mode],done:0}}
function frame(ts){requestAnimationFrame(frame);if(ts-last<33)return;last=ts;mx+=(tx-mx)*.12;my+=(ty-my)*.12;title();
 if(!FX){if(dirty){bx.clearRect(0,0,W,H);dirty=0}return}dirty=1;
 const p=(ts-FX.t0)/FX.dur;if(p>=1){const th=FX.then;FX=null;bx.clearRect(0,0,W,H);if(th)fx(th);return}
 const st=ts/150|0,B=[[],[],[],[],[],[]],put=(i,j,l,hh)=>{const r=(hh%1000)/1000;l*=.8+.4*r;if(l<.08)return;B[Math.min(5,l*6|0)].push(i*cs,j*ch,l>.8&&r>.88?'*':(hh&1?'1':'0'))},hs=(i,j)=>((i*73856093)^(j*19349663)^(st*83492791))>>>0;
 let cov=0;
 if(FX.mode=='wipe'){cov=p<.5?p*2:(1-p)*2;if(p>=.5&&!FX.done){FX.done=1;FX.cb&&FX.cb();if(S.scr=='guess')FX.then='eye'}
  const R=cov*1.25;for(let j=0;j<gh;j++)for(let i=0;i<gw;i++){const d=Math.hypot((i/gw-.5)*1.7,j/gh-.5);if(d>R)continue;const e=Math.max(0,1-(R-d)*9);put(i,j,.3+.7*e,hs(i,j))}}
 if(FX.mode=='eye'){cov=Math.sin(p*Math.PI);scene(ts);const d=sx.getImageData(0,0,gw,gh).data;for(let j=0;j<gh;j++)for(let i=0;i<gw;i++)put(i,j,d[(j*gw+i)*4]/255*Math.min(1,cov*1.6),hs(i,j));cov*=.9}
 if(FX.mode=='rain'){const f=Math.min(1,p*6,(1-p)*3);for(let i=0;i<gw;i++){const v=.6+(hs(i,0)%100)/60,hd=(ts/90*v+i*37)%(gh+14);for(let j=0;j<gh;j++){const tr=hd-j;if(tr>=0&&tr<14)put(i,j,(1-tr/14)*f,hs(i,j))}}}
 bx.clearRect(0,0,W,H);bx.fillStyle=`rgba(6,3,2,${Math.min(.94,cov*1.5)})`;bx.fillRect(0,0,W,H);bx.font=`${cs}px "Courier New",monospace`;bx.textBaseline='top';
 B.forEach((a,b)=>{bx.fillStyle=COL[b];for(let k=0;k<a.length;k+=3)bx.fillText(a[k+2],a[k],a[k+1])})}

document.fonts&&document.fonts.load('900 expanded 100px Archivo');
addEventListener('keydown',e=>{
  if(S.scr==='ask'&&!FX&&!md.classList.contains('on')&&/^[1-4]$/.test(e.key)){
    const b=document.querySelector(`[data-a="${+e.key-1}"]`);
    b&&b.click();
  }
});

const op=document.getElementById('op');
ot=document.getElementById('optitle').getContext('2d');
document.getElementById('om').innerHTML=M('intro');

function enter(){
  if(op.classList.contains('out'))return;
  op.classList.add('out');
  // Auto-play the authentic Desert City track on user tap
  bgm.play().then(() => {
    musicPlaying = true;
    updateMusicBtn();
  }).catch(() => {});
  fx('wipe',()=>{op.remove();ot=null;});
}
op.onclick=enter;

const of=document.getElementById('opfx'),oc=of.getContext('2d'),P=[];
of.width=innerWidth;of.height=innerHeight;
for(let i=0;i<170;i++)P.push({a:Math.random()*6.28,r:.4+Math.random()*.7,s:(Math.random()-.5)*2,z:1+Math.random()*2.6,u:Math.random()});
const t0=performance.now();
(function opl(ts){
  if(!op.isConnected)return;
  requestAnimationFrame(opl);
  const tt=(ts-t0)/1000,w=of.width,h=of.height,cx=w/2,cy=h*.44,R=Math.hypot(w,h)/2;
  oc.clearRect(0,0,w,h);
  for(const p of P){
    let x,y,al;
    if(tt<1.7){
      const k=tt/1.7;
      x=cx+Math.cos(p.a+p.s*k*3)*R*p.r*(1-k*k*.97);
      y=cy+Math.sin(p.a+p.s*k*3)*R*p.r*(1-k*k*.97)*.6;
      al=.2+.8*k;
    }else{
      const k=tt-1.7,sp=p.r*300*(1-Math.exp(-k*1.8))+k*14;
      x=cx+Math.cos(p.a)*sp*1.2;
      y=cy+Math.sin(p.a)*sp*.7-k*k*16*p.z;
      al=Math.max(0,1-k/3.4)*.9;
    }
    oc.fillStyle=`rgba(${p.u>.5?'226,181,74':'217,52,28'},${al})`;
    oc.fillRect(x,y,p.z,p.z);
  }
})(t0);

const stg=document.getElementById('stars');
for(let i=0;i<70;i++){
  const c=document.createElementNS('http://www.w3.org/2000/svg','circle');
  c.setAttribute('cx',Math.random()*1600);
  c.setAttribute('cy',Math.random()*520);
  c.setAttribute('r',Math.random()*1.6+.4);
  c.style.animationDelay=Math.random()*4+'s';
  stg.appendChild(c);
}

loadST();
navBtn();
render();
requestAnimationFrame(frame);
