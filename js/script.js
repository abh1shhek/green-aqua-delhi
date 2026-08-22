/* ============================================================
     PAGE-LOAD TRANSITION
     Fades the whole page in once fonts/layout have settled, and
     kicks off the hero zoom-out a beat later for a composed entry.
  ============================================================ */
/* ============================================================
   LENIS SMOOTH SCROLL
============================================================ */
let lenis;
if(typeof Lenis !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false
  });

  const raf = (time) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);

  // Make in-page nav links (Gallery, About, etc.) scroll smoothly too
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if(target){
        e.preventDefault();
        lenis.scrollTo(target, { offset: -80 });
      }
    });
  });
}
  document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');
    requestAnimationFrame(() => {
      setTimeout(() => heroBg && heroBg.classList.add('in'), 120);
    });
  });

  /* ============================================================
     MOBILE NAV TOGGLE
  ============================================================ */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('open');
});
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

  /* ============================================================
     HEADER FROSTED-GLASS STATE ON SCROLL
  ============================================================ */
  const siteHeader = document.getElementById('siteHeader');
  const onScroll = () => siteHeader.classList.toggle('scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ============================================================
     SCROLL-TRIGGERED REVEALS (staggered per section)
  ============================================================ */
  const revealGroups = new Map();
  document.querySelectorAll('.reveal').forEach(el => {
    const parent = el.parentElement;
    const index = revealGroups.get(parent) || 0;
    el.style.setProperty('--reveal-delay', `${Math.min(index * 90, 360)}ms`);
    revealGroups.set(parent, index + 1);
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ============================================================
     HERO ZOOM-OUT + MOUSE-TRACKING PARALLAX
     The background image starts zoomed and gently settles; once
     settled it drifts opposite the cursor for a subtle depth cue.
  ============================================================ */
  const heroSection = document.querySelector('.hero');
  const heroBg = document.querySelector('.hero-bg');
  if (heroSection && heroBg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    heroSection.addEventListener('pointermove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * 100;
      const my = ((e.clientY - rect.top) / rect.height) * 100;
      heroBg.style.setProperty('--mx', `${mx}%`);
      heroBg.style.setProperty('--my', `${my}%`);
    });
    heroSection.addEventListener('pointerleave', () => {
      heroBg.style.setProperty('--mx', `50%`);
      heroBg.style.setProperty('--my', `50%`);
    });
  }

  /* ============================================================
     MAGNETIC BUTTONS
     Nudges nav links, pills, and social buttons a few pixels
     toward the cursor while it's nearby, springing back on exit.
  ============================================================ */
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.magnetic').forEach(el => {
      const strength = 0.28;
      el.addEventListener('pointermove', (e) => {
        const rect = el.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width / 2)) * strength;
        const dy = (e.clientY - (rect.top + rect.height / 2)) * strength;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = 'translate(0, 0)'; });
    });
  }

  /* ============================================================
     WHAT WE OFFER — TABBED SHOWCASE
  ============================================================ */
  const offerData = [
    {
      title: "Aquascaping",
      desc: "From Iwagumi to Dutch-style layouts, we design, build, and maintain custom aquascapes tailored to your space.",
      img: "assets/aquascape-showcase.jpg"
    },
    {
      title: "Aquatic Plants",
      desc: "Foreground carpets, stem plants, mosses, and rare species — nursery-grown and ready to root in your aquascape.",
      img: "assets/fern_closeup.jpg"
    },
    {
      title: "Premium Livestock",
      desc: "Healthy, vibrant fish and shrimp sourced and quarantined with care — built for community tanks and showcase aquascapes alike.",
      img: "assets/mushroom_macro.jpg"
    }
  ];
  const pills = document.querySelectorAll('.offer-pill');
  const offerBg = document.getElementById('offerBg');
  const offerTitle = document.getElementById('offerTitle');
  const offerDesc = document.getElementById('offerDesc');
  offerBg.style.backgroundImage = `url('${offerData[0].img}')`;
  pills.forEach(p => p.addEventListener('click', () => {
    pills.forEach(x => x.classList.remove('active'));
    p.classList.add('active');
    const d = offerData[p.dataset.tab];
    offerBg.style.opacity = 0;
    setTimeout(() => {
      offerBg.style.backgroundImage = `url('${d.img}')`;
      offerTitle.textContent = d.title;
      offerDesc.textContent = d.desc;
      offerBg.style.opacity = 1;
    }, 250);
  }));
(function(){
  const el = document.getElementById('circularText');
  if(!el) return;
  const text = el.dataset.text || '';
  const letters = Array.from(text);
  const radius = 62;

  const probe = document.createElement('span');
  probe.style.cssText = 'position:absolute;visibility:hidden;white-space:pre;font-family:var(--display);font-weight:700;font-size:0.85rem;';
  document.body.appendChild(probe);

  const measure = (str) => {
    probe.textContent = str.replace(/ /g, '\u00A0');
    return probe.getBoundingClientRect().width;
  };

  // measure cumulative width up to each letter, so real kerning between pairs is captured
  const prefixWidths = [0];
  for (let i = 1; i <= letters.length; i++) {
    prefixWidths.push(measure(letters.slice(0, i).join('')));
  }
  const totalWidth = prefixWidths[letters.length];
  document.body.removeChild(probe);

  letters.forEach((letter, i) => {
    const center = (prefixWidths[i] + prefixWidths[i + 1]) / 2;
    const angle = (center / totalWidth) * 360;

    const span = document.createElement('span');
    span.textContent = letter;
    span.style.transform = `rotate(${angle}deg) translate(${radius}px) rotate(90deg)`;
    el.appendChild(span);
  });
})();
(function(){
  ['col1', 'col2', 'col3'].forEach(id => {
    const track = document.getElementById(id);
    if(!track) return;
    track.innerHTML += track.innerHTML;
  });

  document.querySelectorAll('.review-card').forEach(card => {
    card.addEventListener('click', () => {
      const wasActive = card.classList.contains('is-active');
      document.querySelectorAll('.review-card.is-active').forEach(c => c.classList.remove('is-active'));
      document.querySelectorAll('.reviews-column.is-paused').forEach(col => col.classList.remove('is-paused'));

      if(!wasActive){
        card.classList.add('is-active');
        const column = card.closest('.reviews-column');
        if(column) column.classList.add('is-paused');
      }
    });
  });
})();
(function(){
  const canvas = document.getElementById('siteParticles');
  if(!canvas) return;
  if(!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  let w, h;
  let particles = [];
  const colors = ['125,214,168', '198,168,110'];
  const mouse = { x:-999, y:-999, active:false };
  let lastSpawn = 0;

  const resize = () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('pointermove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;

    const now = performance.now();
    if(now - lastSpawn > 28){
      lastSpawn = now;
      const count = Math.random() < 0.5 ? 1 : 2;
      for(let i = 0; i < count; i++){
        particles.push({
          x: mouse.x + (Math.random() * 10 - 5),
          y: mouse.y + (Math.random() * 10 - 5),
          r: Math.random() * 2.6 + 1.6,
          vx: (Math.random() * 0.6 - 0.3),
          vy: -(Math.random() * 0.5 + 0.3),
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 1,
          decay: Math.random() * 0.012 + 0.01
        });
      }
    }
  });
  window.addEventListener('pointerleave', () => { mouse.active = false; });

  document.addEventListener('click', (e) => {
    const count = 16;
    for(let i = 0; i < count; i++){
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
      const speed = Math.random() * 2.4 + 1.4;
      particles.push({
        x: e.clientX,
        y: e.clientY,
        r: Math.random() * 2.8 + 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
        decay: Math.random() * 0.018 + 0.016
      });
    }
  });

  const tick = () => {
    ctx.clearRect(0, 0, w, h);

    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => {
      p.vy -= 0.006;
      p.vx *= 0.98;
      p.vy *= 0.98;
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * Math.max(p.life, 0), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.life * 0.85})`;
      ctx.shadowColor = `rgba(${p.color},${p.life * 0.6})`;
      ctx.shadowBlur = p.r * 3;
      ctx.fill();
    });

    ctx.shadowBlur = 0;
    requestAnimationFrame(tick);
  };
  tick();
})();
/* ============================================================
   NAV DOCK MAGNIFICATION
   Links grow and lift slightly as the cursor nears them,
   echoing a macOS-dock-style proximity effect.
============================================================ */
if(window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
   !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  const navLinksEl = document.getElementById('navLinks');
  if(navLinksEl){
    const dockLinks = navLinksEl.querySelectorAll('.dock-link');
    const PROXIMITY = 110;
    const MAX_SCALE = 1.16;
    const MAX_LIFT = 5;

    navLinksEl.addEventListener('pointermove', (e) => {
      dockLinks.forEach(link => {
        const rect = link.getBoundingClientRect();
        const center = rect.left + rect.width / 2;
        const dist = Math.abs(e.clientX - center);
        const influence = Math.max(0, 1 - dist / PROXIMITY);
        const scale = 1 + influence * (MAX_SCALE - 1);
        const lift = influence * MAX_LIFT;
        link.style.transform = `translateY(-${lift}px) scale(${scale})`;
      });
    });

    navLinksEl.addEventListener('pointerleave', () => {
      dockLinks.forEach(link => { link.style.transform = ''; });
    });
  }
}
