/* Бударова-керамика — весь скрипт сайта.
   Три вещи: мобильное меню, фильтры каталога, галерея работы, закреплённая связь. */
(function () {
  'use strict';

  /* ── Мобильное меню ── */
  var toggle = document.querySelector('.nav-toggle');
  var panel = document.getElementById('nav-panel');
  if (toggle && panel) {
    var close = panel.querySelector('[data-close]');
    var open = function () {
      panel.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      var first = panel.querySelector('a, button');
      if (first) first.focus();
    };
    var shut = function () {
      panel.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      toggle.focus();
    };
    toggle.addEventListener('click', open);
    if (close) close.addEventListener('click', shut);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) shut();
    });
  }

  /* ── Фильтры каталога ── */
  var chips = document.querySelectorAll('[data-filter]');
  var cards = document.querySelectorAll('[data-cat]');
  var empty = document.querySelector('.catalog-empty');
  if (chips.length && cards.length) {
    var apply = function (value) {
      var shown = 0;
      cards.forEach(function (card) {
        var match = value === 'all' || card.dataset.cat === value;
        card.hidden = !match;
        if (match) shown++;
      });
      if (empty) empty.hidden = shown > 0;
    };
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) {
          c.setAttribute('aria-pressed', String(c === chip));
        });
        apply(chip.dataset.filter);
        try {
          var url = new URL(window.location.href);
          if (chip.dataset.filter === 'all') url.searchParams.delete('c');
          else url.searchParams.set('c', chip.dataset.filter);
          history.replaceState(null, '', url);
        } catch (e) { /* адресная строка не критична */ }
      });
    });
    /* восстановление фильтра из адреса: ссылка «смотреть триподы» ведёт сюда */
    try {
      var want = new URL(window.location.href).searchParams.get('c');
      if (want) {
        var target = document.querySelector('[data-filter="' + CSS.escape(want) + '"]');
        if (target) target.click();
      }
    } catch (e) { /* пусто */ }
  }

  /* ── Галерея работы ── */
  var main = document.querySelector('.gallery-main img');
  var thumbs = document.querySelectorAll('.gallery-thumb');
  if (main && thumbs.length > 1) {
    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        main.src = thumb.dataset.src;
        main.srcset = thumb.dataset.srcset;
        main.alt = thumb.dataset.alt || main.alt;
        thumbs.forEach(function (t) {
          t.setAttribute('aria-current', String(t === thumb));
        });
      });
    });
  }

  /* ── Закреплённая связь: появляется после первого экрана ── */
  var cta = document.querySelector('.sticky-cta');
  if (cta && 'IntersectionObserver' in window) {
    var sentinel = document.querySelector('[data-cta-sentinel]');
    if (sentinel) {
      new IntersectionObserver(function (entries) {
        cta.classList.toggle('is-visible', !entries[0].isIntersecting);
      }, { rootMargin: '0px' }).observe(sentinel);
    }
  }
})();
