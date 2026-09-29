import * as storage from './storage.js';
import * as R from './rates.js';

export const CONFIG = {
  MIN_GRAM: 7000,
  COLLATERAL_MARGIN: 5,  // % сверх суммы кредита
  BASE_RATE: 0.5,        // % в день займа
  DAILY_STEP: 0.5,       // +% каждый следующий день
  COLLATERALS: [
    { id: 'usd', label: 'USD' },
    { id: 'crypto', label: 'Криптовалюта' },
    { id: 'stars', label: 'Telegram Stars' },
    { id: 'pr', label: 'PR GRAM' },
    { id: 'gifts', label: 'Telegram подарки' },
    { id: 'nft', label: 'NFT' }
  ]
};

const nf = d => n => n.toLocaleString('ru-RU', { minimumFractionDigits: d, maximumFractionDigits: d });
export const fmt = nf(0), fmt2 = nf(2);
export const fmtUsd = n => '$' + (n < 1 ? nf(3)(n) : fmt2(n));

// Конвертации (узел — Telegram Star)
export const toGram = (v, cur) => cur === 'PR' ? v * R.get('PR_GRAM') : v;
export const toStars = gram => gram / R.get('STAR_GRAM');
export function collateralNeed(gram) {
  const stars = toStars(gram) * (1 + CONFIG.COLLATERAL_MARGIN / 100);
  return { stars, usd: stars / R.get('USD_STAR'), pr: stars * R.get('STAR_PR') };
}
export function collText(id, need) {
  if (id === 'usd') return fmtUsd(need.usd);
  if (id === 'pr') return `${fmt(need.pr)} PR GRAM`;
  if (id === 'stars') return `${fmt2(need.stars)} ★`;
  return `≈ ${fmt2(need.stars)} ★ (${fmtUsd(need.usd)})`;
}

export const rateAt = days => CONFIG.BASE_RATE + CONFIG.DAILY_STEP * days;
export const daysSince = (loan, now = Date.now()) => Math.max(0, Math.floor((now - loan.createdAt) / 86400000));
export const owed = (loan, now = Date.now()) => Math.ceil(loan.principal * (1 + rateAt(daysSince(loan, now)) / 100));

const listeners = new Set();
export const state = { loans: storage.get('loans', []) };
export const subscribe = fn => { listeners.add(fn); return () => listeners.delete(fn); };
function save() { storage.set('loans', state.loans); listeners.forEach(f => f(state)); }

export function addLoan(principal, collateral, need) {
  const loan = { id: Date.now().toString(36), principal, collateral, need, createdAt: Date.now(), closed: false };
  state.loans.unshift(loan); save(); return loan;
}
export function repayLoan(id) {
  const l = state.loans.find(x => x.id === id);
  if (l && !l.closed) { l.closed = true; l.paid = owed(l); l.closedAt = Date.now(); save(); }
}
