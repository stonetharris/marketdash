import React from 'react';

function WatchlistItems({ watchlist, prices, onDelete }) {
  return (
    <ul className="space-y-2 text-sm">
      {watchlist.map((item) => {
        const quote = prices[item.ticker];
        const price = quote?.c;
        const change = quote?.dp;
        const color = change > 0 ? 'text-green-500' : change < 0 ? 'text-red-500' : 'text-gray-600';

        return (
          <li key={item.id} className="flex justify-between items-center">
            <span>
              <span className="font-medium">{item.ticker}</span>{' '}
              {price !== undefined && (
                <span className={`${color}`}>
                  ${price.toFixed(2)} ({change?.toFixed(2)}%) |
                  <span className="text-xs text-gray-500 ml-1">
                    Open: {quote.o} High: {quote.h} Low: {quote.l}
                  </span>
                </span>
              )}
            </span>
            <button
              onClick={() => onDelete(item.id)}
              className="text-red-600 hover:text-red-800 text-sm ml-3"
            >
              ❌
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default WatchlistItems;