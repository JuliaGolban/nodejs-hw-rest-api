const createError = require('http-errors');
const service = require('../service/authService');

const authToken = async (req, res, next) => {
  // Get token from request headers
  const { authorization = '' } = req.headers;
  const [bearer, token] = authorization.split(' ');

  // Verify that user token and save token
  if (bearer !== 'Bearer' || !token) {
    return next(createError(401, 'Not authorized'));
  }
  const user = await service.authUser(token);
  if (!user) {
    return next(createError(401, 'Not authorized'));
  }
  // save user to request
  req.user = user;
  next();
};

module.exports = { authToken };
