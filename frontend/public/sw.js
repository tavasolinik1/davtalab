self.addEventListener('install', (event) => {
  event.waitUntil(caches.open('vh-cache-v1').then((cache) => cache.addAll(['/','/index.html'])));
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((resp) => resp || fetch(event.request).catch(() => new Response('Offline'))),
  );
});

self.addEventListener('push', (event) => {
  const data = event.data?.text() || 'New notification';
  event.waitUntil(self.registration.showNotification('VolunteerHub', { body: data }));
});