const express = require('express');
const router = express.Router();

const { validation, ctrlWrapper: ctrl, auth } = require('../../middlewares');
const { schemas } = require('../../models/usersModel');
const { ctrlUsers } = require('../../controllers');

// POST @ /users/signup -> registration
router.post(
  '/signup',
  validation(schemas.schemaRegister),
  ctrl(ctrlUsers.signup)
);

// POST @ /users/login -> login
router.post('/login', validation(schemas.schemaLogin), ctrl(ctrlUsers.login));

// GET @ /users/logout -> logout
router.get('/logout', auth, ctrl(ctrlUsers.logout));

// GET @ /users/current -> authenticate the current user
router.get('/current', auth, ctrl(ctrlUsers.getUser));

module.exports = router;
