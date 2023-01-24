const { Unauthorized } = require('http-errors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();
const { SECRET_KEY } = process.env;

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
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Unauthorized('Password is wrong');
  }
  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' });
  const userWithToken = await User.findByIdAndUpdate(user._id, { token });
  return { token, userWithToken };
};

// User logout -> /users/logout
const logout = async id => {
  return User.findByIdAndUpdate({ _id: id }, { token: null });
};

// Authenticate the current user -> /users/current
const authUser = async token => {
  const payload = jwt.verify(token, SECRET_KEY);
  const { id } = payload;
  const user = await User.findById(id);
  return user.token !== token ? null : user;
};

module.exports = {
  signup,
  login,
  logout,
  authUser,
};
