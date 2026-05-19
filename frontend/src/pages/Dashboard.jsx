import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { user, loading } = useContext(AuthContext);
  const [analytics, setAnalytics] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !loading) {
      navigate('/login');
      return;
    }

    const fetchDashboard = async () => {
      try {
        const [analyticsRes, dashboardRes, historyRes] = await Promise.all([
          API.get('/analytics'),
          API.get('/analytics/dashboard'),
          API.get('/tests'),
        ]);

        setAnalytics(analyticsRes.data.data);
        setDashboardData(dashboardRes.data.data);
        setHistory(historyRes.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to fetch dashboard data.');
      }
    };

    fetchDashboard();
  }, [user, loading, navigate]);

  const chartData = (history || []).slice(-10).map((item) => ({
    name: new Date(item.testTime || item.createdAt || item.timestamp).toLocaleDateString(),
    Download: item.downloadSpeed || item.download_speed,
    Upload: item.uploadSpeed || item.upload_speed,
  }));

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
        <h2 className="text-xl font-semibold text-white mb-6">Recent throughput trend</h2>
        <div className="h-80">
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
        <h2 className="text-xl font-semibold text-white mb-6">History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm text-gray-300">
            <thead>
              <tr>
                <th className="px-4 py-3 text-gray-500">Date</th>
                <th className="px-4 py-3 text-gray-500">Download</th>
                <th className="px-4 py-3 text-gray-500">Upload</th>
                <th className="px-4 py-3 text-gray-500">Ping</th>
                <th className="px-4 py-3 text-gray-500">Quality</th>
              </tr>
            </thead>
            <tbody>
              {(history || []).slice(0, 10).map((item) => (
                <tr key={item._id} className="rounded-3xl border border-neutral-900 bg-black/60 mb-2">
                  <td className="px-4 py-4">{new Date(item.testTime || item.createdAt || item.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-4 font-semibold text-emerald-400">{item.downloadSpeed ?? item.download_speed} Mbps</td>
                  <td className="px-4 py-4">{item.uploadSpeed ?? item.upload_speed} Mbps</td>
                  <td className="px-4 py-4">{item.ping} ms</td>
                  <td className="px-4 py-4">
                    <span className="inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">{item.networkQuality ?? item.network_quality}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
