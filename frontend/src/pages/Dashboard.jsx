import { useEffect, useState, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { user, loading } = useContext(AuthContext);
  const [analytics, setAnalytics] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [speedFilter, setSpeedFilter] = useState('all');
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !loading) {
      navigate('/login');
      return;
    }

    if (user) {
      fetchDashboardStats();
      fetchHistory();
    }
  }, [user, loading, navigate]);

  const fetchDashboardStats = async () => {
    try {
      const analyticsRes = await API.get('/analytics');
      setAnalytics(analyticsRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to fetch analytics data.');
    }
  };

  const fetchHistory = async () => {
    setLoadingHistory(true);
    setError(null);
    setPage(1);
    try {
      const query = {};
      if (startDate) query.startDate = startDate;
      if (endDate) query.endDate = endDate;
      if (speedFilter === 'gt50') query.minSpeed = 50;
      if (speedFilter === 'lt20') query.maxPing = 20;

      const params = new URLSearchParams(query).toString();
      const url = params ? `/tests?${params}` : '/tests';
      const historyRes = await API.get(url);
      setHistory(historyRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to fetch history.');
    } finally {
      setLoadingHistory(false);
    }
  };

  const confirmDelete = (test) => {
    setDeleteCandidate(test);
  };

  const cancelDelete = () => {
    setDeleteCandidate(null);
  };

  const handleDelete = async () => {
    if (!deleteCandidate) return;
    try {
      await API.delete(`/tests/${deleteCandidate._id}`);
      setHistory((current) => current.filter((item) => item._id !== deleteCandidate._id));
      setDeleteCandidate(null);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete the selected test.');
      setDeleteCandidate(null);
    }
  };

  const pageCount = Math.max(1, Math.ceil(history.length / pageSize));
  const visibleHistory = useMemo(() => {
    const start = (page - 1) * pageSize;
    return history.slice(start, start + pageSize);
  }, [history, page]);

  const chartData = useMemo(
    () =>
      history.slice(-10).map((item) => ({
        name: new Date(item.testTime || item.createdAt || item.timestamp).toLocaleDateString(),
        Download: item.downloadSpeed ?? item.download_speed,
        Upload: item.uploadSpeed ?? item.upload_speed,
      })),
    [history]
  );

  return (
    <div className="space-y-8">
      <div className="rounded-[32px] border border-neutral-900 bg-neutral-950/90 p-8 shadow-glow">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-400/90">Dashboard</p>
            <h1 className="mt-4 text-4xl font-bold text-white">Your Network Insights</h1>
          </div>
        </div>

        {error && <p className="mt-6 text-sm text-red-400">{error}</p>}

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-neutral-900 bg-black/70 p-6">
            <span className="text-xs uppercase tracking-[0.35em] text-gray-500">Total tests</span>
            <p className="mt-4 text-3xl font-semibold text-emerald-400">{analytics?.totalTests ?? '--'}</p>
          </div>
          <div className="rounded-3xl border border-neutral-900 bg-black/70 p-6">
            <span className="text-xs uppercase tracking-[0.35em] text-gray-500">Avg download</span>
            <p className="mt-4 text-3xl font-semibold text-white">{analytics?.averageDownload ?? '--'} Mbps</p>
          </div>
          <div className="rounded-3xl border border-neutral-900 bg-black/70 p-6">
            <span className="text-xs uppercase tracking-[0.35em] text-gray-500">Avg upload</span>
            <p className="mt-4 text-3xl font-semibold text-white">{analytics?.averageUpload ?? '--'} Mbps</p>
          </div>
          <div className="rounded-3xl border border-neutral-900 bg-black/70 p-6">
            <span className="text-xs uppercase tracking-[0.35em] text-gray-500">Avg ping</span>
            <p className="mt-4 text-3xl font-semibold text-emerald-400">{analytics?.averagePing ?? '--'} ms</p>
          </div>
        </div>
      </div>

      <div className="rounded-[32px] border border-neutral-900 bg-neutral-950/90 p-8 shadow-glow">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Recent throughput trend</h2>
            <p className="mt-2 text-sm text-gray-400">The latest session summary and chart snapshot for your latest tests.</p>
          </div>
        </div>
        <div className="mt-8 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="downloadGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#6b7280" tick={{ fontSize: 12 }} />
              <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#060b10', borderColor: '#111827' }} />
              <Area type="monotone" dataKey="Download" stroke="#10b981" fill="url(#downloadGradient)" strokeWidth={2} />
              <Area type="monotone" dataKey="Upload" stroke="#6ee7b7" fillOpacity={0} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-[32px] border border-neutral-900 bg-neutral-950/90 p-8 shadow-glow">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">History</h2>
            <p className="mt-2 text-sm text-gray-400">Filter your saved tests by date and speed.</p>
          </div>
          <button
            type="button"
            onClick={fetchHistory}
            className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-emerald-400"
          >
            Apply filters
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <label className="block text-sm text-gray-300">
            <span className="text-xs uppercase tracking-[0.3em] text-gray-500">Start date</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-2 w-full rounded-3xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-white outline-none focus:border-emerald-500"
            />
          </label>
          <label className="block text-sm text-gray-300">
            <span className="text-xs uppercase tracking-[0.3em] text-gray-500">End date</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-2 w-full rounded-3xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-white outline-none focus:border-emerald-500"
            />
          </label>
          <label className="block text-sm text-gray-300">
            <span className="text-xs uppercase tracking-[0.3em] text-gray-500">Speed filter</span>
            <select
              value={speedFilter}
              onChange={(e) => setSpeedFilter(e.target.value)}
              className="mt-2 w-full rounded-3xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-white outline-none focus:border-emerald-500"
            >
              <option value="all">All tests</option>
              <option value="gt50">Download over 50 Mbps</option>
              <option value="lt20">Ping under 20 ms</option>
            </select>
          </label>
        </div>

        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm text-gray-300">
            <thead>
              <tr>
                <th className="px-4 py-3 text-gray-500">Date</th>
                <th className="px-4 py-3 text-gray-500">Download</th>
                <th className="px-4 py-3 text-gray-500">Upload</th>
                <th className="px-4 py-3 text-gray-500">Ping</th>
                <th className="px-4 py-3 text-gray-500">Quality</th>
                <th className="px-4 py-3 text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleHistory.map((item) => (
                <tr key={item._id} className="rounded-3xl border border-neutral-900 bg-black/60 mb-2">
                  <td className="px-4 py-4 text-gray-300">{new Date(item.testTime || item.createdAt || item.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-4 font-semibold text-emerald-400">{item.downloadSpeed ?? item.download_speed} Mbps</td>
                  <td className="px-4 py-4 text-gray-300">{item.uploadSpeed ?? item.upload_speed} Mbps</td>
                  <td className="px-4 py-4 text-gray-300">{item.ping} ms</td>
                  <td className="px-4 py-4">
                    <span className="inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">{item.networkQuality ?? item.network_quality}</span>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      type="button"
                      onClick={() => confirmDelete(item)}
                      className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300 transition hover:bg-red-500/20"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-400">
          <p>{history.length} tests found</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="rounded-full border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {page} of {pageCount}
            </span>
            <button
              type="button"
              onClick={() => setPage((prev) => Math.min(prev + 1, pageCount))}
              disabled={page === pageCount}
              className="rounded-full border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {loadingHistory && <p className="mt-4 text-sm text-gray-400">Refreshing history...</p>}
        {!loadingHistory && history.length === 0 && <p className="mt-4 text-sm text-gray-400">No test records found for the selected filter.</p>}
      </div>

      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
          <div className="w-full max-w-xl rounded-[32px] border border-neutral-800 bg-neutral-950 p-8 text-white shadow-glow">
            <h3 className="text-2xl font-semibold text-white">Confirm delete</h3>
            <p className="mt-4 text-sm text-gray-300">
              Are you sure you want to delete the speed test from <span className="font-semibold text-white">{new Date(deleteCandidate.testTime || deleteCandidate.createdAt || deleteCandidate.timestamp).toLocaleString()}</span> with download <span className="text-emerald-400">{deleteCandidate.downloadSpeed ?? deleteCandidate.download_speed} Mbps</span>?
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-3xl bg-red-500 px-5 py-3 text-sm font-semibold text-white hover:bg-red-400 transition"
              >
                Delete permanently
              </button>
              <button
                type="button"
                onClick={cancelDelete}
                className="rounded-3xl border border-neutral-700 bg-neutral-900 px-5 py-3 text-sm font-semibold text-gray-200 hover:border-white transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
