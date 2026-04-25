// controllers/emergencyContactController.js

import {
  getAllContacts,
  getContactById,
  addContact,
  editContact,
  removeContact,
} from "../services/emergencyContactService.js";
import { logAction } from "../services/auditService.js";

const handle = (fn, getAuditData) => async (req, res) => {
  try {
    const result = await fn(req, res);

    if (getAuditData) {
      await logAction(req, await getAuditData(req, result));
    }

    res.json({ success: true, data: result });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ success: false, message: err.message || "Erreur serveur" });
  }
};

export const getAll = handle(
  async () => getAllContacts(),
  () => ({
    module: "EMERGENCY_CONTACT",
    action: "EMERGENCY_CONTACT_LIST_VIEW",
    entity_id: null,
    old_data: null,
    new_data: null,
  }),
);

export const getOne = handle(
  async (req) => getContactById(req.params.id),
  (req, result) => ({
    module: "EMERGENCY_CONTACT",
    action: "EMERGENCY_CONTACT_VIEW",
    patient_id: result?.patient_id || null,
    entity_id: result?.id || Number(req.params.id),
    old_data: null,
    new_data: null,
  }),
);

export const create = handle(
  async (req) => addContact(req.body, req.user.id),
  (_req, result) => ({
    module: "EMERGENCY_CONTACT",
    action: "EMERGENCY_CONTACT_CREATE",
    patient_id: result?.patient_id || null,
    entity_id: result?.id || null,
    old_data: null,
    new_data: result,
  }),
);

export const update = handle(
  async (req) => {
    const oldContact = await getContactById(req.params.id);
    const updatedContact = await editContact(req.params.id, req.body);
    return { oldContact, updatedContact };
  },
  (_req, result) => ({
    module: "EMERGENCY_CONTACT",
    action: "EMERGENCY_CONTACT_UPDATE",
    patient_id:
      result?.updatedContact?.patient_id || result?.oldContact?.patient_id || null,
    entity_id: result?.updatedContact?.id || result?.oldContact?.id || null,
    old_data: result?.oldContact || null,
    new_data: result?.updatedContact || null,
  }),
);

export const remove = handle(
  async (req) => {
    const oldContact = await getContactById(req.params.id);
    await removeContact(req.params.id);
    return oldContact;
  },
  (_req, result) => ({
    module: "EMERGENCY_CONTACT",
    action: "EMERGENCY_CONTACT_DELETE",
    patient_id: result?.patient_id || null,
    entity_id: result?.id || null,
    old_data: result,
    new_data: null,
  }),
);
