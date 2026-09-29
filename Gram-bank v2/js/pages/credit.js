import * as tg from '../telegram.js';
import * as R from '../rates.js';
import { CONFIG, state, fmt, fmt2, toGram, toStars, rateAt, owed, daysSince, collateralNeed, collText, addLoan, repayLoan, subscribe } from '../state.js';
import { setBack } from '../router.js';
import { rows } from '../components/rows.js';

export default { render(el) {
  let cur = 'GRAM', amount = '', unsubs = [];
  const clear = () => { unsubs.forEach(f => f()); unsubs = []; };
  const gramValue = () => toGram(parseFloat(amount) || 0, cur);
  const validate = () => gramValue() < CONFIG.MIN_GRAM ? `Минимальная сумма кредита — ${fmt(CONFIG.MIN_GRAM)} GRAM` : '';

  function form() {
    clear(); setBack(null); tg.hideMain();
    el.innerHTML = `
      <h1>Взять кредит</h1>
      <div class="seg"><button data-c="GRAM" class="${cur === 'GRAM' ? 'on' : ''}">GRAM</button><button data-c="PR" class="${cur === 'PR' ? 'on' : ''}">PR GRAM</button></div>
      <input id="amt" type="number" inputmode="decimal" min="0" placeholder="Количество ${cur === 'PR' ? 'PR GRAM' : 'GRAM'}" value="${amount}">
      <div class="err" id="err"></div>
      <div class="card" id="calc"></div>
      <button class="btn" id="go">Взять кредит</button>
      <h2>Мои кредиты</h2><div id="loans"></div>`;
    el.querySelectorAll('.seg button').forEach(b => b.onclick = () => { cur = b.dataset.c; tg.haptic('select'); form(); });
    const inp = el.querySelector('#amt'), go = el.querySelector('#go');
    const update = () => {
      amount = inp.value;
      const g = gramValue(), e = validate();
      el.querySelector('#err').textContent = amount && e ? e : '';
      el.querySelector('#calc').innerHTML = rows([
        ['Курс PR GRAM', `1 = ${R.get('PR_GRAM').toFixed(3)} GRAM`],
        ['Курс ★', `1 = ${fmt(R.get('STAR_GRAM'))} GRAM`],
        ['Сумма в GRAM', fmt(g)],
        ['В Telegram Stars', `≈ ${fmt2(toStars(g))} ★`],
        ['Вернуть в 1-й день', `${fmt(g * (1 + rateAt(0) / 100))} GRAM (${rateAt(0)}%)`]
      ]);
      go.disabled = !!e;
    };
    inp.oninput = update; update();
    go.onclick = () => { if (!validate()) { tg.haptic('light'); collateral(gramValue()); } };
    const draw = () => { el.querySelector('#loans').innerHTML = loansHtml(); bindLoans(); };
    draw();
    unsubs.push(subscribe(draw), R.subscribe(update));
  }

  function loansHtml() {
    if (!state.loans.length) return '<p class="hint">Кредитов пока нет</p>';
    return state.loans.map(l => {
      if (l.closed) return `<div class="card closed">${fmt(l.principal)} GRAM · погашен<br>Выплачено: ${fmt(l.paid)} GRAM</div>`;
      const c = CONFIG.COLLATERALS.find(x => x.id === l.collateral)?.label, d = daysSince(l);
      return `<div class="card">${rows([
        ['Сумма', `${fmt(l.principal)} GRAM`],
        ['Залог', `${c}${l.need ? ': ' + collText(l.collateral, l.need) : ''}`],
        ['День / ставка', `${d + 1} / ${rateAt(d)}%`],
        ['К возврату', `<b class="acc">${fmt(owed(l))} GRAM</b>`]
      ])}<button class="btn ghost" data-repay="${l.id}">Погасить</button></div>`;
    }).join('');
  }
  function bindLoans() {
    el.querySelectorAll('[data-repay]').forEach(b => b.onclick = () =>
      tg.confirm('Погасить кредит?', ok => { if (ok) { repayLoan(b.dataset.repay); tg.haptic('success'); } }));
  }

  function collateral(g) {
    clear(); setBack(form);
    const need = collateralNeed(g); let sel = null;     // курс фиксируется на момент выбора
    el.innerHTML = `
      <h1>Выберите залог</h1>
      <div class="card">${rows([
        ['Сумма кредита', `${fmt(g)} GRAM`],
        ['Залог +' + CONFIG.COLLATERAL_MARGIN + '%', `${fmt2(need.stars)} ★`]
      ])}<p class="hint" style="margin:0">Курс зафиксирован на момент выбора.</p></div>
      <div id="opts">${CONFIG.COLLATERALS.map(c => `<button class="opt" data-id="${c.id}"><span>${c.label}</span><span class="amt">${collText(c.id, need)}</span></button>`).join('')}</div>
      <div style="height:16px"></div>
      <button class="btn" id="ok" disabled>Подтвердить</button>`;
    const ok = el.querySelector('#ok');
    const confirmFn = () => { if (sel) { addLoan(g, sel, need); tg.haptic('success'); done(g, sel, need); } };
    ok.onclick = confirmFn;
    el.querySelectorAll('.opt').forEach(b => b.onclick = () => {
      sel = b.dataset.id; tg.haptic('select');
      el.querySelectorAll('.opt').forEach(x => x.classList.toggle('on', x === b));
      ok.disabled = false;
      if (tg.showMain('Подтвердить', confirmFn)) ok.style.display = 'none';
    });
  }

  function done(g, sel, need) {
    setBack(null); tg.hideMain(); amount = '';
    const label = CONFIG.COLLATERALS.find(x => x.id === sel).label;
    el.innerHTML = `<h1>Кредит оформлен</h1><div class="card">${rows([
      ['Получено', `${fmt(g)} GRAM`], ['Залог', `${label}: ${collText(sel, need)}`],
      ['Вернуть в 1-й день', `${fmt(g * (1 + rateAt(0) / 100))} GRAM`]])}
      <p class="hint" style="margin:0">Ставка растёт на ${CONFIG.DAILY_STEP}% каждый день.</p></div>
      <button class="btn" id="back">Готово</button>`;
    el.querySelector('#back').onclick = form;
  }

  form();
  return clear;
} };
