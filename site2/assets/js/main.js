/* PINE & PALM MGMT — Draft v2 */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Header: scrolled / inverted over hero ---------- */
  var header = $('#siteHeader');
  var hero = $('.hero');
  var updateHeader = function () {
    if (!header) return;
    var y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 16);
    if (hero) {
      var heroBottom = hero.getBoundingClientRect().bottom;
      header.classList.toggle('is-inverted', heroBottom > 56 && y <= 16);
    }
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
  window.addEventListener('resize', updateHeader);

  /* ---------- Current nav ---------- */
  var page = document.body.getAttribute('data-page');
  $$('[data-nav]').forEach(function (a) { a.classList.toggle('is-current', a.getAttribute('data-nav') === page); });

  /* ---------- Mobile nav ---------- */
  var toggle = $('#navToggle');
  var nav = $('#mainNav');
  var closeNav = function () {
    if (!nav) return;
    nav.classList.remove('is-open');
    document.body.classList.remove('nav-open');
    if (toggle) { toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', '메뉴 열기'); }
  };
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      document.body.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', closeNav); });
    window.addEventListener('resize', function () { if (window.innerWidth > 1024) closeNav(); });
  }

  /* ---------- Reveal ---------- */
  var revealEls = $$('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-visible'); rio.unobserve(e.target); } });
    }, { threshold: .08, rootMargin: '0px 0px -4% 0px' });
    revealEls.forEach(function (el) { rio.observe(el); });
  } else { revealEls.forEach(function (el) { el.classList.add('is-visible'); }); }

  /* ---------- Framework steps (click / hover / scroll on desktop) ---------- */
  var steps = $$('.step');
  if (steps.length) {
    var imgs = $$('[data-step-img]');
    var cap = $('#stepCap');
    var mq = window.matchMedia('(min-width: 641px)');
    var activate = function (i) {
      steps.forEach(function (s, j) { s.classList.toggle('is-active', j === i); });
      imgs.forEach(function (im, j) { im.classList.toggle('is-active', j === i); });
      if (cap) cap.textContent = steps[i].getAttribute('data-name') || '';
    };
    steps.forEach(function (s, i) {
      s.addEventListener('click', function () { activate(i); });
      s.addEventListener('mouseenter', function () { if (mq.matches) activate(i); });
    });
    // gentle auto-advance until the user interacts
    var idx = 0, timer = null, interacted = false;
    var startAuto = function () {
      if (timer || interacted || !mq.matches) return;
      timer = setInterval(function () { idx = (idx + 1) % steps.length; activate(idx); }, 3200);
    };
    var stopAuto = function () { interacted = true; if (timer) { clearInterval(timer); timer = null; } };
    steps.forEach(function (s) { s.addEventListener('mouseenter', stopAuto); s.addEventListener('click', stopAuto); });
    if ('IntersectionObserver' in window) {
      var fio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) startAuto(); else if (timer) { clearInterval(timer); timer = null; } });
      }, { threshold: .4 });
      var fw = $('.framework'); if (fw) fio.observe(fw);
    }
  }

  /* ---------- Accordion ---------- */
  $$('.accordion').forEach(function (acc) {
    var items = $$('.acc-item', acc);
    var setOpen = function (item, open) {
      var btn = $('.acc-trigger', item), panel = $('.acc-panel', item);
      item.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      panel.style.maxHeight = open ? panel.scrollHeight + 'px' : '0px';
    };
    var refresh = function () { items.forEach(function (i) { if (i.classList.contains('is-open')) { var p = $('.acc-panel', i); p.style.maxHeight = p.scrollHeight + 'px'; } }); };
    items.forEach(function (item) {
      setOpen(item, item.classList.contains('is-open'));
      $('.acc-trigger', item).addEventListener('click', function () {
        var willOpen = !item.classList.contains('is-open');
        items.forEach(function (o) { if (o !== item) setOpen(o, false); });
        setOpen(item, willOpen);
      });
    });
    window.addEventListener('resize', refresh);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
  });

  /* ---------- Carousel controls ---------- */
  $$('[data-carousel]').forEach(function (wrap) {
    var track = $('.carousel, .jrow, .ugc', wrap);
    if (!track) return;
    var step = function () { var first = track.firstElementChild; return first ? first.getBoundingClientRect().width + 16 : 320; };
    $$('[data-prev]', wrap).forEach(function (b) { b.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); }); });
    $$('[data-next]', wrap).forEach(function (b) { b.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); }); });
  });

  /* ---------- Count-up ---------- */
  var counters = $$('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        cio.unobserve(e.target);
        var el = e.target, end = parseFloat(el.getAttribute('data-count')), suf = el.getAttribute('data-suffix') || '', dur = 1400, t0 = null;
        var tick = function (t) { if (t0 === null) t0 = t; var p = Math.min(1, (t - t0) / dur); var ease = 1 - Math.pow(1 - p, 3); el.textContent = Math.round(end * ease) + suf; if (p < 1) requestAnimationFrame(tick); };
        requestAnimationFrame(tick);
      });
    }, { threshold: .5 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ---------- Creator filter ---------- */
  var filters = $$('.filter');
  if (filters.length) {
    var cards = $$('.cgrid > *');
    filters.forEach(function (f) {
      f.addEventListener('click', function () {
        filters.forEach(function (o) { o.classList.toggle('is-active', o === f); });
        var cat = f.getAttribute('data-filter');
        cards.forEach(function (c) {
          var cats = (c.getAttribute('data-cat') || '').split(' ');
          var show = cat === 'all' || cats.indexOf(cat) !== -1 || c.classList.contains('moment');
          c.classList.toggle('hidden', !show);
        });
      });
    });
  }

  /* ---------- Modal ---------- */
  var modal = $('#deckModal');
  if (modal) {
    var lastFocus = null;
    var openModal = function () {
      lastFocus = document.activeElement;
      modal.classList.add('is-open'); modal.setAttribute('aria-hidden', 'false'); document.body.classList.add('modal-open'); closeNav();
      setTimeout(function () { var f = $('input', modal); if (f) f.focus(); }, 80);
    };
    var closeModal = function () {
      modal.classList.remove('is-open'); modal.setAttribute('aria-hidden', 'true'); document.body.classList.remove('modal-open');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };
    $$('[data-deck]').forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); openModal(); }); });
    $$('[data-close]', modal).forEach(function (b) { b.addEventListener('click', closeModal); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal(); });
  }

  /* ---------- Forms (draft: front-end only) ---------- */
  $$('form[data-form]').forEach(function (form) {
    form.setAttribute('novalidate', '');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        var first = $(':invalid', form); if (first) { first.focus(); if (first.reportValidity) first.reportValidity(); }
        return;
      }
      var wrap = form.closest('[data-form-wrap]') || form.parentElement;
      var success = $('.form-success', wrap);
      form.hidden = true;
      if (success) { success.hidden = false; if (!modal || !modal.contains(form)) success.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    });
  });

  /* ---------- Contact: preselect from query ---------- */
  try {
    var params = new URLSearchParams(window.location.search);
    var interest = params.get('interest');
    if (interest) { var cb = $('input[name="interest"][value="' + interest + '"]'); if (cb) cb.checked = true; }
  } catch (err) { /* noop */ }
})();
