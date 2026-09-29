import { CONFIG as C } from '../config.js';
import * as S from '../state.js';
import { fmt, history } from '../calc.js';
import { rows, toast } from '../components/ui.js';
import { mountChart } from '../components/chart.js';
import * as tg from '../telegram.js';

const asset = C.assets.find(a => a.id === 'gram');
const price = () => history(asset).at(-1);
const portfolio = () => {
  const p = S.get().portfolio;
  return rows([
    ['GRAM', `${fmt(p.gram)}`],
    ['Свободно, USDT', fmt(p.cash, 6)],
    ['Всего, USDT', `<b>${fmt(p.cash + p.gram * price(), 6)}</b>`]
  ]);
};

export default {
  render() {
    const h = history(asset), d = (h.at(-1) / h.at(-2) - 1) * 100;
    return `
      <h1>Инвестиции</h1>
      <div class="card"><h2>Стоимость GRAM</h2>
        <div class="big">${fmt(price(), 8)} USDT</div>
        <div class="${d >= 0 ? 'up' : 'dn'}" style="font-size:13px">${d >= 0 ? '+' : ''}${d.toFixed(2)}% за 24ч</div></div>
      <div class="card" id="chart"></div>
      <div class="card"><h2>Портфель (демо)</h2><div id="pf">${portfolio()}</div></div>
      <label class="lbl" for="q">Количество GRAM</label>
      <div class="field" style="margin-bottom:12px"><input id="q" inputmode="numeric" value="${C.rates.gramPerStar}"><span>GRAM</span></div>
      <div class="two"><button class="btn2 buy" data-op="buy">Купить</button><button class="btn2 sell" data-op="sell">Продать</button></div>
      <p class="note">Локальная симуляция. Реальных операций нет.</p>`;
  },
  mount(el) {
    mountChart(el.querySelector('#chart'), ['gram']);
    const q = el.querySelector('#q');
    el.querySelectorAll('[data-op]').forEach(b => b.onclick = () => {
      const n = +q.value.replace(/\D/g, '') || 0, p = { ...S.get().portfolio }, cost = n * price();
      if (!n) return toast('Введите количество');
      if (b.dataset.op === 'buy') {
        if (cost > p.cash) return toast('Недостаточно средств');
        p.cash -= cost; p.gram += n;
      } else {
        if (n > p.gram) return toast('Недостаточно GRAM');
        p.cash += cost; p.gram -= n;
      }
      S.set({ portfolio: p }); tg.haptic();
      el.querySelector('#pf').innerHTML = portfolio();
      toast(b.dataset.op === 'buy' ? 'Куплено (демо)' : 'Продано (демо)');
    });
  }
};
