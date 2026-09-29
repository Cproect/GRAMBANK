# GRAM Bank — демо Telegram Mini App

Статический прототип: HTML, CSS, Vanilla JS (ES-модули), LocalStorage. Без backend. Все операции и курсы — демонстрационные.

## Публикация
1. Загрузите содержимое папки в корень репозитория GitHub.
2. Settings → Pages → Deploy from branch → `main` / root.
3. В @BotFather: `/newapp` (или Menu Button) → URL `https://<user>.github.io/<repo>/`.

## Настройка
Все курсы, ставки, страховка, лимиты, залоги и активы — в `js/config.js`.

## Структура
`js/telegram.js` — Telegram Web App API · `js/storage.js` — LocalStorage · `js/state.js` — состояние · `js/router.js` — hash-навигация · `js/calc.js` — расчёты и демо-история цен · `js/pages/` — экраны · `js/components/` — компоненты.

Локальный запуск: `python3 -m http.server` (ES-модули не работают с `file://`).
