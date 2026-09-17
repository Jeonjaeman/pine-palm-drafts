/* PINE & PALM MGMT — site3 (multi-page) */
(function () {
  'use strict';
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  /* ---------- Navbar ---------- */
  const navbar = $('#navbar');
  const hasHero = !!$('.hero, .page-hero');
  const setNav = () => { if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50 || !hasHero); };
  setNav();
  window.addEventListener('scroll', setNav, { passive: true });

  const page = document.body.dataset.page;
  $$('[data-nav]').forEach(a => a.classList.toggle('active', a.dataset.nav === page));

  /* ---------- Mobile menu ---------- */
  const mobileToggle = $('#mobileToggle');
  const mobileMenu = $('#mobileMenu');
  function closeMobile() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('open'); navbar.classList.remove('open');
    mobileToggle.setAttribute('aria-expanded', 'false'); document.body.style.overflow = '';
  }
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const open = !mobileMenu.classList.contains('open');
      mobileMenu.classList.toggle('open', open); navbar.classList.toggle('open', open);
      mobileToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    $$('a', mobileMenu).forEach(a => a.addEventListener('click', closeMobile));
    window.addEventListener('resize', () => { if (window.innerWidth > 768) closeMobile(); });
  }

  /* ---------- Hero particles ---------- */
  const particlesEl = $('#particles');
  if (particlesEl) {
    for (let i = 0; i < 26; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDuration = (Math.random() * 8 + 8) + 's';
      p.style.animationDelay = (Math.random() * 6) + 's';
      p.style.width = p.style.height = (Math.random() * 4 + 3) + 'px';
      particlesEl.appendChild(p);
    }
  }

  /* ---------- Marquee ---------- */
  const marqueeTrack = $('#marqueeTrack');
  if (marqueeTrack) marqueeTrack.innerHTML += marqueeTrack.innerHTML;

  /* ---------- Scroll reveal ---------- */
  const revealElements = $$('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('active'); revealObserver.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealElements.forEach(el => revealObserver.observe(el));
  } else { revealElements.forEach(el => el.classList.add('active')); }

  /* ---------- Counter band ---------- */
  const counterNumbers = $$('.number[data-target]');
  if (counterNumbers.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target, target = parseInt(el.dataset.target, 10), duration = 2000, start = performance.now();
        const animate = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 4);
          el.textContent = (progress >= 1 ? target : Math.floor(eased * target)).toLocaleString();
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      });
    }, { threshold: 0.5 });
    counterNumbers.forEach(el => counterObserver.observe(el));
  }

  /* ---------- Creator slider ---------- */
  const slider = $('#trainerSlider');
  let trainerPos = 0;
  const visibleCards = () => window.innerWidth <= 768 ? 1 : (window.innerWidth <= 1024 ? 2 : 3);
  window.slideTrainer = function (dir) {
    if (!slider) return;
    const cardWidth = slider.children[0].offsetWidth + 24;
    const maxPos = -(slider.children.length - visibleCards()) * cardWidth;
    trainerPos = Math.max(maxPos, Math.min(0, trainerPos - dir * cardWidth));
    slider.style.transform = `translateX(${trainerPos}px)`;
  };
  if (slider) window.addEventListener('resize', () => { trainerPos = 0; slider.style.transform = ''; });

  /* ---------- Smooth scroll for same-page anchors ---------- */
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - (href === '#top' ? 0 : 70);
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  /* ---------- Scroll handler (progress, back-to-top, hero parallax) ---------- */
  const scrollProgress = $('#scrollProgress');
  const backToTop = $('#backToTop');
  const heroContent = $('.hero-content');
  const heroVideo = $('.hero-video');
  let ticking = false;
  function onScroll() {
    const y = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollProgress) scrollProgress.style.width = (docH > 0 ? (y / docH * 100) : 0) + '%';
    if (backToTop) backToTop.classList.toggle('show', y > 600);
    if (heroContent && y < window.innerHeight) {
      heroContent.style.transform = `translateY(${y * 0.25}px)`;
      heroContent.style.opacity = Math.max(0, 1 - y / (window.innerHeight * 0.7));
      if (heroVideo) heroVideo.style.transform = `scale(1.08) translateY(${y * 0.15}px)`;
    }
    ticking = false;
  }
  window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Magnetic buttons / 3D tilt ---------- */
  $$('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2, y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
  $$('.program-card, .trainer-card, .event-card, .branch-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5, y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-10px) perspective(700px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  /* ---------- Hero stats count-up ---------- */
  function countUpEl(el) {
    const target = parseInt(el.dataset.count, 10), suffix = el.dataset.suffix || '', dur = 1800, start = performance.now();
    const step = now => {
      const p = Math.min((now - start) / dur, 1), eased = 1 - Math.pow(1 - p, 4);
      el.textContent = (p >= 1 ? target : Math.floor(eased * target)) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  window.addEventListener('load', () => { setTimeout(() => $$('.hero-stat .num[data-count]').forEach(countUpEl), 900); });

  /* ---------- Service Deck modal ---------- */
  const deckModal = $('#deckModal');
  if (deckModal) {
    const openDeck = () => { deckModal.classList.add('open'); deckModal.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; closeMobile(); setTimeout(() => { const f = $('input', deckModal); if (f) f.focus(); }, 80); };
    const closeDeck = () => { deckModal.classList.remove('open'); deckModal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; };
    $$('[data-deck]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); openDeck(); }));
    $$('[data-close]', deckModal).forEach(b => b.addEventListener('click', closeDeck));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && deckModal.classList.contains('open')) closeDeck(); });
  }

  /* ---------- Forms (draft: front-end validation + success state) ---------- */
  $$('form[data-form]').forEach(form => {
    form.setAttribute('novalidate', '');
    form.addEventListener('submit', e => {
      e.preventDefault();
      // radio groups inside .choice-group: mark invalid group
      $$('.form-group', form).forEach(g => g.classList.remove('was-invalid'));
      if (!form.checkValidity()) {
        const first = $(':invalid', form);
        if (first) {
          const grp = first.closest('.form-group'); if (grp) grp.classList.add('was-invalid');
          first.focus(); if (first.reportValidity) first.reportValidity();
        }
        return;
      }
      const wrap = form.closest('[data-form-wrap]') || form.parentElement;
      const success = $('.form-success', wrap);
      form.hidden = true;
      if (success) { success.hidden = false; if (!deckModal || !deckModal.contains(form)) success.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    });
  });

  /* ---------- Contact: preselect from query ---------- */
  try {
    const params = new URLSearchParams(window.location.search);
    const interest = params.get('interest');
    if (interest) {
      const cb = $(`input[name="interest"][value="${interest}"]`);
      if (cb) cb.checked = true;
    }
  } catch (err) { /* noop */ }
})();
