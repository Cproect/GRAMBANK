export const rows = list => `<div class="rows">${list.map(([k, v]) => `<div class="row"><span>${k}</span><span>${v}</span></div>`).join('')}</div>`;
