// Carrega conteúdo dinâmico e inicializa a experiência
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  yearEl.textContent = new Date().getFullYear();

  fetch('content.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Não foi possível carregar o conteúdo.');
      }
      return response.json();
    })
    .then(data => {
      renderHero(data.hero);
      renderVideo(data.video);
      renderLinks(data.links);
      renderBeats(data.beats);
      renderDrops(data.drops);
      renderBio(data.bio, data.contact);
      initScrollAnimation();
    })
    .catch(err => {
      console.error(err);
    });

  // Registrar service worker opcional
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').catch(err => {
      console.warn('Service worker não pôde ser registrado:', err);
    });
  }
});

function renderHero(hero) {
  if (!hero) return;
  const titleEl = document.getElementById('hero-title');
  const taglineEl = document.getElementById('hero-tagline');
  const primaryCTA = document.getElementById('cta-primary');
  const secondaryCTA = document.getElementById('cta-secondary');

  titleEl.textContent = hero.title || 'ANJO';
  taglineEl.textContent = hero.tagline || '';
  primaryCTA.textContent = hero.ctaPrimaryLabel || 'Ouça agora';
  primaryCTA.href = hero.ctaPrimaryLink || '#';
  secondaryCTA.textContent = hero.ctaSecondaryLabel || 'Booking';
  secondaryCTA.href = hero.ctaSecondaryLink || '#';

  // Atualizar imagem do hero se fornecida
  if (hero.cover) {
    document.querySelector('.hero').style.backgroundImage =
      `linear-gradient(135deg, rgba(0,0,0,0.9), rgba(0,0,0,0.6)), url('${hero.cover}')`;
  }
}

function renderVideo(video) {
  const container = document.getElementById('video-container');
  container.innerHTML = '';
  if (!video || !video.url) {
    container.innerHTML = '<p>Sem clipe no momento.</p>';
    return;
  }
  const iframe = document.createElement('iframe');
  iframe.src = `${video.url}?rel=0&modestbranding=1`;
  iframe.title = video.title || 'Clipe';
  iframe.loading = 'lazy';
  container.appendChild(iframe);
}

function renderLinks(links = []) {
  const container = document.getElementById('links-container');
  container.innerHTML = '';
  links.forEach(link => {
    const card = document.createElement('a');
    card.className = 'link-card';
    card.href = link.url;
    card.target = '_blank';
    card.rel = 'noopener';

    const iconSpan = document.createElement('span');
    iconSpan.className = 'icon';
    iconSpan.textContent = link.icon || '🔗';

    const labelSpan = document.createElement('span');
    labelSpan.className = 'label';
    labelSpan.textContent = link.label || 'Link';

    card.appendChild(iconSpan);
    card.appendChild(labelSpan);
    container.appendChild(card);
  });
}

function renderBeats(beats = []) {
  const container = document.getElementById('beats-container');
  container.innerHTML = '';
  beats.forEach(beat => {
    const card = document.createElement('div');
    card.className = 'beat-card';

    const title = document.createElement('h3');
    title.className = 'beat-title';
    title.textContent = beat.title;

    const meta = document.createElement('div');
    meta.className = 'beat-meta';
    meta.textContent = `${beat.bpm || ''}${beat.bpm ? ' BPM' : ''}${beat.key ? ' • ' + beat.key : ''}`;

    const actions = document.createElement('div');
    actions.className = 'beat-actions';

    const audio = document.createElement('audio');
    audio.controls = true;
    audio.src = beat.previewUrl;

    const downloadBtn = document.createElement('a');
    downloadBtn.className = 'download-btn';
    downloadBtn.href = beat.downloadUrl || beat.previewUrl;
    downloadBtn.target = '_blank';
    downloadBtn.rel = 'noopener';
    downloadBtn.textContent = 'Baixar';

    actions.appendChild(audio);
    actions.appendChild(downloadBtn);

    card.appendChild(title);
    card.appendChild(meta);
    card.appendChild(actions);
    container.appendChild(card);
  });
}

function renderDrops(drops = []) {
  const container = document.getElementById('drops-container');
  container.innerHTML = '';
  drops.forEach(drop => {
    const item = document.createElement('li');
    item.className = 'drop-item';

    const date = document.createElement('div');
    date.className = 'drop-date';
    date.textContent = drop.date;

    const title = document.createElement('h4');
    title.className = 'drop-title';
    title.textContent = drop.title;

    const desc = document.createElement('p');
    desc.textContent = drop.description || '';

    item.appendChild(date);
    item.appendChild(title);
    item.appendChild(desc);

    container.appendChild(item);
  });
}

function renderBio(bio = '', contact = {}) {
  const container = document.getElementById('bio-container');
  container.innerHTML = '';
  const paragraphs = Array.isArray(bio) ? bio : [bio];
  paragraphs.forEach(p => {
    const para = document.createElement('p');
    para.textContent = p;
    container.appendChild(para);
  });

  if (contact) {
    const contactPara = document.createElement('p');
    contactPara.innerHTML = `<strong>Booking:</strong> <a href="${contact.whatsapp}" target="_blank" rel="noopener">${contact.whatsappLabel || contact.whatsapp}</a>`;
    container.appendChild(contactPara);
  }
}

// Animação de fade-in para seções quando entram na viewport
function initScrollAnimation() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1
  });

  document.querySelectorAll('.section').forEach(section => observer.observe(section));
}
