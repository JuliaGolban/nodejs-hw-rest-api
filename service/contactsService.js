const { Contact } = require('../models/contactsModel');

// Get all contacts -> [contacts]
const getAll = async () => {
  return Contact.find();
};

// Get contact by id -> {contact with contactId}
const getById = async id => {
  return Contact.findById({ _id: id });
};

// Add new contact -> [newContact, ...contacts]
const addContact = async body => {
  return Contact.create(body);
};

// Update contact by id -> [contacts with updated contact]
const updateContact = async (id, body) => {
  return Contact.findByIdAndUpdate({ _id: id }, body, { new: true });
};

// Update status of the contact by id -> [contacts with updated status of the contact]
const updateStatusContact = async (id, body) => {
  return Contact.findByIdAndUpdate(
    { _id: id },
    { $set: { favorite: body } },
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
  updateStatusContact,
  deleteContact,
};
