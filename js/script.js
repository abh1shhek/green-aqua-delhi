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
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
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

  // Contact form removed — social links now live in the Connect With Us panel