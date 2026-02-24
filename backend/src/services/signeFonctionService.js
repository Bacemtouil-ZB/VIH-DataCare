import {
  createSignesFonctionnels as createSignesModel,
  createAutreSigneFonctionnel,
  getSignesByPatientNumero as getSignesByNumeroModel,
  getSignesByExamenId as getSignesByExamenModel,
  getAutresSignesByExamenId as getAutresSignesModel,
  updateSignesFonctionnels as updateSignesModel,
  getAppareils as getAppareilsModel,
  deleteAutresSignesBySignesFonctionnelsId,
} from "../models/signeFonctionModel.js";

// ── Helpers ───────────────────────────────────────────────────────────────────
const _inserterAutresSignes = async (signesFonctionnelsId, autres_signes = []) => {
  for (const autreSigne of autres_signes) {
    await createAutreSigneFonctionnel(
      signesFonctionnelsId,
      autreSigne.appareil_id,
      autreSigne.description
    );
  }
};

// ── Créer OU mettre à jour si l'examen existe déjà ───────────────────────────
// ✅ FIX : vérifie d'abord si un signe existe pour cet examen
//          → si oui : UPDATE + remplace autres signes
//          → si non : INSERT + crée autres signes
export const createSignesFonctionnels = async (data) => {
  const { examen_clinique_id, signes, autres_signes = [] } = data;

  // Vérifier si un signe existe déjà pour cet examen
  const existing = await getSignesByExamenModel(examen_clinique_id);

  let signesFonctionnels;

  if (existing && existing.id) {
    // Déjà existant → UPDATE au lieu d'INSERT
    signesFonctionnels = await updateSignesModel(existing.id, signes || {});

    // Remplacer les autres signes
    await deleteAutresSignesBySignesFonctionnelsId(existing.id);
  } else {
    // N'existe pas → INSERT normal
    signesFonctionnels = await createSignesModel(examen_clinique_id, signes || {});
  }

  // Insérer les autres signes
  await _inserterAutresSignes(signesFonctionnels.id, autres_signes);

  return signesFonctionnels;
};

// ── Historique patient ────────────────────────────────────────────────────────
export const getSignesByPatientNumero = async (numero) => {
  const signes = await getSignesByNumeroModel(numero);

  return Promise.all(
    signes.map(async (signe) => {
      if (!signe.id) return { ...signe, autres_signes: [] };
      const autresSignes = await getAutresSignesModel(signe.examen_id);
      return { ...signe, autres_signes: autresSignes };
    })
  );
};

// ── Par examen ────────────────────────────────────────────────────────────────
export const getSignesByExamenId = async (examenId) => {
  const signes = await getSignesByExamenModel(examenId);
  if (!signes) return null;

  const autresSignes = await getAutresSignesModel(examenId);
  return { ...signes, autres_signes: autresSignes };
};

// ── Mettre à jour ─────────────────────────────────────────────────────────────
export const updateSignesFonctionnels = async (examenId, data) => {
  const existing = await getSignesByExamenModel(examenId);
  if (!existing || !existing.id) {
    throw new Error("Signes fonctionnels non trouvés pour cet examen");
  }

  const signesUpdated = await updateSignesModel(existing.id, data.signes || {});

  if (data.autres_signes !== undefined) {
    await deleteAutresSignesBySignesFonctionnelsId(existing.id);
    await _inserterAutresSignes(existing.id, data.autres_signes);
  }

  return signesUpdated;
};

// ── Appareils ─────────────────────────────────────────────────────────────────
export const getAppareils = async () => {
  return getAppareilsModel();
};