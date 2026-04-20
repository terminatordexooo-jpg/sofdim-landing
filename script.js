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
const DIA_DATA = {
  100: {
    title: 'Ø100 мм — компактные котлы',
    desc: 'Для газовых настенных котлов малой мощности и небольших каминных топок до 10 кВт.',
    use: 'Газовые котлы 6–12 кВт',
    outer: 'Ø150 мм (изоляция 25 мм)',
    steel: 'AISI 304',
  },
  115: {
    title: 'Ø115 мм — газовые настенники',
    desc: 'Европейский стандарт для немецких и итальянских газовых котлов до 24 кВт.',
    use: 'Bosch, Vaillant, Ariston до 24 кВт',
    outer: 'Ø165 мм (изоляция 25 мм)',
    steel: 'AISI 304',
  },
  120: {
    title: 'Ø120 мм — средние котлы',
    desc: 'Ходовой диаметр для газовых и электрических систем средней мощности.',
    use: 'Котлы 18–28 кВт',
    outer: 'Ø170 мм (изоляция 25 мм)',
    steel: 'AISI 304',
  },
  130: {
    title: 'Ø130 мм — универсал',
    desc: 'Подходит для большинства бытовых котлов и мини-каминов.',
    use: 'Настенные котлы и малые камины',
    outer: 'Ø180 мм (изоляция 25 мм)',
    steel: 'AISI 304 / 321',
  },
  140: {
    title: 'Ø140 мм — твёрдое топливо',
    desc: 'Малые твердотопливные котлы, печи-буржуйки, уличные казаны.',
    use: 'ТТ-котлы до 18 кВт, печи',
    outer: 'Ø240 мм (изоляция 50 мм)',
    steel: 'AISI 321',
  },
  150: {
    title: 'Ø150 мм — самый популярный',
    desc: 'Классика для ТТ-котлов среднего частного дома и большинства банных печей.',
    use: 'ТТ-котлы 20–30 кВт, бани',
    outer: 'Ø250 мм (изоляция 50 мм)',
    steel: 'AISI 321',
  },
  160: {
    title: 'Ø160 мм — средне-большие ТТ',
    desc: 'Для котлов верхнего горения и каминных вкладышей.',
    use: 'ТТ-котлы 25–35 кВт, камины',
    outer: 'Ø260 мм (изоляция 50 мм)',
    steel: 'AISI 321',
  },
  180: {
    title: 'Ø180 мм — мощные ТТ-котлы',
    desc: 'Для больших домов и пеллетных котлов с длительным горением.',
    use: 'ТТ-котлы 30–45 кВт',
    outer: 'Ø280 мм (изоляция 50 мм)',
    steel: 'AISI 321',
  },
  200: {
    title: 'Ø200 мм — коттеджи',
    desc: 'Большие твердотопливные котлы, каминные залы, производственные печи.',
    use: 'ТТ-котлы 40–60 кВт',
    outer: 'Ø300 мм (изоляция 50 мм)',
    steel: 'AISI 321',
  },
  220: {
    title: 'Ø220 мм — промышленный',
    desc: 'Котельные малого бизнеса, теплицы, цеха.',
    use: 'Промышленные котлы 50–80 кВт',
    outer: 'Ø320 мм (изоляция 50 мм)',
    steel: 'AISI 321',
  },
  230: {
    title: 'Ø230 мм — максимум',
    desc: 'Максимальный стандартный диаметр. Промышленные задачи и большие общественные здания.',
    use: 'Котельные 60–100 кВт',
    outer: 'Ø330 мм (изоляция 50 мм)',
    steel: 'AISI 321',
  },
};

const diaButtons = document.querySelectorAll('.dia-btn');
const diaValue = document.getElementById('diaValue');
const diaTitle = document.getElementById('diaTitle');
const diaDesc = document.getElementById('diaDesc');
const diaUse = document.getElementById('diaUse');
const diaOuter = document.getElementById('diaOuter');
const diaSteel = document.getElementById('diaSteel');
const diaCta = document.getElementById('diaCta');

diaButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    diaButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const d = btn.dataset.d;
    const info = DIA_DATA[d];
    if (!info) return;
    diaValue.textContent = d;
    diaTitle.textContent = info.title;
    diaDesc.textContent = info.desc;
    diaUse.textContent = info.use;
    diaOuter.textContent = info.outer;
    diaSteel.textContent = info.steel;
    diaCta.textContent = d;
  });
});

/* --------- Lead form --------- */
const form = document.getElementById('leadForm');
const status = document.getElementById('formStatus');

/* === CONFIG: подставь свой токен и chat_id === */
const TELEGRAM_CONFIG = {
  // 1) Создай бота у @BotFather, получи TOKEN
  // 2) Свой chat_id: напиши боту /start и открой https://api.telegram.org/bot<TOKEN>/getUpdates
  BOT_TOKEN: '', // <-- сюда токен, например '123456:ABC...'
  CHAT_ID: '',   // <-- сюда твой chat_id, например '7042878265'
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());

  const text =
    '🔥 *Новая заявка SOFDIM*\n\n' +
    `👤 Имя: ${data.name || '—'}\n` +
    `📱 Телефон: ${data.phone || '—'}\n` +
    `📏 Диаметр: ${data.diameter || 'подберёт инженер'}\n` +
    `🔧 Источник: ${data.source || '—'}\n` +
    `💬 Коммент: ${data.comment || '—'}\n` +
    `\n🕐 ${new Date().toLocaleString('ru-RU')}`;

  status.hidden = false;
  status.classList.remove('error');
  status.textContent = 'Отправляем…';

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
      status.textContent = '✓ Заявка отправлена. Перезвоним в течение часа.';
      form.reset();
    } else {
      // fallback: лог в консоль, чтобы проверить до интеграции
      console.log('LEAD:', data);
      console.log(text);
      status.textContent = '✓ Форма готова. Подключи Telegram-бот в script.js → TELEGRAM_CONFIG.';
    }
  } catch (err) {
    status.classList.add('error');
    status.textContent = 'Ошибка отправки. Напишите в Telegram напрямую.';
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

  // Outer pipe
  const outerGeom = new THREE.CylinderGeometry(1.2, 1.2, 4, 64, 1, true);
  const outerMat = new THREE.MeshStandardMaterial({
    color: 0xd4d4d8,
    metalness: 0.95,
    roughness: 0.25,
    side: THREE.DoubleSide,
  });
  const outer = new THREE.Mesh(outerGeom, outerMat);
  group.add(outer);

  // Inner pipe
  const innerGeom = new THREE.CylinderGeometry(0.85, 0.85, 4.2, 64, 1, true);
  const innerMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    metalness: 0.8,
    roughness: 0.4,
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
