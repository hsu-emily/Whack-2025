// src/components/NavBar.jsx
import { Link, useLocation } from 'react-router-dom';

export default function NavBar() {
  const location = useLocation();

  return (
    <nav className="w-full flex justify-center mt-6 sm:mt-8">
      <div
        className="
          flex items-center justify-between
          px-4 sm:px-8 py-2
          rounded-full shadow-lg bg-white/90 border border-gray-200
          w-[98vw] max-w-[95vw] sm:max-w-xl
        "
      >
        {/* Left: App Name */}
        <span className="font-bold text-base sm:text-lg text-pink-500" style={{ fontFamily: 'inherit' }}>
          Punchie
        </span>

        {/* Right: Nav Links and Bunny */}
        <div className="flex items-center space-x-1 sm:space-x-2 ml-4 sm:ml-8">
          <Link
            to="/"
            className={`mx-1 sm:mx-2 px-1 sm:px-2 py-1 font-semibold transition ${
              location.pathname === '/' ? 'text-pink-500' : 'text-gray-700 hover:text-pink-400'
            }`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`mx-1 sm:mx-2 px-1 sm:px-2 py-1 font-semibold transition ${
              location.pathname === '/about' ? 'text-pink-500' : 'text-gray-700 hover:text-pink-400'
            }`}
          >
            About
          </Link>
          <Link
            to="/login"
            className={`mx-1 sm:mx-2 px-1 sm:px-2 py-1 font-semibold transition ${
              location.pathname === '/login' ? 'text-pink-500' : 'text-gray-700 hover:text-pink-400'
            }`}
          >
            Login
          </Link>
          <span className="ml-2 sm:ml-3 text-xl sm:text-2xl" title="Bunny">

            
          </span>
        </div>
      </div>
    </nav>
  );
}