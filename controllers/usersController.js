const service = require('../service/usersService');

// Get the current user by token
const getUser = async (req, res) => {
  const { username, email, subscription, createdAt, updatedAt } = req.user;
  res.json({ user: { username, email, subscription, createdAt, updatedAt } });
};

// Update the current user's subscription
const updateUser = async (req, res) => {
  const user = await service.updateUser(req.user._id, req.body);
  const { username, email, subscription } = user;
  res.json({ user: { username, email, subscription } });
};

module.exports = { getUser, updateUser };
