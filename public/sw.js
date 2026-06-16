const CACHE_NAME = 'vanzi-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/vanzi-logo-white.png',
  '/favicon.svg'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).catch(err => console.log('SW install cache failed:', err))
  );
});

self.addEventListener('fetch', (e) => {
  // Only cache same-origin and safe methods (GET)
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request).then(response => {
        // Cache new successful requests
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(e.request, responseClone);
          });
        }
        return response;
      }).catch(() => {
        // Offline fallback
        return caches.match('/');
      });
    })
  );
});
