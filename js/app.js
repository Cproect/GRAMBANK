import * as tg from './telegram.js';
import { register, start } from './router.js';
import credit from './pages/credit.js';
import terms from './pages/terms.js';
import invest from './pages/invest.js';

tg.init();
const u = tg.getUser();
if (u) document.getElementById('user').textContent = u.first_name || u.username || '';

register('credit', credit);
register('terms', terms);
register('invest', invest);

start(document.getElementById('view'), document.getElementById('nav'),
  [{ id: 'credit', label: 'Взять кредит' }, { id: 'terms', label: 'Условия' }, { id: 'invest', label: 'Инвестиции' }],
  'credit');
