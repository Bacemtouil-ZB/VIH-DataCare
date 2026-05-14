import {
  findNouveauxDepistes,
  findDiagnosticTardifLt200,
  findDiagnosticTardif200350,
  findPopClesHsh,
  findPopClesUdi,
  findPopClesPs,
  findPopClesTransgenres,
  findFileActiveTotal,
  findCvControle,
  findSuppressionLt1000,
  findSuppressionLt50,
  findSuppressionGt1000,
  findDecesSida,
  findDecesNormaux,
  findPerdusDeVue,
  findRecuperes,
  findTransferts,
  findMigrants,
  findAnneesDisponibles,
  refreshAllMVs,
  findClassificationCD4
} from '../models/biModel.js';

// ============================================================
// CONSTANTES
// ============================================================

const TRANCHES_8 = [
  '<1an', '1-4ans', '5-9ans', '10-14ans',
  '15-19ans', '20-24ans', '25-49ans', '>50ans',
];

const TRANCHES_3 = ['<5ans', '5-14ans', '>15ans'];

const TRANCHES_2 = ['<25ans', '>=25ans'];

const GENDERS = ['homme', 'femme', 'transgenre'];


// ============================================================
// HELPERS FORMATAGE RECHARTS
// ============================================================

// Bar groupé — gender × tranches
// Recharts : <BarChart> avec <Bar dataKey="homme"> <Bar dataKey="femme"> etc.
// [{ tranche, homme, femme, transgenre, total }]
const toBarGroupe = (rows, tranches, trancheCol) => {
  const map = {};
  for (const t of tranches) {
    map[t] = { tranche: t, homme: 0, femme: 0, transgenre: 0, total: 0 };
  }
  for (const row of rows) {
    const t = row[trancheCol];
    const g = row.gender;
    const n = parseInt(row.total, 10);
    if (!map[t] || !GENDERS.includes(g)) continue;
    map[t][g]    += n;
    map[t].total += n;
  }
  return tranches.map((t) => map[t]);
};



// CORRIGÉ — pivot direct depuis SQL, plus de calcul par soustraction
const toDiagnosticTardif = (rowsClassification) => {
  const map = {};
  for (const t of TRANCHES_8) {
    map[t] = {
      tranche:     t,
      lt200:       0,
      "200_350":   0,   
      gt350:       0,
      sans_mesure: 0,   
    };
  }
  for (const row of rowsClassification) {
    const t = row.tranche;
    if (!map[t]) continue;
    map[t].lt200       = parseInt(row.lt200,       10) || 0;
    map[t]["200_350"]  = parseInt(row["200_350"],  10) || 0;
    map[t].gt350       = parseInt(row.gt350,       10) || 0;
    map[t].sans_mesure = parseInt(row.sans_mesure, 10) || 0;
  }
  return TRANCHES_8.map((t) => map[t]);
};


// Bar empilé 100% — cascade virologique ONUSIDA
// Recharts : <BarChart> avec stackId="v" sur 3 couches
// [{ tranche, lt50, lt1000_only, gt1000 }]
const toCascadeVirale = (rowsLt50, rowsLt1000, rowsGt1000) => {
  // remplacer rowsTotal par rowsGt1000, supprimer _total
  const map = {};
  for (const t of TRANCHES_8) {
    map[t] = { tranche: t, lt50: 0, lt1000_only: 0, gt1000: 0 };
  }

  for (const row of rowsLt50) {
    const t = row.tranche_8;
    if (!map[t]) continue;
    map[t].lt50 += parseInt(row.total, 10);
  }

  for (const row of rowsLt1000) {
    const t = row.tranche_8;
    if (!map[t]) continue;
    map[t].lt1000_only += parseInt(row.total, 10);
  }

  for (const row of rowsGt1000) {
    const t = row.tranche_8;
    if (!map[t]) continue;
    map[t].gt1000 += parseInt(row.total, 10);
  }

  // lt1000_only = lt1000 - lt50 (lt1000 inclut lt50)
  for (const t of TRANCHES_8) {
    map[t].lt1000_only = Math.max(0, map[t].lt1000_only - map[t].lt50);
  }

  return TRANCHES_8.map((t) => map[t]);
};


// Donut — populations clés
// Recharts : <PieChart><Pie innerRadius={60}> avec dataKey="value"
// [{ label, value }]
const toDonut = (rowsHsh, rowsUdi, rowsPs, rowsTransgenres) => {
  const sum = (rows = []) =>
    rows.reduce((acc, r) => acc + (parseInt(r.total, 10) || 0), 0);

  const donut = [
    { label: 'HSH',         value: sum(rowsHsh)         },
    { label: 'UDI',         value: sum(rowsUdi)         },
    { label: 'PS',          value: sum(rowsPs)          },
    { label: 'Transgenres', value: sum(rowsTransgenres) },
  ];

  const total = donut.reduce((acc, d) => acc + d.value, 0);
  if (total === 0) return [];

  return donut;
};


// Bar delta — perdus de vue vs récupérés côte à côte
// Recharts : <BarChart> avec <Bar dataKey="perdu_de_vue"> <Bar dataKey="recupere">
// [{ tranche, perdu_de_vue, recupere }]
const toDelta = (rowsPerdus, rowsRecuperes, tranches, trancheCol) => {
  const map = {};
  for (const t of tranches) {
    map[t] = { tranche: t, perdu_de_vue: 0, recupere: 0 };
  }
  for (const row of rowsPerdus) {
    const t = row[trancheCol];
    if (!map[t]) continue;
    map[t].perdu_de_vue += parseInt(row.total, 10);
  }
  for (const row of rowsRecuperes) {
    const t = row[trancheCol];
    if (!map[t]) continue;
    map[t].recupere += parseInt(row.total, 10);
  }
  return tranches.map((t) => map[t]);
};


// Bar simple — une seule série gender × tranches
// Recharts : <BarChart> avec <Bar dataKey="total">
const toBarSimple = (rows, tranches, trancheCol) =>
  toBarGroupe(rows, tranches, trancheCol);


// ============================================================
// SERVICE — NOUVEAUX MALADES
// ============================================================

export const getNouveauxMaladesSummary = async ({ annee, trimestre }) => {
  const params = { annee, trimestre };

  const [
    rowsNouveaux,
    rowsClassificationCD4,
    rowsHsh,
    rowsUdi,
    rowsPs,
    rowsTransgenres,
  ] = await Promise.all([
    findNouveauxDepistes(params),
    findClassificationCD4(params),
    findPopClesHsh(params),
    findPopClesUdi(params),
    findPopClesPs(params),
    findPopClesTransgenres(params),
  ]);

  return {
    meta: { annee, trimestre: trimestre ?? null },

    // KPI 1 — Bar groupé gender × tranche_8
    nouveaux_depistes: toBarGroupe(rowsNouveaux, TRANCHES_8, 'tranche_8'),

    // KPI 2 + 3 — Bar empilé diagnostic tardif CD4
    diagnostic_tardif: toDiagnosticTardif(rowsClassificationCD4), 

    // KPI 4 — Donut total + détail tranche_2 pour drill-down
    populations_cles: {
      donut: toDonut(rowsHsh, rowsUdi, rowsPs, rowsTransgenres),
      detail: {
        hsh:         toBarGroupe(rowsHsh,         TRANCHES_2, 'tranche_2'),
        udi:         toBarGroupe(rowsUdi,         TRANCHES_2, 'tranche_2'),
        ps:          toBarGroupe(rowsPs,          TRANCHES_2, 'tranche_2'),
        transgenres: toBarGroupe(rowsTransgenres, TRANCHES_2, 'tranche_2'),
      },
    },
  };
};


// ============================================================
// SERVICE — FILE ACTIVE
// ============================================================

export const getFileActiveSummary = async ({ annee }) => {
  const params = { annee };

  const [
    rowsTotal,
    rowsCvControle,
    rowsLt1000,
    rowsLt50,
    rowsGt1000,
    rowsDecesSida,
    rowsDecesNormaux,
    rowsPerdus,
    rowsRecuperes,
    rowsTransferts,
    rowsMigrants,
  ] = await Promise.all([
    findFileActiveTotal(params),
    findCvControle(params),
    findSuppressionLt1000(params),
    findSuppressionLt50(params),
     findSuppressionGt1000(params),
    findDecesSida(params),
    findDecesNormaux(params),
    findPerdusDeVue(params),
    findRecuperes(params),
    findTransferts(params),
    findMigrants(params),
  ]);

  return {
    meta: { annee },

    // KPI 5 — Bar horizontal pyramide des âges
    // Recharts : <BarChart layout="vertical">
    total_file_active: toBarGroupe(rowsTotal, TRANCHES_8, 'tranche_8'),

    // KPI 6 — Bar groupé CV contrôle
    // cible_pct_95 = signal frontend pour <ReferenceLine y={95} label="Cible 95%">
    cv_controle: {
      data:      toBarGroupe(rowsCvControle, TRANCHES_8, 'tranche_8'),
      cible_95:  true,
    },

    // KPI 7 + 8 — Bar empilé 100% cascade virologique ONUSIDA
    // 3 couches : lt50 / lt1000_only / gt1000
    cascade_virale: toCascadeVirale(rowsLt50, rowsLt1000, rowsGt1000),
    // KPI 9 + 10 — Bar groupé décès sida vs normaux par tranche_3
    deces: {
      sida:    toBarSimple(rowsDecesSida,    TRANCHES_3, 'tranche_3'),
      normaux: toBarSimple(rowsDecesNormaux, TRANCHES_3, 'tranche_3'),
    },

    // KPI 11 + 12 — Bar delta perdus de vue vs récupérés
    retention: {
      perdus:    toBarGroupe(rowsPerdus,    TRANCHES_3, 'tranche_3'),
      recuperes: toBarGroupe(rowsRecuperes, TRANCHES_8, 'tranche_8'),
    },
    // KPI 13 — Bar simple transferts par tranche_3
    transferts: toBarSimple(rowsTransferts, TRANCHES_3, 'tranche_3'),

    // KPI 14 — Bar simple migrants par tranche_3
    migrants: toBarSimple(rowsMigrants, TRANCHES_3, 'tranche_3'),
  };
};


// ============================================================
// SERVICE — UTILITAIRES
// ============================================================

export const getAnneesDisponibles = async () => {
  return await findAnneesDisponibles();
};

export const refreshAllMaterializedViews = async () => {
  await refreshAllMVs();
  return { refreshed: true, timestamp: new Date().toISOString() };
};