const { Unauthorized } = require('http-errors');
const { User } = require('../models/usersModel');

// Registration new user -> /users/signup
const signup = async body => {
  const user = await User.findOne({ email: body.email });
  if (user) {
    throw new Unauthorized('Email is already in use');
  }

  return User.create({ ...body });
};

// User login -> /users/login
const login = async body => {
  const { email, password } = body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new Unauthorized(`User with email '${email}' not found`);
  }

  const isValidPassword = await user.validPassword(password);
  if (!isValidPassword) {
    throw new Unauthorized('Password is wrong');
  }

  const token = await user.generateAuthToken();
  const userWithToken = await User.findByIdAndUpdate(user._id, {
    token,
  }).select({ username: 1, email: 1, subscription: 1, avatarURL: 1, _id: 0 });
  return { token, userWithToken };
};

// User logout -> /users/logout
const logout = async id => {
  return User.findByIdAndUpdate({ _id: id }, { token: null });
};

module.exports = {
  signup,
  login,
  logout,
};
