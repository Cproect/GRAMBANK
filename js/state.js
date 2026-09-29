import * as storage from './storage.js';

export const CONFIG = {
  MIN_GRAM: 7000,
  GRAM_PER_STAR: 3500,   // 3500 GRAM = 1 Telegram Star
  PR_TO_GRAM: 0.3,       // 1 PR GRAM = 0.3 GRAM (курс 0.3/1 в пользу GRAM)
  BASE_RATE: 0.5,        // % в день займа
  DAILY_STEP: 0.5,       // +% каждый следующий день
  COLLATERALS: [
    { id: 'usd', label: 'USD' },
    { id: 'crypto', label: 'Криптовалюта' },
    { id: 'stars', label: 'Telegram Stars' },
    { id: 'gifts', label: 'Telegram подарки' },
    { id: 'nft', label: 'NFT' }
  ]
};

export const fmt = n => Math.round(n).toLocaleString('ru-RU');
export const toGram = (v, cur) => cur === 'PR' ? v * CONFIG.PR_TO_GRAM : v;
export const toStars = gram => gram / CONFIG.GRAM_PER_STAR;
export const rateAt = days => CONFIG.BASE_RATE + CONFIG.DAILY_STEP * days;
export const daysSince = (loan, now = Date.now()) => Math.max(0, Math.floor((now - loan.createdAt) / 86400000));
export const owed = (loan, now = Date.now()) => Math.ceil(loan.principal * (1 + rateAt(daysSince(loan, now)) / 100));

const listeners = new Set();
export const state = { loans: storage.get('loans', []) };

export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
function save() { storage.set('loans', state.loans); listeners.forEach(f => f(state)); }

export function addLoan(principal, collateral) {
  const loan = { id: Date.now().toString(36), principal, collateral, createdAt: Date.now(), closed: false };
  state.loans.unshift(loan); save(); return loan;
}
export function repayLoan(id) {
  const l = state.loans.find(x => x.id === id);
  if (l && !l.closed) { l.closed = true; l.paid = owed(l); l.closedAt = Date.now(); save(); }
}
