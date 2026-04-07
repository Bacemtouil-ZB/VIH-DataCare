// services/emergencyContactService.js

import {
  findAllContacts,
  findContactById,
  createContact,
  updateContact,
  deleteContact,
} from "../models/emergencyContactModel.js";

export const getAllContacts = async () => {
  return await findAllContacts();
};

export const getContactById = async (id) => {
  const contact = await findContactById(id);
  if (!contact) throw { status: 404, message: "Contact introuvable" };
  return contact;
};

export const addContact = async (data, adminId) => {
  const { nom, telephone, whatsapp, email, description } = data;
  if (!nom) throw { status: 400, message: "Le nom est obligatoire" };
  return await createContact({ nom, telephone, whatsapp, email, description, created_by: adminId });
};

export const editContact = async (id, data) => {
  const exists = await findContactById(id);
  if (!exists) throw { status: 404, message: "Contact introuvable" };
  const { nom, telephone, whatsapp, email, description } = data;
  if (!nom) throw { status: 400, message: "Le nom est obligatoire" };
  return await updateContact(id, { nom, telephone, whatsapp, email, description });
};

export const removeContact = async (id) => {
  const exists = await findContactById(id);
  if (!exists) throw { status: 404, message: "Contact introuvable" };
  await deleteContact(id);
};