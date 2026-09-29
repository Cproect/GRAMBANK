import { CONFIG } from '../config.js';
import { fmt, history } from '../calc.js';
import { chips } from './ui.js';

export function mountChart(el, ids) {
  let asset = ids[0], period = '30D';
  const assets = CONFIG.assets.filter(a => ids.includes(a.id));

  const draw = () => {
    const a = assets.find(x => x.id === asset);
    const d = history(a).slice(-CONFIG.periods[period]);
    const min = Math.min(...d), span = Math.max(...d) - min || 1;
    const pts = d.map((v, i) => `${(i / (d.length - 1) * 300).toFixed(1)},${(112 - (v - min) / span * 104).toFixed(1)}`).join(' ');
    const ch = (d.at(-1) / d[0] - 1) * 100;
    el.classList.add('chart');
    el.innerHTML = `
      ${assets.length > 1 ? chips(assets.map(x => [x.id, x.name]), asset, 'a') : ''}
      <div class="big">${fmt(d.at(-1), a.dec)} <small style="font-size:12px;color:var(--mu)">${a.unit}</small></div>
      <div class="${ch >= 0 ? 'up' : 'dn'}" style="font-size:13px">${ch >= 0 ? '+' : ''}${ch.toFixed(2)}% за ${period}</div>
      <svg viewBox="0 0 300 120" preserveAspectRatio="none"><polyline points="${pts}"/></svg>
      ${chips(Object.keys(CONFIG.periods).map(p => [p, p]), period, 'p')}
      <div class="note" style="text-align:left">Демо-данные</div>`;
  };

  el.onclick = e => {
    const b = e.target.closest('[data-a],[data-p]');
    if (!b) return;
    asset = b.dataset.a || asset; period = b.dataset.p || period;
    draw();
  };
  draw();
}
