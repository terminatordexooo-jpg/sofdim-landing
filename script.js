/* ============================================
   SOFDIM — Landing JS
   ============================================ */

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
/* Цены — стенка 0.6 мм (акционные, с sofdim.com). old = зачёркнутая, new = со скидкой. */
const SINGLE_DIAMETERS = [
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
];
const INSULATED_DIAMETERS = [
  { inner: 100, outer: 160, old: 6124,  price: 5512 },
  { inner: 110, outer: 180, old: 6896,  price: 6206 },
  { inner: 120, outer: 180, old: 7053,  price: 6348 },
  { inner: 130, outer: 200, old: 7861,  price: 7075 },
  { inner: 140, outer: 200, old: 8029,  price: 7226 },
  { inner: 150, outer: 220, old: 8833,  price: 7950 },
  { inner: 160, outer: 220, old: 9614,  price: 8653 },
  { inner: 180, outer: 250, old: 10392, price: 9353 },
  { inner: 200, outer: 260, old: 11062, price: 9956 },
  { inner: 220, outer: 280, old: 13692, price: 12323 },
  { inner: 230, outer: 300, old: 14886, price: 13397 },
  { inner: 250, outer: 320, old: 17510, price: 15759 },
  { inner: 300, outer: 360, old: 20385, price: 18347 },
  { inner: 350, outer: 420, old: 23683, price: 21315 },
  { inner: 400, outer: 460, old: 26114, price: 23503 },
];

const UAH = new Intl.NumberFormat('uk-UA').format;

const diaList = document.getElementById('diaList');
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
let currentIndex = 0;

function renderDiaButtons() {
  diaList.innerHTML = '';
  const items = currentType === 'single' ? SINGLE_DIAMETERS : INSULATED_DIAMETERS;
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
  const items = currentType === 'single' ? SINGLE_DIAMETERS : INSULATED_DIAMETERS;
  const item = items[currentIndex];
  const inner = item.inner;
  if (currentType === 'single') {
    diaValue.textContent = inner;
    diaTitle.textContent = `Ø${inner} мм — одностінна`;
    diaInner.textContent = `Ø${inner} мм`;
    diaCta.textContent = inner;
  } else {
    diaValue.textContent = inner;
    diaTitle.textContent = `Ø${inner}/${item.outer} мм — утеплена`;
    diaInner.textContent = `Ø${inner} / ${item.outer} мм`;
    diaCta.textContent = `${inner}/${item.outer}`;
  }
  diaRing.style.setProperty('--dia-scale', scaleFor(inner).toFixed(3));
  diaThickness.textContent = '0,6 / 0,8 / 1 мм';
  if (item.price) {
    diaPriceOld.textContent = item.old ? `${UAH(item.old)} ₴` : '';
    diaPriceNew.textContent = `від ${UAH(item.price)} ₴`;
  } else {
    diaPriceOld.textContent = '';
    diaPriceNew.textContent = 'Уточнити ціну';
  }
}

typeButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    typeButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentType = btn.dataset.type;
    currentIndex = 0;
    renderDiaButtons();
    updatePanel();
  });
});

renderDiaButtons();
updatePanel();

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

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const last = parseInt(localStorage.getItem(RATE_KEY) || '0', 10);
  const elapsed = Date.now() - last;
  if (last && elapsed < RATE_LIMIT_MS) {
    const left = Math.ceil((RATE_LIMIT_MS - elapsed) / 1000);
    const m = Math.floor(left / 60);
    const s = left % 60;
    status.hidden = false;
    status.classList.add('error');
    status.textContent = `Ви вже надіслали заявку. Спробуйте через ${m}:${s.toString().padStart(2, '0')}.`;
    return;
  }

  const data = Object.fromEntries(new FormData(form).entries());

  const text =
    '🔥 *Нова заявка SOFDIM*\n\n' +
    `👤 Ім'я: ${data.name || '—'}\n` +
    `📱 Телефон: ${data.phone || '—'}\n` +
    `📏 Діаметр: ${data.diameter || 'підбере фахівець'}\n` +
    `🔧 Джерело: ${data.source || '—'}\n` +
    `💬 Коментар: ${data.comment || '—'}\n` +
    `\n🕐 ${new Date().toLocaleString('uk-UA')}`;

  status.hidden = false;
  status.classList.remove('error');
  status.textContent = 'Надсилаємо…';

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
      status.textContent = '✓ Заявка надіслана. Передзвонимо протягом 15–20 хвилин.';
      form.reset();
      localStorage.setItem(RATE_KEY, Date.now().toString());
    } else {
      console.log('LEAD:', data);
      console.log(text);
      status.textContent = '✓ Форма готова. Підключи Telegram-бот у script.js → TELEGRAM_CONFIG.';
      localStorage.setItem(RATE_KEY, Date.now().toString());
    }
  } catch (err) {
    status.classList.add('error');
    status.textContent = 'Помилка надсилання. Напишіть у Telegram напряму.';
  }
});

/* --------- 3D pipe (Three.js) --------- */
(function init3D() {
  if (typeof THREE === 'undefined') return;
  const canvas = document.getElementById('pipe3d');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 8);

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

  // Outer pipe — mirror polished stainless
  const outerGeom = new THREE.CylinderGeometry(1.2, 1.2, 4, 64, 1, true);
  const outerMat = new THREE.MeshStandardMaterial({
    color: 0xf0f0f4,
    metalness: 1.0,
    roughness: 0.12,
    side: THREE.DoubleSide,
  });
  const outer = new THREE.Mesh(outerGeom, outerMat);
  group.add(outer);

  // Inner pipe — polished mirror-finish stainless steel
  const innerGeom = new THREE.CylinderGeometry(0.85, 0.85, 4.2, 64, 1, true);
  const innerMat = new THREE.MeshStandardMaterial({
    color: 0xe8e8ec,
    metalness: 1.0,
    roughness: 0.08,
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

  // Product logo label wrapped around the pipe
  const logoCanvas = document.createElement('canvas');
  logoCanvas.width = 2048;
  logoCanvas.height = 256;
  const lctx = logoCanvas.getContext('2d');
  lctx.clearRect(0, 0, logoCanvas.width, logoCanvas.height);

  // Draw logo 2 times around so it's visible from both sides
  const drawLogo = (cx) => {
    // orange mark circle
    const markSize = 56;
    lctx.save();
    lctx.translate(cx - 220, 128);
    const grad = lctx.createLinearGradient(-markSize, -markSize, markSize, markSize);
    grad.addColorStop(0, '#ff8a4c');
    grad.addColorStop(1, '#e04f1c');
    lctx.fillStyle = grad;
    lctx.beginPath();
    lctx.roundRect(-markSize / 2, -markSize / 2, markSize, markSize, 14);
    lctx.fill();
    // inner ring
    lctx.strokeStyle = 'rgba(255,255,255,0.95)';
    lctx.lineWidth = 5;
    lctx.beginPath();
    lctx.arc(0, 0, markSize / 3.5, 0, Math.PI * 2);
    lctx.stroke();
    lctx.restore();

    // SOFDIM text
    lctx.fillStyle = '#ffffff';
    lctx.font = '900 108px Unbounded, Inter, sans-serif';
    lctx.textAlign = 'left';
    lctx.textBaseline = 'middle';
    lctx.fillText('SOFDIM', cx - 170, 128);
  };
  drawLogo(logoCanvas.width * 0.25);
  drawLogo(logoCanvas.width * 0.75);

  const logoTex = new THREE.CanvasTexture(logoCanvas);
  logoTex.anisotropy = 8;

  const labelGeom = new THREE.CylinderGeometry(1.215, 1.215, 0.5, 128, 1, true);
  const labelMat = new THREE.MeshStandardMaterial({
    map: logoTex,
    transparent: true,
    side: THREE.DoubleSide,
    metalness: 0.3,
    roughness: 0.5,
    emissive: 0xffffff,
    emissiveMap: logoTex,
    emissiveIntensity: 0.25,
  });
  const label = new THREE.Mesh(labelGeom, labelMat);
  label.position.y = 0.2;
  group.add(label);

  // Lighting
  const ambient = new THREE.AmbientLight(0x404040, 2);
  scene.add(ambient);

  const key = new THREE.DirectionalLight(0xffffff, 1.2);
  key.position.set(5, 5, 5);
  scene.add(key);

  const rim = new THREE.PointLight(0xff6b35, 3, 20);
  rim.position.set(-3, 2, 3);
  scene.add(rim);

  const fill = new THREE.PointLight(0xfbbf24, 1.5, 15);
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
