const { Contact } = require('../models/contactsModel');

// GET @ /contacts
const getAll = async () => {
  return Contact.find();
};

// GET @ /contacts/:contactId
const getById = async id => {
  return Contact.findById({ _id: id });
};

// POST @ /contacts
const addContact = async body => {
  return Contact.create(body);
};

// PUT @ /contacts/:contactId
const updateContact = async (id, body) => {
  return Contact.findByIdAndUpdate({ _id: id }, body, { new: true });
};

// PATCH @ /contacts/:contactId/favorite
const updateStatusContact = async (id, body) => {
  return Contact.findByIdAndUpdate(
    { _id: id },
    { $set: { favorite: body } },
    { new: true }
  );
};

// DELETE @ /contacts/:contactId
const deleteContact = async id => {
  return Contact.findByIdAndRemove({ _id: id });
};

module.exports = {
  getAll,
  getById,
  addContact,
  updateContact,
  updateStatusContact,
  deleteContact,
};
