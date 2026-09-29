import * as tg from '../telegram.js';
import { CONFIG, state, fmt, toGram, toStars, rateAt, owed, daysSince, addLoan, repayLoan, subscribe } from '../state.js';
import { setBack } from '../router.js';
import { rows } from '../components/rows.js';

export default { render(el) {
  let cur = 'GRAM', amount = '', unsub = null;

  const gramValue = () => toGram(parseFloat(amount) || 0, cur);
  const validate = () => gramValue() < CONFIG.MIN_GRAM
    ? `Минимальная сумма кредита — ${fmt(CONFIG.MIN_GRAM)} GRAM` : '';

  function form() {
    setBack(null); tg.hideMain();
    if (unsub) unsub();
    el.innerHTML = `
      <h1>Взять кредит</h1>
      <div class="seg"><button data-c="GRAM" class="${cur === 'GRAM' ? 'on' : ''}">GRAM</button><button data-c="PR" class="${cur === 'PR' ? 'on' : ''}">PR GRAM</button></div>
      <input id="amt" type="number" inputmode="decimal" min="0" placeholder="Количество ${cur === 'PR' ? 'PR GRAM' : 'GRAM'}" value="${amount}">
      <div class="err" id="err"></div>
      <div id="calc"></div>
      <button class="btn" id="go">Взять кредит</button>
      <h2>Мои кредиты</h2><div id="loans"></div>`;
    el.querySelectorAll('.seg button').forEach(b => b.onclick = () => { cur = b.dataset.c; tg.haptic('select'); form(); });
    const inp = el.querySelector('#amt'), go = el.querySelector('#go');
    const update = () => {
      amount = inp.value;
      const g = gramValue(), e = validate();
      el.querySelector('#err').textContent = amount && e ? e : '';
      el.querySelector('#calc').innerHTML = rows([
        ['Курс', `1 PR GRAM = ${CONFIG.PR_TO_GRAM} GRAM`],
        ['Сумма в GRAM', fmt(g)],
        ['В Telegram Stars', `≈ ${toStars(g).toFixed(2)} ★`],
        ['Вернуть в 1-й день', `${fmt(g * (1 + rateAt(0) / 100))} GRAM (${rateAt(0)}%)`]
      ]);
      go.disabled = !!e;
    };
    inp.oninput = update; update();
    go.onclick = () => { if (!validate()) { tg.haptic('light'); collateral(gramValue()); } };
    const draw = () => { el.querySelector('#loans').innerHTML = loansHtml(); bindLoans(); };
    draw();
    unsub = subscribe(draw);
  }

  function loansHtml() {
    if (!state.loans.length) return '<p class="hint">Кредитов пока нет</p>';
    return state.loans.map(l => {
      const c = CONFIG.COLLATERALS.find(x => x.id === l.collateral)?.label;
      if (l.closed) return `<div class="card closed">${fmt(l.principal)} GRAM · погашен<br>Выплачено: ${fmt(l.paid)} GRAM</div>`;
      const d = daysSince(l);
      return `<div class="card">${rows([
        ['Сумма', `${fmt(l.principal)} GRAM`], ['Залог', c],
        ['День / ставка', `${d + 1} / ${rateAt(d)}%`], ['К возврату', `${fmt(owed(l))} GRAM`]
      ])}<button class="btn ghost" data-repay="${l.id}">Погасить</button></div>`;
    }).join('');
  }
  function bindLoans() {
    el.querySelectorAll('[data-repay]').forEach(b => b.onclick = () =>
      tg.confirm('Погасить кредит?', ok => { if (ok) { repayLoan(b.dataset.repay); tg.haptic('success'); } }));
  }

  function collateral(g) {
    let sel = null;
    if (unsub) unsub();
    setBack(form);
    el.innerHTML = `
      <h1>Выберите залог</h1>
      ${rows([['Сумма кредита', `${fmt(g)} GRAM`]])}
      <div id="opts">${CONFIG.COLLATERALS.map(c => `<button class="opt" data-id="${c.id}"><span>${c.label}</span></button>`).join('')}</div>
      <div style="height:16px"></div>
      <button class="btn" id="ok" disabled>Подтвердить</button>`;
    const ok = el.querySelector('#ok');
    const confirmFn = () => { if (sel) { addLoan(g, sel); tg.haptic('success'); done(g, sel); } };
    ok.onclick = confirmFn;
    el.querySelectorAll('.opt').forEach(b => b.onclick = () => {
      sel = b.dataset.id; tg.haptic('select');
      el.querySelectorAll('.opt').forEach(x => x.classList.toggle('on', x === b));
      ok.disabled = false;
      if (tg.showMain('Подтвердить', confirmFn)) ok.style.display = 'none';
    });
  }

  function done(g, sel) {
    setBack(null); tg.hideMain();
    const label = CONFIG.COLLATERALS.find(x => x.id === sel).label;
    el.innerHTML = `<h1>Кредит оформлен</h1>
      ${rows([['Получено', `${fmt(g)} GRAM`], ['Залог', label], ['Вернуть в 1-й день', `${fmt(g * (1 + rateAt(0) / 100))} GRAM`]])}
      <p class="hint">Ставка растёт на ${CONFIG.DAILY_STEP}% каждый день.</p>
      <button class="btn" id="back">Готово</button>`;
    amount = '';
    el.querySelector('#back').onclick = form;
  }

  form();
  return () => unsub && unsub();
} };
