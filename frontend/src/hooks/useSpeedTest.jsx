import { useCallback, useState } from 'react';
import API from '../services/api';

const useSpeedTest = () => {
  const [metrics, setMetrics] = useState({ ping: 0, download: 0, upload: 0, jitter: 0 });
  const [stage, setStage] = useState('Idle');
  const [running, setRunning] = useState(false);
  const [error, setError] = useState(null);

  const runTest = useCallback(async () => {
    setRunning(true);
    setError(null);
    setStage('Measuring latency');
    setMetrics({ ping: 0, download: 0, upload: 0, jitter: 0 });

    try {
      const pingTimes = [];
      for (let index = 0; index < 4; index += 1) {
        const start = performance.now();
        await API.get('/tests/ping');
        const end = performance.now();
        pingTimes.push(end - start);
      }

      const averagePing = Math.round(pingTimes.reduce((sum, value) => sum + value, 0) / pingTimes.length);
      const jitter = Math.round(pingTimes.slice(1).reduce((sum, value, idx) => sum + Math.abs(value - pingTimes[idx]), 0) / (pingTimes.length - 1));
      setMetrics((current) => ({ ...current, ping: averagePing, jitter }));

      setStage('Measuring download speed');
      const downloadStart = performance.now();
      const downloadResponse = await API.get('/tests/download', {
        responseType: 'blob',
      });
      const downloadEnd = performance.now();
      const downloadSeconds = (downloadEnd - downloadStart) / 1000;
      const downloadBits = downloadResponse.data.size * 8;
      const downloadMbps = Number(((downloadBits / (1024 * 1024)) / downloadSeconds).toFixed(2));
      setMetrics((current) => ({ ...current, download: downloadMbps }));

      setStage('Measuring upload speed');
      const uploadSize = 5 * 1024 * 1024;
      const uploadStart = performance.now();
      await API.post('/tests/upload', { sizeBytes: uploadSize });
      const uploadEnd = performance.now();
      const uploadSeconds = (uploadEnd - uploadStart) / 1000;
      const uploadMbps = Number(((uploadSize * 8 / (1024 * 1024)) / uploadSeconds).toFixed(2));
      setMetrics((current) => ({ ...current, upload: uploadMbps }));

      setStage('Saving results');
      await API.post('/tests/record', {
        downloadSpeed: downloadMbps,
        uploadSpeed: uploadMbps,
        ping: averagePing,
        jitter,
        ispProvider: 'Net Pulse Browser',
      });

      setStage('Completed');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to complete the speed test.');
      setStage('Failed');
    } finally {
      setRunning(false);
    }
  }, []);

  return { metrics, stage, running, error, runTest };
};

export default useSpeedTest;
