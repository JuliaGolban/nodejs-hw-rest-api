const { isValidObjectId } = require('mongoose');
const createError = require('http-errors');

const validateID = (req, _, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    return next(createError(400, `${contactId} is not correct id format`));
  }
  next();
};

module.exports = { validateID };
