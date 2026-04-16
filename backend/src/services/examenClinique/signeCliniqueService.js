//cheked 15/04/2026
import {
  createSigneClinique as createSigneCliniqueModel,
  getSigneCliniqueById as getSigneCliniqueByIdModel,
  getSigneCliniqueByNumeroDossier as getSigneCliniqueByNumeroDossierModel,
  updateSigneClinique as updateSigneCliniqueModel,
  createAutreSigneClinique,           
  getAutresSignesBySigneCliniqueId,  
    deleteAutresSignesBySigneCliniqueId,
  
} from "../../models/examenClinique/signeCliniqueModel.js";

const calculateIMC = (taille, poids) => {
  if (!taille || !poids) return null;
  return parseFloat((poids / Math.pow(taille / 100, 2)).toFixed(2));
};


export const createSigneClinique = async (data) => {
  const { examen_clinique_id, taille, poids, autres_signes = [] } = data;

  // 1. Créer le signe clinique principal
  const signe = await createSigneCliniqueModel({
    examen_clinique_id,
    taille,
    poids,
    imc: calculateIMC(taille, poids),
  });

  // 2. Créer les autres signes liés — même logique que createSignesFonctionnels
  for (const autreSigne of autres_signes) {
    await createAutreSigneClinique(signe.id, autreSigne.appareil_id, autreSigne.description);
  }

  return signe;
};

export const getSigneCliniqueByNumeroDossier = async (numeroDossier) => {
  const signes = await getSigneCliniqueByNumeroDossierModel(numeroDossier);

  return Promise.all(
    signes.map(async (signe) => ({
      ...signe,
      autres_signes: await getAutresSignesBySigneCliniqueId(signe.id),
    }))
  );
};


//?? est l'opérateur de coalescence nulle en JavaScript. 
// Il permet de retourner la première valeur qui n'est pas null ou undefined

  // Recalculer l'IMC si taille ou poids mis à jour
export const updateSigneClinique = async (id, signeData) => {
  const existing = await getSigneCliniqueByIdModel(id);
  if (!existing) {
    throw new Error("Signe clinique introuvable");
  }

  // Recalculer l'IMC si besoin
  const taille = signeData.taille ?? existing.taille;
  const poids = signeData.poids ?? existing.poids;
  signeData.imc = calculateIMC(taille, poids);

  // Mettre à jour le signe principal
  const signe = await updateSigneCliniqueModel(id, signeData);

  // Gérer les autres signes si fournis
  if (signeData.autres_signes !== undefined) {
    // Supprimer les anciens
    await deleteAutresSignesBySigneCliniqueId(id);
    // Insérer les nouveaux
    for (const autreSigne of signeData.autres_signes) {
      await createAutreSigneClinique(id, autreSigne.appareil_id, autreSigne.description);
    }
  }

  return signe;
};
