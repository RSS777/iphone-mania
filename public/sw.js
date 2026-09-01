const CACHE_NAME = "iphone-mania-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((chaves) => Promise.all(chaves.filter((c) => c !== CACHE_NAME).map((c) => caches.delete(c))))
      .then(() => self.clients.claim()),
  );
});

// só GET, só mesmo domínio — escrita (POST das Server Actions) nunca passa pelo cache,
// sempre vai direto pra rede e falha com erro real quando offline.
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((resposta) => {
        const copia = resposta.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copia));
        return resposta;
      })
      .catch(() => caches.match(request).then((cacheado) => cacheado || Response.error())),
  );
});
