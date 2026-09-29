import { CONFIG, fmt } from '../state.js';
import { BASE } from '../rates.js';
export default { render(el) {
  const s = CONFIG.BASE_RATE, d = CONFIG.DAILY_STEP;
  el.innerHTML = `<h1>Условия</h1><div class="card"><ul class="terms">
    <li>Валюта банка — GRAM.</li>
    <li>Базовые курсы: 1 ★ = ${fmt(BASE.STAR_GRAM)} GRAM, 1 PR GRAM = ${BASE.PR_GRAM} GRAM, 1 ★ = ${fmt(BASE.STAR_PR)} PR GRAM, 1 USD = ${BASE.USD_STAR} ★. Текущие курсы меняются — см. раздел «Инвестиции».</li>
    <li>Минимальная сумма кредита — ${fmt(CONFIG.MIN_GRAM)} GRAM.</li>
    <li>Залог рассчитывается автоматически: сумма кредита + ${CONFIG.COLLATERAL_MARGIN}%.</li>
    <li>Сумма возврата: ${s}% в день займа, далее +${d}% каждый день (2-й день — ${s + d}%, 3-й — ${s + 2 * d}% и т.д.).</li>
    <li>Залог: USD, криптовалюта, Telegram Stars, PR GRAM, подарки, NFT.</li>
  </ul></div>`;
} };
