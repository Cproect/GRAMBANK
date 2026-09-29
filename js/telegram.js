const tg = window.Telegram?.WebApp;
let backFn = null;

export function init() {
  if (!tg) return;
  tg.ready(); tg.expand();
  try { tg.setHeaderColor('#0b0d10'); tg.setBackgroundColor('#0b0d10'); } catch {}
}
export const haptic = (t = 'light') => { try { tg?.HapticFeedback?.impactOccurred(t); } catch {} };
export const alert = m => (tg?.showAlert ? tg.showAlert(m) : window.alert(m));
export function setBack(fn) {
  if (!tg?.BackButton) return;
  if (backFn) tg.BackButton.offClick(backFn);
  backFn = fn;
  if (fn) { tg.BackButton.onClick(fn); tg.BackButton.show(); } else tg.BackButton.hide();
}
