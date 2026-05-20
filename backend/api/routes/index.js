const express = require('express');
const authRoutes = require('./auth.routes');
const testRoutes = require('./test.routes');
const analyticsRoutes = require('./analytics.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/tests', testRoutes);
router.use('/analytics', analyticsRoutes);

module.exports = router;
