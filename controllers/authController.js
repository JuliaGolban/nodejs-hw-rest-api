const service = require('../service/authService');

// Registration
const signup = async (req, res) => {
  const user = await service.signup(req.body);
  const { username, email, subscription, avatarURL } = user;
  res.status(201).json({ user: { username, email, subscription, avatarURL } });
};

// Login
const login = async (req, res) => {
  const { token, userWithToken } = await service.login(req.body);
  res.json({ token: token, user: userWithToken });
};

// Logout
const logout = async (req, res) => {
  await service.logout(req.user._id);
  res.status(204).json();
};

module.exports = { signup, login, logout };
