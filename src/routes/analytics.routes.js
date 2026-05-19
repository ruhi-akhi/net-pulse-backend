const express = require('express');
const { analytics, dashboard } = require('../controllers/analytics.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', authMiddleware, analytics);
router.get('/dashboard', authMiddleware, dashboard);

module.exports = router;
