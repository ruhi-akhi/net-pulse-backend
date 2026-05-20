const notFoundHandler = (req, res) => {
  res.status(404).json({ status: 'error', message: 'Route not found' });
};

const errorHandler = (err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  if (err.isJoi) {
    return res.status(400).json({ status: 'fail', message: err.details[0].message });
  }

  res.status(status).json({ status: 'error', message });
};

module.exports = { notFoundHandler, errorHandler };
