import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, List } from 'lucide-react';
const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 w-full md:w-100 bg-white border-t border-gray-200 flex justify-around py-3 z-50">
      <Link
        to="/"
        className={`flex flex-col items-center p-2 ${location.pathname === '/' ? 'text-emerald-800' : 'text-gray-400'}`}
      >
        <Home size={24} />
        <span className="text-md font-medium mt-1 animate-bounce">Beranda</span>
      </Link>

      <Link
        to="/logs"
        className={`flex flex-col items-center p-2 ${location.pathname === '/logs' ? 'text-emerald-800' : 'text-gray-400'}`}
      >
        <List size={24} />
        <span className="text-md font-medium mt-1 animate-bounce">Logs</span>
      </Link>
    </nav>
  );
};

export default Navbar;
