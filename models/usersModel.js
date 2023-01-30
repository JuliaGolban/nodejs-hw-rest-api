const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const gravatar = require('gravatar');

// shema of a user model
const schemaUser = new Schema(
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
  },
  { versionKey: false, timestamps: true }
);

// to hash a user password
schemaUser.pre('save', async function () {
  if (this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

const User = model('user', schemaUser);

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
  schemaLogin,
  schemaUpdate,
};

module.exports = { User, schemas };
