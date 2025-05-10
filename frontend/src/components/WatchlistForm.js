import React from 'react';

function WatchlistForm({ newTicker, setNewTicker, addTicker }) {
  return (
    <form onSubmit={addTicker} className="mb-4 flex items-center gap-2">
      <input
        value={newTicker}
        onChange={(e) => setNewTicker(e.target.value)}
        placeholder="Add Ticker (e.g. AAPL)"
        className="px-3 py-1 border rounded bg-gray-100 text-sm text-gray-800 focus:outline-none"
      />
      <button type="submit" className="bg-teal-500 text-white text-sm px-3 py-1 rounded hover:bg-teal-600">
        Add
      </button>
    </form>
  );
}

export default WatchlistForm;