const service = require('../service/usersService');
const files = require('../service/filesService');

// Get the current user by token
const getUser = async (req, res) => {
  const { username, email, subscription, avatarURL, createdAt, updatedAt } =
    req.user;
  res.json({
    user: { username, email, subscription, avatarURL, createdAt, updatedAt },
  });
};

// Update the current user
const updateUser = async (req, res) => {
  const user = await service.updateUser(req.user._id, req.body);
  res.json({ user: user });
};

// Update the current user
const updateAvatar = async (req, res) => {
  const avatarURL = await files.updateFile('avatars', req.file);
  await service.updateUser(req.user._id, { avatarURL });
  res.json({ avatarURL });
};

module.exports = { getUser, updateUser, updateAvatar };
