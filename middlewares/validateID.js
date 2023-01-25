const { isValidObjectId } = require('mongoose');
const { BadRequest } = require('http-errors');

const validateID = (req, _, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    return next(new BadRequest(`${contactId} is not correct id format`));
  }
  next();
};

module.exports = { validateID };
