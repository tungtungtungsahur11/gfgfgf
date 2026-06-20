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

    parts.forEach(g => {
      const dx = (+g.dataset.dx || 0) * eased;
      const dy = (+g.dataset.dy || 0) * eased;
      g.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    svg.classList.toggle('exploded', explode > 0.15);

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
