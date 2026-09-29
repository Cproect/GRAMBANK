import * as R from '../rates.js';
import { fmt } from '../state.js';
import { lineChart } from '../components/chart.js';

const ITEMS = [
  { k: 'STAR_GRAM', t: '1 ★ Telegram Star', u: 'GRAM', c: '#f5b942', f: fmt },
  { k: 'PR_GRAM', t: '1 PR GRAM', u: 'GRAM', c: '#b18cff', f: v => v.toFixed(3) },
  { k: 'STAR_PR', t: '1 ★ Telegram Star', u: 'PR GRAM', c: '#4fd1c5', f: fmt },
  { k: 'USD_STAR', t: '1 USD', u: '★', c: '#6c8cff', f: v => v.toFixed(2) }
];

export default { render(el) {
  el.innerHTML = `<h1>Курсы</h1><div id="rates"></div><p class="hint">Раздел инвестиций в разработке.</p>`;
  const box = el.querySelector('#rates');
  const draw = () => {
    box.innerHTML = ITEMS.map(i => {
      const h = R.hist(i.k), cur = h[h.length - 1], ch = (cur / h[0] - 1) * 100;
      return `<div class="card"><div class="rate-head"><div><div class="hint">${i.t}</div><div class="big">${i.f(cur)} <span class="unit">${i.u}</span></div></div>
        <div class="chg ${ch >= 0 ? 'up' : 'down'}">${ch >= 0 ? '▲' : '▼'} ${Math.abs(ch).toFixed(2)}%</div></div>${lineChart(h, i.c, i.k)}</div>`;
    }).join('');
  };
  draw();
  return R.subscribe(draw);
} };
