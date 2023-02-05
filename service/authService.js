const { BadRequest, Unauthorized, NotFound } = require('http-errors');
const { v4: uuidv4 } = require('uuid');
const { User } = require('../models/usersModel');

// Registration new user -> /users/signup
const signup = async body => {
  const user = await User.findOne({ email: body.email });
  if (user) {
    throw new Unauthorized('Email is already in use');
  }
  const verificationToken = uuidv4();
  return User.create({ ...body, verificationToken });
};

// User login -> /users/login
const login = async body => {
  const { email, password } = body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new Unauthorized(`User with email '${email}' not found`);
  }

  if (!user.verify) {
    throw new Unauthorized('Email address not verified');
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

// Confirm the user's email address -> /users/verify/:verificationToken
const confirm = async code => {
  const user = await User.findOne({ verificationToken: code });
  if (!user) {
    throw new NotFound(`User not found`);
  }
  return User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });
};

// Resend the user's confirmation email -> /users/verify
const resend = async email => {
  if (!email) {
    throw new BadRequest('Missing required field email');
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new NotFound(`User not found`);
  }
  if (user.verify) {
    throw new BadRequest('Verification has already been passed');
  }

  return true;
};

module.exports = {
  signup,
  login,
  logout,
  confirm,
  resend,
};
