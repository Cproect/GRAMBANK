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
  const p = tg?.themeParams || {}, r = document.documentElement.style;
  const set = (k, v) => v && r.setProperty(k, v);
  set('--bg', p.bg_color); set('--text', p.text_color); set('--hint', p.hint_color);
  set('--line', p.text_color); set('--btn', p.button_color); set('--btn-text', p.button_text_color);
  set('--soft', p.section_separator_color || p.secondary_bg_color);
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
  tg.MainButton.setText(text); tg.MainButton.onClick(cb); tg.MainButton.show();
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
