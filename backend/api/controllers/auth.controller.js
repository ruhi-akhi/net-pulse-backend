const asyncHandler = require('../utils/asyncHandler');
const { registerSchema, loginSchema } = require('../validators/auth.validator');
const { registerUser, authenticateUser, createToken } = require('../services/auth.service');

const register = asyncHandler(async (req, res) => {
  const value = await registerSchema.validateAsync(req.body);
  const user = await registerUser(value);
  const token = createToken(user);
  res.status(201).json({ status: 'success', data: { user: { id: user._id, name: user.name, email: user.email }, token } });
});

const login = asyncHandler(async (req, res) => {
  const value = await loginSchema.validateAsync(req.body);
  const user = await authenticateUser(value);
  const token = createToken(user);
  res.json({ status: 'success', data: { user: { id: user._id, name: user.name, email: user.email }, token } });
});

const profile = asyncHandler(async (req, res) => {
  res.json({ status: 'success', data: { user: req.user } });
});

module.exports = { register, login, profile };
