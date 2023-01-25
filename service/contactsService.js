const { Contact } = require('../models/contactsModel');

// GET @ /contacts
const getAll = async (userId, query) => {
  const { page = 1, limit = 20, favorite } = query;
  // pagination
  const skip = (page - 1) * limit;
  // filter
  if (favorite)
    return Contact.find({ owner: userId, favorite: favorite }, '', {
      skip,
      limit: +limit,
    })
      .sort({ name: 1 })
      .populate('owner', '_id username email subscription');

  return Contact.find({ owner: userId }, '', {
    skip,
    limit: +limit,
  })
    .sort({ name: 1 })
    .populate('owner', '_id username email subscription');
};

// GET @ /contacts/:contactId
const getById = async (contactId, userId) => {
  return Contact.findById({ _id: contactId, owner: userId });
};

// POST @ /contacts
const addContact = async body => {
  return Contact.create(body);
};

// PUT @ /contacts/:contactId
const updateContact = async ({ contactId, _id, ...body }) => {
  return Contact.findOneAndUpdate({ _id: contactId, owner: _id }, body, {
    new: true,
  });
};

// PATCH @ /contacts/:contactId/favorite
const updateStatusContact = async (contactId, userId, body) => {
  return Contact.findByIdAndUpdate(
    { _id: contactId, owner: userId },
    { $set: { favorite: body } },
    { new: true }
  );
};

// DELETE @ /contacts/:contactId
const deleteContact = async (contactId, userId) => {
  return Contact.findByIdAndRemove({ _id: contactId, owner: userId });
};

module.exports = {
  getAll,
  getById,
  addContact,
  updateContact,
  updateStatusContact,
  deleteContact,
};
