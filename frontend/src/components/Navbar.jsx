import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 py-5 border-b border-neutral-900 mb-8">
      <Link to="/" className="text-2xl font-extrabold tracking-tight text-white hover:text-emerald-400 transition-colors">
        Net <span className="text-emerald-400">Pulse</span>
      </Link>

      <nav className="flex flex-wrap items-center gap-3 text-sm font-medium text-gray-300">
        <Link to="/" className="hover:text-white transition-colors">Test</Link>
        <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
        {user ? (
          <button onClick={logout} className="rounded-full border border-neutral-800 bg-neutral-900 px-4 py-2 text-emerald-400 hover:bg-emerald-500/10 transition-colors">
            Logout
          </button>
        ) : (
          <Link to="/login" className="rounded-full bg-emerald-500 px-4 py-2 text-neutral-950 hover:bg-emerald-600 transition-colors">
            Sign In
          </Link>
        )}
      </nav>
    </header>
  );
}
