/* ─── SOLAR CANVAS PARTICLE SYSTEM ─────────────────────────────── */
(function initCanvas() {
  const canvas = document.getElementById('solarCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [], rays = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  /* tiny star particles */
  for (let i = 0; i < 180; i++) {
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

  /* radial sun rays from center */
  const RAY_COUNT = 18;
  for (let i = 0; i < RAY_COUNT; i++) {
    rays.push({
      angle: (i / RAY_COUNT) * Math.PI * 2,
      len: Math.random() * 260 + 120,
      alpha: Math.random() * .18 + .04,
      speed: (Math.random() - .5) * .0006,
    });
  }

  /* floating energy dots */
  const dots = [];
  for (let i = 0; i < 40; i++) {
    dots.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 3 + 1,
      color: Math.random() > .6 ? '#f0c040' : '#4499ff',
      speed: Math.random() * .6 + .2,
      angle: Math.random() * Math.PI * 2,
    });
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);

    const cx = W / 2, cy = H / 2;

    /* deep background gradient */
    const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * .8);
    bg.addColorStop(0,   'rgba(15,10,40,.95)');
    bg.addColorStop(.5,  'rgba(8,8,20,.97)');
    bg.addColorStop(1,   'rgba(5,5,8,1)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    /* sun glow core */
    const sunR = 60 + Math.sin(t * .001) * 8;
    const sun  = ctx.createRadialGradient(cx, cy, 0, cx, cy, sunR * 3);
    sun.addColorStop(0,   'rgba(240,192,64,.35)');
    sun.addColorStop(.4,  'rgba(240,192,64,.08)');
    sun.addColorStop(1,   'transparent');
    ctx.beginPath();
    ctx.arc(cx, cy, sunR * 3, 0, Math.PI * 2);
    ctx.fillStyle = sun;
    ctx.fill();

    /* inner bright sun */
    const inner = ctx.createRadialGradient(cx, cy, 0, cx, cy, sunR);
    inner.addColorStop(0,  'rgba(255,240,180,.9)');
    inner.addColorStop(.5, 'rgba(240,192,64,.6)');
    inner.addColorStop(1,  'transparent');
    ctx.beginPath();
    ctx.arc(cx, cy, sunR, 0, Math.PI * 2);
    ctx.fillStyle = inner;
    ctx.fill();

    /* rays */
    rays.forEach(ray => {
      ray.angle += ray.speed;
      const x2 = cx + Math.cos(ray.angle) * ray.len;
      const y2 = cy + Math.sin(ray.angle) * ray.len;
      const g = ctx.createLinearGradient(cx, cy, x2, y2);
      g.addColorStop(0, `rgba(240,192,64,${ray.alpha})`);
      g.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = g;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    /* orbit ring */
    ctx.beginPath();
    ctx.arc(cx, cy, 130 + Math.sin(t * .0008) * 10, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(240,192,64,.06)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, 210 + Math.cos(t * .0006) * 12, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(240,192,64,.04)';
    ctx.lineWidth = 1;
    ctx.stroke();

    /* stars */
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.a += p.da;
      if (p.a < 0) p.da = Math.abs(p.da);
      if (p.a > 1) p.da = -Math.abs(p.da);
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220,220,255,${p.a * .7})`;
      ctx.fill();
    });

    /* energy dots */
    dots.forEach(d => {
      d.angle += d.speed * .01;
      d.x += Math.cos(d.angle) * d.speed;
      d.y += Math.sin(d.angle) * d.speed;
      if (d.x < -10) d.x = W + 10;
      if (d.x > W + 10) d.x = -10;
      if (d.y < -10) d.y = H + 10;
      if (d.y > H + 10) d.y = -10;
      const dg = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r * 2);
      dg.addColorStop(0,  d.color);
      dg.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r * 2, 0, Math.PI * 2);
      ctx.fillStyle = dg;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();

/* ─── CAR ENERGY PARTICLES ──────────────────────────────────────── */
function spawnParticle() {
  const container = document.getElementById('energyParticles');
  if (!container) return;
  const p = document.createElement('span');
  p.style.cssText = `
    position:absolute;
    width:4px;height:4px;border-radius:50%;
    background:#f0c040;
    box-shadow:0 0 6px #f0c040;
    left:${Math.random()*100}%;
    top:${Math.random()*100}%;
    --tx:${(Math.random()-0.5)*60}px;
    --ty:${-(Math.random()*50+20)}px;
    animation:particleFly ${.6+Math.random()*.8}s ease-out forwards;
    pointer-events:none;
  `;
  container.appendChild(p);
  setTimeout(() => p.remove(), 1400);
}
setInterval(spawnParticle, 180);

/* ─── PERCENTAGE COUNTER ANIMATION ─────────────────────────────── */
function animatePercent(target = 30) {
  const el = document.getElementById('pctVal');
  if (!el) return;
  let n = 0;
  const step = () => {
    n = Math.min(n + 1, target);
    el.textContent = n;
    if (n < target) setTimeout(step, 40);
  };
  step();
}
let pctDone = false;
function checkPct() {
  const el = document.getElementById('pctVal');
  if (!el || pctDone) return;
  const rect = el.closest('.solar-car-wrap')?.getBoundingClientRect();
  if (rect && rect.top < window.innerHeight * .8) { animatePercent(30); pctDone = true; }
}
window.addEventListener('scroll', checkPct, { passive: true });

/* ─── STATS COUNTER ─────────────────────────────────────────────── */
function animateCount(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1600;
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.round(ease * target).toLocaleString('de-DE');
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

/* ─── INTERSECTION OBSERVER UTILITIES ──────────────────────────── */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;

    const el = e.target;

    /* Section labels */
    if (el.classList.contains('section-label')) {
      el.classList.add('visible');
      io.unobserve(el);
      return;
    }

    /* Reveal texts */
    if (el.classList.contains('reveal-text')) {
      el.classList.add('visible');
      io.unobserve(el);
      return;
    }

    /* Problem / sustain cards with delay */
    if (el.classList.contains('problem-card') || el.classList.contains('sustain-card')) {
      const delay = parseFloat(el.dataset.delay || 0) * 1000;
      setTimeout(() => el.classList.add('visible'), delay);
      io.unobserve(el);
      return;
    }

    /* Feature cards */
    if (el.classList.contains('feature-card')) {
      const delay = parseInt(el.dataset.index || 0) * 120;
      setTimeout(() => el.classList.add('visible'), delay);
      io.unobserve(el);
      return;
    }

    /* Steps */
    if (el.classList.contains('step')) {
      el.classList.add('visible');
      io.unobserve(el);
      return;
    }

    /* Stat items */
    if (el.classList.contains('stat-item')) {
      el.classList.add('visible');
      const num = el.querySelector('.stat-num');
      if (num) animateCount(num);
      io.unobserve(el);
      return;
    }

    /* Market cards */
    if (el.classList.contains('market-card')) {
      const delay = el.classList.contains('b2b') ? 200 : 0;
      setTimeout(() => el.classList.add('visible'), delay);
      io.unobserve(el);
      return;
    }

    /* Price cards */
    if (el.classList.contains('price-card')) {
      const delay = parseFloat(el.dataset.delay || 0) * 1000;
      setTimeout(() => el.classList.add('visible'), delay);
      io.unobserve(el);
      return;
    }

    /* Roadmap items */
    if (el.classList.contains('rm-item')) {
      const idx = parseInt(el.dataset.rm || 1) - 1;
      setTimeout(() => el.classList.add('visible'), idx * 180);
      io.unobserve(el);
      return;
    }

    /* Compare table */
    if (el.classList.contains('compare-table')) {
      el.classList.add('visible');
      io.unobserve(el);
      return;
    }

    /* Bullet items */
    if (el.classList.contains('bullet-item')) {
      el.classList.add('visible');
      io.unobserve(el);
      return;
    }
  });
}, { threshold: 0.15 });

/* ─── OBSERVE ALL ANIMATED ELEMENTS ──────────────────────────────  */
function observeAll() {
  document.querySelectorAll(
    '.section-label, .reveal-text, .problem-card, .feature-card, ' +
    '.step, .stat-item, .market-card, .price-card, .rm-item, ' +
    '.compare-table, .sustain-card, .bullet-item'
  ).forEach(el => io.observe(el));
}
observeAll();

/* ─── GSAP SCROLL ANIMATIONS ────────────────────────────────────── */
gsap.registerPlugin(ScrollTrigger, TextPlugin);

/* Hero content entrance (belt on top of CSS animations) */
gsap.from('.hero-content', { opacity: 0, y: 40, duration: 1.2, ease: 'power3.out', delay: .2 });

/* Product section — text slides in from left, visual from right */
gsap.from('.product-text-panel', {
  scrollTrigger: { trigger: '.product-section', start: 'top 70%' },
  x: -60, opacity: 0, duration: 1, ease: 'power3.out',
});
gsap.from('.product-visual-panel', {
  scrollTrigger: { trigger: '.product-section', start: 'top 70%' },
  x: 60, opacity: 0, duration: 1, ease: 'power3.out', delay: .2,
});

/* Bullet items stagger */
gsap.from('.bullet-item', {
  scrollTrigger: { trigger: '.product-text-panel', start: 'top 60%' },
  x: -30, opacity: 0, duration: .6, stagger: .12, ease: 'power2.out', delay: .4,
  onComplete() {
    document.querySelectorAll('.bullet-item').forEach(el => el.classList.add('visible'));
  }
});

/* Steps — stagger from left */
gsap.from('.step', {
  scrollTrigger: { trigger: '.steps-wrap', start: 'top 70%' },
  x: -50, opacity: 0, duration: .8, stagger: .2, ease: 'power3.out',
});

/* Steps progress bar via scroll */
ScrollTrigger.create({
  trigger: '.steps-wrap',
  start: 'top center',
  end: 'bottom center',
  onUpdate(self) {
    const bar = document.getElementById('stepsProgress');
    if (bar) bar.style.height = (self.progress * 100) + '%';
  }
});

/* Pricing cards 3D tilt on hover */
document.querySelectorAll('.price-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - .5;
    const y = (e.clientY - rect.top)  / rect.height - .5;
    card.style.transform = `perspective(600px) rotateY(${x*8}deg) rotateX(${-y*8}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'none';
  });
});

/* Feature card tilt */
document.querySelectorAll('.feature-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - .5;
    const y = (e.clientY - rect.top)  / rect.height - .5;
    card.style.transform = `perspective(700px) rotateY(${x*6}deg) rotateX(${-y*6}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'none';
  });
});

/* ─── HORIZONTAL TEXT REVEAL ────────────────────────────────────── */
document.querySelectorAll('.reveal-text').forEach(el => {
  gsap.from(el, {
    scrollTrigger: { trigger: el, start: 'top 80%' },
    y: 50, opacity: 0, duration: .9, ease: 'power3.out',
    onStart() { el.classList.add('visible'); }
  });
});

/* ─── TAGLINE STRIP parallax ────────────────────────────────────── */
gsap.to('.tagline-track', {
  scrollTrigger: {
    trigger: '.tagline-section',
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
  },
  x: '-=50',
});

/* ─── NAVBAR SCROLL BEHAVIOR ────────────────────────────────────── */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  nav?.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ─── HAMBURGER MENU ────────────────────────────────────────────── */
const hamburger    = document.getElementById('hamburger');
const mobileMenu   = document.getElementById('mobileMenu');

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
  const btn     = e.target.querySelector('.btn-text');
  btn.textContent = 'Se trimite…';
  setTimeout(() => {
    btn.textContent = 'Trimite mesajul';
    e.target.reset();
    if (success) success.classList.add('show');
    setTimeout(() => success?.classList.remove('show'), 5000);
  }, 1200);
}

/* ─── SMOOTH ANCHOR SCROLLING ───────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ─── PARALLAX on mouse move (Hero) ────────────────────────────── */
document.addEventListener('mousemove', (e) => {
  const xR = (e.clientX / window.innerWidth  - .5) * 2;
  const yR = (e.clientY / window.innerHeight - .5) * 2;
  const hero = document.querySelector('.hero-content');
  if (hero) {
    hero.style.transform = `translate(${xR * 8}px, ${yR * 5}px)`;
  }
});

/* ─── SCROLL-LINKED SOLAR CAR COLOR ────────────────────────────── */
ScrollTrigger.create({
  trigger: '.product-section',
  start: 'top center',
  end: 'bottom center',
  onUpdate(self) {
    const glow = document.querySelector('.solar-glow');
    if (glow) {
      const alpha = .2 + self.progress * .6;
      glow.style.opacity = alpha;
    }
  }
});

/* ─── GSAP NUMBER COUNT for stats (fallback) ────────────────────── */
document.querySelectorAll('.stat-num').forEach(el => {
  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    once: true,
    onEnter() {
      gsap.from({ val: 0 }, {
        val: parseInt(el.dataset.target, 10),
        duration: 1.8,
        ease: 'power2.out',
        onUpdate() { el.textContent = Math.round(this.targets()[0].val).toLocaleString('de-DE'); }
      });
    }
  });
});

/* ─── SECTION ENTRANCE via GSAP ─────────────────────────────────── */
gsap.utils.toArray('.problem-section, .features-section, .market-section, .sustainability-section').forEach(section => {
  gsap.from(section.querySelector('h2'), {
    scrollTrigger: { trigger: section, start: 'top 75%' },
    y: 40, opacity: 0, duration: .9, ease: 'power3.out',
  });
});

/* ─── CONTACT SECTION entrance ──────────────────────────────────── */
gsap.from('.contact-form', {
  scrollTrigger: { trigger: '.contact-section', start: 'top 70%' },
  y: 50, opacity: 0, duration: 1, ease: 'power3.out', delay: .3,
});

/* ─── ROADMAP progress glow on dots ─────────────────────────────── */
document.querySelectorAll('.rm-dot').forEach((dot, i) => {
  ScrollTrigger.create({
    trigger: dot,
    start: 'top 75%',
    once: true,
    onEnter() {
      setTimeout(() => {
        dot.style.boxShadow = '0 0 20px rgba(240,192,64,.8), 0 0 40px rgba(240,192,64,.3)';
      }, i * 200);
    }
  });
});

console.log('%cVOLT Solar Skin — by VOLT', 'color:#f0c040;font-weight:800;font-size:18px;');
