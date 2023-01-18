const { Schema, model } = require('mongoose');
const Joi = require('joi');

// shema of a contact model
const schemaContact = new Schema(
  {
    name: {
      type: String,
      unique: [true, 'The name must be unique'],
      required: [true, 'Set name for contact'],
    },
    email: { type: String },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

const Contact = model('Contact', schemaContact);

// schemas
const schemaAddContact = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'org'] },
    })
    .required(),
  phone: Joi.string().min(6).required(),
});

const schemaUpdateContact = Joi.object({
  name: Joi.string().min(3),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ['com', 'net', 'org'] },
  }),
  phone: Joi.string().min(6),
});

const schemas = { schemaAddContact, schemaUpdateContact };

module.exports = { Contact, schemas };
