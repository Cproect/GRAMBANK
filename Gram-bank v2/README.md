# GRAM bank — Telegram Mini App

Статическое приложение: HTML + CSS + Vanilla JS. Без backend, данные — в LocalStorage.

## Деплой на GitHub Pages
1. Залейте файлы в репозиторий (index.html в корне).
2. Settings → Pages → Deploy from branch → `main` / root.
3. В @BotFather: `/newapp` (или Menu Button) → укажите URL `https://<user>.github.io/<repo>/`.

## Настройки
Все константы (курсы, минимум, ставки, список залогов) — `CONFIG` в `js/state.js`.

## Структура
- `telegram.js` — Telegram Web App API (MainButton, BackButton, haptic)
- `storage.js` — единственный доступ к LocalStorage
- `state.js` — состояние, кредиты, расчёты залога
- `rates.js` — курсы и случайная история для графиков
- `router.js` — переключение страниц
- `pages/`, `components/` — страницы и UI
