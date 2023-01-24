const { Unauthorized } = require('http-errors');
// const service = require('../service/authService');
const jwt = require('jsonwebtoken');

require('dotenv').config();
const { SECRET_KEY } = process.env;

const { User } = require('../models/usersModel');

const auth = async (req, res, next) => {
  // Get token from request headers
  const { authorization = '' } = req.headers;
  const [bearer, token] = authorization.split(' ');
  try {
    // Verify that user token and save token
    if (bearer !== 'Bearer' || !token) {
      return next(new Unauthorized('Not authorized'));
    }
    // Extract user id and find user by id
    // const user = await service.authUser(token);
    const payload = jwt.verify(token, SECRET_KEY);
    const { id } = payload;
    const user = await User.findById(id);
    // Authenticate the current user
    if (!user) {
      return next(new Unauthorized('Not authorized'));
    }
    // save user to request
    req.user = user;
    next();
  } catch (e) {
    if (e.message === 'invalid signature') {
      e.status = 401;
    }
    next(e);
  }
};

module.exports = { auth };
