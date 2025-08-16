const CACHE_NAME = 'cv-cache-v1';
const URLS = [
  '/',
  '/index.html',
  '/src/style.css',
  '/src/main.js',
  '/src/data.js',
  '/manifest.json'
];
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS))
  );
});
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request).catch(() => caches.match('/index.html')))
  );
});
