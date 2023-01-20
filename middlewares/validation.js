const createError = require('http-errors');

const validation = schema => {
  return (req, res, next) => {
    // if there is no body
    if (Object.keys(req.body).length === 0) {
      return next(createError(400, 'Missing fields'));
    }
    // other errors in requests
    const { error } = schema.validate(req.body);
    if (error) {
      return next(createError(400, error.message));
    }
    next();
  };
};

module.exports = { validation };
