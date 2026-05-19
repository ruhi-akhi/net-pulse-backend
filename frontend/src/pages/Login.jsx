import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login.');
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-[32px] border border-neutral-900 bg-neutral-950/90 p-8 shadow-glow">
      <h1 className="text-3xl font-bold text-white">Sign in to <span className="text-emerald-400">Net Pulse</span></h1>
      <p className="mt-2 text-sm text-gray-400">Access your speed history and analytics with a secure JWT session.</p>

      {error && <div className="mt-6 rounded-3xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">Email</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-3 w-full rounded-3xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-white outline-none transition focus:border-emerald-500" />
        </label>

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">Password</span>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-3 w-full rounded-3xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-white outline-none transition focus:border-emerald-500" />
        </label>

        <button type="submit" className="w-full rounded-3xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400">Sign In</button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-400">New here? <Link to="/register" className="text-emerald-400 hover:text-emerald-200">Create an account</Link></p>
    </div>
  );
}
