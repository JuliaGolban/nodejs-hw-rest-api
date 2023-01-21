const { validation } = require('./validation');
const { ctrlWrapper } = require('./ctrlWrapper');
const { validateID } = require('./validateID');
const { authToken } = require('./authToken');

module.exports = {
  validation,
  ctrlWrapper,
  validateID,
  authToken,
};
