const CACHE_NAME = "tripmate-cache-v7";

const FILES_TO_CACHE = [
  "/TripMate/",
  "/TripMate/index.html",
  "/TripMate/manifest.json",
  "/TripMate/icon.svg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request).catch(() => {
        if (event.request.mode === "navigate") {
          return caches.match("/TripMate/index.html");
        }
      });
    })
  );
});
