const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Authentication required' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId).select('-passwordHash');
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Invalid authentication token' });
    }
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authMiddleware;
