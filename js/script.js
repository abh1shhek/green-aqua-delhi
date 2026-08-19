/* ============================================================
     PAGE-LOAD TRANSITION
     Fades the whole page in once fonts/layout have settled, and
     kicks off the hero zoom-out a beat later for a composed entry.
  ============================================================ */
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
  let ambient = [];
  let bursts = [];
  const colors = ['125,214,168', '198,168,110'];
  const mouse = { x:-999, y:-999 };

  const resize = () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  };

  const spawnAmbient = () => {
    const count = Math.min(70, Math.floor((w * h) / 16000));
    ambient = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2.4 + 1.4,
      baseSpeed: Math.random() * 0.4 + 0.2,
      drift: Math.random() * 0.6 - 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.4 + 0.3,
      vx: 0, vy: 0
    }));
  };

  resize();
  spawnAmbient();
  window.addEventListener('resize', () => { resize(); spawnAmbient(); });

  window.addEventListener('pointermove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('pointerleave', () => { mouse.x = -999; mouse.y = -999; });

  // Click burst on interactive elements
  document.addEventListener('click', (e) => {
    const target = e.target.closest('button, a, .pill, .review-card__toggle, .offer-pill');
    if(!target) return;
    const count = 18;
    for(let i = 0; i < count; i++){
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
      const speed = Math.random() * 2.6 + 1.6;
      bursts.push({
        x: e.clientX,
        y: e.clientY,
        r: Math.random() * 2.5 + 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
        decay: Math.random() * 0.02 + 0.018
      });
    }
  });

  const drawParticle = (x, y, r, colorRgb, alpha) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${colorRgb},${alpha})`;
    ctx.shadowColor = `rgba(${colorRgb},${alpha * 0.8})`;
    ctx.shadowBlur = r * 2.5;
    ctx.fill();
  };

  const tick = () => {
    ctx.clearRect(0, 0, w, h);

    ambient.forEach(p => {
      const dx = p.x - mouse.x, dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const pushRadius = 140;
      if(dist < pushRadius){
        const force = (1 - dist / pushRadius) * 2.2;
        p.vx += (dx / (dist || 1)) * force;
        p.vy += (dy / (dist || 1)) * force;
      }
      p.vx *= 0.92;
      p.vy *= 0.92;
      p.x += p.vx + p.drift * 0.15;
      p.y += p.vy - p.baseSpeed;

      if(p.y < -10){ p.y = h + 10; p.x = Math.random() * w; }
      if(p.x < -10) p.x = w + 10;
      if(p.x > w + 10) p.x = -10;

      drawParticle(p.x, p.y, p.r, p.color, p.alpha);
    });

    bursts = bursts.filter(b => b.life > 0);
    bursts.forEach(b => {
      b.x += b.vx;
      b.y += b.vy;
      b.vx *= 0.94;
      b.vy *= 0.94;
      b.life -= b.decay;
      drawParticle(b.x, b.y, b.r * b.life, b.color, b.life * 0.9);
    });

    ctx.shadowBlur = 0;
    requestAnimationFrame(tick);
  };
  tick();
})();
