const express = require('express');
const router = express.Router();

const {
  validation,
  validateID,
  ctrlWrapper: ctrl,
} = require('../../middlewares');
const { schemas } = require('../../models/contacts');
const { ctrlContacts } = require('../../controllers');

// Get all contacts -> /api/contacts
router.get('/', ctrl(ctrlContacts.getAll));

// Get contact by id -> /api/contacts/<contactId>
router.get('/:contactId', validateID, ctrl(ctrlContacts.getById));

// Add new contact -> /api/contacts with new contact
router.post(
  '/',
  validation(schemas.schemaAddContact),
  ctrl(ctrlContacts.addContact)
);

// Update contact by id -> /api/contacts/<contactId> with updated contact
router.put(
  '/:contactId',
  validateID,
  validation(schemas.schemaUpdateContact),
  ctrl(ctrlContacts.updateContact)
);

// Update status of the contact by id -> /api/contacts/<contactId>/favorite
router.patch(
  '/:contactId/favorite',
  validateID,
  validation(schemas.schemaUpdateContact),
  ctrl(ctrlContacts.updateStatusContact)
);

// Delete contact by id -> /api/contacts/<contactId> and then Get without this contact
router.delete('/:contactId', validateID, ctrl(ctrlContacts.deleteContact));

module.exports = router;
