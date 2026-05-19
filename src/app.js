const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/error.middleware');
require('express-async-errors');

const app = express();

app.use(helmet());

// ========================================================
// ১. পুরোনো app.use(cors(...)) বাদ দিয়ে ঠিক এই জায়গায় নতুন কোডটি বসাও:
app.use(cors({
  origin: function (origin, callback) {
    // যেকোনো অরিজিন বা ডোমেইনকেই ট্রু করে দেবে, কোনো এরর ধরবে না
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
// ========================================================

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