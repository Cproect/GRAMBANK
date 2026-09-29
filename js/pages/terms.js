import { CONFIG, fmt } from '../state.js';
export default { render(el) {
  el.innerHTML = `<h1>Условия</h1><ul class="terms">
    <li>Валюта банка — GRAM.</li>
    <li>Курс: 1 PR GRAM = ${CONFIG.PR_TO_GRAM} GRAM.</li>
    <li>${fmt(CONFIG.GRAM_PER_STAR)} GRAM = 1 Telegram Star.</li>
    <li>Минимальная сумма кредита — ${fmt(CONFIG.MIN_GRAM)} GRAM.</li>
    <li>Сумма возврата: ${CONFIG.BASE_RATE}% в день займа, далее +${CONFIG.DAILY_STEP}% каждый день (2-й день — ${CONFIG.BASE_RATE + CONFIG.DAILY_STEP}%, 3-й — ${CONFIG.BASE_RATE + 2 * CONFIG.DAILY_STEP}% и т.д.).</li>
    <li>Залог на выбор: USD, криптовалюта, Telegram Stars, Telegram подарки, NFT.</li>
  </ul>`;
} };
