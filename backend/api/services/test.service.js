const SpeedTest = require('../models/speedTest.model');
const { getNetworkQuality } = require('../utils/networkQuality');

const createSpeedTest = async ({ userId, downloadSpeed, uploadSpeed, ping, jitter, ispProvider, ipAddress, testTime }) => {
  const networkQuality = getNetworkQuality({ downloadSpeed, ping });

  const record = await SpeedTest.create({
    userId: userId || null,
    downloadSpeed,
    uploadSpeed,
    ping,
    jitter,
    ispProvider: ispProvider || 'unknown',
    ipAddress,
    networkQuality,
    testTime,
  });

  return record;
};

const getTests = async ({ userId, startDate, endDate, minSpeed, maxPing }) => {
  const filter = {};

  if (userId) filter.userId = userId;
  if (startDate || endDate) {
    filter.testTime = {};
    if (startDate) filter.testTime.$gte = new Date(startDate);
    if (endDate) filter.testTime.$lte = new Date(endDate);
  }
  if (minSpeed !== undefined) filter.downloadSpeed = { $gte: Number(minSpeed) };
  if (maxPing !== undefined) filter.ping = { $lte: Number(maxPing) };

  return SpeedTest.find(filter).sort({ testTime: -1 });
};

const getTestById = async (id, userId) => {
  const query = { _id: id };
  if (userId) query.userId = userId;
  const record = await SpeedTest.findOne(query);
  if (!record) {
    const error = new Error('Test record not found');
    error.status = 404;
    throw error;
  }
  return record;
};

const deleteTest = async (id, userId) => {
  const query = { _id: id };
  if (userId) query.userId = userId;
  const deleted = await SpeedTest.findOneAndDelete(query);
  if (!deleted) {
    const error = new Error('Test record not found');
    error.status = 404;
    throw error;
  }
  return deleted;
};

const getLatestTest = async (userId) => {
  const filter = userId ? { userId } : {};
  return SpeedTest.findOne(filter).sort({ testTime: -1 });
};

module.exports = { createSpeedTest, getTests, getTestById, deleteTest, getLatestTest };
