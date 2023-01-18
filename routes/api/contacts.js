const express = require('express');
const router = express.Router();

const { validation, ctrlWrapper: ctrl } = require('../../middlewares');
const { schemas } = require('../../models/contacts');
const { ctrlContacts } = require('../../controllers');

// Get all contacts -> /api/contacts
router.get('/', ctrl(ctrlContacts.getAll));

// Get contact by id -> /api/contacts/id
router.get('/:contactId', ctrl(ctrlContacts.getById));

// Add new contact -> /api/contacts with new contact
router.post(
  '/',
  validation(schemas.schemaAddContact),
  ctrl(ctrlContacts.addContact)
);

// Update contact by id -> /api/contacts/id with updated contact
router.put(
  '/:contactId',
  validation(schemas.schemaUpdateContact),
  ctrl(ctrlContacts.updateContact)
);

// Delete contact by id -> /api/contacts/id and then Get without this contact
router.delete('/:contactId', ctrl(ctrlContacts.deleteContact));

module.exports = router;
