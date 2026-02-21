import {
  createSigneClinique as createSigneCliniqueModel,
  getSigneCliniqueById as getSigneCliniqueByIdModel,
  getSigneCliniqueByNumeroDossier as getSigneCliniqueByNumeroDossierModel,
  updateSigneClinique as updateSigneCliniqueModel,
} from "../models/signeCliniqueModel.js";

const calculateIMC = (taille, poids) => {
  if (!taille || !poids) return null;
  return parseFloat((poids / Math.pow(taille / 100, 2)).toFixed(2));
};


export const createSigneClinique = async (signeData) => {
  signeData.imc = calculateIMC(signeData.taille, signeData.poids);
  const signe = await createSigneCliniqueModel(signeData);
  return signe;
};

export const getSigneCliniqueById = async (id) => {
  const signe = await getSigneCliniqueByIdModel(id);
  if (!signe) throw new Error("Signe clinique non trouvé");
  return signe;
};

export const getSigneCliniqueByNumeroDossier = async (numeroDossier) => {
  const signes = await getSigneCliniqueByNumeroDossierModel(numeroDossier);
  return signes;
};

export const updateSigneClinique = async (id, signeData) => {
  const existing = await getSigneCliniqueByIdModel(id);
  if (!existing) throw new Error("Signe clinique non trouvé");
//?? est l'opérateur de coalescence nulle en JavaScript. 
// Il permet de retourner la première valeur qui n'est pas null ou undefined

  // Recalculer l'IMC si taille ou poids mis à jour
  const taille = signeData.taille ?? existing.taille;
  const poids  = signeData.poids  ?? existing.poids;
  signeData.imc = calculateIMC(taille, poids);

  const signe = await updateSigneCliniqueModel(id, signeData);
  return signe;
};