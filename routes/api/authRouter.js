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

// GET @ /users/verify/<verificationToken> -> verification the user email
router.get('/verify/:verificationToken', ctrl(ctrlAuth.confirm));

// POST @ /users/verify -> resend the user's confirmation email
router.post(
  '/verify',
  validation(schemas.schemaVerification),
  ctrl(ctrlAuth.resend)
);

// POST @ /users/password -> send password reset link
router.post(
  '/password',
  validation(schemas.schemaVerification),
  ctrl(ctrlAuth.linkPassword)
);

// POST @ /users/password/<userId>/<verificationToken> -> reset user password
router.post(
  '/password/:userId/:verificationToken',
  validation(schemas.schemaChangePassword),
  ctrl(ctrlAuth.changePassword)
);

module.exports = router;
