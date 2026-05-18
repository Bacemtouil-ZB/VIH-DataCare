import {
  getNouveauxMaladesSummary,
  getFileActiveSummary,
  getAnneesDisponibles,
  refreshAllMaterializedViews,
} from '../services/biService.js';


// Wrapper uniforme pour tous les controllers
const handle = (fn) => async (req, res) => {
  try {
    const data = await fn(req, res);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('[BI Controller]', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Parse et valide annee + trimestre depuis req.query
const parsePeriode = (query) => {
  const annee = parseInt(query.annee, 10);

  const trimestre = query.trimestre ? parseInt(query.trimestre, 10) : null;
  if (trimestre !== null && ![1, 2, 3, 4].includes(trimestre)) {
    throw new Error('Paramètre trimestre invalide — valeurs acceptées : 1, 2, 3, 4');
  }

  return { annee, trimestre };
};

// Parse et valide annee uniquement
const parseAnnee = (query) => {
  const annee = parseInt(query.annee, 10);
  return { annee };
};


// ============================================================
// CONTROLLERS
// ============================================================

// GET /api/bi/nouveaux-malades?annee=2025&trimestre=1
// trimestre optionnel — NULL = rapport annuel complet
export const getNouveauxMalades = handle(async (req) => {
  const { annee, trimestre } = parsePeriode(req.query);
  return await getNouveauxMaladesSummary({ annee, trimestre });
});


// GET /api/bi/file-active?annee=2025
export const getFileActive = handle(async (req) => {
  const { annee } = parseAnnee(req.query);
  return await getFileActiveSummary({ annee });
});


// GET /api/bi/annees
export const getAnnees = handle(async () => {
  return await getAnneesDisponibles();
});


// POST /api/bi/refresh
// Admin uniquement — géré dans les routes via adminMiddleware
export const refreshMVs = handle(async () => {
  return await refreshAllMaterializedViews();
});