const { Schema, model, SchemaTypes } = require('mongoose');
const Joi = require('joi');

// shema of a contact model
const schemaContact = new Schema(
  {
    name: {
      type: String,
      unique: [true, 'The name must be unique'],
      required: [true, 'Set name for contact'],
    },
    email: { type: String, required: [true, 'Set email for contact'] },
    phone: {
      type: String,
      required: [true, 'Set phone for contact'],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

const Contact = model('contact', schemaContact);

// schemas validation
const schemaBase = Joi.object().keys({
  name: Joi.string().min(3),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ['com', 'net', 'org'] },
  }),
  phone: Joi.string().min(6),
  favorite: Joi.boolean(),
});

const schemaAddContact = schemaBase.keys({
  name: Joi.required(),
  email: Joi.required(),
  phone: Joi.required(),
});

const schemaUpdateContact = schemaBase.keys();

const schemaUpdateStatusContact = schemaBase.keys({
  favorite: Joi.required(),
});

const schemas = {
  schemaAddContact,
  schemaUpdateContact,
  schemaUpdateStatusContact,
};

module.exports = { Contact, schemas };
