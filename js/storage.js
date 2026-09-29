// Единственное место, где используется LocalStorage.
const P = 'grambank:';
export function get(key, def = null) {
  try { const v = localStorage.getItem(P + key); return v === null ? def : JSON.parse(v); }
  catch { return def; }
}
export function set(key, value) {
  try { localStorage.setItem(P + key, JSON.stringify(value)); } catch {}
}
export function remove(key) {
  try { localStorage.removeItem(P + key); } catch {}
}
