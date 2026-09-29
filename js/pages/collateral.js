import { CONFIG as C } from '../config.js';
import * as S from '../state.js';
import { fmt, collateralFor, insurancePct } from '../calc.js';
import { rows, toast } from '../components/ui.js';
import { calcBlock } from '../components/loanCalc.js';
import { go, refresh } from '../router.js';
import * as tg from '../telegram.js';

const amt = (c, v) => `${fmt(v, c.whole ? 0 : c.dec)} ${c.unit}`;

export default {
  guard: () => (S.get().amount < C.minLoan ? '/loan' : null),
  render() {
    const s = S.get(), list = collateralFor(s.amount, s.goodLoans);
    const cur = list.find(c => c.id === s.collateral) || list[1], pct = insurancePct(s.goodLoans);
    return `
      <h1>Залог</h1>
      <p class="sub">Кредит: <b>${fmt(s.amount)} GRAM</b></p>
      <div class="opts">${list.map(c => `<button class="opt${c.id === cur.id ? ' on' : ''}" data-id="${c.id}"><span>${c.name}</span><b>${amt(c, c.total)}</b></button>`).join('')}</div>
      <div class="card">${rows([
        ['Залог', amt(cur, cur.base)],
        [`Банковская страховка: ${pct}%`, `+${amt(cur, cur.total - cur.base)}`],
        ['Итого залог', `<b>${amt(cur, cur.total)}</b>`]
      ])}<p class="hint" style="margin:8px 0 0">Погашено кредитов: ${s.goodLoans}. Страховка снижается до ${C.insurance.min}%.</p></div>
      <div class="card"><label class="lbl">Срок: <b id="d">${s.days}</b> дн.</label>
        <input type="range" id="days" min="1" max="${C.interest.maxDays}" value="${s.days}">
        <div id="calc">${calcBlock(s.amount, s.days)}</div></div>
      <button class="btn" id="ok">Оформить (демо)</button>`;
  },
  mount(el) {
    el.querySelectorAll('.opt').forEach(b => b.onclick = () => { S.set({ collateral: b.dataset.id }); refresh(); });
    el.querySelector('#days').oninput = e => {
      const days = +e.target.value; S.set({ days });
      el.querySelector('#d').textContent = days;
      el.querySelector('#calc').innerHTML = calcBlock(S.get().amount, days);
    };
    el.querySelector('#ok').onclick = () => {
      const s = S.get(), cur = collateralFor(s.amount, s.goodLoans).find(c => c.id === s.collateral);
      S.set({ loans: [...s.loans, { id: Date.now(), amount: s.amount, days: s.days, col: `${amt(cur, cur.total)}` }] });
      tg.haptic('medium'); toast('Демо-кредит оформлен');
      go('/loan');
    };
  }
};
