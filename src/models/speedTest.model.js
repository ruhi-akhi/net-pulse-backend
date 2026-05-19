const mongoose = require('mongoose');

const speedTestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    downloadSpeed: { type: Number, required: true },
    uploadSpeed: { type: Number, required: true },
    ping: { type: Number, required: true },
    jitter: { type: Number, default: 0 },
    ipAddress: { type: String },
    ispProvider: { type: String, default: 'unknown' },
    networkQuality: { type: String, required: true },
    testTime: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const SpeedTest = mongoose.model('SpeedTest', speedTestSchema);

module.exports = SpeedTest;
