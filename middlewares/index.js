const { validation } = require('./validation');
const { ctrlWrapper } = require('./ctrlWrapper');
const { validateID } = require('./validateID');
const { auth } = require('./auth');
const { upload } = require('./upload');

module.exports = {
  validation,
  ctrlWrapper,
  validateID,
  auth,
  upload,
};
