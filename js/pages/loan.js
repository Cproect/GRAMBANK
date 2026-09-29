import { CONFIG as C } from '../config.js';
import * as S from '../state.js';
import { fmt } from '../calc.js';
import { rows, card, toast } from '../components/ui.js';
import { mountChart } from '../components/chart.js';
import { go, refresh } from '../router.js';
import * as tg from '../telegram.js';

const pr = a => `${fmt(a * C.rates.prPerGram, 2)} PR GRAM`;

export default {
  render() {
    const s = S.get();
    const loans = s.loans.length
      ? card('Мои кредиты (демо)', s.loans.map(l => `<div class="loan"><div>${fmt(l.amount)} GRAM<small>${l.days} дн. · залог ${l.col}</small></div><button class="btn2" data-repay="${l.id}">Погасить</button></div>`).join(''))
      : '';
    return `
      <h1>${C.brand}</h1>
      <label class="lbl" for="amt">Сумма кредита</label>
      <div class="field"><input id="amt" inputmode="numeric" autocomplete="off" value="${s.amount || ''}" placeholder="${fmt(C.minLoan)}"><span>GRAM</span></div>
      <p class="hint" id="hint">Минимум ${fmt(C.minLoan)} GRAM</p>
      <div class="card">${rows([
        ['PR GRAM', `<b id="pr">${pr(s.amount)}</b>`],
        ['Курс', `${C.rates.prPerGram} PR GRAM = 1 GRAM`],
        ['', `${fmt(C.rates.gramPerStar)} GRAM = 1 Telegram Star`],
        ['', `1 USDT = ${C.rates.starsPerUsdt} Telegram Stars`]
      ])}</div>
      <button class="btn" id="go">Взять кредит</button>
      <div class="card" id="chart"></div>
      ${loans}
      <p class="note">Демонстрационный прототип. Реальных операций нет.</p>`;
  },
  mount(el) {
    const inp = el.querySelector('#amt'), hint = el.querySelector('#hint');
    inp.oninput = () => {
      const v = +inp.value.replace(/\D/g, '') || 0;
      inp.value = v || '';
      S.set({ amount: v });
      el.querySelector('#pr').textContent = pr(v);
      hint.classList.remove('err');
    };
    el.querySelector('#go').onclick = () => {
      tg.haptic();
      if (S.get().amount < C.minLoan) { hint.classList.add('err'); return; }
      go('/collateral');
    };
    el.querySelectorAll('[data-repay]').forEach(b => b.onclick = () => {
      const s = S.get();
      S.set({ loans: s.loans.filter(l => l.id != b.dataset.repay), goodLoans: s.goodLoans + 1 });
      toast('Кредит погашен (демо). История улучшена.');
      refresh();
    });
    mountChart(el.querySelector('#chart'), C.assets.map(a => a.id));
  }
};
