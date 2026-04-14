// controllers/biController.js

import {
  getNouveauxMaladesSummary as getNouveauxMaladesSummaryService,
  refreshNouveauxMaladesMVs,
  getAnneesDisponibles as getAnneesDisponiblesService,
} from "../services/biService.js";

// ── Wrapper handle — même pattern que ton projet ──────────────
const handle = (fn) => async (req, res) => {
  try {
    const result = await fn(req, res);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error("❌ ERREUR DÉTAILLÉE :", err);
    res
      .status(err.status || 500)
      .json({ success: false, message: err.message || "Erreur serveur" });
  }
};

// ── Validation params — annee obligatoire, trimestre optionnel
const parsePeriode = (query) => {
  const annee     = query.annee     ? parseInt(query.annee)     : null;
  const trimestre = query.trimestre ? parseInt(query.trimestre) : null;

  if (!annee) {
    throw { status: 400, message: "Le paramètre annee est obligatoire" };
  }
  if (isNaN(annee) || annee < 2000 || annee > 2100) {
    throw { status: 400, message: "Année invalide" };
  }
  if (trimestre !== null && (isNaN(trimestre) || trimestre < 1 || trimestre > 4)) {
    throw { status: 400, message: "Trimestre doit être entre 1 et 4" };
  }

  return { annee, trimestre };
};

// ── Nouveaux malades — summary complet ───────────────────────
export const getNouveauxMaladesSummary = handle(async (req) => {
  const { annee, trimestre } = parsePeriode(req.query);
  return await getNouveauxMaladesSummaryService({ annee, trimestre });
});

// ── Refresh MVs — admin uniquement ───────────────────────────
export const refreshMVs = handle(async () => {
  await refreshNouveauxMaladesMVs();
  return { refreshedAt: new Date().toISOString() };
});

export const getAnneesDisponibles = handle(async () => {
  return await getAnneesDisponiblesService();
});