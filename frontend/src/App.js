import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TICKERS from './data/sp500.json';

const API_KEY = process.env.REACT_APP_FINNHUB_API_KEY;

function App() {
  const [watchlist, setWatchlist] = useState([]);
  const [newTicker, setNewTicker] = useState('');
  const [prices, setPrices] = useState({});
  const [topMovers, setTopMovers] = useState({ gainers: [], losers: [] });

  useEffect(() => {
    fetchWatchlist();
    fetchTopMovers();
    const moverInterval = setInterval(fetchTopMovers, 60000);
    return () => clearInterval(moverInterval);
  }, []);

  useEffect(() => {
    if (watchlist.length > 0) {
      fetchPrices();
    }
  }, [watchlist]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (watchlist.length > 0) {
        fetchPrices();
      }
    }, 30000); // 30 seconds
  
    return () => clearInterval(interval);
  }, [watchlist]);
  

  const fetchWatchlist = async () => {
    const res = await axios.get('/api/watchlist/');
    setWatchlist(res.data);
  };

  const fetchPrices = async () => {
    const newPrices = {};
    for (let item of watchlist) {
      try {
        const res = await axios.get(`https://finnhub.io/api/v1/quote`, {
          params: {
            symbol: item.ticker,
            token: API_KEY,
          },
        });
        newPrices[item.ticker] = res.data;
      } catch (err) {
        console.error(`Error fetching ${item.ticker}:`, err);
      }
    }
    setPrices(newPrices);
  };

  const addTicker = async (e) => {
    e.preventDefault();
    if (!newTicker.trim()) return;
    await axios.post('/api/watchlist/', { ticker: newTicker.trim().toUpperCase() });
    setNewTicker('');
    fetchWatchlist();
  };

  const fetchTopMovers = async () => {
    // Shuffle and sample ~50 tickers
    const sampled = [...TICKERS].sort(() => 0.5 - Math.random()).slice(0, 50);
    const allData = [];
  
    for (let symbol of sampled) {
      try {
        const res = await axios.get('https://finnhub.io/api/v1/quote', {
          params: { symbol, token: API_KEY },
        });
        const quote = res.data;
        allData.push({ symbol, ...quote });
      } catch (err) {
        console.error(`Failed to fetch ${symbol}:`, err);
      }
    }
  
    const sorted = [...allData].sort((a, b) => b.dp - a.dp);
    setTopMovers({
      gainers: sorted.slice(0, 5),
      losers: sorted.slice(-5).reverse(),
    });    
  };
  

  return (
    <div style={{ padding: 30 }}>
      <div style={{
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        background: '#111',
        color: 'white',
        padding: '10px 0',
        fontWeight: 'bold',
        fontSize: '16px',
        borderBottom: '2px solid #444',
        position: 'relative',
      }}>
        <div style={{
          display: 'inline-block',
          paddingLeft: '100%',
          animation: 'scroll-left 30s linear infinite',
        }}>
          {[...topMovers.gainers, ...topMovers.losers, ...topMovers.gainers, ...topMovers.losers].map((stock, idx) => {
            const color = stock.dp > 0 ? 'limegreen' : 'salmon';
            const sign = stock.dp > 0 ? '+' : '';
            return (
              <span key={`${stock.symbol}-${idx}`} style={{ marginRight: 40, color }}>
                {stock.symbol}: ${stock.c?.toFixed(2)} ({sign}{stock.dp?.toFixed(2)}%)
              </span>
            );
          })}
        </div>
      </div>

      <h1>📈 My Watchlist</h1>
      <form onSubmit={addTicker}>
        <input
          value={newTicker}
          onChange={(e) => setNewTicker(e.target.value)}
          placeholder="Add Ticker (e.g. AAPL)"
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {watchlist.map((item) => {
          const quote = prices[item.ticker];
          const price = quote?.c;
          const change = quote?.dp;
          const color = change > 0 ? 'green' : change < 0 ? 'red' : 'black';
          return (
            <li key={item.id}>
              {item.ticker}{' '}
              {price !== undefined && (
                <span style={{ color }}>
                  ${price.toFixed(2)} ({change?.toFixed(2)}%) | Open: {quote.o} High: {quote.h} Low: {quote.l}
                </span>
              )}
              <button
                onClick={async () => {
                  await axios.delete(`/api/watchlist/${item.id}/`);
                  fetchWatchlist();
                }}
                style={{ marginLeft: 10, color: 'gray', border: 'none', background: 'none', cursor: 'pointer' }}
              >
                Delete ❌
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
