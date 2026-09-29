import * as tg from './telegram.js';
import { register, start } from './router.js';
import loan from './pages/loan.js';
import collateral from './pages/collateral.js';
import terms from './pages/terms.js';
import invest from './pages/invest.js';

tg.init();
register('/loan', loan, { tab: 'loan' });
register('/collateral', collateral, { tab: 'loan', back: true, guard: collateral.guard });
register('/terms', terms, { tab: 'terms' });
register('/invest', invest, { tab: 'invest' });
start(document.getElementById('view'), document.getElementById('nav'));
