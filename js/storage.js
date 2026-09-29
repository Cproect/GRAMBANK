const P = 'grambank:';
export const get = (k, fb = null) => {
  try { const v = localStorage.getItem(P + k); return v === null ? fb : JSON.parse(v); } catch { return fb; }
};
export const set = (k, v) => { try { localStorage.setItem(P + k, JSON.stringify(v)); } catch {} };
export const remove = k => { try { localStorage.removeItem(P + k); } catch {} };
