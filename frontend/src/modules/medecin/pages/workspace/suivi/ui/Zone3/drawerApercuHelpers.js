import { formatDate, getDureeTraitement } from "../../helpers/suiviHelpers";
import { UNITES } from "../../constants/suiviConstants";

export const hasValue = (value) =>
  value !== null && value !== undefined && value !== "";

export const displayOrDash = (value) => (hasValue(value) ? value : "-");

export const hasSectionData = (row, fields = []) =>
  fields.some((field) => hasValue(row?.[field]));

export const DRAWER_SECTIONS = [
  {
    title: "Hématologie",
    fields: ["cd4_pourcent", "plaquettes", "globules_blancs", "lymphocytes"],
    items: [
      { label: "CD4 %", key: "cd4_pourcent", render: (value) => `${value} %` },
      { label: `Plaquettes (${UNITES.PLAQUETTES})`, key: "plaquettes" },
      { label: "Globules blancs", key: "globules_blancs" },
      { label: `Lymphocytes (${UNITES.LYMPHOCYTES})`, key: "lymphocytes" },
    ],
  },
  {
    title: "Biochimie",
    fields: ["asat", "alat", "phosphore", "calcemie"],
    items: [
      { label: "ASAT", key: "asat" },
      { label: "ALAT", key: "alat" },
      { label: "Phosphore", key: "phosphore" },
      { label: "Calcémie", key: "calcemie" },
    ],
  },
  {
    title: "Bilan lipidique",
    fields: ["cholesterol_total", "hdl", "ldl", "triglycerides"],
    items: [
      { label: "Cholestérol total", key: "cholesterol_total" },
      { label: "HDL", key: "hdl" },
      { label: "LDL", key: "ldl" },
      { label: "Triglycerides", key: "triglycerides" },
    ],
  },
  {
    title: "Sérologie VHB",
    fields: ["vhb_ag_hbs", "vhb_ac_hbs", "vhb_ac_hbc"],
    items: [
      { label: "AgHBs", key: "vhb_ag_hbs" },
      { label: "Ac HBs", key: "vhb_ac_hbs" },
      { label: "Ac HBc", key: "vhb_ac_hbc" },
    ],
  },
  {
    title: "Sérologie",
    fields: [
      "vhc",
      "vha_igg",
      "toxo_igg",
      "toxo_igm",
      "cmv_igg",
      "cmv_igm",
      "vdrl",
      "tpha",
      "leishmania_ac",
      "idr_tuberculine",
    ],
    items: [
      { label: "VHC", key: "vhc" },
      { label: "VHA IgG", key: "vha_igg" },
      { label: "Toxo IgG", key: "toxo_igg" },
      { label: "Toxo IgM", key: "toxo_igm" },
      { label: "CMV IgG", key: "cmv_igg" },
      { label: "CMV IgM", key: "cmv_igm" },
      { label: "VDRL", key: "vdrl" },
      { label: "TPHA", key: "tpha" },
      { label: "Leishmania Ac", key: "leishmania_ac" },
      { label: "IDR Tuberculine", key: "idr_tuberculine" },
    ],
  },
];

export const getTraitementItems = (row) => [
  {
    label: "Début",
    value: row.traitement_date_debut,
    render: (value) => formatDate(value),
  },
  {
    label: "Fin",
    value: row.traitement_date_fin,
    render: (value) => formatDate(value),
  },
  {
    label: "Durée",
    value: hasValue(row.traitement_date_debut)
      ? getDureeTraitement(row.traitement_date_debut, row.traitement_date_fin)
      : "-",
  },
  {
    label: "Statut",
    value: hasValue(row.traitement_date_debut)
      ? hasValue(row.traitement_date_fin)
        ? { label: "Terminé", color: "default" }
        : { label: "En cours", color: "green" }
      : "-",
  },
];
