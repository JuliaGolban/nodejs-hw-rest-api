const createError = require('http-errors');
const service = require('../service/contacts');

// Get all contacts -> [contacts]
const getAll = async (req, res) => {
  const result = await service.getAll();
  res.json({
    status: 'success',
    code: 200,
    data: {
      result,
    },
  });
};

// Get contact by id -> {contact with contactId}
const getById = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await service.getById(contactId);
  if (!result) {
    return next(createError(404, `Not found contact with id: ${contactId}`));
  }
  res.json({
    status: 'success',
    code: 200,
    data: {
      result,
    },
  });
};

// Add new contact -> [newContact, ...contacts]
const addContact = async (req, res) => {
  const result = await service.addContact(req.body);
  res.status(201).json({
    status: 'success',
    code: 201,
    message: 'contact added',
    data: {
      result,
    },
  });
};

// Update contact by id -> [contacts with updated contact]
const updateContact = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await service.updateContact(contactId, req.body);
  if (!result) {
    return next(createError(404, `Not found contact with id: ${contactId}`));
  }
  res.json({
    status: 'success',
    code: 200,
    message: 'contact updated',
    data: {
      result,
    },
  });
};

// Delete contact by id -> [contacts without this contact]
const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await service.deleteContact(contactId);
  if (!result) {
    return next(createError(404, `Not found contact with id: ${contactId}`));
  }
  res.json({
    status: 'success',
    code: 200,
    message: 'contact deleted',
  });
};

module.exports = {
  getAll,
  getById,
  addContact,
  updateContact,
  deleteContact,
};
