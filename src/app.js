const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/error.middleware');
require('express-async-errors');

const app = express();

app.use(helmet());

// === এই অংশটুকু আপডেট করা হয়েছে (CORS FIX) ===
const allowedOrigins = [
  'http://localhost:5173', // Local React App
  'https://net-pulse-frontend-4pcq9e8yu-ruhi-buiya.vercel.app' // তোমার আসল লাইভ ফ্রন্টেন্ড লিংক
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    // exact match অথবা vercel এর যেকোনো সাব-ডোমেইন বা প্রিভিউ লিংক অ্যালাউ করার জন্য
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    } else {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
// ===================================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({ message: 'Net Pulse API is running' });
});

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;