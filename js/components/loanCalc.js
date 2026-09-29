import { fmt, repay, dayRate } from '../calc.js';
import { rows } from './ui.js';

export function calcBlock(amount, days) {
  const r = repay(amount, days);
  return rows([
    ['Сумма кредита', `${fmt(amount)} GRAM`],
    ['Срок', `${days} дн.`],
    ['Ставка в последний день', `${fmt(dayRate(days), 1)}% в день`],
    ['Накопленный процент', `${fmt(r.pct, 1)}% = ${fmt(r.interest)} GRAM`],
    ['К возврату', `<b>${fmt(r.total)} GRAM</b>`]
  ]);
}
