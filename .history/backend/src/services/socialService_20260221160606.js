import {
  getSocialByNumero as getSocialByNumeroModel,
  createSocial as createSocialModel,
  updateSocial as updateSocialModel,
} from "../models/socialModel.js";

// Récupérer la fiche sociale par numéro
export const getSocialByNumero = async (numero) => {
  const social = await getSocialByNumeroModel(numero);
  return social; // Peut être null si pas de fiche
};

// Créer une fiche sociale
export const createSocial = async (numero, socialData, userId) => {
  // Vérifier si une fiche existe déjà
  const existing = await getSocialByNumeroModel(numero);
  if (existing) {
    throw new Error("Une fiche sociale existe déjà pour ce patient");
  }

  const dataWithUser = { ...socialData, userId };
  const social = await createSocialModel(numero, dataWithUser);
  return social;
};

// Mettre à jour une fiche sociale
export const updateSocial = async (numero, socialData, userId) => {
  // Vérifier si la fiche existe
  const existing = await getSocialByNumeroModel(numero);
  if (!existing) {
    throw new Error("Fiche sociale non trouvée ");
  }

  const dataWithUser = { ...socialData, userId };
  const social = await updateSocialModel(numero, dataWithUser);
  return social;
};
