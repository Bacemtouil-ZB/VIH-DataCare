import {
  createResultat            as createResultatModel,
  getResultatsByNumeroDossier as getResultatsByNumeroDossierModel,
  getDernierBilanPrescrit   as getDernierBilanPrescritModel,
  getResultatById           as getResultatByIdModel,
  updateResultat            as updateResultatModel,
} from "../models/resultatBiologiqueModel.js";

// ── CREATE ────────────────────────────────────────────────────────────────────
export const createResultat = async (data) => {
  if (!data.numero_dossier) throw new Error("Numéro de dossier obligatoire");
  return await createResultatModel(data);
};

// ── GET BY NUMERO DOSSIER ─────────────────────────────────────────────────────
export const getResultatsByNumeroDossier = async (numeroDossier) => {
  if (!numeroDossier) throw new Error("Numéro de dossier obligatoire");
  return await getResultatsByNumeroDossierModel(numeroDossier);
};

// ── GET DERNIER BILAN PRESCRIT ────────────────────────────────────────────────
export const getDernierBilanPrescrit = async (numeroDossier) => {
  if (!numeroDossier) throw new Error("Numéro de dossier obligatoire");
  return await getDernierBilanPrescritModel(numeroDossier);
};

// ── GET BY ID ─────────────────────────────────────────────────────────────────
export const getResultatById = async (id) => {
  const res = await getResultatByIdModel(id);
  if (!res) throw new Error("Résultat non trouvé");
  return res;
};

// ── UPDATE ────────────────────────────────────────────────────────────────────
export const updateResultat = async (id, data) => {
  const existing = await getResultatByIdModel(id);
  if (!existing) throw new Error("Résultat non trouvé");
  return await updateResultatModel(id, data);
};
