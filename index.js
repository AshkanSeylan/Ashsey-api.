const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());

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
console.log('Server is running...');
});
