// service-worker.js — cache e estratégia simples
// Service Worker para Link Hub Pro
// Documentação: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API

const CACHE_NAME = 'linkhub-cache-v4';
const ASSETS_TO_CACHE = [
  './',
  'index.html',
  'manifest.json',
  'src/css/styles.css',
  'src/js/main.js',
  'data/drops.json',
  'assets/logo.png',
  'assets/cover.jpg',
  'assets/avatar.png',
  'assets/icons/icon-192.png',
  'assets/icons/icon-512.png',
  'assets/og/og-1200x630.jpg'
];

self.addEventListener('install', event => {
  // Pré-cache dos arquivos essenciais
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  // Limpa caches antigos
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Network-first para navegação/documento, cache-first para outros assets
  if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.destination === 'document')) {
    event.respondWith(
      fetch(event.request).then(res => {
        // atualiza o cache em segundo plano
        const copy = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return res;
      }).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Para imagens: tentar network-first com timeout curto, senão usar cache (melhora atualização em celulares)
  if (event.request.destination === 'image') {
    const fetchTimeout = (req, ms) => new Promise((resolve) => {
      let resolved = false;
      const timer = setTimeout(() => {
        if (!resolved) { resolved = true; resolve(null); }
      }, ms);
      fetch(req).then(r => { if (!resolved) { resolved = true; clearTimeout(timer); resolve(r); } }).catch(() => { if (!resolved) { resolved = true; clearTimeout(timer); resolve(null); } });
    });

    event.respondWith((async () => {
      // tenta rede por 800ms
      const networkResp = await fetchTimeout(event.request, 800);
      if (networkResp) {
        // atualiza cache em segundo plano
        const copy = networkResp.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return networkResp;
      }
      // se não obteve resposta rápida, tenta cache
      const cached = await caches.match(event.request);
      if (cached) return cached;
      // último recurso: imagem fallback
      return caches.match('/assets/cover.jpg');
    })());
    return;
  }

  // Recursos genéricos: cache-first (mantém offline e rápida resposta)
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // cacheia requisições GET
        if (event.request.method === 'GET' && response && response.status === 200) {
          const rcopy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, rcopy));
        }
        return response;
      }).catch(() => {
        // fallback para imagens (caso) e documentos
        if (event.request.destination === 'image') return caches.match('/assets/cover.jpg');
        if (event.request.destination === 'document') return caches.match('/index.html');
      });
    })
  );
});

// opcional: limpar cache via mensagem de cliente
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then(keys => keys.forEach(k => caches.delete(k)));
  }
});

// Estratégia: cache first para arquivos essenciais, fallback para rede
// Adicione lógica para atualização e notificações conforme necessário
