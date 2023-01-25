const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const Joi = require('joi');

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
const schemaRegister = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'org'] },
    })
    .required(),
  password: Joi.string().min(7).required(),
  subscription: Joi.string(),
});

const schemaLogin = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'org'] },
    })
    .required(),
  password: Joi.string().min(7).required(),
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
