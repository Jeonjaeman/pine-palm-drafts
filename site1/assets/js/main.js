/* PINE & PALM MGMT — Draft v1 */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Header state ---------- */
  var header = $('#siteHeader');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 24); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Current nav ---------- */
  var page = document.body.getAttribute('data-page');
  $$('[data-nav]').forEach(function (a) {
    a.classList.toggle('is-current', a.getAttribute('data-nav') === page);
  });

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

  /* ---------- Reveal on scroll ---------- */
  var revealEls = $$('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); rio.unobserve(e.target); }
      });
    }, { threshold: .1, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { rio.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Approach: 5-step scroll / hover sync ---------- */
  var steps = $$('.approach-step');
  if (steps.length) {
    var imgs = $$('[data-step-img]');
    var num = $('#approachNum');
    var name = $('#approachName');
    var mq = window.matchMedia('(min-width: 641px)');
    var activate = function (i) {
      steps.forEach(function (s, j) { s.classList.toggle('is-active', j === i); });
      imgs.forEach(function (im, j) { im.classList.toggle('is-active', j === i); });
      if (num) num.textContent = (i + 1 < 10 ? '0' : '') + (i + 1);
      if (name) name.textContent = steps[i].getAttribute('data-name') || '';
    };
    if ('IntersectionObserver' in window) {
      var sio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && mq.matches) activate(steps.indexOf(e.target));
        });
      }, { rootMargin: '-38% 0px -47% 0px', threshold: 0 });
      steps.forEach(function (s) { sio.observe(s); });
    }
    steps.forEach(function (s) {
      s.addEventListener('mouseenter', function () { if (mq.matches) activate(steps.indexOf(s)); });
      s.addEventListener('click', function () { activate(steps.indexOf(s)); });
    });
  }

  /* ---------- Accordion (Why Pine & Palm) ---------- */
  $$('.accordion').forEach(function (acc) {
    var items = $$('.acc-item', acc);
    var setOpen = function (item, open) {
      var btn = $('.acc-trigger', item);
      var panel = $('.acc-panel', item);
      item.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      panel.style.maxHeight = open ? panel.scrollHeight + 'px' : '0px';
    };
    items.forEach(function (item) {
      setOpen(item, item.classList.contains('is-open'));
      $('.acc-trigger', item).addEventListener('click', function () {
        var willOpen = !item.classList.contains('is-open');
        items.forEach(function (o) { if (o !== item) setOpen(o, false); });
        setOpen(item, willOpen);
      });
    });
    window.addEventListener('resize', function () {
      items.forEach(function (i) {
        if (i.classList.contains('is-open')) { var p = $('.acc-panel', i); p.style.maxHeight = p.scrollHeight + 'px'; }
      });
    });
    // fonts loading can change panel height
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        items.forEach(function (i) {
          if (i.classList.contains('is-open')) { var p = $('.acc-panel', i); p.style.maxHeight = p.scrollHeight + 'px'; }
        });
      });
    }
  });

  /* ---------- Count-up metrics ---------- */
  var counters = $$('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        cio.unobserve(e.target);
        var el = e.target;
        var end = parseFloat(el.getAttribute('data-count'));
        var suf = el.getAttribute('data-suffix') || '';
        var dur = 1500;
        var t0 = null;
        var tick = function (t) {
          if (t0 === null) t0 = t;
          var p = Math.min(1, (t - t0) / dur);
          var ease = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(end * ease) + suf;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: .5 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ---------- Service Deck modal ---------- */
  var modal = $('#deckModal');
  if (modal) {
    var lastFocus = null;
    var openModal = function () {
      lastFocus = document.activeElement;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      closeNav();
      setTimeout(function () { var f = $('input', modal); if (f) f.focus(); }, 80);
    };
    var closeModal = function () {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };
    $$('[data-deck]').forEach(function (b) {
      b.addEventListener('click', function (e) { e.preventDefault(); openModal(); });
    });
    $$('[data-close]', modal).forEach(function (b) { b.addEventListener('click', closeModal); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });
  }

  /* ---------- Forms (draft: front-end only) ---------- */
  $$('form[data-form]').forEach(function (form) {
    form.setAttribute('novalidate', '');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        var first = $(':invalid', form);
        if (first) { first.focus(); if (first.reportValidity) first.reportValidity(); }
        return;
      }
      var wrap = form.closest('[data-form-wrap]') || form.parentElement;
      var success = $('.form-success', wrap);
      form.hidden = true;
      if (success) {
        success.hidden = false;
        if (!modal || !modal.contains(form)) success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  /* ---------- Contact: preselect interest from query ---------- */
  try {
    var params = new URLSearchParams(window.location.search);
    var interest = params.get('interest');
    if (interest) {
      var cb = $('input[name="interest"][value="' + interest + '"]');
      if (cb) cb.checked = true;
    }
  } catch (err) { /* noop */ }
})();
