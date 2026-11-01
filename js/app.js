/* =================================================================
   OFICINA · Concurso Docente 2026-27 — lógica de la app
   Datos: js/datos-casos.js y js/datos-actividades.js
================================================================= */


/* ---------------------------------------------------------------
   STATE
--------------------------------------------------------------- */
let history = {};
let historyLoaded = false;

let cfg = {
  areas: new Set(Object.keys(AREAS)),
  diffs: new Set(["B","I","A"]),
  mode: "estudio",
  count: 10,
  minutes: 25
};

let session = null;
let screen = "landing";

/* ---------------------------------------------------------------
   GUARDADO LOCAL (localStorage con respaldo en memoria)
--------------------------------------------------------------- */
const memStore = {};
function storeGet(key){
  try{ const v = window.localStorage.getItem(key); if(v!==null) return v; }catch(e){}
  return memStore[key] ?? null;
}
function storeSet(key, value){
  memStore[key] = value;
  try{ window.localStorage.setItem(key, value); return true; }catch(e){ return false; }
}
/* ---------------------------------------------------------------
   GAMIFICACIÓN: XP, niveles, rachas, insignias, efectos y sonido
--------------------------------------------------------------- */
const ICON = {
  flame:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c1 4-3 5-3 9a3 3 0 0 0 6 0c0-1-.4-2-1-3 2 1 4 3.5 4 6.5A6 6 0 0 1 6 14.5C6 9 12 7 12 2z"/></svg>',
  cal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17"/></svg>',
  soundOn:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>',
  soundOff:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9l5 6M22 9l-5 6"/></svg>',
  star:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>',
  bolt:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg>',
  clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  compass:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/></svg>',
  puzzle:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 3a2 2 0 0 1 4 0v2h4a1 1 0 0 1 1 1v4h-2a2 2 0 0 0 0 4h2v4a1 1 0 0 1-1 1h-4v-2a2 2 0 0 0-4 0v2H6a1 1 0 0 1-1-1v-4h2a2 2 0 0 0 0-4H5V6a1 1 0 0 1 1-1h4z"/></svg>',
  medal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M8 3l4 6 4-6"/><circle cx="12" cy="15" r="6"/><path d="M12 12.5v5"/></svg>',
  hundred:'<svg viewBox="0 0 24 24" fill="currentColor"><text x="12" y="16.5" text-anchor="middle" font-size="11" font-weight="900" font-family="Arial">100</text></svg>'
};

const LEVELS = [
  {min:0,    name:"Aspirante"},
  {min:150,  name:"Inscrito en SIMO"},
  {min:400,  name:"Admitido a pruebas"},
  {min:800,  name:"Prueba escrita superada"},
  {min:1400, name:"Nombrado en periodo de prueba"},
  {min:2200, name:"Docente de carrera"},
  {min:3200, name:"Maestro de maestros"}
];
const BADGES = [
  {id:"primer_caso", t:"Primer acierto",       d:"Resuelve bien tu primer caso",          ico:"check"},
  {id:"combo3",      t:"En racha",             d:"3 aciertos seguidos",                    ico:"flame"},
  {id:"combo7",      t:"Imparable",            d:"7 aciertos seguidos",                    ico:"bolt"},
  {id:"sesion80",    t:"Expediente sobresaliente", d:"80% o más en una sesión de 8+ casos", ico:"star"},
  {id:"examen",      t:"Bajo presión",         d:"Termina un examen antes del tiempo",     ico:"clock"},
  {id:"explorador",  t:"Explorador",           d:"Responde casos de las 14 áreas",         ico:"compass"},
  {id:"taller",      t:"Taller completo",      d:"Completa las 7 actividades",             ico:"puzzle"},
  {id:"constancia",  t:"Constancia",           d:"Estudia 3 días seguidos",                ico:"cal"},
  {id:"cien",        t:"Cien casos",           d:"Responde 100 casos en total",            ico:"hundred"}
];
const XP_BY_DIFF = {B:10, I:20, A:30};

let gam = {xp:0, combo:0, bestCombo:0, answered:0, dayLast:null, dayStreak:0, badges:{}, sound:true};
function loadGam(){
  try{ const raw = storeGet('expediente_gamificacion_v1'); if(raw) gam = Object.assign(gam, JSON.parse(raw)); }catch(e){}
}
function saveGam(){ storeSet('expediente_gamificacion_v1', JSON.stringify(gam)); }

function levelIndex(xp){ let i=0; LEVELS.forEach((l,k)=>{ if(xp>=l.min) i=k; }); return i; }
function levelInfo(xp=gam.xp){
  const i = levelIndex(xp), cur = LEVELS[i], next = LEVELS[i+1];
  const pct = next ? Math.round(((xp-cur.min)/(next.min-cur.min))*100) : 100;
  return {i, n:i+1, name:cur.name, next, pct, toNext: next ? next.min-xp : 0};
}
function todayStr(d=new Date()){ return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
function touchDay(){
  const t = todayStr();
  if(gam.dayLast === t) return;
  const y = new Date(); y.setDate(y.getDate()-1);
  gam.dayStreak = (gam.dayLast === todayStr(y)) ? gam.dayStreak+1 : 1;
  gam.dayLast = t;
  if(gam.dayStreak >= 3) unlockBadge('constancia');
}
function activeDayStreak(){
  if(!gam.dayLast) return 0;
  const y = new Date(); y.setDate(y.getDate()-1);
  return (gam.dayLast===todayStr() || gam.dayLast===todayStr(y)) ? gam.dayStreak : 0;
}

/* XP: suma, detecta subida de nivel y refresca el HUD sin re-renderizar todo */
function award(xp, at, label){
  if(xp<=0) return;
  touchDay();
  const before = levelIndex(gam.xp);
  gam.xp += xp;
  saveGam();
  if(at) floatXP(at, xp, label);
  updateHud();
  const after = levelIndex(gam.xp);
  if(after > before) setTimeout(()=>showLevelUp(after), 650);
}
function unlockBadge(id){
  if(gam.badges[id]) return;
  gam.badges[id] = todayStr();
  saveGam();
  const b = BADGES.find(x=>x.id===id);
  if(b){ toast(`Insignia: ${b.t}`, b.d, ICON[b.ico]); sfx('badge'); }
}

/* ---------- efectos visuales ---------- */
const reduceMotion = (()=>{ try{ return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){ return false; } })();
function fxLayer(){
  let l = document.getElementById('fxLayer');
  if(!l){ l = document.createElement('div'); l.id='fxLayer'; l.className='fx-layer'; document.body.appendChild(l); }
  return l;
}
function pointOf(el){
  if(!el || !el.getBoundingClientRect) return {x:window.innerWidth/2, y:window.innerHeight/2};
  const r = el.getBoundingClientRect(); return {x:r.left + r.width*0.85, y:r.top + r.height/2};
}
function floatXP(at, xp, label){
  if(reduceMotion) return;
  const p = at.x!==undefined ? at : pointOf(at);
  const d = document.createElement('div');
  d.className='fx-xp'; d.style.left=p.x+'px'; d.style.top=(p.y-10)+'px';
  d.innerHTML = `+${xp} XP${label?`<small>${label}</small>`:''}`;
  fxLayer().appendChild(d); setTimeout(()=>d.remove(), 1200);
}
function confetti(at, n=26){
  if(reduceMotion) return;
  const p = at && at.x!==undefined ? at : pointOf(at);
  const colors = ['#ffc53d','#ff5c8a','#2fe3a6','#5bb8ff','#b48cff','#ffffff'];
  const layer = fxLayer();
  for(let i=0;i<n;i++){
    const c = document.createElement('i');
    c.className='confetti';
    const ang = Math.random()*Math.PI*2, dist = 70+Math.random()*170;
    c.style.left=p.x+'px'; c.style.top=p.y+'px';
    c.style.background = colors[i%colors.length];
    c.style.setProperty('--x', Math.cos(ang)*dist+'px');
    c.style.setProperty('--y', (Math.sin(ang)*dist + 120)+'px');
    c.style.setProperty('--r', (Math.random()*720-360)+'deg');
    c.style.setProperty('--d', (0.9+Math.random()*0.7)+'s');
    layer.appendChild(c); setTimeout(()=>c.remove(), 1800);
  }
}
function toast(title, text, icon){
  let w = document.getElementById('toastWrap');
  if(!w){ w=document.createElement('div'); w.id='toastWrap'; w.className='toast-wrap'; w.setAttribute('role','status'); document.body.appendChild(w); }
  const t = document.createElement('div');
  t.className='toast';
  t.innerHTML = `<div class="t-ico">${icon||ICON.star}</div><div><b>${title}</b><span>${text||''}</span></div>`;
  w.appendChild(t);
  setTimeout(()=>{ t.classList.add('out'); setTimeout(()=>t.remove(), 400); }, 3200);
}
function showLevelUp(idx){
  sfx('level');
  const ov = document.createElement('div');
  ov.className='levelup';
  ov.innerHTML = `<div class="levelup-card" role="dialog" aria-label="Subiste de nivel">
    <div class="lu-k">¡Subiste de nivel!</div>
    <div class="lu-n">${idx+1}</div>
    <h2>${LEVELS[idx].name}</h2>
    <p>${LEVELS[idx+1] ? `Te faltan ${LEVELS[idx+1].min - gam.xp} XP para «${LEVELS[idx+1].name}».` : 'Llegaste al final de la ruta. Sigue practicando para mantener el nivel.'}</p>
    <button class="btn" id="luClose">Seguir estudiando</button></div>`;
  document.body.appendChild(ov);
  confetti({x:window.innerWidth/2, y:window.innerHeight/2.4}, 60);
  const close = ()=>ov.remove();
  ov.querySelector('#luClose').onclick = close;
  ov.onclick = (e)=>{ if(e.target===ov) close(); };
  setTimeout(()=>{ const b=ov.querySelector('#luClose'); if(b) b.focus(); }, 50);
}

/* ---------- sonido (Web Audio, sin archivos) ---------- */
let audioCtx = null;
function sfx(kind){
  if(!gam.sound) return;
  try{
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const notes = {
      ok:[[660,0],[990,.09]], bad:[[220,0],[180,.1]], badge:[[784,0],[988,.08],[1319,.16]],
      level:[[523,0],[659,.1],[784,.2],[1047,.32]], combo:[[880,0],[1175,.07],[1568,.14]]
    }[kind] || [[600,0]];
    notes.forEach(([f,t])=>{
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = kind==='bad' ? 'sawtooth' : 'triangle';
      o.frequency.value = f;
      const s = audioCtx.currentTime + t;
      g.gain.setValueAtTime(0.0001, s);
      g.gain.exponentialRampToValueAtTime(kind==='bad'?0.05:0.09, s+0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, s+0.22);
      o.connect(g).connect(audioCtx.destination); o.start(s); o.stop(s+0.25);
    });
  }catch(e){}
}

/* ---------- HUD ---------- */
function hudHtml(){
  const L = levelInfo();
  const days = activeDayStreak();
  return `<div class="hud" id="hud">
    <div class="hud-lvl" style="--p:${L.pct}" data-n="${L.n}" aria-label="Nivel ${L.n}"></div>
    <div class="hud-main">
      <div class="hud-name">${L.name}</div>
      <div class="hud-xp">${gam.xp} XP${L.next?` · faltan ${L.toNext} para «${L.next.name}»`:''}</div>
      <div class="hud-bar"><i style="width:${L.pct}%"></i></div>
    </div>
    <div class="hud-chip ${gam.combo>=3?'hot':''}" title="Aciertos seguidos">${ICON.flame} ×${gam.combo} <small>racha</small></div>
    <div class="hud-chip" title="Días seguidos estudiando">${ICON.cal} ${days} <small>${days===1?'día':'días'}</small></div>
    <button class="hud-btn" id="hudSound" aria-label="${gam.sound?'Silenciar sonidos':'Activar sonidos'}" title="${gam.sound?'Silenciar sonidos':'Activar sonidos'}">${gam.sound?ICON.soundOn:ICON.soundOff}</button>
  </div>`;
}
function updateHud(){
  const h = document.getElementById('hud');
  if(!h) return;
  const tmp = document.createElement('div'); tmp.innerHTML = hudHtml();
  h.replaceWith(tmp.firstElementChild);
  const s = document.getElementById('hudSound');
  if(s) s.onclick = toggleSound;
}
function toggleSound(){ gam.sound = !gam.sound; saveGam(); updateHud(); if(gam.sound) sfx('ok'); }

/* ---------- portada: ruta de niveles en SVG ---------- */
function rutaSvg(){
  const L = levelInfo();
  const compact = window.innerWidth < 640;
  const W = compact ? 380 : 800, H=170, n=LEVELS.length;
  const pts = LEVELS.map((_,i)=>{ const x = (compact?26:40) + i*(W-(compact?52:80))/(n-1); const y = 95 + Math.sin(i*1.15)*(compact?30:42); return [x,y]; });
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for(let i=1;i<n;i++){ const [x0,y0]=pts[i-1],[x1,y1]=pts[i]; const cx=(x0+x1)/2; d+=` C${cx},${y0} ${cx},${y1} ${x1},${y1}`; }
  let dDone = `M${pts[0][0]},${pts[0][1]}`;
  for(let i=1;i<=L.i;i++){ const [x0,y0]=pts[i-1],[x1,y1]=pts[i]; const cx=(x0+x1)/2; dDone+=` C${cx},${y0} ${cx},${y1} ${x1},${y1}`; }
  const stops = pts.map(([x,y],i)=>{
    const cls = i<L.i ? 'reached' : (i===L.i ? 'current' : '');
    const lbl = LEVELS[i].name.split(' ');
    const half = Math.ceil(lbl.length/2);
    const above = i%2===1;
    const ty = above ? y-34 : y+38;
    const showLabel = !compact;
    return `<g class="stop ${cls}">
      <circle cx="${x}" cy="${y}" r="${i===L.i?17:14}"/>
      <text class="num" x="${x}" y="${y+4.5}" text-anchor="middle">${i+1}</text>
      ${showLabel?`<text x="${x}" y="${ty}" text-anchor="middle">${lbl.slice(0,half).join(' ')}</text>`:''}
      ${showLabel && lbl.length>1?`<text x="${x}" y="${ty+15}" text-anchor="middle">${lbl.slice(half).join(' ')}</text>`:''}
    </g>`;
  }).join('');
  const [mx,my] = pts[L.i];
  return `<svg viewBox="0 0 ${W} ${H+20}" role="img" aria-label="Ruta de niveles: vas en el nivel ${L.n}, ${L.name}">
    <defs><linearGradient id="gradRuta" x1="0" x2="1"><stop offset="0" stop-color="#ffc53d"/><stop offset="1" stop-color="#ff5c8a"/></linearGradient></defs>
    <path class="track" d="${d}"/>
    ${L.i>0?`<path class="track-done" d="${dDone}"/>`:''}
    ${stops}
    <g class="marker"><path d="M${mx},${my-24} l-9,-14 a11,11 0 1 1 18,0 z" fill="#fff"/><circle cx="${mx}" cy="${my-42}" r="4.5" fill="#ff5c8a"/></g>
  </svg>`;
}

/* ---------- tras cada render: animación de entrada y contadores ---------- */
let lastScreenKey = null;
function afterRender(){
  const app = document.getElementById('app');
  const key = screen + ':' + (actScreen||'') + ':' + (screen==='quiz' && session ? 'q' : '');
  if(key !== lastScreenKey){
    app.classList.remove('screen-enter'); void app.offsetWidth; app.classList.add('screen-enter');
    lastScreenKey = key;
  }
  const s = document.getElementById('hudSound'); if(s) s.onclick = toggleSound;
  document.querySelectorAll('[data-countup]').forEach(el=>{
    const target = parseInt(el.getAttribute('data-countup'))||0;
    if(reduceMotion){ el.textContent = target + (el.dataset.suffix||''); return; }
    const t0 = performance.now(), dur = 900;
    const step = (t)=>{ const k=Math.min(1,(t-t0)/dur); el.textContent = Math.round(target*(1-Math.pow(1-k,3))) + (el.dataset.suffix||''); if(k<1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
    el.removeAttribute('data-countup');
  });
}

/* ---------------------------------------------------------------
   REPETICIÓN ESPACIADA (cajas de Leitner)
   Fallar → vuelve mañana. Acertar → el intervalo crece:
   1, 3, 7, 16 y 35 días. Un acierto a la primera salta a 7 días.
--------------------------------------------------------------- */
const APP_VERSION = '1.0.0';
const SRS_INT = [0,1,3,7,16,35];
function addDays(n, from){ const d = from ? new Date(from+'T12:00:00') : new Date(); d.setDate(d.getDate()+n); return todayStr(d); }
function isDue(s){ return !!(s && s.due && s.due <= todayStr()); }
function srsUpdate(store, key, ok){
  const s = store[key] || {b:0, n:0, ok:0};
  s.b = ok ? (s.n===0 ? 3 : Math.min(s.b+1, 5)) : 1;
  s.n++; if(ok) s.ok++;
  s.due = addDays(SRS_INT[s.b]); s.last = todayStr();
  store[key] = s; return s;
}
let srs = {};
function loadSrs(){ try{ srs = JSON.parse(storeGet('oficina_srs_casos_v1')||'{}'); }catch(e){ srs = {}; } }
function saveSrs(){ storeSet('oficina_srs_casos_v1', JSON.stringify(srs)); }
function casosVencidos(){
  return Q.filter(q=>isDue(srs[q.id])).sort((a,b)=> srs[a.id].due < srs[b.id].due ? -1 : 1);
}
function proximoRepaso(){
  const fut = Q.map(q=>srs[q.id]).filter(s=>s && !isDue(s)).map(s=>s.due).sort();
  if(!fut.length) return null;
  return {fecha:fut[0], n:fut.filter(d=>d===fut[0]).length};
}
function memoriaStats(){
  const st = {nuevos:0, aprendiendo:0, consolidando:0, dominados:0};
  Q.forEach(q=>{ const s=srs[q.id]; if(!s) st.nuevos++; else if(s.b<=2) st.aprendiendo++; else if(s.b<=4) st.consolidando++; else st.dominados++; });
  return st;
}
function fechaCorta(iso){
  const meses=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  const [y,m,d] = iso.split('-').map(Number);
  if(iso===addDays(1)) return 'mañana';
  return `${d} de ${meses[m-1]}`;
}
function startRepaso(){
  const queue = casosVencidos().slice(0, 20);
  if(!queue.length) return;
  session = { queue, idx:0, answers:{}, mode:'estudio', repaso:true, timeLeftSec:null, timerHandle:null, revealed:false };
  screen = 'quiz'; render(); window.scrollTo(0,0);
}

/* ---------------------------------------------------------------
   RESPALDO DEL PROGRESO
--------------------------------------------------------------- */
const BACKUP_KEYS = ['expediente_historial_areas_v2','expediente_actividades_progreso_v1','expediente_gamificacion_v1',
  'oficina_srs_casos_v1','oficina_items_v1','oficina_act_stats_v1'];
function exportBackup(){
  const data = {app:'oficina', version:APP_VERSION, fecha:new Date().toISOString(), datos:{}};
  BACKUP_KEYS.forEach(k=>{ const v = storeGet(k); if(v!==null) data.datos[k] = v; });
  const name = `oficina-respaldo-${todayStr()}.json`;
  const blob = new Blob([JSON.stringify(data)], {type:'application/json'});
  try{
    const file = new File([blob], name, {type:'application/json'});
    if(navigator.canShare && navigator.canShare({files:[file]})){
      navigator.share({files:[file], title:'Respaldo de Oficina'}).catch(()=>{});
      return;
    }
  }catch(e){}
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click();
  setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); }, 800);
  toast('Respaldo descargado', name, ICON.check);
}
function importBackup(file){
  const reader = new FileReader();
  reader.onload = ()=>{
    try{
      const data = JSON.parse(reader.result);
      if(data.app!=='oficina' || typeof data.datos!=='object') throw new Error('formato');
      Object.entries(data.datos).forEach(([k,v])=>{ if(BACKUP_KEYS.includes(k) && typeof v==='string') storeSet(k, v); });
      loadGam(); loadSrs(); loadHistory(); loadActProgress();
      toast('Progreso restaurado', `Respaldo del ${data.fecha.slice(0,10)}`, ICON.check);
    }catch(e){
      toast('No se pudo restaurar', 'El archivo no es un respaldo válido de Oficina.', ICON.star);
    }
  };
  reader.readAsText(file);
}

/* ---------------------------------------------------------------
   APP INSTALABLE: service worker, actualizaciones e instalación
--------------------------------------------------------------- */
let deferredInstall = null;
const isStandalone = ()=> (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform==='MacIntel' && navigator.maxTouchPoints>1);
window.addEventListener('beforeinstallprompt', e=>{ e.preventDefault(); deferredInstall = e; if(screen==='landing') render(); });
window.addEventListener('appinstalled', ()=>{ deferredInstall = null; toast('App instalada', 'Ya puedes abrir Oficina desde tu pantalla de inicio.', ICON.check); });
function installHtml(){
  if(isStandalone()) return '';
  if(storeGet('oficina_hint_cerrado')==='1') return '';
  if(deferredInstall) return `<button class="landing-pill install" id="btnInstall">Instalar la app</button>`;
  if(isIOS) return `<div class="install-hint">Para instalarla en tu iPhone: abre esta página en Safari, toca <b>Compartir</b> y luego <b>«Agregar a pantalla de inicio»</b>. <span class="back-link" id="hintClose">Entendido</span></div>`;
  return '';
}
function showUpdateBar(worker){
  let w = document.getElementById('updateBar');
  if(w) return;
  w = document.createElement('div'); w.id='updateBar'; w.className='update-bar';
  w.innerHTML = `<span>Hay una versión nueva de Oficina.</span><button class="btn" id="btnUpdate">Actualizar</button>`;
  document.body.appendChild(w);
  w.querySelector('#btnUpdate').onclick = ()=> worker.postMessage('skipWaiting');
}
function registerSW(){
  if(!('serviceWorker' in navigator) || !location.protocol.startsWith('http')) return;
  navigator.serviceWorker.register('./sw.js').then(reg=>{
    if(reg.waiting && navigator.serviceWorker.controller) showUpdateBar(reg.waiting);
    reg.addEventListener('updatefound', ()=>{
      const nw = reg.installing;
      if(nw) nw.addEventListener('statechange', ()=>{ if(nw.state==='installed' && navigator.serviceWorker.controller) showUpdateBar(nw); });
    });
  }).catch(()=>{});
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', ()=>{ if(refreshing) return; refreshing = true; location.reload(); });
  try{ if(navigator.storage && navigator.storage.persist) navigator.storage.persist(); }catch(e){}
}

/* ---------------------------------------------------------------
   PERSISTENCE
--------------------------------------------------------------- */
async function loadHistory(){
  try{
    const raw = storeGet('expediente_historial_areas_v2');
    history = raw ? JSON.parse(raw) : {};
  }catch(err){
    history = {};
  }
  historyLoaded = true;
  render();
}
async function saveHistory(){
  storeSet('expediente_historial_areas_v2', JSON.stringify(history));
}
function registerAnswer(area, ok){
  if(!history[area]) history[area] = {attempts:0, correct:0};
  history[area].attempts += 1;
  if(ok) history[area].correct += 1;
}
function masteryOf(area){
  const h = history[area];
  if(!h || h.attempts === 0) return null;
  return Math.round((h.correct / h.attempts) * 100);
}
function weakestArea(){
  let worst = null, worstVal = 101;
  Object.keys(AREAS).forEach(a=>{
    const m = masteryOf(a);
    if(m !== null && m < worstVal){ worstVal = m; worst = a; }
  });
  return worst;
}

/* ---------------------------------------------------------------
   SESSION LOGIC
--------------------------------------------------------------- */
function buildQueue(){
  // 1) casos vencidos para repaso, 2) casos nuevos priorizando áreas débiles, 3) el resto por fecha de repaso
  const pool = Q.filter(q => cfg.areas.has(q.area) && cfg.diffs.has(q.d));
  const due = pool.filter(q=>isDue(srs[q.id])).sort((a,b)=> srs[a.id].due < srs[b.id].due ? -1 : 1);
  let fresh = pool.filter(q=>!srs[q.id]).map(q=>({q, w:(masteryOf(q.area) ?? 50) + Math.random()*25}));
  fresh.sort((a,b)=> a.w - b.w); fresh = fresh.map(x=>x.q);
  const rest = pool.filter(q=>srs[q.id] && !isDue(srs[q.id])).sort((a,b)=> srs[a.id].due < srs[b.id].due ? -1 : 1);
  return [...due, ...fresh, ...rest].slice(0, Math.min(cfg.count, pool.length));
}
function startSession(){
  const queue = buildQueue();
  if(queue.length === 0) return;
  session = { queue, idx:0, answers:{}, mode:cfg.mode,
    timeLeftSec: cfg.mode==="examen" ? cfg.minutes*60 : null,
    timerHandle:null, revealed:false };
  screen = "quiz";
  if(session.mode === "examen") startTimer();
  render();
}
function startTimer(){
  session.timerHandle = setInterval(()=>{
    if(!session) return;
    session.timeLeftSec -= 1;
    if(session.timeLeftSec <= 0){ clearInterval(session.timerHandle); finishSession(); return; }
    const el = document.getElementById('timerChip');
    if(el){ el.textContent = fmtTime(session.timeLeftSec); el.classList.toggle('low', session.timeLeftSec<=60); }
  },1000);
}
function fmtTime(s){ const m=Math.floor(s/60), sec=s%60; return String(m).padStart(2,'0')+":"+String(sec).padStart(2,'0'); }

function answer(qid, optIdx){
  const q = Q.find(x=>x.id===qid);
  if(session.answers[qid]) return;
  const ok = optIdx === q.c;
  session.answers[qid] = {selected:optIdx, correct:ok};
  registerAnswer(q.area, ok);
  saveHistory();
  srsUpdate(srs, q.id, ok); saveSrs();
  gam.answered++;
  if(gam.answered >= 100) unlockBadge('cien');
  if(Object.keys(AREAS).every(a=>history[a] && history[a].attempts>0)) unlockBadge('explorador');
  if(session.mode === "estudio"){
    if(ok){ gam.combo++; gam.bestCombo = Math.max(gam.bestCombo, gam.combo); }
    else { gam.combo = 0; }
    saveGam();
    session.revealed = true; render();
    // efectos sobre la opción ya renderizada (posición real en pantalla)
    const at = pointOf(document.querySelector(ok ? '.option.correct' : '.option.incorrect'));
    if(ok){
      const bonus = Math.min(25, (gam.combo-1)*5);
      const xp = XP_BY_DIFF[q.d] + bonus;
      session.xpEarned = (session.xpEarned||0) + xp;
      award(xp, at, gam.combo>=2 ? `racha ×${gam.combo}` : '');
      confetti(at, gam.combo>=3 ? 40 : 22);
      sfx(gam.combo>=3 ? 'combo' : 'ok');
      unlockBadge('primer_caso');
      if(gam.combo>=3) unlockBadge('combo3');
      if(gam.combo>=7) unlockBadge('combo7');
    } else { sfx('bad'); }
  } else { saveGam(); nextQuestion(); }
}
function nextQuestion(){
  session.revealed = false;
  if(session.idx < session.queue.length - 1){
    session.idx += 1; render();
    const card = document.querySelector('.expediente');
    if(card && card.getBoundingClientRect().top < 0) card.scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth', block:'start'});
  }
  else { finishSession(); }
}
function finishSession(){
  if(!session || session.finished) return;
  session.finished = true;
  if(session.timerHandle) clearInterval(session.timerHandle);
  const total = session.queue.length;
  const correct = session.queue.filter(q=>session.answers[q.id] && session.answers[q.id].correct).length;
  const pct = total ? correct/total : 0;
  let gain = 0;
  if(session.mode === 'examen'){
    session.queue.forEach(q=>{ const a=session.answers[q.id]; if(a && a.correct) gain += XP_BY_DIFF[q.d] + 10; });
    session.xpEarned = gain;
    if(Object.keys(session.answers).length === total && session.timeLeftSec > 0) unlockBadge('examen');
  }
  if(total >= 8 && pct >= 0.8){ gain += 50; session.xpEarned = (session.xpEarned||0) + 50; unlockBadge('sesion80'); }
  saveGam();
  screen = "resumen"; render();
  const ring = document.querySelector('.score-ring');
  if(gain > 0) award(gain, ring, session.mode==='examen' ? 'examen' : 'bono de sesión');
  if(pct >= 0.8){ confetti(ring, 70); sfx('badge'); }
}
function backToStart(){ session = null; screen = "inicio"; render(); }

/* ---------------------------------------------------------------
   RENDER
--------------------------------------------------------------- */
function render(){
  const app = document.getElementById('app');
  if(screen === 'landing'){
    app.innerHTML = renderLanding();
    attachHandlers(); afterRender();
    return;
  }
  app.innerHTML = `
    ${hudHtml()}
    ${masthead()}
    ${disclaimer()}
    ${screen === 'inicio' ? renderInicio() : ''}
    ${screen === 'quiz' ? renderQuiz() : ''}
    ${screen === 'resumen' ? renderResumen() : ''}
    ${screen === 'actividades' ? (actScreen ? renderActividadDetalle() : renderActividadesHub()) : ''}
    ${screen === 'progreso' ? renderProgreso() : ''}
    ${screen === 'estado' ? renderEstado() : ''}
    <footer>oficina v${APP_VERSION} · concurso docente 2026-27 — herramienta de estudio no oficial · verifica siempre la guía de orientación del icfes / cnsc</footer>
  `;
  attachHandlers(); afterRender();
}

function repasoHtml(){
  const venc = casosVencidos().length;
  const actDue = ACTIVIDADES_META.reduce((n,a)=>n+actDueCount(a.id),0);
  if(venc){
    return `<div class="repaso-card due">
      <div class="rp-num">${venc}</div>
      <div class="rp-txt"><b>Repaso de hoy</b><span>${venc===1?'Un caso que fallaste o que ya toca repasar':`${venc} casos que fallaste o que ya toca repasar`}${actDue?` · además, ${actDue} elementos en actividades`:''}.</span></div>
      <button class="btn" id="goRepaso">Repasar ahora</button>
    </div>`;
  }
  const prox = proximoRepaso();
  if(prox) return `<div class="repaso-card"><div class="rp-num ok">✓</div><div class="rp-txt"><b>Estás al día</b><span>Próximo repaso: ${fechaCorta(prox.fecha)} (${prox.n} ${prox.n===1?'caso':'casos'})${actDue?` · ${actDue} elementos de actividades para repasar`:''}.</span></div></div>`;
  return `<div class="repaso-card"><div class="rp-num ok">↻</div><div class="rp-txt"><b>Repaso de hoy</b><span>Responde casos: los que falles volverán mañana y los que aciertes, días después, hasta dominarlos.</span></div></div>`;
}

function renderLanding(){
  const L = levelInfo(), days = activeDayStreak(), got = Object.keys(gam.badges).length;
  const actDone = Object.keys(actProgress).length;
  return `
  <div class="landing">
    <div class="landing-title">
      <div class="landing-eyebrow">Sistema de preparación · Ciencias Sociales</div>
      <h1>CONCURSO DOCENTE 2026<br><span>«OFICINA»</span></h1>
    </div>
    <div class="ruta">${rutaSvg()}</div>
    <div class="ruta-caption">Nivel <b>${L.n}</b> · <b>${L.name}</b> — ${gam.xp} XP${L.next ? ` · te faltan ${L.toNext} para «${L.next.name}»` : ''}</div>
    <div class="landing-stats">
      <div class="hud-chip ${gam.combo>=3?'hot':''}" title="Aciertos seguidos">${ICON.flame} ×${gam.combo} <small>racha</small></div>
      <div class="hud-chip" title="Días seguidos estudiando">${ICON.cal} ${days} <small>${days===1?'día':'días'}</small></div>
      <div class="hud-chip" title="Insignias desbloqueadas">${ICON.star} ${got}/${BADGES.length} <small>insignias</small></div>
      <button class="hud-btn" id="hudSound" aria-label="${gam.sound?'Silenciar sonidos':'Activar sonidos'}" title="${gam.sound?'Silenciar sonidos':'Activar sonidos'}">${gam.sound?ICON.soundOn:ICON.soundOff}</button>
    </div>
    ${repasoHtml()}
    <div class="landing-buttons">
      <button class="landing-btn" id="goToCasos">
        <span class="lb-tag">${Q.length} casos · nivel Saber</span>
        <span class="lb-title">Casos de análisis</span>
        <span class="lb-sub">Lectura crítica, razonamiento cuantitativo, juicio situacional y fundamentación normativa. Cada acierto suma XP y alarga tu racha.</span>
      </button>
      <button class="landing-btn ghost" id="goToActividades">
        <span class="lb-tag">${ACTIVIDADES_META.length} actividades · ${actDone} hechas</span>
        <span class="lb-title">Actividades conceptuales y de conocimiento</span>
        <span class="lb-sub">Simulador de decisiones, laboratorio de fuentes, tarjetas de memoria y más.</span>
      </button>
    </div>
    <div class="landing-progress-link">
      <button class="landing-pill" id="goToEstado">Estado del concurso 2026-27</button>
      <button class="landing-pill" id="goToProgreso">Mi progreso e insignias</button>
      ${installHtml().startsWith('<button') ? installHtml() : ''}
    </div>
    ${installHtml().startsWith('<div') ? installHtml() : ''}
  </div>`;
}

/* =================================================================
   ACTIVIDADES CONCEPTUALES — motor de rondas repetibles
   Cada ronda saca elementos de los bancos (datos-actividades.js) y
   prioriza los que fallaste o que ya toca repasar.
================================================================= */
let actScreen = null;      // 1..7 actividad abierta, null = lista
let actProgress = {};      // actividades completadas al menos una vez
let actStats = {};         // {id:{rondas, mejor, ultimo, fecha}}
let itemSrs = {};          // repetición espaciada de los elementos de las actividades
let ronda = null;          // estado de la ronda abierta

function loadActProgress(){
  try{ actProgress = JSON.parse(storeGet('expediente_actividades_progreso_v1')||'{}'); }catch(e){ actProgress = {}; }
  try{ actStats = JSON.parse(storeGet('oficina_act_stats_v1')||'{}'); }catch(e){ actStats = {}; }
  try{ itemSrs = JSON.parse(storeGet('oficina_items_v1')||'{}'); }catch(e){ itemSrs = {}; }
  render();
}
function saveActProgress(){ storeSet('expediente_actividades_progreso_v1', JSON.stringify(actProgress)); }
function saveActStats(){ storeSet('oficina_act_stats_v1', JSON.stringify(actStats)); }
function saveItemSrs(){ storeSet('oficina_items_v1', JSON.stringify(itemSrs)); }

function shuffleArr(arr){ for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; } return arr; }
function randInt(a,b){ return a + Math.floor(Math.random()*(b-a+1)); }

/* Elige n elementos: primero los vencidos, luego los nuevos, luego el resto. */
function pickFromPool(pool, n, prefix){
  const due=[], unseen=[], rest=[];
  pool.forEach(it=>{ const s=itemSrs[prefix+it.id]; if(!s) unseen.push(it); else if(isDue(s)) due.push(it); else rest.push(it); });
  shuffleArr(due); shuffleArr(unseen); shuffleArr(rest);
  const byDue = (a,b)=> (itemSrs[prefix+a.id].due < itemSrs[prefix+b.id].due ? -1 : 1);
  due.sort(byDue); rest.sort(byDue);
  return [...due, ...unseen, ...rest].slice(0, n);
}
const ACT_PREFIX = {1:'a1:',2:'a2:',3:'a3:',5:'a5:',6:'a6:',7:'a7:'};
const ACT_POOL = ()=>({1:BANCO_ARBOLES,2:BANCO_FRAGMENTOS,3:BANCO_NORM,5:BANCO_TARJETAS,6:BANCO_TRIOS,7:BANCO_TEXTOS});
function actDueCount(id){
  const pre = ACT_PREFIX[id]; if(!pre) return 0;
  return ACT_POOL()[id].filter(it=>isDue(itemSrs[pre+it.id])).length;
}
function actItemResult(id, itemId, ok){ srsUpdate(itemSrs, ACT_PREFIX[id]+itemId, ok); saveItemSrs(); }

/* Cierre de ronda: estadísticas, XP e insignias */
function finishRonda(id, pct){
  if(!ronda || ronda.done) return;
  ronda.done = true; ronda.pct = pct;
  const st = actStats[id] || {rondas:0, mejor:0};
  st.rondas++; st.ultimo = Math.round(pct*100); st.mejor = Math.max(st.mejor, st.ultimo); st.fecha = todayStr();
  actStats[id] = st; saveActStats();
  const at = {x:window.innerWidth/2, y:window.innerHeight/2.6};
  let xp;
  if(!actProgress[id]){
    actProgress[id] = true; saveActProgress(); xp = 60;
    if(Object.keys(actProgress).length >= ACTIVIDADES_META.length) unlockBadge('taller');
  } else xp = 15 + Math.round(25*pct);
  ronda.xp = xp;
  award(xp, at, 'ronda terminada');
  if(pct >= 0.8){ confetti(at, 50); sfx('badge'); } else sfx('ok');
}
function rondaResumen(id, extra){
  const pct = Math.round((ronda.pct||0)*100);
  const st = actStats[id] || {};
  return `<div class="ronda-res">
    <div class="score-ring small" style="--p:${pct};--ring:${pct>=80?'var(--menta)':(pct>=60?'var(--mango)':'var(--guayaba)')}"><div><div class="big">${pct}%</div></div></div>
    <div><b>Ronda terminada</b><span>+${ronda.xp||0} XP · mejor resultado: ${st.mejor||pct}% · rondas: ${st.rondas||1}</span></div>
  </div>
  ${extra||''}
  <div class="quiz-footer"><span class="progress-line">${id===4?'Cada ronda genera datos nuevos.':'Lo que fallaste volverá en tus próximas rondas.'}</span><button class="btn" id="rondaNueva">Nueva ronda →</button></div>`;
}

/* ---------- construcción de cada ronda ---------- */
function newRonda(id){
  if(id===1){
    const tree = pickFromPool(BANCO_ARBOLES, 1, 'a1:')[0];
    ronda = {id, tree, level:0, choice:null, first:tree.niveles.map(()=>true)};
  }
  if(id===2){
    const frag = pickFromPool(BANCO_FRAGMENTOS, 1, 'a2:')[0];
    ronda = {id, frag, task:0, solved:{}, first:frag.tareas.map(()=>true), feedback:null};
  }
  if(id===3){
    let cards = [];
    CATS_NORM.forEach(c=>{ cards = cards.concat(pickFromPool(BANCO_NORM.filter(x=>x.cat===c.key), 2, 'a3:')); });
    ronda = {id, cards:shuffleArr(cards), placed:{}, picked:null};
  }
  if(id===4){ ronda = Object.assign({id, idx:0, choice:null, results:[]}, genTaller()); }
  if(id===5){
    ronda = {id, deck:pickFromPool(BANCO_TARJETAS, 5, 'a5:'), idx:0, flip:false, known:{}};
  }
  if(id===6){
    const ordered = pickFromPool(BANCO_TRIOS, BANCO_TRIOS.length, 'a6:');
    const chosen=[], used=new Set();
    for(const t of ordered){ if(!used.has(t.c)){ chosen.push(t); used.add(t.c); } if(chosen.length===4) break; }
    ronda = {id, trios:chosen, optB:shuffleArr(chosen.map((t,i)=>i)), optC:shuffleArr(chosen.map((t,i)=>i)), sel:{}, checked:false};
  }
  if(id===7){
    const tx = pickFromPool(BANCO_TEXTOS, 1, 'a7:')[0];
    ronda = {id, tx, answers:{}, checked:false};
  }
}

/* ---------- vistas ---------- */
function renderActividadesHub(){
  const doneCount = Object.keys(actProgress).length;
  const cards = ACTIVIDADES_META.map(a=>{
    const st = actStats[a.id], due = actDueCount(a.id);
    const meta = st ? `${st.rondas} ${st.rondas===1?'ronda':'rondas'} · último ${st.ultimo}% · mejor ${st.mejor}%` : 'Sin rondas todavía';
    const tag = due ? `<span class="act-tag due">${due} para repasar</span>` : (st && st.ultimo<80 ? '<span class="act-tag">Repítela</span>' : '');
    return `
    <div class="act-card ${actProgress[a.id]?'done':''}" data-open-act="${a.id}" role="button" tabindex="0">
      <div class="act-num">${actProgress[a.id]?'✓':a.id}</div>
      <div><div class="act-title">${a.title} ${tag}</div><div class="act-sub">${a.sub}</div><div class="act-meta">${meta}</div></div>
    </div>`;
  }).join('');
  return `<div class="card"><h3>Actividades conceptuales y de conocimiento</h3>
    <div class="sub">${doneCount}/7 completadas · cada ronda trae elementos distintos</div>
    <div class="act-grid">${cards}</div></div>`;
}
function renderActividadDetalle(){
  if(!ronda || ronda.id !== actScreen) newRonda(actScreen);
  const views = {1:renderArbol,2:renderFuentes,3:renderNormativo,4:renderTaller,5:renderTarjetas,6:renderTriangulacion,7:renderCompletar};
  return `<div class="card"><div class="act-back"><span id="backHub" class="back-link">← Actividades</span></div>${views[actScreen]()}</div>`;
}

function renderArbol(){
  const t = ronda.tree;
  if(ronda.level >= t.niveles.length){
    return `<div class="sub">simulador de decisiones · ${t.titulo}</div>
    <h3 style="margin:10px 0;">Cierre del caso</h3>
    <div class="explain">${t.cierre}</div>${rondaResumen(1)}`;
  }
  const nivel = t.niveles[ronda.level], ch = ronda.choice;
  const ops = nivel.opciones.map((op,i)=>{
    let cls='option';
    if(ch!==null){ cls+=' disabled'; cls += (i===ch) ? (op.correcto?' correct':' incorrect') : ' dim'; }
    return `<div class="${cls}" data-dt-opt="${i}" role="button" tabindex="0"><span class="k">${'ABC'[i]}</span><span>${op.t}</span></div>`;
  }).join('');
  const cons = ch!==null ? `<div class="explain"><b>${nivel.opciones[ch].correcto?'Consecuencia positiva.':'Consecuencia negativa.'}</b> ${nivel.opciones[ch].consecuencia}</div>` : '';
  let footer = '';
  if(ch!==null) footer = nivel.opciones[ch].correcto
    ? `<button class="btn" id="dtNext">${ronda.level<t.niveles.length-1?'Siguiente decisión →':'Ver cierre →'}</button>`
    : `<button class="btn ghost" id="dtRetry">Reconsiderar esta decisión</button>`;
  return `
  <div class="sub">simulador de decisiones · ${t.titulo} · decisión ${ronda.level+1} de ${t.niveles.length}</div>
  ${ronda.level===0? `<div class="basetext"><b>Situación</b> — ${t.situacion}</div>`:''}
  <div class="prompt" style="margin-top:14px;">${nivel.prompt}</div>
  <div class="options">${ops}</div>${cons}
  <div class="quiz-footer"><span></span>${footer}</div>`;
}

function renderFuentes(){
  const f = ronda.frag, done = ronda.task >= f.tareas.length;
  const seg = f.segmentos.map(s=>{
    if(!s.tag) return `<span>${s.text}</span>`;
    return `<span class="fuente-span ${ronda.solved[s.tag]?'fuente-solved':''}" data-fuente-tag="${s.tag}" role="button" tabindex="0">${s.text}</span>`;
  }).join('');
  const fb = ronda.feedback ? `<div class="explain" style="border-left-color:${ronda.feedback.ok?'var(--menta)':'var(--guayaba)'};"><b>${ronda.feedback.ok?'Correcto.':'No es esa frase.'}</b> ${ronda.feedback.msg}</div>` : '';
  const task = done ? '' : `<div class="explain"><b>Tarea ${ronda.task+1} de ${f.tareas.length}:</b> ${f.tareas[ronda.task].label}</div>`;
  return `
  <div class="sub">laboratorio de fuentes · ${f.titulo}</div>
  <div class="basetext fuente-texto"><b>Fragmento</b> — ${seg}</div>
  ${fb}${task}
  ${done ? `<div class="explain">${f.cierre}</div>${rondaResumen(2)}` : ''}`;
}

function renderNormativo(){
  const pend = ronda.cards.filter(c=>!ronda.placed[c.id]);
  const cardsHtml = pend.map(c=>`<div class="norm-card ${ronda.picked===c.id?'picked':''}" draggable="true" data-norm-card="${c.id}" role="button" tabindex="0">${c.text}</div>`).join('');
  const cats = CATS_NORM.map(cat=>{
    const items = ronda.cards.filter(c=>ronda.placed[c.id] && ronda.placed[c.id].cat===cat.key).map(c=>{
      const ok = ronda.placed[c.id].correct;
      return `<div class="norm-placed ${ok?'ok':'bad'}">${c.text}<div class="no-data" style="margin-top:4px;">${ok?'✓ Correcto. ':'✗ Va en «'+CATS_NORM.find(x=>x.key===c.cat).label+'». '}${c.exp||EXP_NORM[c.cat]}</div></div>`;
    }).join('');
    return `<div class="norm-cat" data-norm-cat="${cat.key}" role="button" tabindex="0"><div class="norm-cat-title">${cat.label}</div>${items}</div>`;
  }).join('');
  const done = pend.length===0;
  return `
  <div class="sub">organizador normativo · ${ronda.cards.length - pend.length}/${ronda.cards.length} clasificadas</div>
  <p class="hint">Arrastra cada tarjeta a su categoría. En el celular: toca la tarjeta y luego la categoría.</p>
  ${done ? '' : `<div class="norm-cards">${cardsHtml}</div>`}
  <div class="norm-cats">${cats}</div>
  ${done ? rondaResumen(3) : ''}`;
}

/* ---------- 4. Taller cuantitativo: datos generados en cada ronda ---------- */
function genTaller(){
  const grades = ['6°','7°','8°','9°','10°','11°'];
  let data, ok=false;
  for(let t=0; t<500 && !ok; t++){
    data = grades.map(g=>({g, pct:randInt(8,40), mat:randInt(28,45)}));
    data.forEach(d=> d.n = Math.round(d.pct*d.mat/100));
    const sp = [...data].sort((a,b)=>b.pct-a.pct), sn = [...data].sort((a,b)=>b.n-a.n), sm=[...data].sort((a,b)=>b.mat-a.mat);
    ok = sp[0].pct>sp[1].pct && sn[0].n>sn[1].n && sn[2].n>sn[3].n && sp[0].g!==sn[0].g && sm[0].mat>sm[1].mat;
    const w = data.reduce((s,d)=>s+d.pct*d.mat,0)/data.reduce((s,d)=>s+d.mat,0);
    const avg = data.reduce((s,d)=>s+d.pct,0)/data.length;
    ok = ok && Math.abs(w-avg) >= 0.8;
  }
  const minutes = [240,300,360,420][randInt(0,3)];
  const qs = shuffleArr([qMasEstudiantes, qConteo, qReparto, qPonderado].map(f=>f(data, minutes))).slice(0,3);
  return {data, minutes, qs};
}
function mkQ(p, correct, wrongs, e){
  const o = shuffleArr([correct, ...wrongs]);
  return {p, o, c:o.indexOf(correct), e};
}
function qMasEstudiantes(data){
  const sn=[...data].sort((a,b)=>b.n-a.n), sp=[...data].sort((a,b)=>b.pct-a.pct), sm=[...data].sort((a,b)=>b.mat-a.mat);
  const c=sn[0], d1=sp[0];
  const d2 = [sm[0], sp[1], sn[1], ...sn].find(x=>x.g!==c.g && x.g!==d1.g);
  return mkQ("¿Qué grado tiene <b>más estudiantes</b> en desempeño bajo?",
    `Grado ${c.g}`, [`Grado ${d1.g}`, `Grado ${d2.g}`],
    `Hay que multiplicar porcentaje por matrícula: grado ${c.g} tiene ${c.pct}% de ${c.mat} ≈ <b>${c.n} estudiantes</b>. Grado ${d1.g} tiene el porcentaje más alto (${d1.pct}%), pero con ${d1.mat} matriculados son ≈ ${d1.n}. Confundir porcentaje con cantidad es el error más común.`);
}
function qConteo(data){
  const cands = data.filter(d=> d.n !== d.pct && (d.mat-d.n)!==d.pct && d.n!==(d.mat-d.n));
  const d = cands[randInt(0,cands.length-1)] || data[0];
  return mkQ(`Grado ${d.g} tiene ${d.mat} estudiantes y el ${d.pct}% está en desempeño bajo. ¿Cuántos necesitan plan de apoyo (redondeando al entero)?`,
    `${d.n} estudiantes`, [`${d.mat-d.n} estudiantes`, `${d.pct} estudiantes`],
    `${d.pct}% de ${d.mat} = ${(d.pct*d.mat/100).toFixed(2)} ≈ <b>${d.n}</b>. ${d.mat-d.n} son los que <i>no</i> están en desempeño bajo, y ${d.pct} es el porcentaje, no la cantidad.`);
}
function split(total, weights){
  const s = weights.reduce((a,b)=>a+b,0);
  const raw = weights.map(w=>total*w/s), fl = raw.map(Math.floor);
  let rem = total - fl.reduce((a,b)=>a+b,0);
  raw.map((r,i)=>({i, f:r-fl[i]})).sort((a,b)=>b.f-a.f).slice(0,rem).forEach(x=>fl[x.i]++);
  return fl;
}
function qReparto(data, minutes){
  const top = [...data].sort((a,b)=>b.n-a.n).slice(0,3).sort((a,b)=>grades_idx(a.g)-grades_idx(b.g));
  const fmt = arr => top.map((d,i)=>`${d.g}: ${arr[i]} min`).join(' · ');
  const correct = split(minutes, top.map(d=>d.n));
  const byPct = split(minutes, top.map(d=>d.pct));
  const eq = split(minutes, [1,1,1]);
  const cands = [fmt(byPct), fmt(eq), fmt(split(minutes, top.map(d=>d.mat))), fmt(split(minutes,[3,2,1]))];
  const wrongs = [...new Set(cands)].filter(x=>x!==fmt(correct)).slice(0,2);
  return mkQ(`Hay <b>${minutes} minutos semanales</b> de refuerzo para los tres grados con más estudiantes en desempeño bajo (${top.map(d=>d.g).join(', ')}). ¿Cuál reparto es proporcional al número de estudiantes que necesitan apoyo?`,
    fmt(correct), wrongs,
    `Estudiantes en desempeño bajo: ${top.map(d=>`${d.g} ≈ ${d.n}`).join(', ')} (total ${top.reduce((s,d)=>s+d.n,0)}). Cada grado recibe ${minutes} × su parte del total. Repartir por porcentaje ignora cuántos estudiantes hay; repartir en partes iguales ignora la necesidad.`);
}
function grades_idx(g){ return ['6°','7°','8°','9°','10°','11°'].indexOf(g); }
function qPonderado(data){
  const totM = data.reduce((s,d)=>s+d.mat,0);
  const w = data.reduce((s,d)=>s+d.pct*d.mat,0)/totM;
  const avg = data.reduce((s,d)=>s+d.pct,0)/data.length;
  const sp = data.map(d=>d.pct).sort((a,b)=>a-b);
  const med = (sp[2]+sp[3])/2;
  const f = x => x.toFixed(1).replace('.',',')+'%';
  const third = [f(med), f((sp[0]+sp[5])/2), f(w+2.4), f(w-2.4)].find(x=> x!==f(w) && x!==f(avg));
  return mkQ("¿Qué porcentaje de <b>todos los estudiantes de 6° a 11°</b> está en desempeño bajo?",
    f(w), [f(avg), third],
    `Hay que ponderar por matrícula: (suma de porcentaje × matrícula de cada grado) ÷ ${totM} estudiantes = <b>${f(w)}</b>. Promediar los seis porcentajes (${f(avg)}) da el mismo peso a un grado de ${Math.min(...data.map(d=>d.mat))} estudiantes que a uno de ${Math.max(...data.map(d=>d.mat))}.`);
}
function renderTaller(){
  const max = Math.max(...ronda.data.map(d=>d.pct));
  const bars = ronda.data.map(d=>`
    <div class="cu-bar-row"><span class="cu-bar-label">${d.g}</span>
      <div class="cu-bar-track"><div class="cu-bar-fill" style="width:${(d.pct/max*100).toFixed(0)}%"></div></div>
      <span class="cu-bar-val">${d.pct}% · ${d.mat} est.</span></div>`).join('');
  const table = `<div class="basetext"><b>Resultados de lectura crítica — % de estudiantes en desempeño bajo y matrícula por grado</b>${bars}</div>`;
  if(ronda.idx >= ronda.qs.length){
    const ok = ronda.results.filter(Boolean).length;
    return `<div class="sub">taller de gestión académica · ${ok} de ${ronda.qs.length} correctas</div>${table}${rondaResumen(4)}`;
  }
  const q = ronda.qs[ronda.idx], ch = ronda.choice;
  const ops = q.o.map((t,i)=>{
    let cls='option';
    if(ch!==null){ cls+=' disabled'; if(i===q.c) cls+=' correct'; else if(i===ch) cls+=' incorrect'; else cls+=' dim'; }
    return `<div class="${cls}" data-cu-opt="${i}" role="button" tabindex="0"><span class="k">${'ABC'[i]}</span><span>${t}</span></div>`;
  }).join('');
  return `
  <div class="sub">taller de gestión académica · pregunta ${ronda.idx+1} de ${ronda.qs.length}</div>
  ${table}
  <div class="prompt" style="margin-top:14px;">${q.p}</div>
  <div class="options">${ops}</div>
  ${ch!==null ? `<div class="explain"><b>${ch===q.c?'Correcto.':'No es la opción correcta.'}</b> ${q.e}</div>` : ''}
  <div class="quiz-footer"><span></span>${ch!==null?`<button class="btn" id="cuNext">${ronda.idx<ronda.qs.length-1?'Siguiente pregunta →':'Ver resultado →'}</button>`:''}</div>`;
}

function renderTarjetas(){
  const deck = ronda.deck;
  if(ronda.idx >= deck.length){
    const k = Object.values(ronda.known).filter(Boolean).length;
    return `<div class="sub">tarjetas de memoria · sabías ${k} de ${deck.length}</div>${rondaResumen(5, '<p class="hint">Las que no sabías vuelven mañana; las que sabías, en una semana.</p>')}`;
  }
  const c = deck[ronda.idx];
  return `
  <div class="sub">tarjetas de memoria · ${ronda.idx+1} de ${deck.length}</div>
  <div class="flashcard ${ronda.flip?'flipped':''}" id="fcCard" role="button" tabindex="0" aria-label="Voltear tarjeta">
    <div class="fc-face fc-front">${c.front}</div>
    <div class="fc-face fc-back"><div>${c.back}</div></div>
  </div>
  ${ronda.flip
    ? `<div class="fc-rate"><button class="btn ghost" id="fcNo">No lo sabía</button><button class="btn" id="fcSi">Lo sabía</button></div>`
    : `<p class="hint" style="text-align:center;">Piensa qué modelo o concepto es y toca la tarjeta para comprobarlo.</p>`}`;
}

function renderTriangulacion(){
  const R = ronda;
  const rows = R.trios.map((t,i)=>{
    const s = R.sel[i] || {};
    const bOpts = R.optB.map(j=>`<option value="${j}" ${s.b==j?'selected':''}>${R.trios[j].b}</option>`).join('');
    const cOpts = R.optC.map(j=>`<option value="${j}" ${s.c==j?'selected':''}>${R.trios[j].c}</option>`).join('');
    let fb = '';
    if(R.checked){
      const bOk = s.b==i, cOk = s.c==i;
      fb = `<div class="tri-fb"><span class="${bOk?'ok':'bad'}">${bOk?'✓':'✗'} Estándar</span> <span class="${cOk?'ok':'bad'}">${cOk?'✓':'✗'} Competencia</span>
        ${bOk&&cOk?'':`<div class="no-data">Correcto: ${t.b} — <b>${t.c}</b></div>`}</div>`;
    }
    return `<div class="tri-row">
      <div class="tri-a"><span class="k">${i+1}</span> ${t.a}</div>
      <div class="tri-selects">
        <select data-tri-b="${i}" ${R.checked?'disabled':''} aria-label="Estándar"><option value="">— Estándar que se trabaja —</option>${bOpts}</select>
        <select data-tri-c="${i}" ${R.checked?'disabled':''} aria-label="Competencia"><option value="">— Competencia del docente —</option>${cOpts}</select>
      </div>${fb}</div>`;
  }).join('');
  const all = R.trios.every((_,i)=>R.sel[i] && R.sel[i].b!==undefined && R.sel[i].c!==undefined);
  return `
  <div class="sub">matriz de triangulación pedagógica</div>
  <p class="hint">Para cada situación, elige el estándar que se trabaja y la competencia comportamental que demuestra el docente (Resolución 3842).</p>
  <div class="tri-rows">${rows}</div>
  ${R.checked ? rondaResumen(6) : `<button class="btn" id="triCheck" ${all?'':'disabled'}>Verificar</button>`}`;
}

function renderCompletar(){
  const R = ronda, tx = R.tx;
  const html = tx.partes.map(p=>{
    if(p.text!==undefined) return `<span>${p.text}</span>`;
    const b = tx.blancos[p.blank], ch = R.answers[p.blank];
    let cls = 'completar-blank';
    if(R.checked) cls += (ch===b.c) ? ' correct' : ' incorrect'; else if(ch!==undefined) cls += ' filled';
    return `<select class="${cls}" data-blank="${p.blank}" ${R.checked?'disabled':''} aria-label="Espacio ${p.blank+1}">
      <option value="">(${p.blank+1}) ______</option>${b.options.map((o,i)=>`<option value="${i}" ${ch===i?'selected':''}>${o}</option>`).join('')}</select>`;
  }).join('');
  const all = tx.blancos.every((_,i)=>R.answers[i]!==undefined);
  const fb = R.checked ? tx.blancos.map((b,i)=>{
    const ok = R.answers[i]===b.c;
    return `<div class="explain" style="margin-top:10px;border-left-color:${ok?'var(--menta)':'var(--guayaba)'};"><b>Espacio ${i+1}: ${ok?'correcto':'era «'+b.options[b.c]+'»'}.</b> ${b.e}</div>`;
  }).join('') : '';
  return `
  <div class="sub">reconstrucción normativa · ${tx.titulo}</div>
  <div class="basetext completar-texto">${html}</div>
  ${R.checked ? fb + rondaResumen(7) : `<div style="margin-top:16px;"><button class="btn" id="compCheck" ${all?'':'disabled'}>Verificar texto</button></div>`}`;
}

/* ---------- eventos de las actividades ---------- */
function onActivate(el, fn){ el.onclick = fn; el.onkeydown = (e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); fn(e); } }; }
function attachActividadHandlers(){
  document.querySelectorAll('[data-open-act]').forEach(el=> onActivate(el, ()=>{ actScreen = parseInt(el.dataset.openAct); ronda = null; render(); window.scrollTo(0,0); }));
  const backHub = document.getElementById('backHub');
  if(backHub) backHub.onclick = ()=>{ actScreen = null; ronda = null; render(); };
  const nueva = document.getElementById('rondaNueva');
  if(nueva) nueva.onclick = ()=>{ newRonda(actScreen); render(); window.scrollTo(0,0); };
  if(!ronda) return;
  const R = ronda;

  /* 1. árbol */
  document.querySelectorAll('[data-dt-opt]').forEach(el=> onActivate(el, ()=>{
    if(R.choice!==null) return;
    R.choice = parseInt(el.dataset.dtOpt);
    if(R.tree.niveles[R.level].opciones[R.choice].correcto){ award(10, el); confetti(pointOf(el), 16); sfx('ok'); }
    else { R.first[R.level] = false; sfx('bad'); }
    render();
  }));
  const dtNext = document.getElementById('dtNext');
  if(dtNext) dtNext.onclick = ()=>{
    R.level++; R.choice=null;
    if(R.level >= R.tree.niveles.length){
      const ok = R.first.filter(Boolean).length;
      actItemResult(1, R.tree.id, ok===R.first.length);
      finishRonda(1, ok/R.first.length);
    }
    render();
  };
  const dtRetry = document.getElementById('dtRetry');
  if(dtRetry) dtRetry.onclick = ()=>{ R.choice=null; render(); };

  /* 2. fuentes */
  document.querySelectorAll('[data-fuente-tag]').forEach(el=> onActivate(el, ()=>{
    const f = R.frag; if(R.task >= f.tareas.length) return;
    const tag = el.dataset.fuenteTag, task = f.tareas[R.task];
    if(R.solved[tag]) return;
    if(tag===task.tag){
      R.solved[tag]=true; R.feedback={ok:true,msg:task.exp}; R.task++;
      award(10, el); confetti(pointOf(el), 14); sfx('ok');
      if(R.task >= f.tareas.length){
        const ok = R.first.filter(Boolean).length;
        actItemResult(2, f.id, ok===R.first.length);
        finishRonda(2, ok/R.first.length);
      }
    } else { R.first[R.task]=false; R.feedback={ok:false,msg:"Esa frase no cumple la función que pide la tarea. Vuelve a leer el fragmento."}; sfx('bad'); }
    render();
  }));

  /* 3. organizador */
  const place = (id, cat)=>{
    const card = R.cards.find(c=>c.id===id); if(!card || R.placed[id]) return;
    const ok = cat===card.cat;
    R.placed[id] = {cat, correct:ok}; R.picked=null;
    actItemResult(3, id, ok);
    sfx(ok?'ok':'bad'); if(ok) award(5);
    if(Object.keys(R.placed).length===R.cards.length){
      finishRonda(3, Object.values(R.placed).filter(p=>p.correct).length/R.cards.length);
    }
    render();
  };
  document.querySelectorAll('[data-norm-card]').forEach(el=>{
    onActivate(el, ()=>{ const id=el.dataset.normCard; R.picked = R.picked===id ? null : id; render(); });
    el.ondragstart = (e)=>{ e.dataTransfer.setData('text/plain', el.dataset.normCard); el.classList.add('dragging'); };
    el.ondragend = ()=> el.classList.remove('dragging');
  });
  document.querySelectorAll('[data-norm-cat]').forEach(el=>{
    onActivate(el, ()=>{ if(R.picked) place(R.picked, el.dataset.normCat); });
    el.ondragover = (e)=>{ e.preventDefault(); el.classList.add('drag-over'); };
    el.ondragleave = ()=> el.classList.remove('drag-over');
    el.ondrop = (e)=>{ e.preventDefault(); el.classList.remove('drag-over'); const id=e.dataTransfer.getData('text/plain'); if(id) place(id, el.dataset.normCat); };
  });

  /* 4. taller */
  document.querySelectorAll('[data-cu-opt]').forEach(el=> onActivate(el, ()=>{
    if(R.choice!==null) return;
    R.choice = parseInt(el.dataset.cuOpt);
    const ok = R.choice===R.qs[R.idx].c; R.results[R.idx]=ok;
    if(ok){ award(15, el); confetti(pointOf(el), 16); sfx('ok'); } else sfx('bad');
    render();
  }));
  const cuNext = document.getElementById('cuNext');
  if(cuNext) cuNext.onclick = ()=>{
    R.idx++; R.choice=null;
    if(R.idx >= R.qs.length) finishRonda(4, R.results.filter(Boolean).length/R.qs.length);
    render();
  };

  /* 5. tarjetas */
  const fc = document.getElementById('fcCard');
  if(fc) onActivate(fc, ()=>{ R.flip = !R.flip; render(); });
  const rate = (knew)=>{
    const c = R.deck[R.idx]; R.known[c.id] = knew; actItemResult(5, c.id, knew);
    sfx(knew?'ok':'bad'); if(knew) award(4);
    R.idx++; R.flip=false;
    if(R.idx >= R.deck.length) finishRonda(5, Object.values(R.known).filter(Boolean).length/R.deck.length);
    render();
  };
  const si = document.getElementById('fcSi'); if(si) si.onclick = ()=>rate(true);
  const no = document.getElementById('fcNo'); if(no) no.onclick = ()=>rate(false);

  /* 6. triangulación */
  document.querySelectorAll('[data-tri-b]').forEach(el=>{ el.onchange = ()=>{ const i=+el.dataset.triB; R.sel[i]=R.sel[i]||{}; R.sel[i].b = el.value===''?undefined:+el.value; render(); }; });
  document.querySelectorAll('[data-tri-c]').forEach(el=>{ el.onchange = ()=>{ const i=+el.dataset.triC; R.sel[i]=R.sel[i]||{}; R.sel[i].c = el.value===''?undefined:+el.value; render(); }; });
  const triCheck = document.getElementById('triCheck');
  if(triCheck) triCheck.onclick = ()=>{
    R.checked = true; let pts = 0;
    R.trios.forEach((t,i)=>{ const s=R.sel[i]; const ok = s.b==i && s.c==i; pts += (s.b==i) + (s.c==i); actItemResult(6, t.id, ok); });
    finishRonda(6, pts/(R.trios.length*2)); render();
  };

  /* 7. completar */
  document.querySelectorAll('[data-blank]').forEach(el=>{ el.onchange = ()=>{ R.answers[+el.dataset.blank] = el.value===''?undefined:+el.value; render(); }; });
  const compCheck = document.getElementById('compCheck');
  if(compCheck) compCheck.onclick = ()=>{
    R.checked = true;
    const ok = R.tx.blancos.filter((b,i)=>R.answers[i]===b.c).length;
    actItemResult(7, R.tx.id, ok===R.tx.blancos.length);
    finishRonda(7, ok/R.tx.blancos.length); render();
  };
}


function masthead(){
  if(screen === 'actividades'){
    return `
    <div class="masthead">
      <div class="stamp">EXPEDIENTE<br>CS · 2026<br>ACTIVIDADES</div>
      <div class="eyebrow"><span id="backLanding" class="back-link">← Portada</span> · Concurso Docente 2026 — CNSC · Área: Ciencias Sociales</div>
      <h1>Actividades conceptuales y de conocimiento</h1>
      <p>Simulador de decisiones, laboratorio de fuentes, organizador normativo, taller de gestión académica, tarjetas de memoria, matriz de triangulación pedagógica y reconstrucción normativa.</p>
    </div>`;
  }
  if(screen === 'estado'){
    return `
    <div class="masthead">
      <div class="stamp">EXPEDIENTE<br>CS · 2026<br>CONVOCATORIA</div>
      <div class="eyebrow"><span id="backLanding" class="back-link">← Portada</span> · Concurso Docente 2026-27 — CNSC</div>
      <h1>Estado del concurso</h1>
      <p>Cronograma, etapas, oferta y requisitos de título para Ciencias Sociales. Cada dato indica si está confirmado o es todavía una proyección, y de dónde sale.</p>
    </div>`;
  }
  if(screen === 'progreso'){
    return `
    <div class="masthead">
      <div class="stamp">EXPEDIENTE<br>CS · 2026<br>MI PROGRESO</div>
      <div class="eyebrow"><span id="backLanding" class="back-link">← Portada</span> · Concurso Docente 2026 — CNSC · Área: Ciencias Sociales</div>
      <h1>Mi progreso general</h1>
      <p>Vista conjunta de tu dominio por competencia en los casos de análisis y de los módulos completados en Actividades conceptuales.</p>
    </div>`;
  }
  return `
  <div class="masthead">
    <div class="stamp">EXPEDIENTE<br>CS · 2026<br>NIVEL SABER</div>
    <div class="eyebrow"><span id="backLanding" class="back-link">← Portada</span> · Concurso Docente 2026 — CNSC · Área: Ciencias Sociales</div>
    <h1>Sala de preparación — casos de análisis avanzado</h1>
    <p>Casos tipo Saber: lectura crítica con fuentes cruzadas, razonamiento cuantitativo aplicado a gestión escolar, juicio situacional docente y fundamentación legal-normativa aplicada. Todas las opciones exigen lectura completa: la longitud del texto no indica cuál es correcta.</p>
  </div>`;
}
function disclaimer(){
  if(screen === 'actividades'){
    return `<div class="disclaimer"><b>Nota:</b> estas actividades son ejercicios propios de repaso conceptual, construidos a partir de los Estándares y el Manual de Funciones que subiste; la Ley 1620 de 2013, el Decreto 1965 de 2013 y los DBA de grados 1° a 8° se contrastaron con el texto oficial; los DBA de 9° a 11° siguen pendientes de verificación. No son parte de una prueba oficial ni sustituyen la Guía de Orientación del ICFES/CNSC.</div>`;
  }
  if(screen === 'estado'){
    return `<div class="disclaimer"><b>Actualizado al 24 de octubre de 2026.</b> La CNSC aún no ha publicado los acuerdos definitivos de la convocatoria; mientras eso no ocurra, fechas, etapas y ponderaciones pueden cambiar. Verifica siempre en cnsc.gov.co y en SIMO.</div>`;
  }
  if(screen === 'progreso'){
    return `<div class="disclaimer"><b>Nota:</b> este resumen es un registro personal de estudio guardado en tu propio dispositivo/cuenta; no es un registro oficial ante la CNSC ni el ICFES.</div>`;
  }
  return `<div class="disclaimer"><b>Nota:</b> el número de preguntas, el tiempo exacto y la estructura oficial de la prueba los define la Guía de Orientación y el manual de funciones que publique el ICFES / la universidad contratada por la CNSC para esta convocatoria. Esta herramienta es un simulador de estudio propio, no un examen oficial.</div>`;
}


const ESTADO_CRONO = [
  {cuando:"Agosto 2026", que:"La CNSC publica para consulta ciudadana los proyectos de acuerdo y el anexo técnico de la convocatoria (población mayoritaria). Se reciben cerca de 15.000 observaciones.", estado:"confirmado", src:[0,1]},
  {cuando:"Octubre 2026", que:"La CNSC traslada las inscripciones del cierre de 2026 al comienzo de 2027, sin fechas exactas, para garantizar la participación de aspirantes de las zonas afectadas por el sismo.", estado:"confirmado", src:[1,2]},
  {cuando:"Antes de inscribir", que:"Publicación de los acuerdos definitivos con reglas, requisitos y etapas. Sin ellos no puede abrirse la inscripción.", estado:"pendiente", src:[1]},
  {cuando:"Dic 2026 – ene 2027", que:"Inscripción gratuita para aspirantes con discapacidad.", estado:"proyectado", src:[1,2]},
  {cuando:"Inicio de 2027", que:"Inscripciones generales a través de SIMO.", estado:"proyectado", src:[1,3]},
  {cuando:"Segundo semestre 2027", que:"Aplicación de las pruebas escritas, la etapa eliminatoria del proceso.", estado:"proyectado", src:[2]}
];
const ESTADO_ETAPAS = [
  {t:"Pruebas escritas de aptitudes y competencias", d:"Etapa eliminatoria. El ICFES o la universidad contratada publicará una Guía de Orientación y Ejes Temáticos con contenidos, número de preguntas y criterios de calificación."},
  {t:"Prueba psicotécnica", d:"Valora actitudes, motivaciones y competencias comportamentales frente a situaciones propias de la labor docente."},
  {t:"Entrevista", d:"Su forma de aplicación, quiénes la presentan y su peso los define el acuerdo definitivo."},
  {t:"Valoración de antecedentes", d:"Puntúa hasta 100 puntos la formación (licenciatura, especialización, maestría, doctorado) y la experiencia relevante para el cargo."}
];
const ESTADO_FUENTES = [
  {n:"Infobae (21 ago 2026) — consulta pública de la convocatoria", u:"https://www.infobae.com/colombia/2026/08/21/cnsc-abrio-a-consulta-publica-la-convocatoria-para-28000-plazas-docentes-las-pruebas-del-concurso-2026-se-haran-en-mas-de-50-ciudades/"},
  {n:"RTVC Noticias — el cronograma se movió a 2027", u:"https://www.rtvcnoticias.com/actualidad/educacion/el-cronograma-del-concurso-docente-2026-se-movio-2027-aqui-le-contamos-las"},
  {n:"Noticias RCN (13 oct 2026) — cambios en el cronograma", u:"https://www.noticiasrcn.com/economia/atencion-aspirantes-cnsc-confirma-importantes-cambios-en-el-concurso-docente-2026-1071226"},
  {n:"RCN Radio — cómo consultar las vacantes en SIMO", u:"https://newsroom.rcnradio.com/colombia/concurso-de-docentes-del-ministerio-de-educacion-y-cnsc-asi-puedes-aplicar-a-las-vacantes"},
  {n:"Infobae (16 jun 2026) — títulos habilitados por área", u:"https://www.infobae.com/colombia/2026/06/16/definen-carreras-y-titulos-habilitados-para-aplicar-al-concurso-docente-2026-en-preescolar-primaria-y-secundaria-en-colombia/"}
];
const TITULOS_CS = {
  lic:["Ciencias sociales","Historia","Geografía","Filosofía","Educación básica con énfasis en ciencias sociales","Educación comunitaria","Pedagogía y sociales","Educación con énfasis o especialidad en ciencias sociales","Etnoeducación","Ciencias económicas y políticas","Humanidades","Estudios sociales y humanos","Educación para la democracia","Pedagogía y/o didáctica de las ciencias sociales"],
  prof:["Sociología","Geografía","Historia","Ciencias sociales","Ciencias políticas","Artes liberales en ciencias sociales","Filosofía","Antropología","Arqueología","Estudios políticos y resolución de conflictos","Estudios políticos","Trabajo social"]
};
function badge(e){
  const L={confirmado:"Confirmado",proyectado:"Proyectado",pendiente:"Pendiente"};
  return `<span class="est-badge ${e}">${L[e]}</span>`;
}
function srcLinks(arr){
  return arr.map(i=>`<a href="${ESTADO_FUENTES[i].u}" target="_blank" rel="noopener" class="est-src">[${i+1}]</a>`).join(' ');
}
function renderEstado(){
  const crono = ESTADO_CRONO.map(c=>`
    <div class="est-row">
      <div class="est-when">${c.cuando}</div>
      <div class="est-what">${badge(c.estado)} ${c.que} ${srcLinks(c.src)}</div>
    </div>`).join('');
  const etapas = ESTADO_ETAPAS.map(e=>`<div class="est-stage"><div class="est-stage-t">${e.t}</div><div class="est-stage-d">${e.d}</div></div>`).join('');
  const lic = TITULOS_CS.lic.map(t=>`<li>Licenciatura en ${t.charAt(0).toLowerCase()+t.slice(1)}</li>`).join('');
  const prof = TITULOS_CS.prof.map(t=>`<li>${t}</li>`).join('');
  const fuentes = ESTADO_FUENTES.map((f,i)=>`<li><a href="${f.u}" target="_blank" rel="noopener">[${i+1}] ${f.n}</a></li>`).join('');
  return `
  <div class="card">
    <h3>Cronograma</h3>
    <div class="sub">qué ya pasó, qué está proyectado y qué falta</div>
    <div class="est-crono">${crono}</div>
  </div>
  <div class="card">
    <h3>Etapas del proceso ${badge('proyectado')}</h3>
    <div class="sub">según los proyectos de acuerdo publicados en agosto de 2026 ${srcLinks([0])}</div>
    <div class="est-stages">${etapas}</div>
    <p class="est-note">Los pesos de cada etapa y el puntaje mínimo aprobatorio los fija el acuerdo definitivo. No los des por hechos hasta que se publique.</p>
  </div>
  <div class="card">
    <h3>Oferta preliminar ${badge('proyectado')}</h3>
    <div class="est-facts">
      <div class="est-fact"><span class="est-num">≈ 28.000</span><span>vacantes en instituciones oficiales ${srcLinks([0,1])}</span></div>
      <div class="est-fact"><span class="est-num">+50</span><span>ciudades donde se aplicarán las pruebas ${srcLinks([0])}</span></div>
      <div class="est-fact"><span class="est-num">7%</span><span>de cada vacante reservado para personas con discapacidad ${srcLinks([0])}</span></div>
    </div>
    <p class="est-note">Cargos: docentes de aula por área y nivel, docentes orientadores, rectores, coordinadores y directores rurales. Las vacantes preliminares se consultan en SIMO → «Proyectos de Acuerdo» → «Procesos de selección docentes y directivos docentes 2026 – población mayoritaria» ${srcLinks([3])}.</p>
  </div>
  <div class="card">
    <h3>Títulos admitidos para Ciencias Sociales ${badge('confirmado')}</h3>
    <div class="sub">Resolución 3842 de 2022, numeral 2.1.4.4 — docente de ciencias sociales, historia, geografía, constitución política y democracia</div>
    <div class="est-cols">
      <div><div class="est-col-t">Licenciaturas</div><ul class="est-list">${lic}</ul></div>
      <div><div class="est-col-t">Títulos profesionales</div><ul class="est-list">${prof}</ul></div>
    </div>
    <p class="est-note">Cargos vecinos en la misma resolución: <b>docente de filosofía</b> (2.1.4.19: licenciatura en filosofía, en educación con énfasis en filosofía, en ciencias sociales con profundización en filosofía o en teología; profesional en filosofía, teología o estudios en filosofía) y <b>docente de ciencias económicas y políticas</b> (2.1.4.18, que admite, entre otros, administración de negocios, pública o financiera, finanzas, economía y ciencia política). La prensa de junio de 2026 reporta una lista un poco distinta para Ciencias Sociales (incluye economía) ${srcLinks([4])}; la que manda es la del acuerdo definitivo. Los profesionales no licenciados deben acreditar formación pedagógica.</p>
  </div>
  <div class="card">
    <h3>Qué hacer mientras tanto</h3>
    <ul class="est-todo">
      <li>Revisa en SIMO las vacantes preliminares de Ciencias Sociales en tu entidad territorial.</li>
      <li>Reúne desde ya los soportes de valoración de antecedentes: títulos, actas de grado y certificados laborales con funciones y fechas.</li>
      <li>Usa el tiempo hasta el segundo semestre de 2027 para un plan por fases: diagnóstico con los casos de análisis, refuerzo de tus áreas débiles y simulacros con tiempo.</li>
      <li>Cuando el ICFES publique la Guía de Orientación, ajusta en el modo Examen el número de preguntas y la duración.</li>
    </ul>
  </div>
  <div class="card">
    <h3>Fuentes</h3>
    <ul class="est-fuentes">${fuentes}</ul>
    <button class="btn ghost" id="backLanding4" style="margin-top:12px;">← Volver a la portada</button>
  </div>`;
}

function renderProgreso(){
  const actDoneCount = Object.keys(actProgress).length;
  const actList = ACTIVIDADES_META.map(a=>{
    const done = !!actProgress[a.id];
    const st = actStats[a.id];
    return `<div class="prog-act-row"><span class="prog-act-status ${done?'ok':''}">${done?'✓':'○'}</span><span>${a.title}</span><span class="prog-act-meta">${st?`${st.rondas} ${st.rondas===1?'ronda':'rondas'} · mejor ${st.mejor}%`:''}</span></div>`;
  }).join('');
  const L = levelInfo(), gotN = Object.keys(gam.badges).length;
  const badgesHtml = BADGES.map(b=>`<div class="badge-item ${gam.badges[b.id]?'got':''}"><div class="b-ico">${ICON[b.ico]}</div><div class="b-t">${b.t}</div><div class="b-d">${gam.badges[b.id] ? 'Obtenida el '+gam.badges[b.id] : b.d}</div></div>`).join('');
  return `
  <div class="card" style="margin-bottom:16px;">
    <h3>Tu ruta</h3>
    <div class="sub">nivel ${L.n} · ${L.name}</div>
    <div class="stat-row">
      <div class="stat"><b data-countup="${gam.xp}">0</b><span>XP acumulados</span></div>
      <div class="stat"><b data-countup="${gam.answered}">0</b><span>casos respondidos</span></div>
      <div class="stat"><b data-countup="${gam.bestCombo}">0</b><span>mejor racha</span></div>
      <div class="stat"><b data-countup="${activeDayStreak()}">0</b><span>días seguidos</span></div>
    </div>
  </div>
  <div class="card" style="margin-bottom:16px;">
    <h3>Memoria de largo plazo</h3>
    <div class="sub">en qué punto de la repetición espaciada está cada caso</div>
    ${memoriaHtml()}
  </div>
  <div class="card" style="margin-bottom:16px;">
    <h3>Insignias</h3>
    <div class="sub">${gotN} de ${BADGES.length} desbloqueadas</div>
    <div class="badges">${badgesHtml}</div>
  </div>
  <div class="grid">
    <div>${competencyPanel()}</div>
    <div class="card">
      <h3>Actividades conceptuales y de conocimiento</h3>
      <div class="sub">progreso: ${actDoneCount}/7 módulos completados</div>
      <div class="prog-act-list">${actList}</div>
      <div style="margin-top:20px;display:flex;gap:10px;flex-wrap:wrap;">
        <button class="btn ghost" id="goToActividadesFromProgreso">Ir a Actividades</button>
        <button class="btn ghost" id="goToCasosFromProgreso">Ir a Casos de análisis</button>
      </div>
    </div>
  </div>
  <div class="card" style="margin-top:16px;">
    <h3>Respaldo del progreso</h3>
    <div class="sub">tu avance vive en este dispositivo</div>
    <p class="hint">Guarda un archivo de respaldo de vez en cuando (por ejemplo, en Google Drive o en Archivos). Si cambias de celular o borras los datos del navegador, lo restauras desde aquí.</p>
    <div style="display:flex;gap:10px;flex-wrap:wrap;">
      <button class="btn" id="btnExport">Guardar respaldo</button>
      <label class="btn ghost" for="fileImport">Restaurar desde archivo</label>
      <input type="file" id="fileImport" accept="application/json,.json" hidden>
    </div>
    <p class="hint" style="margin-top:10px;">Restaurar reemplaza el progreso actual de este dispositivo por el del archivo.</p>
  </div>`;
}
function memoriaHtml(){
  const m = memoriaStats(), tot = Q.length;
  const segs = [['dominados','Dominados','var(--menta)'],['consolidando','Consolidando','var(--cielo)'],['aprendiendo','Aprendiendo','var(--mango)'],['nuevos','Sin ver','rgba(255,255,255,.12)']];
  const bar = segs.map(([k,,c])=> m[k] ? `<span style="flex:${m[k]};background:${c}"></span>` : '').join('');
  const legend = segs.map(([k,l,c])=>`<div class="mem-leg"><i style="background:${c}"></i><b>${m[k]}</b> ${l}</div>`).join('');
  return `<div class="mem-bar" role="img" aria-label="${m.dominados} dominados, ${m.consolidando} consolidando, ${m.aprendiendo} aprendiendo, ${m.nuevos} sin ver, de ${tot}">${bar}</div>
    <div class="mem-legend">${legend}</div>
    <p class="hint">Un caso pasa a «dominado» cuando lo aciertas varias veces seguidas con días de separación. Si lo fallas, vuelve a «aprendiendo».</p>`;
}
function competencyPanel(){
  const rows = Object.entries(AREAS).map(([key,meta])=>{
    const m = masteryOf(key);
    const h = history[key];
    let cls = '';
    if(m !== null){ cls = m < 60 ? 'weak' : (m >= 80 ? 'strong' : ''); }
    return `
      <div class="comp-row">
        <div class="comp-label"><span>${meta.label}</span><span class="n">${m===null?'—':m+'%'}</span></div>
        <div class="bar-track"><div class="bar-fill ${cls}" style="width:${m===null?4:m}%"></div></div>
        ${h ? `<div class="no-data">${h.correct}/${h.attempts} correctas registradas</div>` : `<div class="no-data">Sin datos aún</div>`}
      </div>`;
  }).join('');
  const weak = weakestArea();
  const rec = weak
    ? `Tu área con menor dominio registrado es <b>${AREAS[weak].label}</b> (${masteryOf(weak)}%). El simulador la está priorizando en tus próximas sesiones.`
    : `Responde algunos casos para que el sistema detecte tus áreas más débiles y las priorice.`;
  return `<div class="card"><h3>Marco de competencias</h3><div class="sub">dominio disciplinar, cuantitativo, normativo y situacional</div>${rows}<div class="recommend">${rec}</div></div>`;
}
function renderInicio(){
  const areaChips = Object.entries(AREAS).map(([key,meta])=>
    `<span class="chip ${cfg.areas.has(key)?'active':''}" data-toggle-area="${key}">${meta.label}</span>`).join('');
  const diffChips = [["B","Básico"],["I","Intermedio"],["A","Avanzado"]].map(([k,l])=>
    `<span class="chip ${cfg.diffs.has(k)?'active':''}" data-toggle-diff="${k}">${l}</span>`).join('');
  const pool = Q.filter(q => cfg.areas.has(q.area) && cfg.diffs.has(q.d)).length;
  return `
  <div class="grid">
    <div>${competencyPanel()}</div>
    <div class="card">
      <h3>Configurar sesión</h3>
      <div class="sub">banco de casos de análisis — nivel Saber</div>
      <fieldset><legend>Modo</legend>
        <div class="mode-toggle">
          <div class="mode-btn ${cfg.mode==='estudio'?'active':''}" data-mode="estudio">
            <div class="t">Estudio</div><div class="d">Retroalimentación inmediata con fundamentación de cada caso</div></div>
          <div class="mode-btn ${cfg.mode==='examen'?'active':''}" data-mode="examen">
            <div class="t">Examen</div><div class="d">Contrarreloj, sin pistas, informe final con revisión</div></div>
        </div>
      </fieldset>
      <fieldset><legend>Áreas incluidas</legend><div class="chip-row">${areaChips}</div></fieldset>
      <fieldset><legend>Dificultad</legend><div class="chip-row">${diffChips}</div></fieldset>
      <label class="field">Número de casos
        <div><input type="number" id="countInput" min="3" max="${Math.max(3,pool)}" value="${cfg.count}"></div></label>
      ${cfg.mode==='examen' ? `<label class="field">Duración total (minutos)
        <div><input type="number" id="minutesInput" min="5" max="180" value="${cfg.minutes}"></div></label>` : ''}
      <div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap;">
        <button class="btn" id="startBtn" ${pool===0?'disabled':''}>Abrir expediente (${Math.min(cfg.count,pool)} casos)</button>
        <button class="btn ghost" id="backLanding3">← Volver a la portada</button>
      </div>
      ${pool===0 ? `<div class="no-data" style="margin-top:8px;">Selecciona al menos un área y una dificultad.</div>` : ''}
    </div>
  </div>`;
}
function renderQuiz(){
  const q = session.queue[session.idx];
  const given = session.answers[q.id];
  const diffLabel = {B:'Básico',I:'Intermedio',A:'Avanzado'}[q.d];
  const optionsHtml = q.o.map((text, i)=>{
    let cls = 'option';
    if(session.mode==='estudio' && given){
      cls += ' disabled';
      if(i === q.c) cls += ' correct';
      else if(i === given.selected) cls += ' incorrect';
      else cls += ' dim';
    }
    return `<div class="${cls}" data-answer="${i}"><span class="k">${String.fromCharCode(65+i)}</span><span>${text}</span></div>`;
  }).join('');
  const timerBlock = session.mode==='examen' ? `<div class="timer" id="timerChip">${fmtTime(session.timeLeftSec)}</div>` : '';
  const ctxBlock = q.ctx ? `<div class="basetext">${q.ctx}</div>` : '';
  const explainBlock = (session.mode==='estudio' && given)
    ? `<div class="explain"><b>${given.correct ? 'Correcto.' : 'No es la opción correcta.'}</b> ${q.e}</div>` : '';
  const nextBtn = (session.mode==='estudio' && given)
    ? `<button class="btn" id="nextBtn">${session.idx < session.queue.length-1 ? 'Siguiente caso →' : 'Ver informe final →'}</button>`
    : `<span></span>`;
  return `
  <div class="grid">
    <div>${competencyPanel()}</div>
    <div class="card expediente">
      <div class="exp-head">
        <div>
          <div class="exp-id">${session.repaso?'REPASO · ':''}CASO N.º ${String(session.idx+1).padStart(2,'0')} / ${session.queue.length} · REF. ${q.id.toUpperCase()}</div>
          <div class="exp-tags"><span class="tag">${AREAS[q.area].label}</span><span class="tag diff-${q.d}">${diffLabel}</span></div>
        </div>
        ${timerBlock}
      </div>
      <div class="q-progress" aria-hidden="true">${session.queue.map((qq,i)=>{ const a=session.answers[qq.id]; let c=''; if(a) c = session.mode==='estudio' ? (a.correct?'done-ok':'done-bad') : 'done'; else if(i===session.idx) c='now'; return `<span class="${c}"></span>`; }).join('')}</div>
      ${ctxBlock}
      <div class="prompt">${q.p}</div>
      <div class="options">${optionsHtml}</div>
      ${explainBlock}
      <div class="quiz-footer">
        <span class="progress-line">Progreso: ${Object.keys(session.answers).length}/${session.queue.length} respondidas</span>
        ${nextBtn}
      </div>
    </div>
  </div>`;
}
function renderResumen(){
  const total = session.queue.length;
  let correct = 0;
  const rows = session.queue.map(q=>{
    const a = session.answers[q.id];
    const ok = a ? a.correct : false;
    if(ok) correct++;
    const chosen = a ? q.o[a.selected] : '— sin responder —';
    return `<tr><td class="mono">${q.id.toUpperCase()}</td><td>${AREAS[q.area].label}</td><td>${q.p}</td>
      <td class="${ok?'ok':'bad'}">${chosen}</td><td>${ok ? '' : q.o[q.c]}</td></tr>`;
  }).join('');
  const pct = Math.round((correct/total)*100);
  const weak = weakestArea();
  const bySession = {};
  session.queue.forEach(q=>{
    if(!bySession[q.area]) bySession[q.area] = {a:0,c:0};
    bySession[q.area].a++;
    if(session.answers[q.id] && session.answers[q.id].correct) bySession[q.area].c++;
  });
  const breakdown = Object.entries(bySession).map(([k,v])=>
    `<div class="comp-row"><div class="comp-label"><span>${AREAS[k].label}</span><span class="n">${v.c}/${v.a}</span></div>
     <div class="bar-track"><div class="bar-fill" style="width:${Math.round((v.c/v.a)*100)}%"></div></div></div>`).join('');
  return `
  <div class="grid">
    <div>${competencyPanel()}</div>
    <div class="card">
      <div class="score-hero"><div class="score-ring" style="--p:${pct};--ring:${pct>=80?'var(--menta)':(pct>=60?'var(--mango)':'var(--guayaba)')}"><div><div class="big" data-countup="${pct}" data-suffix="%">0%</div></div></div><div class="lab">${correct} de ${total} casos resueltos correctamente</div>${session.xpEarned?`<div class="score-xp">+${session.xpEarned} XP en esta sesión</div>`:''}</div>
      <h3 style="margin-top:6px;">Desglose de esta sesión</h3>
      ${breakdown}
      ${weak ? `<div class="recommend">Con base en tu historial acumulado, tu prioridad de estudio es <b>${AREAS[weak].label}</b>. Abre una nueva sesión enfocada solo en esa área para reforzarla.</div>` : ''}
      <h3 style="margin-top:20px;">Revisión caso por caso</h3>
      <div class="table-wrap"><table class="review"><tr><th>Ref.</th><th>Área</th><th>Enunciado</th><th>Tu respuesta</th><th>Correcta (si falló)</th></tr>${rows}</table></div>
      <div style="margin-top:20px;display:flex;gap:10px;flex-wrap:wrap;">
        <button class="btn" id="restartBtn">Nueva sesión</button>
        <button class="btn ghost" id="retryWeakBtn" ${!weak?'disabled':''}>Reforzar área débil</button>
        <button class="btn ghost" id="backLanding3">Ir a la portada</button>
      </div>
    </div>
  </div>`;
}
function attachHandlers(){
  const goToCasos = document.getElementById('goToCasos');
  if(goToCasos) goToCasos.onclick = ()=>{ screen = 'inicio'; render(); };
  const goToActividades = document.getElementById('goToActividades');
  if(goToActividades) goToActividades.onclick = ()=>{ screen = 'actividades'; actScreen = null; ronda = null; render(); window.scrollTo(0,0); };
  attachActividadHandlers();

  const goRepaso = document.getElementById('goRepaso');
  if(goRepaso) goRepaso.onclick = startRepaso;
  const btnInstall = document.getElementById('btnInstall');
  if(btnInstall) btnInstall.onclick = async ()=>{ if(!deferredInstall) return; deferredInstall.prompt(); try{ await deferredInstall.userChoice; }catch(e){} deferredInstall = null; render(); };
  const hintClose = document.getElementById('hintClose');
  if(hintClose) hintClose.onclick = ()=>{ storeSet('oficina_hint_cerrado','1'); render(); };
  const btnExport = document.getElementById('btnExport');
  if(btnExport) btnExport.onclick = exportBackup;
  const fileImport = document.getElementById('fileImport');
  if(fileImport) fileImport.onchange = ()=>{ if(fileImport.files[0]) importBackup(fileImport.files[0]); fileImport.value=''; };
  const backLanding = document.getElementById('backLanding');
  if(backLanding) backLanding.onclick = ()=>{ session = null; screen = 'landing'; render(); };
  const goToEstado = document.getElementById('goToEstado');
  if(goToEstado) goToEstado.onclick = ()=>{ screen = 'estado'; render(); window.scrollTo(0,0); };
  const backLanding4 = document.getElementById('backLanding4');
  if(backLanding4) backLanding4.onclick = ()=>{ screen = 'landing'; render(); window.scrollTo(0,0); };
  const goToProgreso = document.getElementById('goToProgreso');
  if(goToProgreso) goToProgreso.onclick = ()=>{ screen = 'progreso'; render(); };
  const goToActividadesFromProgreso = document.getElementById('goToActividadesFromProgreso');
  if(goToActividadesFromProgreso) goToActividadesFromProgreso.onclick = ()=>{ screen = 'actividades'; actScreen = null; render(); };
  const goToCasosFromProgreso = document.getElementById('goToCasosFromProgreso');
  if(goToCasosFromProgreso) goToCasosFromProgreso.onclick = ()=>{ screen = 'inicio'; render(); };
  const backLanding2 = document.getElementById('backLanding2');
  if(backLanding2) backLanding2.onclick = ()=>{ session = null; screen = 'landing'; render(); };
  const backLanding3 = document.getElementById('backLanding3');
  if(backLanding3) backLanding3.onclick = ()=>{ session = null; screen = 'landing'; render(); };
  document.querySelectorAll('[data-toggle-area]').forEach(el=>{
    el.onclick = ()=>{ const k=el.getAttribute('data-toggle-area'); cfg.areas.has(k)?cfg.areas.delete(k):cfg.areas.add(k); render(); };
  });
  document.querySelectorAll('[data-toggle-diff]').forEach(el=>{
    el.onclick = ()=>{ const k=el.getAttribute('data-toggle-diff'); cfg.diffs.has(k)?cfg.diffs.delete(k):cfg.diffs.add(k); render(); };
  });
  document.querySelectorAll('[data-mode]').forEach(el=>{ el.onclick = ()=>{ cfg.mode = el.getAttribute('data-mode'); render(); }; });
  const countInput = document.getElementById('countInput');
  if(countInput) countInput.onchange = ()=>{ cfg.count = Math.max(3, parseInt(countInput.value)||10); };
  const minutesInput = document.getElementById('minutesInput');
  if(minutesInput) minutesInput.onchange = ()=>{ cfg.minutes = Math.max(5, parseInt(minutesInput.value)||25); };
  const startBtn = document.getElementById('startBtn');
  if(startBtn) startBtn.onclick = startSession;
  document.querySelectorAll('[data-answer]').forEach(el=>{
    el.onclick = ()=>{ const q=session.queue[session.idx]; if(session.mode==='estudio' && session.answers[q.id]) return; window._lastClick = el; answer(q.id, parseInt(el.getAttribute('data-answer'))); };
  });
  const nextBtn = document.getElementById('nextBtn'); if(nextBtn) nextBtn.onclick = nextQuestion;
  const restartBtn = document.getElementById('restartBtn'); if(restartBtn) restartBtn.onclick = backToStart;
  const retryWeakBtn = document.getElementById('retryWeakBtn');
  if(retryWeakBtn) retryWeakBtn.onclick = ()=>{ const weak=weakestArea(); if(weak){ cfg.areas=new Set([weak]); cfg.diffs=new Set(["B","I","A"]); backToStart(); } };
}
loadGam();
loadSrs();
loadHistory();
loadActProgress();
registerSW();