const { BadRequest } = require('http-errors');

const validation = schema => {
  return (req, res, next) => {
    // if there is no body
    if (Object.keys(req.body).length === 0) {
      return next(new BadRequest('Missing fields'));
    }
    // other errors in requests
    const { error } = schema.validate(req.body);
    if (error) {
      return next(new BadRequest(error.message));
    }
    next();
  };
};

module.exports = { validation };
