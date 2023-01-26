const { User } = require('../models/usersModel');

// Update the current user
const updateUser = async (id, body) => {
  return User.findByIdAndUpdate({ _id: id }, body);
};
module.exports = {
  updateUser,
};
