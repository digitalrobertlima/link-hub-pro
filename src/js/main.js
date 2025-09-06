// main.js — modularized app logic
// Carrega dados dinâmicos, registra SW e controla instalação do PWA

async function renderDrops() {
  const el = document.getElementById('drops');
  try {
    const res = await fetch('./data/drops.json');
    const drops = await res.json();
    el.innerHTML = drops.map(d => `
      <div class="row" style="justify-content:space-between;border:1px solid var(--line);border-radius:14px;padding:12px;background:#0f0f12">
        <div>
          <strong>${d.title}</strong><div class="small">${d.date}</div>
        </div>
        <a class="btn" href="${d.url}" aria-label="Abrir drop ${d.n}">Abrir</a>
        <span class="pill">#${d.n}</span>
      </div>
    `).join('');
  } catch (err) {
    console.error('Erro carregando drops:', err);
    el.innerHTML = '<div class="small">Não foi possível carregar os drops.</div>';
  }
}

function setYear() {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', async () => {
    try {
  const registration = await navigator.serviceWorker.register('service-worker.js');
      console.log('ServiceWorker registrado:', registration);
    } catch (err) {
      console.warn('ServiceWorker falhou:', err);
    }
  });

  // Notificação de nova versão
  if (navigator.serviceWorker) {
    navigator.serviceWorker.addEventListener('controllerchange', function() {
      const notice = document.createElement('div');
      notice.textContent = 'Nova versão disponível — recarregue a página.';
      notice.className = 'card';
      document.body.prepend(notice);
    });
  }
}

function setupPWAInstallPrompt() {
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    window.deferredPrompt = deferredPrompt; // expor para UI customizada
  });
}

/* Lazy-load suave para o background da capa usando IntersectionObserver
   troca data-src -> background-image e adiciona classe .is-loaded para transição */
function lazyLoadCover() {
  const cover = document.querySelector('.cover');
  if (!cover) return;
  const src = cover.getAttribute('data-src');
  if (!src) { cover.classList.add('is-loaded'); return; }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = new Image();
          img.src = src;
          img.onload = () => {
            cover.style.backgroundImage = `url('${src}')`;
            cover.classList.add('is-loaded');
          };
          obs.disconnect();
        }
      });
    }, {rootMargin: '200px'});
    io.observe(cover);
  } else {
    // fallback imediato
    cover.style.backgroundImage = `url('${src}')`;
    cover.classList.add('is-loaded');
  }
}

/* Forçar refresh de imagens no SW (envia mensagem ao SW para limpar caches) */
function requestClearCache() {
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' });
  }
}

function setupForceRefreshButton() {
  const btn = document.getElementById('force-refresh');
  if (!btn) return;
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    btn.textContent = 'Atualizando…';
    // solicita o SW limpar cache e, após um pequeno delay, recarrega a página
    requestClearCache();
    setTimeout(() => {
      // Tenta garantir que o SW esteja controlando antes de recarregar
      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' });
      }
      window.location.reload(true);
    }, 700);
  });
}

// Forçar autoplay do iframe do YouTube (muted) quando possível
function tryAutoplayIframe() {
  const iframe = document.querySelector('.embed iframe');
  if (!iframe) return;

  // Tenta focar e tocar via postMessage para o player (YouTube Iframe API) como fallback.
  // Observação: navegadores geralmente permitem autoplay quando está muted.
  // Envia comando para reproduzir caso o player aceite mensagens.
  try {
    // Mensagem conforme a API postMessage do player do YouTube
    const msg = JSON.stringify({ event: 'command', func: 'playVideo' });
    iframe.contentWindow.postMessage(msg, '*');
  } catch (err) {
    console.warn('Não foi possível enviar postMessage para iframe:', err);
  }

  // Opcional: adicionar botão para desmutar se o usuário quiser
  let unmuteBtn = document.getElementById('unmute-btn');
  if (!unmuteBtn) {
    unmuteBtn = document.createElement('button');
    unmuteBtn.id = 'unmute-btn';
    unmuteBtn.textContent = 'Desmutar vídeo';
    unmuteBtn.className = 'btn small';
    unmuteBtn.style.position = 'fixed';
    unmuteBtn.style.right = '12px';
    unmuteBtn.style.bottom = '12px';
    unmuteBtn.style.zIndex = 9999;
    document.body.appendChild(unmuteBtn);
    unmuteBtn.addEventListener('click', () => {
      try {
        // Solicita ao player para desmutar (via postMessage)
        const msgUnmute = JSON.stringify({ event: 'command', func: 'unMute' });
        iframe.contentWindow.postMessage(msgUnmute, '*');
      } catch (err) {
        console.warn('Falha ao enviar comando unMute:', err);
      }
      unmuteBtn.remove();
    });
  }
}
// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  renderDrops();
  setYear();
  registerServiceWorker();
  setupPWAInstallPrompt();
  lazyLoadCover();
  setupForceRefreshButton();
});
