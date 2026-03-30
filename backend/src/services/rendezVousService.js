import {
  createRendezvous as createRendezvousModel,
  getRendezvousByNumeroDossier as getRendezvousByNumeroDossierModel,
  getRendezvousById as getRendezvousByIdModel,
  updateRendezvous as updateRendezvousModel,
} from "../models/rendezVousModel.js";

// rendezvousService.js
export const createRendezvous = async (data) => {
  const { numero_dossier, date,  type, statut, commentaire } = data;
  const heure=data.heure || null
  return await createRendezvousModel({ numero_dossier, date, heure, type, statut, commentaire });
};

export const getRendezvousByNumeroDossier = async (numeroDossier) => {
  const rendezvous = await getRendezvousByNumeroDossierModel(numeroDossier);
  if (!rendezvous.length) return [];
  return rendezvous;
};

export const getRendezvousById = async (id) => {
  const rdv = await getRendezvousByIdModel(id);
  if (!rdv) throw new Error("Rendez-vous non trouvé");
  return rdv;
};

export const updateRendezvous = async (id, data) => {
  const existing = await getRendezvousByIdModel(id);
  if (!existing) throw new Error("Rendez-vous non trouvé");
  
  return await updateRendezvousModel(id, data);
};

// New service function to get next rendezvous per patient
import { getNextRendezVousPerPatient as getNextRendezVousPerPatientModel } from "../models/rendezVousModel.js";
 
export const getNextRendezVousPerPatient = async () => {
  return await getNextRendezVousPerPatientModel();
};