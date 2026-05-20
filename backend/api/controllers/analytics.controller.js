const asyncHandler = require('../utils/asyncHandler');
const { getAnalytics, getDashboard } = require('../services/analytics.service');

const analytics = asyncHandler(async (req, res) => {
  const data = await getAnalytics(req.user ? req.user._id : null);
  res.json({ status: 'success', data });
});

const dashboard = asyncHandler(async (req, res) => {
  const data = await getDashboard(req.user ? req.user._id : null);
  res.json({ status: 'success', data });
});

module.exports = { analytics, dashboard };
