import React from 'react';

function TickerBanner({ topMovers }) {
  return (
    <div className="whitespace-nowrap overflow-hidden bg-black text-white py-2 border-b-2 border-gray-700 text-sm font-semibold">
      <div className="inline-block animate-scroll-left pl-[100%]">
        {[...topMovers.gainers, ...topMovers.losers, ...topMovers.gainers, ...topMovers.losers].map((stock, idx) => {
          const color = stock.dp > 0 ? 'text-green-400' : 'text-red-400';
          const sign = stock.dp > 0 ? '+' : '';
          return (
            <span key={`${stock.symbol}-${idx}`} className={`${color} mr-10`}>
              {stock.symbol}: ${stock.c?.toFixed(2)} ({sign}{stock.dp?.toFixed(2)}%)
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default TickerBanner;