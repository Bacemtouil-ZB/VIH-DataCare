import {
  createSignesFonctionnels as createSignesFonctionnelsModel,
  getSignesFonctionnelsByNumeroDossier,
  updateSignesFonctionnels as updateSignesFonctionnelsModel,
  createAutreSigneFonctionnel,
  getAutresSignesBySignesFonctionnelsId,
  deleteAutresSignesBySignesFonctionnelsId,
  getAppareils as getAppareilsModel,
} from "../models/signeFonctionModel.js";

export const createSignesFonctionnels = async (data) => {
  const { examen_clinique_id, signes, autres_signes = [] } = data;

  const sf = await createSignesFonctionnelsModel(examen_clinique_id, signes || {});

  for (const autreSigne of autres_signes) {
    await createAutreSigneFonctionnel(sf.id, autreSigne.appareil_id, autreSigne.description);
  }

  return sf;
};

export const getSignesByNumeroDossier = async (numeroDossier) => {
  const signes = await getSignesFonctionnelsByNumeroDossier(numeroDossier);

  return Promise.all(
    signes.map(async (sf) => ({
      ...sf,
      autres_signes: await getAutresSignesBySignesFonctionnelsId(sf.id),
    }))
  );
};

export const updateSignesFonctionnels = async (id, data) => {
  const { signes, autres_signes } = data;

  const sfUpdated = await updateSignesFonctionnelsModel(id, signes || {});

  if (autres_signes !== undefined) {
    await deleteAutresSignesBySignesFonctionnelsId(id);
    for (const autreSigne of autres_signes) {
      await createAutreSigneFonctionnel(id, autreSigne.appareil_id, autreSigne.description);
    }
  }

  return sfUpdated;
};

export const getAppareils = async () => getAppareilsModel();