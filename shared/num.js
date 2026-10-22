/* Numerology LP: keep the floating buttons out of the hero, and move the pain-card rail on phones. */
(() => {
  'use strict';
  const set = () => document.body.classList.toggle('n-top', scrollY < 480);
  set(); addEventListener('scroll', set, { passive: true });
})();
