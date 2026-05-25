const CACHE = 'sgt-v2';
const ASSETS = ['/', '/index.html', '/pages/dashboard.html', '/pages/login.html',
  '/css/main.css', '/css/dashboard.css', '/css/landing.css',
  '/js/main.js', '/js/dashboard.js', '/js/ai-features.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(()=>{})));
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => cached))
  );
});
