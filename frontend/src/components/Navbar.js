import React from 'react';

function Navbar() {
  return (
    <nav className="bg-gray-900 text-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-teal-400">📊 MarketDash</h1>
        <ul className="flex space-x-4 text-sm">
          <li><a href="/" className="hover:text-teal-300">Dashboard</a></li>
          <li><a href="/about" className="hover:text-teal-300">About</a></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
