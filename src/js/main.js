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
      const registration = await navigator.serviceWorker.register('/service-worker.js');
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

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  renderDrops();
  setYear();
  registerServiceWorker();
  setupPWAInstallPrompt();
});
