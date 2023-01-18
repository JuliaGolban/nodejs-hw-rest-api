const { Contact } = require('../models/contacts');

// Get all contacts -> [contacts]
const getAll = async () => {
  return Contact.find({});
};

// Get contact by id -> {contact with contactId}
const getById = async id => {
  return Contact.findOne({ _id: id });
};

// Add new contact -> [newContact, ...contacts]
const addContact = async fields => {
  return Contact.create(fields);
};

// Update contact by id -> [contacts with updated contact]
const updateContact = async (id, fields) => {
  return Contact.findByIdAndUpdate(
    { _id: id },
    { $set: { fields } },
    { new: true }
  );
};

// Delete contact by id -> [contacts without this contact]
const deleteContact = async id => {
  return Contact.findByIdAndRemove({ _id: id });
};

module.exports = {
  getAll,
  getById,
  addContact,
  updateContact,
  deleteContact,
};
