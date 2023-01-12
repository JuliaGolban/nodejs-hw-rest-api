const fs = require('fs/promises');
const path = require('path');
const { v4 } = require('uuid');

const contactsPath = path.join(__dirname, 'contacts.json');

const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  const contacts = JSON.parse(data.toString());
  return contacts;
};

const getContactById = async contactId => {
  const contacts = await listContacts();
  const contact = contacts.find(contact => {
    return contact.id === contactId;
  });
  return contact || null;
};

const removeContact = async contactId => {
  const contacts = await listContacts();
  const index = contacts.findIndex(contact => contact.id === contactId);
  const deletedContact = contacts[index];
  if (index !== -1) {
    contacts.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts));
  }
  return deletedContact || null;
};

const addContact = async body => {
  const { name, email, phone } = body;
  const newContact = {
    id: v4(),
    name: name,
    email: email,
    phone: phone,
  };
  const contacts = await listContacts();
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts));
  return newContact;
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const index = contacts.findIndex(contact => contact.id === contactId);
  if (index !== -1) {
    const contact = await getContactById(contactId);
    contacts[index] = {
      ...contact,
      ...body,
    };
    await fs.writeFile(contactsPath, JSON.stringify(contacts));
  }
  return contacts[index] || null;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
