const asyncHandler = require('../utils/asyncHandler');
const { recordTestSchema } = require('../validators/test.validator');
const { createSpeedTest, getTests, getTestById, deleteTest, getLatestTest } = require('../services/test.service');

const downloadDummyFile = asyncHandler(async (req, res) => {
  const sizeInMb = Number(process.env.DUMMY_FILE_SIZE_MB || 5);
  const fileSize = sizeInMb * 1024 * 1024;
  const buffer = Buffer.alloc(fileSize, '0');

  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Disposition', `attachment; filename="net-pulse-test-${sizeInMb}mb.bin"`);
  res.setHeader('Content-Length', buffer.length);
  res.send(buffer);
});

const uploadDummyData = asyncHandler(async (req, res) => {
  const sizeBytes = Number(req.body.sizeBytes || 0);
  res.json({ status: 'success', data: { sizeBytes, receivedAt: new Date().toISOString() } });
});

const ping = asyncHandler(async (req, res) => {
  res.json({ status: 'success', data: { ts: new Date().toISOString() } });
});

const recordTest = asyncHandler(async (req, res) => {
  const payload = await recordTestSchema.validateAsync(req.body, { stripUnknown: true });
  const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const userId = req.user ? req.user._id : null;
  const record = await createSpeedTest({ userId, ipAddress, ...payload });
  res.status(201).json({ status: 'success', data: record });
});

const listTests = asyncHandler(async (req, res) => {
  const { startDate, endDate, minSpeed, maxPing } = req.query;
  const userId = req.user ? req.user._id : null;
  const tests = await getTests({ userId, startDate, endDate, minSpeed, maxPing });
  res.json({ status: 'success', data: tests });
});

const getTest = asyncHandler(async (req, res) => {
  const test = await getTestById(req.params.id, req.user ? req.user._id : null);
  res.json({ status: 'success', data: test });
});

const deleteTestRecord = asyncHandler(async (req, res) => {
  await deleteTest(req.params.id, req.user ? req.user._id : null);
  res.json({ status: 'success', message: 'Speed test deleted' });
});

const latestTest = asyncHandler(async (req, res) => {
  const record = await getLatestTest(req.user ? req.user._id : null);
  res.json({ status: 'success', data: record });
});

module.exports = {
  downloadDummyFile,
  uploadDummyData,
  ping,
  recordTest,
  listTests,
  getTest,
  deleteTestRecord,
  latestTest,
};
