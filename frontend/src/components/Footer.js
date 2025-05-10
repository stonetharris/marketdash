import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 text-center py-3 mt-10 text-xs">
      &copy; {new Date().getFullYear()} MarketDash. Built by Stone Harris.
    </footer>
  );
}

export default Footer;
