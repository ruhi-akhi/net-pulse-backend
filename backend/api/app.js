const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('express-async-errors');

// Path corrected: points to the new 'api' folder
const routes = require('./api/routes');
const { errorHandler, notFoundHandler } = require('./api/middleware/error.middleware');

const app = express();

app.use(helmet());

// Hardcoded your frontend URL for rock-solid CORS with credentials
app.use(cors({
  origin: 'https://net-pulse-frontend.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
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