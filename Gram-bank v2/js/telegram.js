// Вся интеграция с Telegram Web App API — только здесь.
const tg = window.Telegram?.WebApp;
export const isTelegram = !!(tg && tg.initData);
let mainHandler = null, backHandler = null;

export function init() {
  if (!tg) return;
  tg.ready();
  tg.expand();
  applyTheme();
  tg.onEvent('themeChanged', applyTheme);
}

function applyTheme() {
  try { tg.setHeaderColor('#0b0e14'); tg.setBackgroundColor('#0b0e14'); tg.setBottomBarColor && tg.setBottomBarColor('#0b0e14'); } catch {}
}

export function getUser() { return tg?.initDataUnsafe?.user || null; }

export function haptic(type = 'light') {
  const h = tg?.HapticFeedback; if (!h) return;
  if (['success', 'error', 'warning'].includes(type)) h.notificationOccurred(type);
  else if (type === 'select') h.selectionChanged();
  else h.impactOccurred(type);
}

// Возвращает true, если нативная MainButton доступна
export function showMain(text, cb) {
  if (!isTelegram) return false;
  hideMain();
  mainHandler = cb;
  tg.MainButton.setParams({ text, color: '#6c8cff', text_color: '#ffffff' }); tg.MainButton.onClick(cb); tg.MainButton.show();
  return true;
}
export function hideMain() {
  if (!isTelegram) return;
  if (mainHandler) tg.MainButton.offClick(mainHandler);
  mainHandler = null; tg.MainButton.hide();
}
export function showBack(cb) {
  if (!isTelegram) return;
  hideBack(); backHandler = cb; tg.BackButton.onClick(cb); tg.BackButton.show();
}
export function hideBack() {
  if (!isTelegram) return;
  if (backHandler) tg.BackButton.offClick(backHandler);
  backHandler = null; tg.BackButton.hide();
}
export function confirm(msg, cb) {
  if (isTelegram) tg.showConfirm(msg, cb); else cb(window.confirm(msg));
}
