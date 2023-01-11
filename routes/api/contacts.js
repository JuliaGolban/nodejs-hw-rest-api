const express = require('express');
const router = express.Router();

const { validation, ctrlWrapper: ctrl } = require('../../middlewares');
const { schemaContact: schema } = require('../../schemas');
const { contacts } = require('../../controllers');

// Get all contacts -> /api/contacts
router.get('/', ctrl(contacts.getAll));

// Get contact by id -> /api/contacts/id
router.get('/:contactId', ctrl(contacts.getById));

// Add new contact -> /api/contacts with new contact
router.post('/', validation(schema), ctrl(contacts.addContact));

// Update contact by id -> /api/contacts/id with updated contact
router.put('/:contactId', validation(schema), ctrl(contacts.updateContact));

// Delete contact by id -> /api/contacts/id and then Get without this contact
router.delete('/:contactId', ctrl(contacts.deleteContact));

module.exports = router;
