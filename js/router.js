import * as tg from './telegram.js';

const routes = {};
let view, nav;

export const register = (path, page, opts = {}) => (routes[path] = { page, ...opts });
export const go = p => { location.hash = p; };

export function refresh(top = false) {
  const path = location.hash.slice(1) || '/loan';
  const r = routes[path] || routes['/loan'];
  const to = r.guard?.();
  if (to) return go(to);
  view.innerHTML = `<section class="page${top ? ' enter' : ''}">${r.page.render()}</section>`;
  r.page.mount?.(view);
  nav.querySelectorAll('a').forEach(a => a.classList.toggle('on', a.dataset.tab === r.tab));
  tg.setBack(r.back ? () => history.back() : null);
  if (top) window.scrollTo(0, 0);
}

export function start(v, n) {
  view = v; nav = n;
  addEventListener('hashchange', () => refresh(true));
  refresh(true);
}
