import { CONFIG as C } from './config.js';

export const fmt = (n, d = 0) => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: d }).format(n);
export const gramToStars = g => g / C.rates.gramPerStar;
export const starsToUsdt = s => s / C.rates.starsPerUsdt;
export const insurancePct = good => Math.max(C.insurance.min, C.insurance.start - good * C.insurance.stepPerGoodLoan);
export const dayRate = n => C.interest.startDaily + C.interest.dailyStep * (n - 1);

export function collateralFor(gram, good) {
  const stars = gramToStars(gram) * C.collateralRatio;
  const total = stars * (1 + insurancePct(good) / 100);
  return C.collateral.map(c => {
    let base, tot;
    if (c.perItemStars) { base = Math.ceil(stars / c.perItemStars); tot = Math.ceil(total / c.perItemStars); }
    else if (c.id === 'stars') { base = stars; tot = total; }
    else { base = starsToUsdt(stars); tot = starsToUsdt(total); }
    return { ...c, base, total: tot };
  });
}

export function repay(gram, days) {
  let pct = 0;
  for (let i = 1; i <= days; i++) pct += dayRate(i);
  const interest = gram * pct / 100;
  return { pct, interest, total: gram + interest };
}

const cache = {};
export function history(a) {
  if (cache[a.id]) return cache[a.id];
  let seed = a.seed, v = a.base;
  const r = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
  const p = Array.from({ length: 365 }, () => (v += (a.base - v) * 0.08 + (r() - 0.5) * 2 * a.vol * a.base));
  const off = a.base - p[364];
  return (cache[a.id] = p.map(x => x + off));
}
