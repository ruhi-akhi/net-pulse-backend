const SpeedTest = require('../models/speedTest.model');

const getAnalytics = async (userId) => {
  const matchStage = userId ? { userId } : {};

  const results = await SpeedTest.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalTests: { $sum: 1 },
        averageDownload: { $avg: '$downloadSpeed' },
        averageUpload: { $avg: '$uploadSpeed' },
        averagePing: { $avg: '$ping' },
        bestSpeed: { $max: '$downloadSpeed' },
        worstSpeed: { $min: '$downloadSpeed' },
      },
    },
  ]);

  const summary = results[0] || {
    totalTests: 0,
    averageDownload: 0,
    averageUpload: 0,
    averagePing: 0,
    bestSpeed: 0,
    worstSpeed: 0,
  };

  return {
    totalTests: summary.totalTests,
    averageDownload: Number(summary.averageDownload.toFixed(2) || 0),
    averageUpload: Number(summary.averageUpload.toFixed(2) || 0),
    averagePing: Number(summary.averagePing.toFixed(2) || 0),
    bestSpeed: Number(summary.bestSpeed.toFixed(2) || 0),
    worstSpeed: Number(summary.worstSpeed.toFixed(2) || 0),
  };
};

const getDashboard = async (userId) => {
  const latestTest = await SpeedTest.findOne(userId ? { userId } : {}).sort({ testTime: -1 });
  const analytics = await getAnalytics(userId);

  const trendData = await SpeedTest.find(userId ? { userId } : {})
    .sort({ testTime: 1 })
    .limit(30)
    .select('testTime downloadSpeed uploadSpeed ping networkQuality');

  return { latestTest, analytics, trendData };
};

module.exports = { getAnalytics, getDashboard };
