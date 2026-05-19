const express = require('express');
const {
  downloadDummyFile,
  ping,
  recordTest,
  listTests,
  getTest,
  deleteTestRecord,
  latestTest,
  uploadDummyData,
} = require('../controllers/test.controller');
const authMiddleware = require('../middleware/auth.middleware');
const optionalAuthMiddleware = require('../middleware/optionalAuth.middleware');

const router = express.Router();

router.get('/download', downloadDummyFile);
router.get('/ping', ping);
router.post('/upload', uploadDummyData);
router.post('/record', optionalAuthMiddleware, recordTest);
router.get('/', authMiddleware, listTests);
router.get('/latest', authMiddleware, latestTest);
router.get('/:id', authMiddleware, getTest);
router.delete('/:id', authMiddleware, deleteTestRecord);

module.exports = router;
