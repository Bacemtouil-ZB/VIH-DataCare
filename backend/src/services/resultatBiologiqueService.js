import {
  createResultat as createResultatModel,
  getResultatsByNumeroDossier as getResultatsByNumeroDossierModel,
  // getDernierBilanPrescrit as getDernierBilanPrescritModel,
  getResultatById as getResultatByIdModel,
  updateResultat as updateResultatModel,
} from "../models/resultatBiologiqueModel.js";

export const createResultat = async (data) => {
  if (!data.numero_dossier) {
    throw new Error("Numero de dossier obligatoire");
  }

  return createResultatModel(data);
};

export const getResultatsByNumeroDossier = async (numeroDossier) => {
  if (!numeroDossier) {
    throw new Error("Numero de dossier obligatoire");
  }

  return getResultatsByNumeroDossierModel(numeroDossier);
};

// export const getDernierBilanPrescrit = async (numeroDossier) => {
//   if (!numeroDossier) {
//     throw new Error("Numero de dossier obligatoire");
//   }

//   return getDernierBilanPrescritModel(numeroDossier);
// };

export const getResultatById = async (id) => {
  const resultat = await getResultatByIdModel(id);
  if (!resultat) {
    throw new Error("Resultat non trouve");
  }
  return resultat;
};

export const updateResultat = async (id, data) => {
  const existing = await getResultatByIdModel(id);
  if (!existing) {
    throw new Error("Resultat non trouve");
  }

  return updateResultatModel(id, data);
};
