const service = require('../service/authService');

// Registration
const signup = async (req, res) => {
  const user = await service.signup(req.body);
  const { email, subscription } = user;
  res.status(201).json({ user: { email, subscription } });
};

// Login
const login = async (req, res, next) => {
  const user = await service.login(req.body);
  const { email, subscription, token } = user;
  res.json({ token: token, user: { email, subscription } });
};

// Logout
const logout = async (req, res) => {
  await service.logout(req.user._id);
  res.status(204);
};

// Get the current user by token
const getUser = async (req, res, next) => {
  const user = await service.authUser(req.user.token);
  res.json(user.email, user.subscription);
};

module.exports = { signup, login, logout, getUser };
