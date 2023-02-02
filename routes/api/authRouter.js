const express = require('express');
const router = express.Router();

const { validation, ctrlWrapper: ctrl, auth } = require('../../middlewares');
const { schemas } = require('../../models/usersModel');
const { ctrlAuth } = require('../../controllers');

// POST @ /users/signup -> registration
router.post(
  '/signup',
  validation(schemas.schemaRegister),
  ctrl(ctrlAuth.signup)
);

// POST @ /users/login -> login
router.post('/login', validation(schemas.schemaLogin), ctrl(ctrlAuth.login));

// GET @ /users/logout -> logout
router.get('/logout', auth, ctrl(ctrlAuth.logout));

module.exports = router;
