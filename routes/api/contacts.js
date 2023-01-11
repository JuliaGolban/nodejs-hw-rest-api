const createError = require('http-errors');
const Joi = require('joi');
const express = require('express');
const router = express.Router();

const operations = require('../../models/contacts');

const schema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'org'] },
    })
    .required(),
  phone: Joi.string().min(6).required(),
});

// Get all contacts -> /api/contacts
router.get('/', async (req, res, next) => {
  try {
    const result = await operations.listContacts();
    res.status(200).json({
      status: 'success',
      code: 200,
      data: {
        result,
      },
    });
  } catch (e) {
    next(e);
  }
});

// Get contact by id -> /api/contacts/id
router.get('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await operations.getContactById(contactId);
    if (!result) {
      return next();
    }
    res.status(200).json({
      status: 'success',
      code: 200,
      data: {
        result,
      },
    });
  } catch (e) {
    next(e);
  }
});

// Add new contact -> /api/contacts with new contact
router.post('/', async (req, res, next) => {
  try {
    // data validation
    const { error } = schema.validate(req.body);
    if (error) {
      next(createError(400, error.message));
    }

    const result = await operations.addContact(req.body);
    res.status(201).json({
      status: 'success',
      code: 201,
      message: 'contact added',
      data: {
        result,
      },
    });
  } catch (e) {
    next(e);
  }
});

// Delete contact by id -> /api/contacts/id and then Get without this contact
router.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await operations.removeContact(contactId);
    if (!result) {
      return next();
    }
    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'contact deleted',
      data: {
        result,
      },
    });
  } catch (e) {
    next(e);
  }
});

// Update contact by id -> /api/contacts/id with updated contact
router.put('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    if (!req.body) {
      next(createError(400, 'Missing fields'));
    }
    // data validation
    const { error } = schema.validate(req.body);
    if (error) {
      next(createError(400, error.message));
    }
    const result = await operations.updateContact(contactId, req.body);
    if (!result) {
      return next();
    }
    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'contact updated',
      data: {
        result,
      },
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
