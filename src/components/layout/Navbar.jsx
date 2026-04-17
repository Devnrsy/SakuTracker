import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, List } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 flex justify-around items-center py-3 pb-4 z-50">
      {/* BERANDA */}
      <Link
        to="/"
        className={`flex flex-col items-center p-2 ${
          location.pathname === '/' ? 'text-emerald-600' : 'text-gray-400'
        }`}
      >
        <Home size={24} />
        <span className="text-xs font-medium mt-1">Beranda</span>
      </Link>

      {/* LOGS */}
      <Link
        to="/logs"
        className={`flex flex-col items-center p-2 ${
          location.pathname === '/logs' ? 'text-emerald-600' : 'text-gray-400'
        }`}
      >
        <List size={24} />
        <span className="text-xs font-medium mt-1">Logs</span>
      </Link>
    </nav>
  );
};

export default Navbar;
