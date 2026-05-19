import useSpeedTest from '../hooks/useSpeedTest';

export default function Home() {
  const { metrics, stage, running, error, runTest } = useSpeedTest();

  return (
    <div className="space-y-10">
      <section className="rounded-[32px] border border-neutral-900 bg-neutral-950/90 p-8 shadow-glow">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-400/90">Live speed test</p>
            <h1 className="mt-4 text-4xl font-bold text-white">Black &amp; Emerald Performance Meter</h1>
            <p className="mt-3 max-w-2xl text-sm text-gray-400">Run a real-world latency, download and upload measurement. Save results immediately to the Net Pulse dashboard.</p>
          </div>
          <button
            type="button"
            onClick={runTest}
            disabled={running}
            className="inline-flex items-center justify-center rounded-3xl bg-emerald-500 px-7 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {running ? 'Running test...' : 'Start Speed Test'}
          </button>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-neutral-900 bg-black/70 p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-gray-500">Latency</p>
            <p className="mt-4 text-4xl font-semibold text-emerald-400">{metrics.ping || '--'} <span className="text-sm font-medium text-gray-400">ms</span></p>
          </div>
          <div className="rounded-3xl border border-neutral-900 bg-black/70 p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-gray-500">Download</p>
            <p className="mt-4 text-4xl font-semibold text-white">{metrics.download || '--'} <span className="text-sm font-medium text-gray-400">Mbps</span></p>
          </div>
          <div className="rounded-3xl border border-neutral-900 bg-black/70 p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-gray-500">Upload</p>
            <p className="mt-4 text-4xl font-semibold text-white">{metrics.upload || '--'} <span className="text-sm font-medium text-gray-400">Mbps</span></p>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-neutral-900 bg-black/70 p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Current stage</p>
              <p className="mt-1 text-sm text-gray-400">{stage}</p>
            </div>
            <div className="rounded-3xl bg-neutral-900 px-4 py-2 text-sm text-emerald-400">Jitter {metrics.jitter || '--'} ms</div>
          </div>
          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-neutral-900 bg-neutral-950/95 p-6">
          <h2 className="text-lg font-semibold text-white">How it works</h2>
          <ol className="mt-4 space-y-3 text-sm text-gray-300">
            <li>1. Ping latency is measured via <span className="text-emerald-400">/api/tests/ping</span>.</li>
            <li>2. Download sequence uses <span className="text-emerald-400">/api/tests/download</span> and browser timing.</li>
            <li>3. Upload speed uses <span className="text-emerald-400">/api/tests/upload</span>.</li>
            <li>4. Results are stored through <span className="text-emerald-400">/api/tests/record</span>.</li>
          </ol>
        </div>

        <div className="rounded-3xl border border-neutral-900 bg-neutral-950/95 p-6">
          <h2 className="text-lg font-semibold text-white">Use as guest</h2>
          <p className="mt-4 text-sm text-gray-300">The app records speed results for guests and logged-in users. Login to access analytics and history.</p>
        </div>

        <div className="rounded-3xl border border-neutral-900 bg-neutral-950/95 p-6">
          <h2 className="text-lg font-semibold text-white">Dark theme</h2>
          <p className="mt-4 text-sm text-gray-300">The dashboard is optimized for a premium black and emerald-green look with a clean minimal UI.</p>
        </div>
      </section>
    </div>
  );
}
