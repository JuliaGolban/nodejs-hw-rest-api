const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');

require('dotenv').config();
const { SECRET_KEY } = process.env;

const { User } = require('../models/usersModel');

// Registration new user -> /users/signup
const signup = async body => {
  const user = await User.findOne({ email: body.email });
  if (user) {
    throw createError(409, 'Email is already in use');
  }
  const password = body.password;
  const hashedPassword = await bcrypt.hash(password, 10);

  return User.create({
    ...body,
    password: hashedPassword,
  });
};

// User login -> /users/login
const login = async body => {
  const { email, password } = body;
  const user = await User.findOne({ email });
  const isValid = await bcrypt.compare(password, user.password);

  if (!user || !isValid) {
    throw createError(401, 'Email or password is wrong');
  }
  const payload = {
    id: user._id,
    username: user.username,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
  const userWithToken = await User.findByIdAndUpdate(user._id, {
    token,
  });
  return userWithToken;
};

// User logout -> /users/logout
const logout = async id => {
  return User.findByIdAndUpdate({ _id: id }, { token: null });
};

// Authenticate the current user -> /users/current
const authUser = async token => {
  // Extract user id and find user by id
  const payload = jwt.verify(token, SECRET_KEY);
  const { id } = payload;
  const user = await User.findById(id);

  // Authenticate the current user
  return user.token !== token ? null : user;
};

module.exports = {
  signup,
  login,
  logout,
  authUser,
};
