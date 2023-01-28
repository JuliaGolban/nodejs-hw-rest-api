const express = require('express');
const router = express.Router();

const {
  validation,
  ctrlWrapper: ctrl,
  auth,
  upload,
} = require('../../middlewares');
const { schemas } = require('../../models/usersModel');
const { ctrlUsers } = require('../../controllers');

// GET @ /users/current -> authenticate the current user
router.get('/current', auth, ctrl(ctrlUsers.getUser));

// PATCH @ /users -> update the current user
router.patch(
  '/',
  validation(schemas.schemaUpdate),
  auth,
  ctrl(ctrlUsers.updateUser)
);

// PATCH @ /users/avatars -> update the current user's avatar
router.patch(
  '/avatars',
  auth,
  upload.single('avatar'),
  ctrl(ctrlUsers.updateAvatar)
);

module.exports = router;
