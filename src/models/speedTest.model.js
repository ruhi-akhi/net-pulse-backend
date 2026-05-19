const mongoose = require('mongoose');

const speedTestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    downloadSpeed: { type: Number, required: true },
    uploadSpeed: { type: Number, required: true },
    ping: { type: Number, required: true },
    jitter: { type: Number, required: true },
    ipAddress: { type: String },
    ispProvider: { type: String, default: 'unknown' },
    networkQuality: { type: String, required: true },
    testTime: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

speedTestSchema.index({ userId: 1, testTime: -1 });
speedTestSchema.index({ downloadSpeed: 1 });

const SpeedTest = mongoose.model('SpeedTest', speedTestSchema);

module.exports = SpeedTest;
