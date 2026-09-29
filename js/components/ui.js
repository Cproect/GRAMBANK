export const rows = list =>
  `<div class="rows">${list.map(([k, v]) => `<div><span>${k}</span><span>${v}</span></div>`).join('')}</div>`;

export const card = (title, body) => `<div class="card"><h2>${title}</h2>${body}</div>`;

export const chips = (items, active, key) =>
  `<div class="chips">${items.map(([id, n]) => `<button class="chip${id === active ? ' on' : ''}" data-${key}="${id}">${n}</button>`).join('')}</div>`;

export function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2200);
}
