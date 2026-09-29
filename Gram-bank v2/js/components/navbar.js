import * as tg from '../telegram.js';
export function renderNavbar(el, tabs, active, onSelect) {
  el.innerHTML = tabs.map(t => `<button data-id="${t.id}" class="${t.id === active ? 'on' : ''}">${t.label}</button>`).join('');
  el.querySelectorAll('button').forEach(b => b.onclick = () => {
    if (b.dataset.id !== active) { tg.haptic('select'); onSelect(b.dataset.id); }
  });
}
