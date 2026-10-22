/* Numerology LP: keep the floating buttons out of the hero, and move the pain-card rail on phones. */
(() => {
  'use strict';
  const set = () => document.body.classList.toggle('n-top', scrollY < 480);
  set(); addEventListener('scroll', set, { passive: true });
})();
/* Birth-date tool: root number (mulank) from the day, destiny number (bhagyank) from every digit of the full date, each reduced to 1-9.
   Planet names follow the Lo Shu grid shown on the page. Nothing leaves the browser. */
(() => {
  'use strict';
  const box = document.querySelector('[data-calc]');
  if (!box) return;
  const P = { 1: 'Sun', 2: 'Moon', 3: 'Jupiter', 4: 'Rahu', 5: 'Mercury', 6: 'Venus', 7: 'Ketu', 8: 'Shani', 9: 'Mangal' };
  const red = (n) => { while (n > 9) n = String(n).split('').reduce((a, d) => a + Number(d), 0); return n; };
  const form = box.querySelector('form'), inp = box.querySelector('input'), out = box.querySelector('.n-calc-out'), err = box.querySelector('.n-calc-err');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = inp.value;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) { err.textContent = 'Please choose your birth date.'; inp.focus(); return; }
    err.textContent = '';
    const [y, m, d] = v.split('-');
    const mul = red(Number(d));
    const bh = red((d + m + y).split('').reduce((a, c) => a + Number(c), 0));
    box.querySelector('[data-mul]').textContent = mul; box.querySelector('[data-mulp]').textContent = P[mul];
    box.querySelector('[data-bh]').textContent = bh; box.querySelector('[data-bhp]').textContent = P[bh];
    out.hidden = false;
    document.querySelectorAll('.na-grid span').forEach((s) => s.classList.toggle('is-hit', [mul, bh].includes(parseInt(s.textContent, 10))));
    window.dataLayer?.push({ event: 'numerology_tool', root_number: mul, destiny_number: bh });
  });
})();
/* Option tiles: tapping anywhere on a tile opens the form with that topic chosen. */
document.querySelectorAll('.no-grid li').forEach((li) => li.addEventListener('click', (e) => { if (!e.target.closest('a')) li.querySelector('.no-go')?.click(); }));
/* Floating buttons step aside while the birth-date tool is on screen (they covered the date box). */
(() => {
  const c = document.querySelector('.n-calc');
  if (!c) return;
  new IntersectionObserver((es) => document.body.classList.toggle('n-calc-in-view', es[0].isIntersecting), { threshold: 0.2 }).observe(c);
})();
/* Motion: steps light up in turn; promises fade in; pain-card rail moves on phones like the Brainology cards. */
(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const steps = [...document.querySelectorAll('.na-steps li')];
  if (steps.length) {
    let i = 0, vis = false;
    new IntersectionObserver((es) => { vis = es[0].isIntersecting; }, { threshold: 0.4 }).observe(steps[0].parentElement);
    const lit = () => steps.forEach((s, k) => s.classList.toggle('is-lit', k === i));
    lit();
    if (!reduce) setInterval(() => { if (vis) { i = (i + 1) % steps.length; lit(); } }, 1800);
  }
  const nw = document.querySelector('.nw-cards');
  if (nw) new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { nw.classList.add('is-in'); o.disconnect(); } }, { threshold: 0.25 }).observe(nw);
  const rail = document.querySelector('.nq-cards');
  if (rail && !reduce) {
    let paused = 0, vis = false;
    ['pointerdown', 'touchstart', 'wheel'].forEach((ev) => rail.addEventListener(ev, () => { paused = Date.now() + 8000; }, { passive: true }));
    new IntersectionObserver((es) => { vis = es[0].isIntersecting; }, { threshold: 0.6 }).observe(rail);
    setInterval(() => {
      if (!vis || Date.now() < paused || rail.scrollWidth <= rail.clientWidth + 4) return;
      const x = rail.scrollLeft, kids = [...rail.children];
      const next = kids.find((c) => c.offsetLeft - rail.offsetLeft > x + 8);
      const end = x + rail.clientWidth >= rail.scrollWidth - 8;
      rail.scrollTo({ left: end || !next ? 0 : next.offsetLeft - rail.offsetLeft - (rail.clientWidth - next.clientWidth) / 2, behavior: 'smooth' });
    }, 7000);
  }
})();
