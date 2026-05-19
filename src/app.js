const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/error.middleware');
require('express-async-errors');

const app = express();

app.use(helmet());

// CORS পলিসি ফিক্স করার জন্য কাস্টম কনফিগারেশন
app.use(cors({
  origin: '*', // সাময়িকভাবে সব ডোমেইন ওপen রাখা হলো যাতে আপনার কোনো সাব-ডোমেইনও ব্লক না হয়
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

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