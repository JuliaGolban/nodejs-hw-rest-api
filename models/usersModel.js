const { Schema, model } = require('mongoose');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');

require('dotenv').config();
const { SECRET_KEY } = process.env;

// shema of a user model
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Set name for user'],
    },
    email: {
      type: String,
      unique: [true, 'The email must be unique'],
      required: [true, 'Email is required'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 7,
    },
    subscription: {
      type: String,
      enum: ['starter', 'pro', 'business'],
      default: 'starter',
    },
    avatarURL: {
      type: String,
      default: function () {
        return gravatar.url(this.email, {}, true);
      },
    },
    token: {
      type: String,
      default: null,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, 'Verify token is required'],
    },
  },
  { versionKey: false, timestamps: true }
);

// hash a user's password before saving
userSchema.pre('save', async function () {
  if (this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

// validation the password
userSchema.methods.validPassword = async function (password) {
  const isValidPassword = await bcrypt.compare(password, this.password);
  await this.save();
  return isValidPassword;
};

// generate token
userSchema.methods.generateAuthToken = async function () {
  const payload = { id: this._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' });
  await this.save();
  return token;
};

const User = model('user', userSchema);

// schemas Joi
const schemaBase = Joi.object().keys({
  username: Joi.string().min(3).max(30),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ['com', 'net', 'org'] },
  }),
  password: Joi.string().min(7),
  subscription: Joi.string().valid('starter', 'pro', 'business'),
  avatarURL: Joi.string(),
});

const schemaRegister = schemaBase.keys({
  username: Joi.required(),
  email: Joi.required(),
  password: Joi.required(),
});

const schemaVerification = schemaBase.keys({
  email: Joi.required().messages({
    'any.required': `Missing required field email`,
  }),
});

const schemaLogin = schemaBase.keys({
  email: Joi.required(),
  password: Joi.required(),
});

const schemaUpdate = Joi.object({
  username: Joi.string().min(3).max(30),
  subscription: Joi.string().valid('starter', 'pro', 'business'),
});

const schemas = {
  schemaRegister,
  schemaVerification,
  schemaLogin,
  schemaUpdate,
};

module.exports = { User, schemas };
