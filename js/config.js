// Единый конфиг: все курсы, проценты, лимиты и настройки
const R = { prPerGram: 0.3, gramPerStar: 3500, starsPerUsdt: 100 };

export const CONFIG = {
  brand: 'GRAM Bank',
  minLoan: 7000,
  rates: R,
  interest: { startDaily: 0.5, dailyStep: 0.5, maxDays: 30, defaultDays: 7 }, // % в день
  insurance: { start: 10, min: 5, stepPerGoodLoan: 1 },                        // %
  collateralRatio: 1,                                                          // залог = сумма кредита × ratio
  demoCash: 1,                                                                 // стартовый баланс, USDT
  periods: { '7D': 7, '30D': 30, '90D': 90, '1Y': 365 },
  collateral: [
    { id: 'usd',   name: 'USD',            unit: 'USD',  dec: 4 },
    { id: 'usdt',  name: 'USDT / крипто',  unit: 'USDT', dec: 4 },
    { id: 'stars', name: 'Telegram Stars', unit: '★',    dec: 2 },
    { id: 'gifts', name: 'Telegram Gifts', unit: 'шт.',  perItemStars: 25,  whole: true },
    { id: 'nft',   name: 'NFT',            unit: 'шт.',  perItemStars: 500, whole: true }
  ],
  assets: [
    { id: 'gram',   name: 'GRAM',           unit: 'USDT',          dec: 8, base: 1 / R.gramPerStar / R.starsPerUsdt, vol: 0.04,   seed: 11 },
    { id: 'prgram', name: 'PR GRAM',        unit: 'PR за 1 GRAM',  dec: 3, base: R.prPerGram,     vol: 0.015,  seed: 23 },
    { id: 'usdt',   name: 'USDT',           unit: 'Stars за 1 USDT', dec: 2, base: R.starsPerUsdt, vol: 0.0008, seed: 37 },
    { id: 'stars',  name: 'Telegram Stars', unit: 'GRAM за 1 Star', dec: 0, base: R.gramPerStar,  vol: 0.012,  seed: 51 }
  ]
};
