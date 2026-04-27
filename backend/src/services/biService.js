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
  findDecesSida,
  findDecesNormaux,
  findPerdusDeVue,
  findRecuperes,
  findTransferts,
  findMigrants,
  findAnneesDisponibles,
  refreshAllMVs,
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


// Bar empilé — diagnostic tardif CD4
// Recharts : <BarChart> avec stackId="a" sur lt200 / entre_200_350 / gt350
// [{ tranche, lt200, entre_200_350, gt350 }]
const toDiagnosticTardif = (rowsLt200, rows200350, rowsNouveaux) => {
  const map = {};
  for (const t of TRANCHES_8) {
    map[t] = { tranche: t, lt200: 0, entre_200_350: 0, gt350: 0 };
  }

  // Dénominateur = total nouveaux dépistés par tranche
  const totalMap = {};
  for (const row of rowsNouveaux) {
    const t = row.tranche_8;
    if (!totalMap[t]) totalMap[t] = 0;
    totalMap[t] += parseInt(row.total, 10);
  }

  for (const row of rowsLt200) {
    const t = row.tranche_8;
    if (!map[t]) continue;
    map[t].lt200 += parseInt(row.total, 10);
  }

  for (const row of rows200350) {
    const t = row.tranche_8;
    if (!map[t]) continue;
    map[t].entre_200_350 += parseInt(row.total, 10);
  }

  for (const t of TRANCHES_8) {
    const known = map[t].lt200 + map[t].entre_200_350;
    map[t].gt350 = Math.max(0, (totalMap[t] || 0) - known);
  }

  return TRANCHES_8.map((t) => map[t]);
};


// Bar empilé 100% — cascade virologique ONUSIDA
// Recharts : <BarChart> avec stackId="v" sur 4 couches
// [{ tranche, lt50, lt1000_only, gt1000, sans_mesure }]
const toCascadeVirale = (rowsLt50, rowsLt1000, rowsTotal) => {
  const map = {};
  for (const t of TRANCHES_8) {
    map[t] = { tranche: t, lt50: 0, lt1000_only: 0, gt1000: 0, sans_mesure: 0, _total: 0 };
  }

  for (const row of rowsTotal) {
    const t = row.tranche_8;
    if (!map[t]) continue;
    map[t]._total += parseInt(row.total, 10);
  }

  for (const row of rowsLt50) {
    const t = row.tranche_8;
    if (!map[t]) continue;
    map[t].lt50 += parseInt(row.total, 10);
  }

  const lt1000Map = {};
  for (const row of rowsLt1000) {
    const t = row.tranche_8;
    if (!lt1000Map[t]) lt1000Map[t] = 0;
    lt1000Map[t] += parseInt(row.total, 10);
  }

  for (const t of TRANCHES_8) {
    const lt50   = map[t].lt50;
    const lt1000 = lt1000Map[t] || 0;
    const total  = map[t]._total;

    map[t].lt1000_only = Math.max(0, lt1000 - lt50);
    map[t].gt1000      = Math.max(0, total - lt1000);
    map[t].sans_mesure = Math.max(0, total - lt50 - map[t].lt1000_only - map[t].gt1000);
    delete map[t]._total;
  }

  return TRANCHES_8.map((t) => map[t]);
};


// Donut — populations clés
// Recharts : <PieChart><Pie innerRadius={60}> avec dataKey="value"
// [{ label, value }]
const toDonut = (rowsHsh, rowsUdi, rowsPs, rowsTransgenres) => {
  const sum = (rows) => rows.reduce((acc, r) => acc + parseInt(r.total, 10), 0);
  return [
    { label: 'HSH',         value: sum(rowsHsh)         },
    { label: 'UDI',         value: sum(rowsUdi)         },
    { label: 'PS',          value: sum(rowsPs)          },
    { label: 'Transgenres', value: sum(rowsTransgenres) },
  ];
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
    rowsLt200,
    rows200350,
    rowsHsh,
    rowsUdi,
    rowsPs,
    rowsTransgenres,
  ] = await Promise.all([
    findNouveauxDepistes(params),
    findDiagnosticTardifLt200(params),
    findDiagnosticTardif200350(params),
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
    diagnostic_tardif: toDiagnosticTardif(rowsLt200, rows200350, rowsNouveaux),

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
    // 4 couches : lt50 / lt1000_only / gt1000 / sans_mesure
    cascade_virale: toCascadeVirale(rowsLt50, rowsLt1000, rowsTotal),

    // KPI 9 + 10 — Bar groupé décès sida vs normaux par tranche_3
    deces: {
      sida:    toBarSimple(rowsDecesSida,    TRANCHES_3, 'tranche_3'),
      normaux: toBarSimple(rowsDecesNormaux, TRANCHES_3, 'tranche_3'),
    },

    // KPI 11 + 12 — Bar delta perdus de vue vs récupérés
    retention: toDelta(rowsPerdus, rowsRecuperes, TRANCHES_3, 'tranche_3'),

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