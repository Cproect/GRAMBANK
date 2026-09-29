import * as storage from './storage.js';
import { CONFIG } from './config.js';

const defaults = () => ({
  amount: CONFIG.minLoan,
  days: CONFIG.interest.defaultDays,
  collateral: 'usdt',
  goodLoans: 0,
  loans: [],
  portfolio: { cash: CONFIG.demoCash, gram: 0 }
});

let s = { ...defaults(), ...storage.get('state', {}) };
export const get = () => s;
export const set = p => { s = { ...s, ...p }; storage.set('state', s); };
export const reset = () => { s = defaults(); storage.set('state', s); };
