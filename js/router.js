import * as tg from './telegram.js';
import { renderNavbar } from './components/navbar.js';

const routes = {};
let view, nav, tabs = [], cleanup = null, current = null;

export function register(name, page) { routes[name] = page; }

export function start(viewEl, navEl, tabList, first) {
  view = viewEl; nav = navEl; tabs = tabList; navigate(first);
}

export function setBack(fn) { fn ? tg.showBack(fn) : tg.hideBack(); }

export function navigate(name) {
  if (typeof cleanup === 'function') cleanup();
  setBack(null); tg.hideMain();
  current = name;
  view.innerHTML = ''; view.scrollTop = 0;
  cleanup = routes[name].render(view);
  renderNavbar(nav, tabs, current, navigate);
}
