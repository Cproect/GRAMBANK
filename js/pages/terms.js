import { CONFIG as C } from '../config.js';
import { fmt } from '../calc.js';
import { rows, card } from '../components/ui.js';
import { calcBlock } from '../components/loanCalc.js';

const i = C.interest, r = C.rates;

export default {
  render() {
    return `
      <h1>Условия</h1>
      ${card('Минимальная сумма', `<div class="big">${fmt(C.minLoan)} GRAM</div>`)}
      ${card('Ставка', rows([
        ['В день', `${i.startDaily}%`],
        ['Рост', `+${i.dailyStep} п.п. каждый день`],
        ['День 1 / 2 / 3', `${i.startDaily}% / ${i.startDaily + i.dailyStep}% / ${i.startDaily + 2 * i.dailyStep}%`]
      ]))}
      ${card('Банковская страховка', rows([
        ['Новый клиент', `${C.insurance.start}%`],
        ['С хорошей историей', `−${C.insurance.stepPerGoodLoan} п.п. за кредит`],
        ['Минимум', `${C.insurance.min}%`]
      ]))}
      ${card('Варианты залога', `<div class="rows">${C.collateral.map(c => `<div><span>${c.name}</span></div>`).join('')}</div>`)}
      ${card('Демо-курсы', rows([
        ['PR GRAM', `${r.prPerGram} = 1 GRAM`],
        ['GRAM', `${fmt(r.gramPerStar)} = 1 Star`],
        ['USDT', `1 = ${r.starsPerUsdt} Stars`]
      ]))}
      ${card('Пример: 10 000 GRAM на 3 дня', calcBlock(10000, 3))}
      <p class="note">Демонстрационный прототип. Реальных операций нет.</p>`;
  }
};
