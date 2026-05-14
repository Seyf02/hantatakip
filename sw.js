const CACHE='hantatakip-v3';
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./index.html','./manifest.json'])));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))));self.clients.claim();});
self.addEventListener('fetch',e=>{const h=new URL(e.request.url).hostname;if(['rss2json.com','hantacount.com','cartocdn.com','unpkg.com'].some(d=>h.includes(d))){e.respondWith(fetch(e.request).catch(()=>new Response('',{status:503})));return;}e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request)));});
