const { Schema, model } = require('mongoose');
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
    // owner: {
    //     type: SchemaTypes.ObjectId,
    //   ref: 'user',
    // },
  },
  { versionKey: false, timestamps: true }
);

const User = model('user', schemaUser);

// schemas
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

const schemas = {
  schemaRegister,
  schemaLogin,
};

module.exports = { User, schemas };
