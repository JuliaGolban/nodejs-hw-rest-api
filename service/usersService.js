const { User } = require('../models/usersModel');

// Update the current user
const updateUser = async (id, body) => {
  return User.findByIdAndUpdate({ _id: id }, body).select({
    _id: 0,
    password: 0,
    token: 0,
  });
};

// Update the avatar of the current user
const updateAvatar = async (id, body) => {
  return User.findByIdAndUpdate({ _id: id }, body, { new: true }).select({
    avatarURL: 1,
    _id: 0,
  });
};

module.exports = {
  updateUser,
  updateAvatar,
};
