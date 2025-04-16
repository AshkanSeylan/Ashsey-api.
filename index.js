const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());

// Nouvelle route pour plusieurs cryptos
app.get('/binance-prices', async (req, res) => {
const symbolsParam = req.query.symbols;
if (!symbolsParam) return res.status(400).json({ error: 'Missing symbols parameter' });

const symbols = symbolsParam.split(',').map(s => s.trim().toUpperCase());
const results = {};

for (const symbol of symbols) {
try {
const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
const data = await response.json();
results[symbol] = {
price: data.lastPrice,
change: data.priceChangePercent,
volume: data.quoteVolume
};
} catch (error) {
results[symbol] = { error: true };
}
}

res.json(results);
});

// Ancienne route pour compatibilité
app.get('/binance-price', async (req, res) => {
const symbol = req.query.symbol;
if (!symbol) return res.status(400).json({ error: 'Symbol is required' });

try {
const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
const data = await response.json();

res.json({
symbol: data.symbol,
price: data.lastPrice,
change: data.priceChangePercent,
volume: data.quoteVolume
});
} catch (error) {
res.status(500).json({ error: 'Failed to fetch from Binance' });
}
});

app.listen(process.env.PORT || 3000, () => {
console.log('Ash & Sey server ready');
})
