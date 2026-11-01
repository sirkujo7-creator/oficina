/* Oficina · service worker: funciona sin internet y avisa cuando hay versión nueva */
const VERSION = 'oficina-1.0.0';
const SHELL = [
  './', './index.html', './manifest.webmanifest', './css/app.css',
  './js/datos-casos.js', './js/datos-actividades.js', './js/app.js',
  './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png', './icons/favicon-32.png'
];
const FONTS = 'oficina-fuentes';

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(VERSION).then(c=>c.addAll(SHELL)));
});
self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(
    keys.filter(k=>k!==VERSION && k!==FONTS).map(k=>caches.delete(k))
  )).then(()=>self.clients.claim()));
});
self.addEventListener('message', e=>{ if(e.data==='skipWaiting') self.skipWaiting(); });

self.addEventListener('fetch', e=>{
  const req = e.request;
  if(req.method !== 'GET') return;
  const url = new URL(req.url);
  // Fuentes de Google: primero caché, luego red
  if(url.host === 'fonts.googleapis.com' || url.host === 'fonts.gstatic.com'){
    e.respondWith(caches.open(FONTS).then(c=>c.match(req).then(hit=> hit || fetch(req).then(res=>{ c.put(req, res.clone()); return res; }))));
    return;
  }
  if(url.origin !== location.origin) return;
  // Archivos de la app: caché de la versión instalada (las versiones nuevas llegan con el aviso de actualización)
  e.respondWith(caches.match(req, {ignoreSearch:true}).then(hit=> hit || fetch(req).then(res=>{
    if(res.ok){ const copy = res.clone(); caches.open(VERSION).then(c=>c.put(req, copy)); }
    return res;
  }).catch(()=> req.mode==='navigate' ? caches.match('./index.html') : undefined)));
});
