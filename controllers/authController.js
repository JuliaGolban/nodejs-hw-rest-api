const service = require('../service/authService');

// Registration
const signup = async (req, res) => {
  const user = await service.signup(req.body);
  // res.status(201).json(user);
  const { username, email, subscription } = user;
  res.status(201).json({ user: { username, email, subscription } });
};

// Login
const login = async (req, res) => {
  const { token, userWithToken } = await service.login(req.body);
  // res.json(userWithToken);
  const { username, email, subscription } = userWithToken;
  res.json({ token: token, user: { username, email, subscription } });
};

// Logout
const logout = async (req, res) => {
  await service.logout(req.user._id);
  res.status(204).json();
};

// Get the current user by token
const getUser = async (req, res) => {
  // res.json(req.user);
  const { username, email, subscription, createdAt, updatedAt } = req.user;
  res.json({ user: { username, email, subscription, createdAt, updatedAt } });
};

// Update the current user's subscription
const updateUser = async (req, res) => {
  const user = await service.updateUser(req.user._id, req.body);
  const { username, email, subscription } = user;
  res.json({ user: { username, email, subscription } });
};

module.exports = { signup, login, logout, getUser, updateUser };
