import {
  createSignesFonctionnels as createSignesModel,
  createAutreSigneFonctionnel,
  getSignesByPatientNumero as getSignesByNumeroModel,
  getSignesByExamenId as getSignesByExamenModel,
  getAutresSignesByExamenId as getAutresSignesModel,
  updateSignesFonctionnels as updateSignesModel,
  getAppareils as getAppareilsModel,
} from "../models/signeFonctionModel.js";


export const createSignesFonctionnels = async (data, userId) => {
  const { examen_clinique_id, signes, autres_signes } = data;
  // Créer les signes fonctionnels de base
  const signesFonctionnels = await createSignesModel(
    examen_clinique_id,
    signes || {}
  );

  // Créer les autres signes si fournis
  if (autres_signes && autres_signes.length > 0) {
    for (const autreSigne of autres_signes) {
      await createAutreSigneFonctionnel(
        signesFonctionnels.id,
        autreSigne.appareil_id,
        autreSigne.description
      );
    }
  }

  return signesFonctionnels;
};


export const getSignesByPatientNumero = async (numero) => {
  const signes = await getSignesByNumeroModel(numero);

  // Pour chaque signe, récupérer les autres signes
  const signesComplets = await Promise.all(
    signes.map(async (signe) => {
      if (signe.id) {
        const autresSignes = await getAutresSignesModel(signe.examen_id);
        return {
          ...signe,
          autres_signes: autresSignes
        };
      }
      return signe;
    })
  );

  return signesComplets;
};

export const getSignesByExamenId = async (examenId) => {
  const signes = await getSignesByExamenModel(examenId);
  
  if (!signes) {
    return null;
  }

  const autresSignes = await getAutresSignesModel(examenId);

  return {
    ...signes,
    autres_signes: autresSignes
  };
};

export const updateSignesFonctionnels = async (examenId, data, userId) => {

  const signesUpdated = await updateSignesModel(
    signesActuels.id,
    data.signes || {}
  );

  return signesUpdated;
};


export const getAppareils = async () => {
  return await getAppareilsModel();
};