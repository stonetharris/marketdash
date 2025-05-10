import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import TICKERS from './data/sp500.json';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TickerBanner from './components/TickerBanner';
import WatchlistForm from './components/WatchlistForm';
import WatchlistItems from './components/WatchlistItems';

const API_KEY = process.env.REACT_APP_FINNHUB_API_KEY;

function App() {
  const [watchlist, setWatchlist] = useState([]);
  const [newTicker, setNewTicker] = useState('');
  const [prices, setPrices] = useState({});
  const [topMovers, setTopMovers] = useState({ gainers: [], losers: [] });

  const fetchPrices = useCallback(async () => {
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
  }, [watchlist]);

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
    <>
      <Navbar />

      <main className="px-6 py-8 max-w-4xl mx-auto">
        <TickerBanner topMovers={topMovers} />

        <h1 className="text-4xl font-bold text-teal-400 mb-6 mt-8">📈 My Watchlist</h1>

        <WatchlistForm
          newTicker={newTicker}
          setNewTicker={setNewTicker}
          addTicker={addTicker}
        />

        <WatchlistItems
          watchlist={watchlist}
          prices={prices}
          onDelete={async (id) => {
            await axios.delete(`/api/watchlist/${id}/`);
            fetchWatchlist();
          }}
        />
      </main>

      <Footer />
    </>

  );
}

export default App;
