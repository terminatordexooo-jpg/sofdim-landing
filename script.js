/* ============================================
   SOFDIM — Landing JS
   ============================================ */

/* --------- i18n (UK default / RU) --------- */
const LANG_KEY = 'sofdim_lang';
let currentLang = localStorage.getItem(LANG_KEY) || 'uk';

const PICKER_I18N = {
  uk: { single: 'одностінна', insulated: 'нерж/нерж', insulatedGalv: 'нерж/оц', ask: 'Уточнити ціну', from: 'від' },
  ru: { single: 'одностенная', insulated: 'нерж/нерж', insulatedGalv: 'нерж/оц', ask: 'Уточнить цену', from: 'от' },
};

function setLang(lang) {
  currentLang = lang === 'ru' ? 'ru' : 'uk';
  document.documentElement.lang = currentLang;

  document.querySelectorAll('[data-ru]').forEach((el) => {
    if (!el.dataset.ukOriginal) el.dataset.ukOriginal = el.innerHTML;
    el.innerHTML = currentLang === 'ru' ? el.dataset.ru : el.dataset.ukOriginal;
  });

  document.querySelectorAll('[data-ru-ph]').forEach((el) => {
    if (!el.dataset.ukOriginalPh) el.dataset.ukOriginalPh = el.placeholder;
    el.placeholder = currentLang === 'ru' ? el.dataset.ruPh : el.dataset.ukOriginalPh;
  });

  document.querySelectorAll('meta[name="description"][data-ru]').forEach((el) => {
    if (!el.dataset.ukOriginal) el.dataset.ukOriginal = el.content;
    el.content = currentLang === 'ru' ? el.dataset.ru : el.dataset.ukOriginal;
  });

  const titleEl = document.querySelector('title[data-ru]');
  if (titleEl) {
    if (!titleEl.dataset.ukOriginal) titleEl.dataset.ukOriginal = titleEl.textContent;
    titleEl.textContent = currentLang === 'ru' ? titleEl.dataset.ru : titleEl.dataset.ukOriginal;
  }

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    const on = btn.dataset.lang === currentLang;
    btn.classList.toggle('active', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  });

  localStorage.setItem(LANG_KEY, currentLang);

  if (typeof updatePanel === 'function') updatePanel();
}

document.querySelectorAll('.lang-btn').forEach((btn) => {
  btn.addEventListener('click', () => setLang(btn.dataset.lang));
});

/* --------- Nav scroll state --------- */
const nav = document.querySelector('.nav');
const onScroll = () => {
  if (window.scrollY > 40) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* --------- Cursor glow --------- */
const glow = document.querySelector('.cursor-glow');
window.addEventListener('mousemove', (e) => {
  glow.style.left = e.clientX + 'px';
  glow.style.top = e.clientY + 'px';
});

/* --------- Card hover light tracking --------- */
document.querySelectorAll('.card').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    card.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });
});

/* --------- Kit photo carousel --------- */
(() => {
  const track = document.getElementById('kitCarouselTrack');
  const dotsBox = document.getElementById('kitCarouselDots');
  const carousel = document.getElementById('kitCarousel');
  if (!track || !dotsBox || !carousel) return;

  const total = track.children.length;
  let idx = 0;
  let timer;

  const go = (i) => {
    idx = (i + total) % total;
    track.style.transform = `translateX(-${idx * 100}%)`;
    dotsBox.querySelectorAll('.kit-dot').forEach((d, k) => d.classList.toggle('active', k === idx));
  };
  const next = () => go(idx + 1);
  const prev = () => go(idx - 1);
  const start = () => { stop(); timer = setInterval(next, 4500); };
  const stop = () => { if (timer) { clearInterval(timer); timer = null; } };

  for (let i = 0; i < total; i++) {
    const dot = document.createElement('button');
    dot.className = 'kit-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Слайд ${i + 1}`);
    dot.addEventListener('click', () => { go(i); start(); });
    dotsBox.appendChild(dot);
  }
  carousel.querySelector('.kit-prev').addEventListener('click', () => { prev(); start(); });
  carousel.querySelector('.kit-next').addEventListener('click', () => { next(); start(); });
  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', start);

  // Touch swipe
  let startX = 0, moved = false;
  track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; moved = false; stop(); }, { passive: true });
  track.addEventListener('touchmove', () => { moved = true; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    if (!moved) { start(); return; }
    const dx = e.changedTouches[0].clientX - startX;
    if (dx > 40) prev(); else if (dx < -40) next();
    start();
  });

  start();
})();

/* --------- Catalog cards → calculator --------- */
document.querySelectorAll('.cat-card').forEach((card) => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', () => {
    document.getElementById('diameters')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* --------- Reveal on scroll --------- */
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

/* --------- Diameter picker --------- */
/* Цены с sofdim.com (акционные). old = зачёркнутая, price = со скидкой. */
const PRICES = {
  single: {
    '0.6': [
      { inner: 100, old: 2738,  price: 2464 },
      { inner: 110, old: 3010,  price: 2709 },
      { inner: 120, old: 3289,  price: 2960 },
      { inner: 130, old: 3563,  price: 3207 },
      { inner: 140, old: 3835,  price: 3452 },
      { inner: 150, old: 4116,  price: 3704 },
      { inner: 160, old: 4382,  price: 3944 },
      { inner: 180, old: 4928,  price: 4435 },
      { inner: 200, old: 5480,  price: 4932 },
      { inner: 220, old: 6059,  price: 5453 },
      { inner: 230, old: 6299,  price: 5669 },
      { inner: 250, old: 8112,  price: 7301 },
      { inner: 300, old: 10895, price: 9806 },
      { inner: 350, old: 12848, price: 11563 },
      { inner: 400, old: 14471, price: 13024 },
    ],
    '0.8': [
      { inner: 100, old: 3950,  price: 3555 },
      { inner: 110, old: 4346,  price: 3911 },
      { inner: 120, old: 4742,  price: 4268 },
      { inner: 130, old: 5137,  price: 4623 },
      { inner: 140, old: 5528,  price: 4975 },
      { inner: 150, old: 5932,  price: 5339 },
      { inner: 160, old: 6327,  price: 5694 },
      { inner: 180, old: 7112,  price: 6401 },
      { inner: 200, old: 7905,  price: 7115 },
      { inner: 220, old: 8730,  price: 7857 },
      { inner: 230, old: 9086,  price: 8177 },
      { inner: 250, old: 11746, price: 10571 },
      { inner: 300, old: 16052, price: 14447 },
      { inner: 350, old: 16416, price: 14774 },
      { inner: 400, old: 17631, price: 15868 },
    ],
    '1.0': [
      { inner: 100, old: 4737,  price: 4263 },
      { inner: 110, old: 5215,  price: 4694 },
      { inner: 120, old: 5692,  price: 5123 },
      { inner: 130, old: 6165,  price: 5549 },
      { inner: 140, old: 6643,  price: 5979 },
      { inner: 150, old: 7116,  price: 6404 },
      { inner: 160, old: 7586,  price: 6827 },
      { inner: 180, old: 8536,  price: 7682 },
      { inner: 200, old: 9486,  price: 8537 },
      { inner: 220, old: 10468, price: 9421 },
      { inner: 230, old: 10907, price: 9816 },
      { inner: 250, old: 14584, price: 13126 },
      { inner: 300, old: 19721, price: 17749 },
      { inner: 350, old: 20377, price: 18339 },
      { inner: 400, old: 21112, price: 19001 },
    ],
  },
  nerzh: {
    '0.6': [
      { inner: 100, outer: 160, old: 8165,  price: 7349  },
      { inner: 110, outer: 180, old: 9098,  price: 8188  },
      { inner: 120, outer: 180, old: 9434,  price: 8491  },
      { inner: 130, outer: 200, old: 10370, price: 9333  },
      { inner: 140, outer: 200, old: 10702, price: 9632  },
      { inner: 150, outer: 220, old: 11612, price: 10451 },
      { inner: 160, outer: 220, old: 11974, price: 10777 },
      { inner: 180, outer: 250, old: 13549, price: 12194 },
      { inner: 200, outer: 260, old: 14571, price: 13114 },
      { inner: 220, outer: 280, old: 15846, price: 14261 },
      { inner: 230, outer: 300, old: 17113, price: 15402 },
      { inner: 250, outer: 320, old: 20390, price: 18351 },
      { inner: 300, outer: 360, old: 23270, price: 20943 },
      { inner: 350, outer: 420, old: 26077, price: 23469 },
      { inner: 400, outer: 460, old: 29932, price: 26939 },
    ],
    '0.8': [
      { inner: 100, outer: 160, old: 10325, price: 9293  },
      { inner: 110, outer: 180, old: 10750, price: 9675  },
      { inner: 120, outer: 180, old: 11149, price: 10034 },
      { inner: 130, outer: 200, old: 12251, price: 11026 },
      { inner: 140, outer: 200, old: 12581, price: 11323 },
      { inner: 150, outer: 220, old: 13727, price: 12354 },
      { inner: 160, outer: 220, old: 14143, price: 12729 },
      { inner: 180, outer: 250, old: 15998, price: 14398 },
      { inner: 200, outer: 260, old: 17193, price: 15474 },
      { inner: 220, outer: 280, old: 18700, price: 16830 },
      { inner: 230, outer: 300, old: 20378, price: 18340 },
      { inner: 250, outer: 320, old: 25919, price: 23327 },
      { inner: 300, outer: 360, old: 30652, price: 27587 },
      { inner: 350, outer: 420, old: 32059, price: 28853 },
      { inner: 400, outer: 460, old: 34916, price: 31424 },
    ],
    '1.0': [
      { inner: 100, outer: 160, old: 10992, price: 9893  },
      { inner: 110, outer: 180, old: 11432, price: 10289 },
      { inner: 120, outer: 180, old: 11849, price: 10664 },
      { inner: 130, outer: 200, old: 13026, price: 11723 },
      { inner: 140, outer: 200, old: 13442, price: 12098 },
      { inner: 150, outer: 220, old: 14593, price: 13134 },
      { inner: 160, outer: 220, old: 15033, price: 13530 },
      { inner: 180, outer: 250, old: 17010, price: 15309 },
      { inner: 200, outer: 260, old: 18277, price: 16449 },
      { inner: 220, outer: 280, old: 21279, price: 19151 },
      { inner: 230, outer: 300, old: 23082, price: 20774 },
      { inner: 250, outer: 320, old: 28450, price: 25605 },
      { inner: 300, outer: 360, old: 34754, price: 31279 },
      { inner: 350, outer: 420, old: 38453, price: 34608 },
      { inner: 400, outer: 460, old: 42742, price: 38468 },
    ],
  },
  galv: {
    '0.6': [
      { inner: 100, outer: 160, old: 6124,  price: 5512  },
      { inner: 110, outer: 180, old: 6896,  price: 6206  },
      { inner: 120, outer: 180, old: 7053,  price: 6348  },
      { inner: 130, outer: 200, old: 7861,  price: 7075  },
      { inner: 140, outer: 200, old: 8029,  price: 7226  },
      { inner: 150, outer: 220, old: 8833,  price: 7950  },
      { inner: 160, outer: 220, old: 9614,  price: 8653  },
      { inner: 180, outer: 250, old: 10392, price: 9353  },
      { inner: 200, outer: 260, old: 11062, price: 9956  },
      { inner: 220, outer: 280, old: 13692, price: 12323 },
      { inner: 230, outer: 300, old: 14886, price: 13397 },
      { inner: 250, outer: 320, old: 17510, price: 15759 },
      { inner: 300, outer: 360, old: 20385, price: 18347 },
      { inner: 350, outer: 420, old: 23683, price: 21315 },
      { inner: 400, outer: 460, old: 26114, price: 23503 },
    ],
    '0.8': [
      { inner: 100, outer: 160, old: 7631,  price: 6868  },
      { inner: 110, outer: 180, old: 8501,  price: 7651  },
      { inner: 120, outer: 180, old: 8803,  price: 7923  },
      { inner: 130, outer: 200, old: 9755,  price: 8780  },
      { inner: 140, outer: 200, old: 10088, price: 9079  },
      { inner: 150, outer: 220, old: 11033, price: 9930  },
      { inner: 160, outer: 220, old: 11432, price: 10289 },
      { inner: 180, outer: 250, old: 13034, price: 11731 },
      { inner: 200, outer: 260, old: 13998, price: 12598 },
      { inner: 220, outer: 280, old: 17468, price: 15721 },
      { inner: 230, outer: 300, old: 18857, price: 16971 },
      { inner: 250, outer: 320, old: 21676, price: 19508 },
      { inner: 300, outer: 360, old: 24423, price: 21981 },
      { inner: 350, outer: 420, old: 26628, price: 23965 },
      { inner: 400, outer: 460, old: 30061, price: 27055 },
    ],
    '1.0': [
      { inner: 100, outer: 160, old: 8619,  price: 7757  },
      { inner: 110, outer: 180, old: 9577,  price: 8619  },
      { inner: 120, outer: 180, old: 9958,  price: 8962  },
      { inner: 130, outer: 200, old: 11012, price: 9911  },
      { inner: 140, outer: 200, old: 11436, price: 10292 },
      { inner: 150, outer: 220, old: 12480, price: 11232 },
      { inner: 160, outer: 220, old: 13007, price: 11706 },
      { inner: 180, outer: 250, old: 14813, price: 13332 },
      { inner: 200, outer: 260, old: 15968, price: 14371 },
      { inner: 220, outer: 280, old: 19966, price: 17969 },
      { inner: 230, outer: 300, old: 21496, price: 19346 },
      { inner: 250, outer: 320, old: 24560, price: 22104 },
      { inner: 300, outer: 360, old: 28293, price: 25464 },
      { inner: 350, outer: 420, old: 30063, price: 27057 },
      { inner: 400, outer: 460, old: 33947, price: 30552 },
    ],
  },
};

const THICKNESSES = ['0.6', '0.8', '1.0'];
const THICKNESS_LABEL = { '0.6': '0,6 мм', '0.8': '0,8 мм', '1.0': '1 мм' };

const UAH = new Intl.NumberFormat('uk-UA').format;

const diaList = document.getElementById('diaList');
const thList = document.getElementById('thList');
const diaRing = document.getElementById('diaRing');
const diaValue = document.getElementById('diaValue');
const diaTitle = document.getElementById('diaTitle');
const diaInner = document.getElementById('diaInner');
const diaThickness = document.getElementById('diaThickness');
const diaPriceOld = document.getElementById('diaPriceOld');
const diaPriceNew = document.getElementById('diaPriceNew');
const diaCta = document.getElementById('diaCta');
const typeButtons = document.querySelectorAll('.type-btn');

const DIA_MIN = 100;
const DIA_MAX = 400;
const SCALE_MIN = 0.65;
const SCALE_MAX = 1.1;

function scaleFor(diameter) {
  const clamped = Math.max(DIA_MIN, Math.min(DIA_MAX, diameter));
  const t = (clamped - DIA_MIN) / (DIA_MAX - DIA_MIN);
  return SCALE_MIN + t * (SCALE_MAX - SCALE_MIN);
}

let currentType = 'single';
let currentThickness = '0.6';
let currentIndex = 0;

function currentItems() {
  return (PRICES[currentType] && PRICES[currentType][currentThickness]) || [];
}

function titleSuffix(type, t) {
  if (type === 'single') return t.single;
  if (type === 'galv') return t.insulatedGalv;
  return t.insulated;
}

function renderThButtons() {
  thList.innerHTML = '';
  THICKNESSES.forEach((th) => {
    const btn = document.createElement('button');
    const available = (PRICES[currentType][th] || []).length > 0;
    btn.className = 'th-btn' + (th === currentThickness ? ' active' : '') + (available ? '' : ' disabled');
    btn.textContent = THICKNESS_LABEL[th];
    btn.disabled = !available;
    btn.addEventListener('click', () => {
      if (!available) return;
      currentThickness = th;
      currentIndex = 0;
      renderThButtons();
      renderDiaButtons();
      updatePanel();
    });
    thList.appendChild(btn);
  });
}

function renderDiaButtons() {
  diaList.innerHTML = '';
  const items = currentItems();
  items.forEach((item, i) => {
    const btn = document.createElement('button');
    btn.className = 'dia-btn' + (i === currentIndex ? ' active' : '');
    btn.dataset.i = i;
    btn.textContent = currentType === 'single' ? `Ø${item.inner}` : `${item.inner}/${item.outer}`;
    btn.addEventListener('click', () => {
      currentIndex = i;
      document.querySelectorAll('.dia-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      updatePanel();
    });
    diaList.appendChild(btn);
  });
}

function updatePanel() {
  const t = PICKER_I18N[currentLang];
  const items = currentItems();
  const item = items[currentIndex];
  if (!item) {
    diaTitle.textContent = '—';
    diaInner.textContent = '—';
    diaPriceOld.textContent = '';
    diaPriceNew.textContent = t.ask;
    return;
  }
  const inner = item.inner;
  const suffix = titleSuffix(currentType, t);
  const thLabel = THICKNESS_LABEL[currentThickness];
  if (currentType === 'single') {
    diaValue.textContent = inner;
    diaTitle.textContent = `Ø${inner} мм — ${suffix}`;
    diaInner.textContent = `Ø${inner} мм`;
    diaCta.textContent = inner;
  } else {
    diaValue.textContent = inner;
    diaTitle.textContent = `Ø${inner}/${item.outer} мм — ${suffix}`;
    diaInner.textContent = `Ø${inner} / ${item.outer} мм`;
    diaCta.textContent = `${inner}/${item.outer}`;
  }
  diaRing.style.setProperty('--dia-scale', scaleFor(inner).toFixed(3));
  diaThickness.textContent = thLabel;
  if (item.price) {
    diaPriceOld.textContent = item.old ? `${UAH(item.old)} ₴` : '';
    diaPriceNew.textContent = `${t.from} ${UAH(item.price)} ₴`;
  } else {
    diaPriceOld.textContent = '';
    diaPriceNew.textContent = t.ask;
  }
}

typeButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    typeButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentType = btn.dataset.type;
    // Pick first thickness that has items for this type
    currentThickness = THICKNESSES.find((th) => (PRICES[currentType][th] || []).length > 0) || '0.6';
    currentIndex = 0;
    renderThButtons();
    renderDiaButtons();
    updatePanel();
  });
});

renderThButtons();
renderDiaButtons();
updatePanel();
setLang(currentLang);

/* --------- Lead form --------- */
const form = document.getElementById('leadForm');
const status = document.getElementById('formStatus');

/* === CONFIG: подставь свой токен и chat_id === */
const TELEGRAM_CONFIG = {
  BOT_TOKEN: '8672726415:AAHH5K7SohIcP4_wT4rEKS4A1zPyNox0yBo',
  CHAT_ID: '7042878265',
};

const RATE_LIMIT_MS = 5 * 60 * 1000;
const RATE_KEY = 'sofdim_last_submit';

const FORM_I18N = {
  uk: {
    rateLimit: (m, s) => `Ви вже надіслали заявку. Спробуйте через ${m}:${s}.`,
    sending: 'Надсилаємо…',
    ok: '✓ Заявка надіслана. Передзвонимо протягом 15–20 хвилин.',
    err: 'Помилка надсилання. Напишіть у Telegram напряму.',
    tgTitle: '🔥 *Нова заявка SOFDIM*',
    tgName: '👤 Ім\'я',
    tgPhone: '📱 Телефон',
    tgSrc: '🔧 Джерело',
    tgComm: '💬 Коментар',
    locale: 'uk-UA',
  },
  ru: {
    rateLimit: (m, s) => `Вы уже отправили заявку. Попробуйте через ${m}:${s}.`,
    sending: 'Отправляем…',
    ok: '✓ Заявка отправлена. Перезвоним в течение 15–20 минут.',
    err: 'Ошибка отправки. Напишите в Telegram напрямую.',
    tgTitle: '🔥 *Новая заявка SOFDIM*',
    tgName: '👤 Имя',
    tgPhone: '📱 Телефон',
    tgSrc: '🔧 Источник',
    tgComm: '💬 Коммент',
    locale: 'ru-RU',
  },
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const L = FORM_I18N[currentLang];

  const last = parseInt(localStorage.getItem(RATE_KEY) || '0', 10);
  const elapsed = Date.now() - last;
  if (last && elapsed < RATE_LIMIT_MS) {
    const left = Math.ceil((RATE_LIMIT_MS - elapsed) / 1000);
    const m = Math.floor(left / 60);
    const s = (left % 60).toString().padStart(2, '0');
    status.hidden = false;
    status.classList.add('error');
    status.textContent = L.rateLimit(m, s);
    return;
  }

  const data = Object.fromEntries(new FormData(form).entries());

  const text =
    `${L.tgTitle}\n\n` +
    `${L.tgName}: ${data.name || '—'}\n` +
    `${L.tgPhone}: ${data.phone || '—'}\n` +
    `${L.tgSrc}: ${data.source || '—'}\n` +
    `${L.tgComm}: ${data.comment || '—'}\n` +
    `\n🕐 ${new Date().toLocaleString(L.locale)}`;

  status.hidden = false;
  status.classList.remove('error');
  status.textContent = L.sending;

  try {
    if (TELEGRAM_CONFIG.BOT_TOKEN && TELEGRAM_CONFIG.CHAT_ID) {
      const res = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_CONFIG.BOT_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_CONFIG.CHAT_ID,
            text,
            parse_mode: 'Markdown',
          }),
        }
      );
      if (!res.ok) throw new Error('tg');
      status.textContent = L.ok;
      form.reset();
      localStorage.setItem(RATE_KEY, Date.now().toString());
    } else {
      console.log('LEAD:', data);
      console.log(text);
      status.textContent = L.ok;
      localStorage.setItem(RATE_KEY, Date.now().toString());
    }
  } catch (err) {
    status.classList.add('error');
    status.textContent = L.err;
  }
});

/* --------- 3D pipe (Three.js) --------- */
(function init3D() {
  if (typeof THREE === 'undefined') return;
  const canvas = document.getElementById('pipe3d');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 8);

  // Procedural studio environment — dark base with bright softboxes positioned
  // around the equator so the mirror-polished pipe shows sharp vertical streak
  // highlights (classic chrome look), not a flat white wash.
  const envCanvas = document.createElement('canvas');
  envCanvas.width = 1024;
  envCanvas.height = 512;
  const ectx = envCanvas.getContext('2d');

  // Base: dark grey with subtle top-to-bottom gradient (sky/floor hint).
  const eg = ectx.createLinearGradient(0, 0, 0, 512);
  eg.addColorStop(0.00, '#1c1e24');
  eg.addColorStop(0.45, '#2a2d34');
  eg.addColorStop(0.55, '#2a2d34');
  eg.addColorStop(1.00, '#0a0b10');
  ectx.fillStyle = eg;
  ectx.fillRect(0, 0, 1024, 512);

  // Softboxes — vertical bright rectangles around the equator.
  // Each gives a crisp vertical streak on the rotating cylinder.
  const softbox = (cx, cy, w, h, intensity) => {
    const g = ectx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) / 1.6);
    g.addColorStop(0.0, `rgba(255,255,255,${intensity})`);
    g.addColorStop(0.55, `rgba(255,255,255,${intensity * 0.35})`);
    g.addColorStop(1.0, `rgba(255,255,255,0)`);
    ectx.fillStyle = g;
    ectx.fillRect(cx - w / 2, cy - h / 2, w, h);
  };
  // Key light — big bright softbox front-right
  softbox(760, 240, 220, 380, 1.0);
  // Fill — softer softbox front-left
  softbox(280, 250, 180, 320, 0.95);
  // Back rim highlight
  softbox(50,  240, 90,  260, 0.8);
  softbox(990, 240, 90,  260, 0.8);
  // Small top hair-light
  softbox(512, 110, 160, 120, 0.6);

  // Hot cores — pure-white saturated centers give HDR-like punch so the
  // chrome gets a crisp specular glint instead of a muted grey reflection.
  ectx.globalCompositeOperation = 'lighter';
  const core = (cx, cy, r) => {
    const g = ectx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0.0, 'rgba(255,255,255,1)');
    g.addColorStop(0.4, 'rgba(255,255,255,0.6)');
    g.addColorStop(1.0, 'rgba(255,255,255,0)');
    ectx.fillStyle = g;
    ectx.fillRect(cx - r, cy - r, r * 2, r * 2);
  };
  core(760, 240, 90);
  core(280, 250, 70);
  core(50,  240, 40);
  core(990, 240, 40);
  ectx.globalCompositeOperation = 'source-over';

  // Warm brand accent — orange glow near the key softbox, picked up as a warm glint.
  const warm = ectx.createRadialGradient(830, 290, 10, 830, 290, 160);
  warm.addColorStop(0, 'rgba(255,140,60,0.85)');
  warm.addColorStop(1, 'rgba(255,140,60,0)');
  ectx.fillStyle = warm;
  ectx.fillRect(0, 0, 1024, 512);

  // Tiny cool accent opposite side
  const cool = ectx.createRadialGradient(220, 200, 10, 220, 200, 140);
  cool.addColorStop(0, 'rgba(160,200,240,0.35)');
  cool.addColorStop(1, 'rgba(160,200,240,0)');
  ectx.fillStyle = cool;
  ectx.fillRect(0, 0, 1024, 512);

  const envTex = new THREE.CanvasTexture(envCanvas);
  envTex.mapping = THREE.EquirectangularReflectionMapping;
  envTex.colorSpace = THREE.SRGBColorSpace;
  try {
    const cubeRT = new THREE.WebGLCubeRenderTarget(256);
    cubeRT.fromEquirectangularTexture(renderer, envTex);
    scene.environment = cubeRT.texture;
  } catch (e) {
    // Fallback: use equirect directly (lower quality reflections but still works)
    scene.environment = envTex;
  }

  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  window.addEventListener('resize', resize);

  // Group (whole assembly)
  const group = new THREE.Group();
  scene.add(group);

  // Outer pipe — mirror polished stainless steel
  const outerGeom = new THREE.CylinderGeometry(1.2, 1.2, 4, 128, 1, true);
  const outerMat = new THREE.MeshStandardMaterial({
    color: 0xeef1f5,
    metalness: 1.0,
    roughness: 0.035,
    envMapIntensity: 2.0,
    side: THREE.DoubleSide,
  });
  const outer = new THREE.Mesh(outerGeom, outerMat);
  group.add(outer);

  // Inner pipe — polished mirror-finish stainless steel
  const innerGeom = new THREE.CylinderGeometry(0.85, 0.85, 4.2, 128, 1, true);
  const innerMat = new THREE.MeshPhysicalMaterial({
    color: 0xf2f4f7,
    metalness: 1.0,
    roughness: 0.02,
    envMapIntensity: 1.9,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
    side: THREE.DoubleSide,
  });
  const inner = new THREE.Mesh(innerGeom, innerMat);
  group.add(inner);

  // Top cap ring (visible insulation)
  const ringGeom = new THREE.RingGeometry(0.85, 1.2, 64);
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0xff8a4c,
    metalness: 0.2,
    roughness: 0.8,
    emissive: 0x331a08,
    side: THREE.DoubleSide,
  });
  const ringTop = new THREE.Mesh(ringGeom, ringMat);
  ringTop.position.y = 2;
  ringTop.rotation.x = Math.PI / 2;
  group.add(ringTop);

  const ringBot = ringTop.clone();
  ringBot.position.y = -2;
  group.add(ringBot);

  // Decorative segment lines
  for (let i = 0; i < 3; i++) {
    const lineGeom = new THREE.TorusGeometry(1.201, 0.01, 8, 64);
    const lineMat = new THREE.MeshStandardMaterial({
      color: 0x666666, metalness: 0.9, roughness: 0.2,
    });
    const line = new THREE.Mesh(lineGeom, lineMat);
    line.position.y = -1.5 + i * 1.5;
    line.rotation.x = Math.PI / 2;
    group.add(line);
  }

  // Lighting — env map does the heavy lifting; direct lights add highlights only
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(5, 5, 5);
  scene.add(key);

  const rim = new THREE.PointLight(0xff6b35, 0.9, 20);
  rim.position.set(-3, 2, 3);
  scene.add(rim);

  const fill = new THREE.PointLight(0xffffff, 0.8, 15);
  fill.position.set(3, -2, 2);
  scene.add(fill);

  // Animate
  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 0.3;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.3;
  });

  group.rotation.z = 0.2;

  let t = 0;
  function animate() {
    t += 0.005;
    group.rotation.y = t + mouseX;
    group.rotation.x = Math.sin(t * 0.5) * 0.1 + mouseY;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
})();
