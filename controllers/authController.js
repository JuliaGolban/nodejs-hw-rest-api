const service = require('../service/authService');

// Registration
const signup = async (req, res) => {
  const user = await service.signup(req.body);
  const { username, email, subscription } = user;
  res.status(201).json({ user: { username, email, subscription } });
};

// Login
const login = async (req, res) => {
  const { token, userWithToken } = await service.login(req.body);
  const { username, email, subscription } = userWithToken;
  res.json({ token: token, user: { username, email, subscription } });
};

// Logout
const logout = async (req, res) => {
  await service.logout(req.user._id);
  res.status(204).json();
};

module.exports = { signup, login, logout };
