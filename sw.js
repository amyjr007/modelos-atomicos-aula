/* ============================================================
   SERVICE WORKER — Modelos Atômicos (Aula)
   Estratégia:
   - navegação (HTML): network-first → cache → index offline
   - demais GET: stale-while-revalidate (responde do cache e
     atualiza em segundo plano)
   IMPORTANTE: a cada alteração no conteúdo, suba o número da
   versão em CACHE para forçar a atualização nos dispositivos.
   ============================================================ */
const CACHE = "modelos-atomicos-aula-v1.2.6";

/* arquivos do "app shell" pré-armazenados na instalação */
const PRECACHE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/maskable-512.png",
  "./icons/apple-touch-180.png",
  "./imagens/img1.png",
  "./imagens/Img2.png",
  "./imagens/Img3.png",
  "./imagens/Img4.png",
  "./imagens/Img5.png",
  "./imagens/lab.png",
  "./imagens/metal_cold.png",
  "./imagens/lab_chem.jpeg",
  "./imagens/minerio1.png",
  "./imagens/minerio2.png",
  "./imagens/minerio3.png",
  "./imagens/aluminio.png",
  "./imagens/ferro.png",
  "./imagens/cobre.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      // addAll falha se 1 arquivo faltar; usamos tolerância por item
      .then((c) => Promise.allSettled(PRECACHE.map((u) => c.add(u))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;

  // navegação: rede primeiro (pega atualizações), cai pro cache offline
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((r) => { const cp = r.clone(); caches.open(CACHE).then((c) => c.put(req, cp)); return r; })
        .catch(() => caches.match(req).then((m) => m || caches.match("./index.html")))
    );
    return;
  }

  // demais recursos: responde do cache e revalida em segundo plano
  e.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((r) => {
          if (r && (r.ok || r.type === "opaque")) {
            const cp = r.clone(); caches.open(CACHE).then((c) => c.put(req, cp));
          }
          return r;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
