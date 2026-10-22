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
