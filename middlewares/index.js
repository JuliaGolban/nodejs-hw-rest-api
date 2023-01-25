const { validation } = require('./validation');
const { ctrlWrapper } = require('./ctrlWrapper');
const { validateID } = require('./validateID');
const { auth } = require('./auth');

module.exports = {
  validation,
  ctrlWrapper,
  validateID,
  auth,
};
