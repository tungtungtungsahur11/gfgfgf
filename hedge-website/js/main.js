/* ─── HEDGE / GARDEN CANVAS ─────────────────────────────────────── */
(function initCanvas() {
  const canvas = document.getElementById('hedgeCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], leaves = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  /* soft pollen specks */
  for (let i = 0; i < 160; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.4 + .3,
      a: Math.random(),
      da: (Math.random() - .5) * .008,
      vx: (Math.random() - .5) * .15,
      vy: (Math.random() - .5) * .15,
    });
  }

  /* drifting leaves */
  for (let i = 0; i < 26; i++) {
    leaves.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 5 + 2,
      color: Math.random() > .5 ? '#f0a830' : '#c07d1c',
      speedY: Math.random() * .5 + .2,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * .02 + .01,
    });
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    const cx = W / 2, cy = H / 2;

    /* deep background gradient */
    const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * .85);
    bg.addColorStop(0,  'rgba(20,15,6,.95)');
    bg.addColorStop(.5, 'rgba(12,9,5,.97)');
    bg.addColorStop(1,  'rgba(4,8,10,1)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    /* central green glow */
    const glowR = 120 + Math.sin(t * .001) * 14;
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR * 2.4);
    glow.addColorStop(0,  'rgba(240,168,48,.20)');
    glow.addColorStop(.4, 'rgba(240,168,48,.06)');
    glow.addColorStop(1,  'transparent');
    ctx.beginPath();
    ctx.arc(cx, cy, glowR * 2.4, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();

    /* faint rings */
    ctx.beginPath();
    ctx.arc(cx, cy, 150 + Math.sin(t * .0008) * 10, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(240,168,48,.06)';
    ctx.lineWidth = 1; ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, 230 + Math.cos(t * .0006) * 12, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(240,168,48,.04)';
    ctx.lineWidth = 1; ctx.stroke();

    /* pollen */
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.a += p.da;
      if (p.a < 0) p.da = Math.abs(p.da);
      if (p.a > 1) p.da = -Math.abs(p.da);
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(235,222,190,${p.a * .6})`;
      ctx.fill();
    });

    /* leaves */
    leaves.forEach(l => {
      l.sway += l.swaySpeed;
      l.y += l.speedY;
      l.x += Math.sin(l.sway) * .6;
      if (l.y > H + 10) { l.y = -10; l.x = Math.random() * W; }
      ctx.save();
      ctx.translate(l.x, l.y);
      ctx.rotate(l.sway);
      ctx.beginPath();
      ctx.ellipse(0, 0, l.r, l.r * .5, 0, 0, Math.PI * 2);
      ctx.fillStyle = l.color;
      ctx.globalAlpha = .5;
      ctx.fill();
      ctx.restore();
      ctx.globalAlpha = 1;
    });

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();

/* ─── LEAF CLIPPINGS FLYING OFF THE BLADE ───────────────────────── */
function spawnLeaf() {
  const container = document.getElementById('leafParticles');
  if (!container) return;
  const p = document.createElement('span');
  const green = Math.random() > .5 ? '#f0a830' : '#c07d1c';
  p.style.cssText = `
    position:absolute;
    width:7px;height:4px;border-radius:60% 60% 60% 0;
    background:${green};
    left:${Math.random()*55}%;
    top:42%;
    --tx:${(Math.random()-0.5)*120}px;
    --ty:${Math.random()*70+30}px;
    --rot:${(Math.random()-0.5)*540}deg;
    animation:leafFall ${.7+Math.random()*.7}s ease-in forwards;
    pointer-events:none;
  `;
  container.appendChild(p);
  setTimeout(() => p.remove(), 1500);
}
setInterval(spawnLeaf, 220);

/* ─── SPEC NUMBER (cutting thickness) ───────────────────────────── */
function animateSpec(target = 24) {
  const el = document.getElementById('specVal');
  if (!el) return;
  let n = 0;
  const step = () => {
    n = Math.min(n + 1, target);
    el.textContent = n;
    if (n < target) setTimeout(step, 45);
  };
  step();
}
let specDone = false;
window.addEventListener('scroll', () => {
  const el = document.getElementById('specVal');
  if (!el || specDone) return;
  const rect = el.closest('.trimmer-wrap')?.getBoundingClientRect();
  if (rect && rect.top < window.innerHeight * .8) { animateSpec(24); specDone = true; }
}, { passive: true });

/* ─── STATS COUNTER ─────────────────────────────────────────────── */
function animateCount(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1600;
  const start = performance.now();
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.round(ease * target).toLocaleString('de-DE');
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

/* ─── INTERSECTION OBSERVER ─────────────────────────────────────── */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;

    if (el.classList.contains('section-label') || el.classList.contains('reveal-text') ||
        el.classList.contains('step') || el.classList.contains('compare-table') ||
        el.classList.contains('bullet-item')) {
      el.classList.add('visible'); io.unobserve(el); return;
    }
    if (el.classList.contains('problem-card') || el.classList.contains('sustain-card') ||
        el.classList.contains('price-card')) {
      const delay = parseFloat(el.dataset.delay || 0) * 1000;
      setTimeout(() => el.classList.add('visible'), delay); io.unobserve(el); return;
    }
    if (el.classList.contains('feature-card')) {
      setTimeout(() => el.classList.add('visible'), parseInt(el.dataset.index || 0) * 120);
      io.unobserve(el); return;
    }
    if (el.classList.contains('stat-item')) {
      el.classList.add('visible');
      const num = el.querySelector('.stat-num'); if (num) animateCount(num);
      io.unobserve(el); return;
    }
    if (el.classList.contains('market-card')) {
      setTimeout(() => el.classList.add('visible'), el.classList.contains('b2b') ? 200 : 0);
      io.unobserve(el); return;
    }
    if (el.classList.contains('spec-item')) {
      const idx = parseInt(el.dataset.spec || 1) - 1;
      setTimeout(() => el.classList.add('visible'), idx * 180); io.unobserve(el); return;
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(
  '.section-label, .reveal-text, .problem-card, .feature-card, ' +
  '.step, .stat-item, .market-card, .price-card, .spec-item, ' +
  '.compare-table, .sustain-card, .bullet-item'
).forEach(el => io.observe(el));

/* ─── GSAP SCROLL ANIMATIONS ────────────────────────────────────── */
gsap.registerPlugin(ScrollTrigger, TextPlugin);

gsap.from('.hero-content', { opacity: 0, y: 40, duration: 1.2, ease: 'power3.out', delay: .2 });

gsap.from('.product-text-panel', {
  scrollTrigger: { trigger: '.product-section', start: 'top 70%' },
  x: -60, opacity: 0, duration: 1, ease: 'power3.out',
});
gsap.from('.product-visual-panel', {
  scrollTrigger: { trigger: '.product-section', start: 'top 70%' },
  x: 60, opacity: 0, duration: 1, ease: 'power3.out', delay: .2,
});

gsap.from('.bullet-item', {
  scrollTrigger: { trigger: '.product-text-panel', start: 'top 60%' },
  x: -30, opacity: 0, duration: .6, stagger: .12, ease: 'power2.out', delay: .4,
  onComplete() { document.querySelectorAll('.bullet-item').forEach(el => el.classList.add('visible')); }
});

gsap.from('.step', {
  scrollTrigger: { trigger: '.steps-wrap', start: 'top 70%' },
  x: -50, opacity: 0, duration: .8, stagger: .2, ease: 'power3.out',
});

ScrollTrigger.create({
  trigger: '.steps-wrap', start: 'top center', end: 'bottom center',
  onUpdate(self) {
    const bar = document.getElementById('stepsProgress');
    if (bar) bar.style.height = (self.progress * 100) + '%';
  }
});

/* ─── MECHANISM: rotate gears, then explode into layers on scroll ─ */
(function mechScroll() {
  const section = document.querySelector('.mech-section');
  if (!section) return;

  const svg     = document.getElementById('xtrimmer');
  const parts   = gsap.utils.toArray('.xpart');
  const core    = document.getElementById('mechCore');
  const idxEl   = document.getElementById('mechIndex');
  const titleEl = document.getElementById('mechTitle');
  const subEl   = document.getElementById('mechSub');
  const readEl  = document.getElementById('mechReadout');

  // three narrative stages, like the watch page
  const stages = [
    { idx: '01', title: 'ANTRIEB',  sub: 'Akku und bürstenloser Motor liefern die Kraft — kabellos und konstant.',
      read: [['Spannung','18 V'],['Akku','4,0 Ah'],['Motor','Brushless']] },
    { idx: '02', title: 'ROTATION', sub: 'Das Getriebe wandelt die Motordrehung in bis zu 3.200 Hübe pro Minute um.',
      read: [['Drehzahl','3.200 /min'],['Hubzahl','3.200 spm'],['Frequenz','53 Hz']] },
    { idx: '03', title: 'AUFBAU',   sub: 'Sechs Komponenten greifen ineinander — vom Akku bis zum Diamantmesser.',
      read: [['Komponenten','6'],['Schnittstärke','24 mm'],['Messer','60 cm']] },
  ];

  let curStage = -1;
  function setStage(s) {
    if (s === curStage) return;
    curStage = s;
    const st = stages[s];
    [titleEl, subEl, readEl].forEach(el => el.classList.add('mech-swap'));
    setTimeout(() => {
      idxEl.textContent   = st.idx;
      titleEl.textContent = st.title;
      subEl.textContent   = st.sub;
      readEl.innerHTML    = st.read.map(r => `<div><span>${r[0]}</span><b>${r[1]}</b></div>`).join('');
      idxEl.style.color   = 'rgba(240,168,48,' + (0.16 + s * 0.12) + ')';
      [titleEl, subEl, readEl].forEach(el => el.classList.remove('mech-swap'));
    }, 180);
  }

  function render(p) {
    // p: 0..1 over the whole pinned section.
    // Stay assembled (recognisable trimmer) through stage 1-2, then explode.
    const explode = Math.max(0, Math.min(1, (p - 0.40) / 0.60)); // 0..1
    const eased   = explode * explode * (3 - 2 * explode);        // smoothstep

    if (window.__MECH3D) {
      // drive the real 3D model; SVG fallback is hidden
      window.__MECH3D.render(p, explode, eased);
    } else {
      parts.forEach(g => {
        const dx = (+g.dataset.dx || 0) * eased;
        const dy = (+g.dataset.dy || 0) * eased;
        g.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      svg.classList.toggle('exploded', explode > 0.15);
    }

    // glowing core grows with the sequence
    core.style.opacity = (0.30 + p * 0.5).toFixed(3);
    core.style.transform = `scale(${(0.6 + p * 1.0).toFixed(3)})`;

    setStage(p < 0.34 ? 0 : p < 0.67 ? 1 : 2);
  }
  render(0);

  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    onUpdate(self) { render(self.progress); }
  });
})();

/* Card tilt on hover */
function tilt(selector, depth, perspective) {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - .5;
      const y = (e.clientY - rect.top)  / rect.height - .5;
      card.style.transform = `perspective(${perspective}px) rotateY(${x*depth}deg) rotateX(${-y*depth}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = 'none'; });
  });
}
tilt('.price-card', 8, 600);
tilt('.feature-card', 6, 700);

document.querySelectorAll('.reveal-text').forEach(el => {
  gsap.from(el, {
    scrollTrigger: { trigger: el, start: 'top 80%' },
    y: 50, opacity: 0, duration: .9, ease: 'power3.out',
    onStart() { el.classList.add('visible'); }
  });
});

gsap.to('.tagline-track', {
  scrollTrigger: { trigger: '.tagline-section', start: 'top bottom', end: 'bottom top', scrub: true },
  x: '-=50',
});

/* ─── NAVBAR + MENU ─────────────────────────────────────────────── */
window.addEventListener('scroll', () => {
  document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu?.classList.toggle('open');
});
document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    mobileMenu?.classList.remove('open');
  });
});

/* ─── CONTACT FORM ──────────────────────────────────────────────── */
function handleSubmit(e) {
  e.preventDefault();
  const success = document.getElementById('formSuccess');
  const btn = e.target.querySelector('.btn-text');
  btn.textContent = 'Wird gesendet…';
  setTimeout(() => {
    btn.textContent = 'Nachricht senden';
    e.target.reset();
    if (success) success.classList.add('show');
    setTimeout(() => success?.classList.remove('show'), 5000);
  }, 1200);
}

/* ─── SMOOTH ANCHORS ────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

/* ─── HERO PARALLAX ─────────────────────────────────────────────── */
document.addEventListener('mousemove', (e) => {
  const xR = (e.clientX / window.innerWidth  - .5) * 2;
  const yR = (e.clientY / window.innerHeight - .5) * 2;
  const hero = document.querySelector('.hero-content');
  if (hero) hero.style.transform = `translate(${xR * 8}px, ${yR * 5}px)`;
});

/* Spec items glow */
document.querySelectorAll('.spec-dot').forEach((dot, i) => {
  ScrollTrigger.create({
    trigger: dot, start: 'top 80%', once: true,
    onEnter() {
      setTimeout(() => {
        dot.style.boxShadow = '0 0 20px rgba(240,168,48,.8), 0 0 40px rgba(240,168,48,.3)';
      }, i * 180);
    }
  });
});

console.log('%cVERDA TitanCut — Akku-Heckenschere', 'color:#f0a830;font-weight:800;font-size:18px;');

/* ─── REAL 3D MECHANISM (Three.js) ──────────────────────────────────
   Builds the hedge trimmer from real geometry with metal materials,
   environment reflections, lights and shadows. Scroll rotates it and
   blows it apart into labelled parts. Falls back to the SVG silently
   if WebGL or the THREE library is unavailable.                       */
(function buildMech3D() {
  if (!window.THREE) return;                         // CDN blocked → SVG fallback
  const canvas = document.getElementById('mech3d');
  const stage  = document.querySelector('.mech-stage');
  const labelLayer = document.getElementById('mechLabels');
  if (!canvas || !stage) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  } catch (e) { return; }                            // no WebGL → SVG fallback
  if (!renderer || !renderer.getContext()) return;

  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(DPR);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200);

  /* ---- environment map (gradient) for believable metal reflections ---- */
  function makeEnv() {
    const c = document.createElement('canvas'); c.width = 128; c.height = 64;
    const x = c.getContext('2d');
    const g = x.createLinearGradient(0, 0, 0, 64);
    g.addColorStop(0.00, '#454d5e');
    g.addColorStop(0.42, '#23272f');
    g.addColorStop(0.50, '#6a5f48');
    g.addColorStop(0.58, '#22262d');
    g.addColorStop(1.00, '#0b0a08');
    x.fillStyle = g; x.fillRect(0, 0, 128, 64);
    x.fillStyle = 'rgba(255,238,205,0.95)'; x.fillRect(14, 10, 44, 5);   // soft light bar
    x.fillStyle = 'rgba(240,168,48,0.30)';  x.fillRect(78, 40, 40, 8);   // warm bounce
    const tex = new THREE.CanvasTexture(c);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    const env = pmrem.fromEquirectangular(tex).texture;
    tex.dispose(); pmrem.dispose();
    return env;
  }
  scene.environment = makeEnv();

  /* ---- materials ---- */
  const M = {
    housing: new THREE.MeshStandardMaterial({ color: 0x2b2517, metalness: 0.85, roughness: 0.42 }),
    steel:   new THREE.MeshStandardMaterial({ color: 0xcfc6ad, metalness: 1.0,  roughness: 0.26 }),
    gear:    new THREE.MeshStandardMaterial({ color: 0xa3946a, metalness: 1.0,  roughness: 0.30 }),
    copper:  new THREE.MeshStandardMaterial({ color: 0xd98a36, metalness: 0.95, roughness: 0.32 }),
    cell:    new THREE.MeshStandardMaterial({ color: 0xb9a877, metalness: 0.8,  roughness: 0.38 }),
    grip:    new THREE.MeshStandardMaterial({ color: 0x16130c, metalness: 0.25, roughness: 0.85 }),
    pcb:     new THREE.MeshStandardMaterial({ color: 0x123a18, metalness: 0.3,  roughness: 0.6 }),
    dark:    new THREE.MeshStandardMaterial({ color: 0x0e0b06, metalness: 0.4,  roughness: 0.7 }),
    accent:  new THREE.MeshStandardMaterial({ color: 0x3a2606, metalness: 0.5,  roughness: 0.4,
                                              emissive: 0xf0a830, emissiveIntensity: 1.1 }),
  };

  const root = new THREE.Group();          // everything (gets scroll rotation)
  scene.add(root);

  // helper: make a "part" group that can fly out on explode
  const partList = [];   // { group, dir:Vector3, label, spinners:[] }
  function addPart(dir, label) {
    const g = new THREE.Group();
    root.add(g);
    const p = { group: g, dir: new THREE.Vector3(dir[0], dir[1], dir[2]), label, labelEl: null, home: new THREE.Vector3() };
    partList.push(p);
    return g;
  }
  function box(w, h, d, mat) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.castShadow = m.receiveShadow = true; return m; }
  function cyl(rt, rb, h, mat, seg) { const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg || 36), mat); m.castShadow = m.receiveShadow = true; return m; }
  function rrect(w, h, d, r, mat) {  // rounded box via extruded rounded rect
    const s = new THREE.Shape();
    const x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y);
    s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    const geo = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.06, bevelSegments: 2, steps: 1 });
    geo.translate(0, 0, -d / 2);
    const m = new THREE.Mesh(geo, mat); m.castShadow = m.receiveShadow = true; return m;
  }
  function gearMesh(teeth, ro, rr, depth, mat) {
    const shape = new THREE.Shape();
    const step = Math.PI * 2 / teeth;
    for (let i = 0; i < teeth; i++) {
      const a = i * step;
      [[a - step * 0.42, rr], [a - step * 0.18, ro], [a + step * 0.18, ro], [a + step * 0.42, rr]]
        .forEach(([ang, r], j) => {
          const px = Math.cos(ang) * r, py = Math.sin(ang) * r;
          (i === 0 && j === 0) ? shape.moveTo(px, py) : shape.lineTo(px, py);
        });
    }
    shape.closePath();
    const hole = new THREE.Path(); hole.absarc(0, 0, rr * 0.4, 0, Math.PI * 2, true); shape.holes.push(hole);
    const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: depth * 0.18, bevelSize: depth * 0.12, bevelSegments: 1, steps: 1 });
    geo.translate(0, 0, -depth / 2);
    const m = new THREE.Mesh(geo, mat); m.castShadow = m.receiveShadow = true; return m;
  }

  const spinners = [];   // meshes that rotate continuously

  /* ① BLADE ----------------------------------------------------------- */
  (function () {
    const g = addPart([-0.2, -1, 0], '① Messer');
    const bar = box(9.0, 0.55, 0.3, M.housing); bar.position.set(-4.7, 0, 0); g.add(bar);
    const edge = box(9.0, 0.12, 0.34, M.steel); edge.position.set(-4.7, 0.28, 0); g.add(edge);
    // teeth (triangular prisms) along both sides
    const triShape = new THREE.Shape();
    triShape.moveTo(0, 0); triShape.lineTo(0.5, 0.55); triShape.lineTo(1.0, 0); triShape.closePath();
    const triGeo = new THREE.ExtrudeGeometry(triShape, { depth: 0.26, bevelEnabled: false });
    triGeo.translate(0, 0, -0.13);
    for (let i = 0; i < 16; i++) {
      const tx = -8.8 + i * 0.56;
      const tTop = new THREE.Mesh(triGeo, M.steel); tTop.castShadow = true;
      tTop.position.set(tx, 0.28, 0); g.add(tTop);
      const tBot = new THREE.Mesh(triGeo, M.steel); tBot.castShadow = true;
      tBot.position.set(tx + 0.28, -0.28, 0); tBot.rotation.z = Math.PI; g.add(tBot);
    }
    const tip = cyl(0.16, 0.16, 0.3, M.steel, 12); tip.rotation.z = Math.PI / 2; tip.position.set(-9.3, 0, 0); g.add(tip);
  })();

  /* ② HANDGUARD ------------------------------------------------------- */
  (function () {
    const g = addPart([0, 1, 0.4], '② Handschutz');
    const plate = box(0.25, 1.7, 1.7, M.housing); plate.position.set(0.1, 0, 0); g.add(plate);
    const lip = box(0.5, 0.18, 1.7, M.accent); lip.position.set(0.35, 0.85, 0); g.add(lip);
  })();

  /* ③ ECCENTRIC + CONROD --------------------------------------------- */
  (function () {
    const g = addPart([-0.1, -1.1, 0.6], '③ Exzenter & Pleuel');
    const ecc = cyl(0.6, 0.6, 0.45, M.gear, 28); ecc.rotation.x = Math.PI / 2; ecc.position.set(0.9, 0, 0.2); g.add(ecc); spinners.push({ m: ecc, s: 1.4, ax: 'z' });
    const rod = box(1.6, 0.22, 0.18, M.copper); rod.position.set(0.1, 0, 0.2); g.add(rod);
    const pin = cyl(0.14, 0.14, 0.5, M.accent, 16); pin.rotation.x = Math.PI / 2; pin.position.set(1.2, 0.32, 0.2); g.add(pin);
  })();

  /* ④ GEARS ----------------------------------------------------------- */
  (function () {
    const g = addPart([-0.3, 1.1, 0.7], '④ Getriebe & Ritzel');
    const big = gearMesh(18, 1.05, 0.78, 0.34, M.gear); big.position.set(1.5, 0.1, 0.55); g.add(big); spinners.push({ m: big, s: -1.0, ax: 'z' });
    const hub = cyl(0.34, 0.34, 0.4, M.housing, 24); hub.rotation.x = Math.PI / 2; hub.position.set(1.5, 0.1, 0.55); g.add(hub);
    const small = gearMesh(9, 0.5, 0.34, 0.3, M.copper); small.position.set(2.45, 0.55, 0.55); g.add(small); spinners.push({ m: small, s: 2.0, ax: 'z' });
  })();

  /* ⑤ STATOR ---------------------------------------------------------- */
  (function () {
    const g = addPart([0, 1.2, -0.2], '⑤ Stator (Wicklung)');
    const ringO = cyl(1.5, 1.5, 1.1, M.housing, 40); ringO.rotation.z = Math.PI / 2; ringO.position.set(1.5, 0, 0); g.add(ringO);
    const ringI = cyl(0.95, 0.95, 1.16, M.dark, 40); ringI.rotation.z = Math.PI / 2; ringI.position.set(1.5, 0, 0); g.add(ringI);
    for (let k = 0; k < 6; k++) {
      const a = k * Math.PI / 3;
      const coil = box(0.95, 0.5, 0.5, M.copper);
      coil.position.set(1.5, Math.cos(a) * 1.18, Math.sin(a) * 1.18);
      coil.rotation.x = a; g.add(coil);
    }
  })();

  /* ⑥ ROTOR + SHAFT --------------------------------------------------- */
  (function () {
    const g = addPart([0, -0.3, 1.3], '⑥ Rotor & Welle');
    const rot = cyl(0.82, 0.82, 1.0, M.steel, 28); rot.rotation.z = Math.PI / 2; rot.position.set(1.5, 0, 0); g.add(rot); spinners.push({ m: rot, s: 4.5, ax: 'x' });
    for (let k = 0; k < 8; k++) {
      const a = k * Math.PI / 4;
      const slot = box(1.02, 0.12, 0.18, M.dark);
      slot.position.set(1.5, Math.cos(a) * 0.7, Math.sin(a) * 0.7);
      slot.rotation.x = a; rot.add(slot);
    }
    const shaft = cyl(0.16, 0.16, 4.4, M.steel, 18); shaft.rotation.z = Math.PI / 2; shaft.position.set(0.2, 0, 0); g.add(shaft); spinners.push({ m: shaft, s: 4.5, ax: 'x' });
    const core = cyl(0.2, 0.2, 1.04, M.accent, 16); core.rotation.z = Math.PI / 2; core.position.set(1.5, 0, 0); g.add(core);
  })();

  /* ⑦ MOTOR HOUSING --------------------------------------------------- */
  (function () {
    const g = addPart([0.3, 0, -1.3], '⑦ Motorgehäuse');
    const shell = rrect(3.0, 2.7, 2.7, 0.7, M.housing); shell.rotation.y = Math.PI / 2; shell.position.set(1.6, 0, 0); g.add(shell);
    for (let i = 0; i < 8; i++) {
      const fin = box(0.06, 1.2, 2.4, M.dark);
      fin.position.set(0.45 + i * 0.16, 0.55, 0); g.add(fin);
    }
    [[3.1, 1.0, 1.0], [3.1, 1.0, -1.0], [3.1, -1.0, 1.0], [3.1, -1.0, -1.0]].forEach(p => {
      const bolt = cyl(0.13, 0.13, 0.12, M.gear, 12); bolt.rotation.x = Math.PI / 2; bolt.position.set(p[0], p[1], p[2]); g.add(bolt);
    });
  })();

  /* ⑧ HANDLE + ELECTRONICS ------------------------------------------- */
  (function () {
    const g = addPart([0.5, 1.2, -0.4], '⑧ Griff & Elektronik');
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(2.0, 1.2, 0), new THREE.Vector3(2.6, 2.7, 0),
      new THREE.Vector3(4.2, 2.9, 0), new THREE.Vector3(4.9, 1.6, 0),
      new THREE.Vector3(4.6, 0.4, 0),
    ]);
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 40, 0.34, 16, false), M.grip);
    tube.castShadow = tube.receiveShadow = true; g.add(tube);
    const trigger = box(0.5, 0.5, 0.7, M.accent); trigger.position.set(2.0, 0.5, 0); g.add(trigger);
    const pcb = box(0.1, 0.7, 1.1, M.pcb); pcb.position.set(2.9, 1.0, 0); g.add(pcb);
  })();

  /* ⑨ BATTERY --------------------------------------------------------- */
  (function () {
    const g = addPart([0.4, -1.3, 0], '⑨ Akku (Lithium-Zellen)');
    const pack = rrect(3.0, 1.4, 1.8, 0.3, M.housing); pack.rotation.y = Math.PI / 2; pack.position.set(3.0, -1.7, 0); g.add(pack);
    for (let i = 0; i < 5; i++) {
      const cell = cyl(0.26, 0.26, 1.2, M.cell, 20); cell.rotation.z = Math.PI / 2;
      cell.position.set(2.0 + i * 0.5, -1.7, 0); g.add(cell);
      const cap = cyl(0.1, 0.1, 0.1, M.accent, 12); cap.rotation.z = Math.PI / 2; cap.position.set(1.4, -1.7 + 0, 0);
    }
    const term = box(0.4, 0.18, 0.7, M.accent); term.position.set(1.5, -1.1, 0); g.add(term);
  })();

  // record each part's home position (its children are offset in world space,
  // so the group itself starts at origin and we translate it along dir).
  partList.forEach(p => { p.home.copy(p.group.position); });

  /* ---- labels (HTML, projected each frame) ---- */
  partList.forEach(p => {
    const el = document.createElement('div');
    el.className = 'm3d-label';
    el.textContent = p.label;
    labelLayer.appendChild(el);
    p.labelEl = el;
    // anchor: average of children bbox centre
    const bb = new THREE.Box3().setFromObject(p.group);
    p.anchor = bb.getCenter(new THREE.Vector3());
  });

  /* ---- lights ---- */
  scene.add(new THREE.HemisphereLight(0x9fb4d4, 0x140f08, 0.55));
  const key = new THREE.DirectionalLight(0xfff0d8, 2.3);
  key.position.set(-6, 9, 8); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 1; key.shadow.camera.far = 60;
  key.shadow.camera.left = -14; key.shadow.camera.right = 14;
  key.shadow.camera.top = 14; key.shadow.camera.bottom = -14;
  key.shadow.bias = -0.0004;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xf0a830, 1.3); rim.position.set(8, 3, -7); scene.add(rim);
  const fill = new THREE.DirectionalLight(0xbfd0ff, 0.5); fill.position.set(5, -4, 6); scene.add(fill);

  /* ---- contact shadow ---- */
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.ShadowMaterial({ opacity: 0.34 }));
  ground.rotation.x = -Math.PI / 2; ground.position.y = -3.4; ground.receiveShadow = true; scene.add(ground);

  /* ---- frame the camera to the assembled model ---- */
  const bbox = new THREE.Box3().setFromObject(root);
  const center = bbox.getCenter(new THREE.Vector3());
  const size = bbox.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const fitDist = (maxDim * 1.45) / Math.tan((camera.fov * Math.PI / 180) / 2);
  const camDir = new THREE.Vector3(0.12, 0.34, 1).normalize();
  const camTarget = center.clone();
  function placeCamera() {
    camera.position.copy(camTarget).add(camDir.clone().multiplyScalar(fitDist));
    camera.lookAt(camTarget);
  }

  /* ---- sizing ---- */
  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    placeCamera();
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  /* ---- scroll-driven state + render loop ---- */
  let targetExplode = 0, curExplode = 0, scrollP = 0;
  const tmp = new THREE.Vector3();
  const projV = new THREE.Vector3();
  let last = performance.now();

  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.05); last = now;
    curExplode += (targetExplode - curExplode) * Math.min(1, dt * 8);  // smooth

    // turntable: scroll drives base yaw, plus a gentle idle sway
    root.rotation.y = -0.55 + scrollP * 1.15 + Math.sin(now / 3500) * 0.05;
    root.rotation.x = -0.12;

    // spin live mechanism (faster as it assembles, calmer when exploded)
    const spinFactor = 0.4 + (1 - curExplode) * 0.8;
    spinners.forEach(sp => { sp.m.rotation[sp.ax] += sp.s * dt * spinFactor; });

    // explode: push each part along its direction
    partList.forEach(p => {
      p.group.position.copy(p.home).addScaledVector(p.dir, curExplode * 3.1);
    });

    renderer.render(scene, camera);

    // project labels
    const rect = stage.getBoundingClientRect();
    const showLabels = curExplode > 0.2;
    partList.forEach(p => {
      const el = p.labelEl;
      if (!showLabels) { el.style.opacity = '0'; return; }
      tmp.copy(p.anchor).addScaledVector(p.dir, curExplode * 3.1);
      tmp.applyMatrix4(root.matrixWorld);
      projV.copy(tmp).project(camera);
      const vis = projV.z < 1;
      el.style.opacity = vis ? String((curExplode - 0.2) / 0.8) : '0';
      el.style.left = ((projV.x * 0.5 + 0.5) * rect.width) + 'px';
      el.style.top  = ((-projV.y * 0.5 + 0.5) * rect.height) + 'px';
    });

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ---- public API used by the scroll driver ---- */
  window.__MECH3D = {
    render(p, explode /*, eased */) {
      scrollP = p;
      targetExplode = explode;
    }
  };

  stage.classList.add('has3d');   // hide SVG, reveal canvas
})();
