// controllers/emergencyContactController.js

import {
  getAllContacts,
  getContactById,
  addContact,
  editContact,
  removeContact,
} from "../services/emergencyContactService.js";

const handle = (fn) => async (req, res) => {
  try {
    const result = await fn(req, res);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message || "Erreur serveur" });
  }
};

export const getAll    = handle(async (req) => getAllContacts());
export const getOne    = handle(async (req) => getContactById(req.params.id));
export const create    = handle(async (req) => addContact(req.body, req.user.id));
export const update    = handle(async (req) => editContact(req.params.id, req.body));
export const remove    = handle(async (req) => { await removeContact(req.params.id); return null; });