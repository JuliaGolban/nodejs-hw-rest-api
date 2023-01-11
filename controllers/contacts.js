const createError = require('http-errors');
const operations = require('../models/contacts');

// Get all contacts -> /api/contacts
const getAll = async (req, res) => {
  const result = await operations.listContacts();
  res.status(200).json({
    status: 'success',
    code: 200,
    data: {
      result,
    },
  });
};

// Get contact by id -> /api/contacts/id
const getById = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await operations.getContactById(contactId);
  if (!result) {
    return next(createError(404, 'Not found'));
  }
  res.status(200).json({
    status: 'success',
    code: 200,
    data: {
      result,
    },
  });
};

// Add new contact -> /api/contacts with new contact
const addContact = async (req, res) => {
  const result = await operations.addContact(req.body);
  res.status(201).json({
    status: 'success',
    code: 201,
    message: 'contact added',
    data: {
      result,
    },
  });
};

// Delete contact by id -> /api/contacts/id and then Get without this contact
const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await operations.removeContact(contactId);
  if (!result) {
    return next(createError(404, 'Not found'));
  }
  res.status(200).json({
    status: 'success',
    code: 200,
    message: 'contact deleted',
  });
};

// Update contact by id -> /api/contacts/id with updated contact
const updateContact = async (req, res, next) => {
  const { contactId } = req.params;
  if (!req.body) {
    return next(createError(400, 'Missing fields'));
  }
  const result = await operations.updateContact(contactId, req.body);
  if (!result) {
    return next(createError(404, 'Not found'));
  }
  res.status(200).json({
    status: 'success',
    code: 200,
    message: 'contact updated',
    data: {
      result,
    },
  });
};

module.exports = {
  getAll,
  getById,
  addContact,
  updateContact,
  deleteContact,
};
