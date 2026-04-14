// services/biService.js
import {
  findNouveauxCasParSexeAge,
  findDiagnosticTardif,
  findPopulationsCles,
  findAnneesDisponibles
} from "../models/biModel.js";
import pool from "../config/db.js";

// ── Helpers formatage ─────────────────────────────────────────

const TRANCHES_AGE = [
  "<1an", "1-4ans", "5-9ans", "10-14ans",
  "15-19ans", "20-24ans", "25-49ans", ">50ans",
];

const GENDERS = ["homme", "femme", "transgenre"];

const formatNouveauxCas = (rows) => {
  const result = {};

  for (const g of GENDERS) {
    result[g] = {};
    for (const t of TRANCHES_AGE) result[g][t] = 0;
  }

  for (const row of rows) {
    if (result[row.gender]?.[row.tranche_age] !== undefined) {
      result[row.gender][row.tranche_age] = parseInt(row.nb);
    }
  }

  result.total = {};
  for (const t of TRANCHES_AGE) {
    result.total[t] = GENDERS.reduce(
      (sum, g) => sum + (result[g][t] || 0), 0
    );
  }

  return result;
};

const formatDiagnosticTardif = (rows) => {
  const SEUILS = ["lt200", "200_350", "gt350", "sans_mesure"];

  const result = {};
  for (const g of GENDERS) {
    result[g] = {};
    for (const t of TRANCHES_AGE) {
      result[g][t] = { lt200: 0, "200_350": 0, gt350: 0, sans_mesure: 0 };
    }
  }

  for (const row of rows) {
    if (result[row.gender]?.[row.tranche_age]?.[row.seuil_cd4] !== undefined) {
      result[row.gender][row.tranche_age][row.seuil_cd4] = parseInt(row.nb);
    }
  }

  result.total = {};
  for (const t of TRANCHES_AGE) {
    result.total[t] = { lt200: 0, "200_350": 0, gt350: 0, sans_mesure: 0 };
    for (const s of SEUILS) {
      result.total[t][s] = GENDERS.reduce(
        (sum, g) => sum + (result[g][t][s] || 0), 0
      );
    }
  }

  return result;
};

const formatPopulationsCles = (rows) => {
  const result = {
    hsh:         { lt25: 0, gte25: 0, total: 0 },
    udi:         { lt25: 0, gte25: 0, total: 0 },
    transgenres: { lt25: 0, gte25: 0, total: 0 },
  };

  for (const row of rows) {
    const grp = row.groupe_age_pop;
    result.hsh[grp]          = parseInt(row.nb_hsh);
    result.udi[grp]          = parseInt(row.nb_udi);
    result.transgenres[grp]  = parseInt(row.nb_transgenres);
    result.hsh.total         += parseInt(row.nb_hsh);
    result.udi.total         += parseInt(row.nb_udi);
    result.transgenres.total += parseInt(row.nb_transgenres);
  }

  return result;
};

// ── Summary — tous les KPIs nouveaux malades en parallèle ────
export const getNouveauxMaladesSummary = async ({ annee, trimestre }) => {
  const [
    rowsCas,
    rowsDiagnostic,
    rowsPopulations,
  ] = await Promise.all([
    findNouveauxCasParSexeAge({ annee, trimestre }),
    findDiagnosticTardif({ annee, trimestre }),
    findPopulationsCles({ annee, trimestre }),
  ]);

  return {
    casSexeAge:      formatNouveauxCas(rowsCas),
    diagnosticTardif: formatDiagnosticTardif(rowsDiagnostic),
    populationsCles:  formatPopulationsCles(rowsPopulations),
  };
};

// ── Refresh MVs ───────────────────────────────────────────────
export const refreshNouveauxMaladesMVs = async () => {
  await Promise.all([
    pool.query("REFRESH MATERIALIZED VIEW CONCURRENTLY mv_nouveaux_cas"),
    pool.query("REFRESH MATERIALIZED VIEW CONCURRENTLY mv_diagnostic_tardif"),
  ]);
};

export const getAnneesDisponibles = async () => {
  return await findAnneesDisponibles();
};