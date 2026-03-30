// bilanResultatsMap.js  — source de vérité unique

export const BILAN_RESULTATS_MAP = {

  serologie_vih: {
    label: "Sérologie VIH",
    champs: [
      { key: "vih_anticorps",   label: "Anticorps VIH",    type: "select",
        options: ["Positif", "Négatif", "Indéterminé"] },
      { key: "vih_charge_log",  label: "Charge virale (log)", type: "number", unite: "log cp/ml" },
    ],
  },

  bilan_biochimique: {
    label: "Bilan biochimique",
    champs: [
      { key: "asat",       label: "ASAT",       type: "number", unite: "UI/L" },
      { key: "alat",       label: "ALAT",       type: "number", unite: "UI/L" },
      { key: "phosphore",  label: "Phosphore",  type: "number", unite: "mmol/L" },
      { key: "calcemie",   label: "Calcémie",   type: "number", unite: "mmol/L" },
    ],
  },

  serologie_vhb: {
    label: "Sérologie VHB",
    champs: [
      { key: "vhb_ag_hbs",   label: "Ag HBs",    type: "select", options: ["Positif", "Négatif"] },
      { key: "vhb_ac_hbs",   label: "Ac anti-HBs", type: "number", unite: "UI/L" },
      { key: "vhb_ac_hbc",   label: "Ac anti-HBc", type: "select", options: ["Positif", "Négatif"] },
    ],
  },

  nfs_complete: {
    label: "NFS complète",
    champs: [
      { key: "hemoglobine",   label: "Hémoglobine",   type: "number", unite: "g/dL" },
      { key: "leucocytes",    label: "Leucocytes",    type: "number", unite: "G/L" },
      { key: "plaquettes",    label: "Plaquettes",    type: "number", unite: "G/L" },
      { key: "hematocrite",   label: "Hématocrite",   type: "number", unite: "%" },
    ],
  },

  charge_virale_vih: {
    label: "Charge Virale VIH",
    champs: [
      { key: "charge_virale_valeur", label: "Charge virale", type: "number", unite: "copies/mL" },
      { key: "charge_virale_log",    label: "Log",           type: "number", unite: "log" },
      { key: "charge_virale_statut", label: "Statut",        type: "select",
        options: ["Indétectable", "Détectable", "Elevée"] },
    ],
  },

  cd4_cd8: {
    label: "CD4/CD8",
    champs: [
      { key: "cd4_absolu",  label: "CD4 absolu",  type: "number", unite: "cellules/mm³" },
      { key: "cd4_pourcent",label: "CD4 %",       type: "number", unite: "%" },
      { key: "cd8_absolu",  label: "CD8 absolu",  type: "number", unite: "cellules/mm³" },
      { key: "ratio_cd4_cd8", label: "Ratio CD4/CD8", type: "number", unite: "" },
    ],
  },

  bilan_lipidique: {
    label: "Bilan lipidique",
    champs: [
      { key: "cholesterol_total", label: "Cholestérol total", type: "number", unite: "mmol/L" },
      { key: "hdl",               label: "HDL",               type: "number", unite: "mmol/L" },
      { key: "ldl",               label: "LDL",               type: "number", unite: "mmol/L" },
      { key: "triglycerides",     label: "Triglycérides",     type: "number", unite: "mmol/L" },
    ],
  },

  serologie_vha: {
    label: "Sérologie VHA",
    champs: [
      { key: "vha_igm", label: "Ac anti-VHA IgM", type: "select", options: ["Positif", "Négatif"] },
      { key: "vha_igg", label: "Ac anti-VHA IgG", type: "select", options: ["Positif", "Négatif"] },
    ],
  },

  serologie_vhc: {
    label: "Sérologie VHC",
    champs: [
      { key: "vhc_ac",       label: "Ac anti-VHC",  type: "select", options: ["Positif", "Négatif"] },
      { key: "vhc_arn",      label: "ARN VHC",      type: "number", unite: "UI/mL" },
    ],
  },

  tpha_vdrl: {
    label: "TPHA VDRL",
    champs: [
      { key: "tpha",  label: "TPHA",  type: "select", options: ["Positif", "Négatif"] },
      { key: "vdrl",  label: "VDRL",  type: "select", options: ["Positif", "Réactif", "Non réactif"] },
    ],
  },

  serologie_toxoplasmose: {
    label: "Sérologie toxoplasmose",
    champs: [
      { key: "toxo_igm", label: "IgM toxo", type: "select", options: ["Positif", "Négatif"] },
      { key: "toxo_igg", label: "IgG toxo", type: "number", unite: "UI/mL" },
    ],
  },

  serologie_cmv: {
    label: "Sérologie CMV",
    champs: [
      { key: "cmv_igm", label: "IgM CMV", type: "select", options: ["Positif", "Négatif"] },
      { key: "cmv_igg", label: "IgG CMV", type: "number", unite: "UI/mL" },
    ],
  },

  serologie_leishmaniose: {
    label: "Sérologie leishmaniose",
    champs: [
      { key: "leishmania_ac", label: "Ac anti-leishmania", type: "select",
        options: ["Positif", "Négatif"] },
      { key: "leishmania_titre", label: "Titre",           type: "number", unite: "" },
    ],
  },

  idr_tuberculine: {
    label: "IDR à la tuberculine",
    champs: [
      { key: "idr_diametre",  label: "Diamètre d'induration", type: "number", unite: "mm" },
      { key: "idr_resultat",  label: "Résultat",              type: "select",
        options: ["Négatif", "Douteux", "Positif"] },
    ],
  },

  test_genotypage: {
    label: "Test de génotypage",
    champs: [
      { key: "genotype_vih",      label: "Génotype VIH",       type: "text" },
      { key: "resistance_inti",   label: "Résistance INTI",    type: "select",
        options: ["Sensible", "Résistance faible", "Résistance intermédiaire", "Résistance élevée"] },
      { key: "resistance_innti",  label: "Résistance INNTI",   type: "select",
        options: ["Sensible", "Résistance faible", "Résistance intermédiaire", "Résistance élevée"] },
      { key: "resistance_ip",     label: "Résistance IP",      type: "select",
        options: ["Sensible", "Résistance faible", "Résistance intermédiaire", "Résistance élevée"] },
    ],
  },

  radio_thorax: {
    label: "Radio thorax",
    champs: [
      { key: "radio_resultat",   label: "Résultat",   type: "select",
        options: ["Normal", "Anomalie détectée"] },
      { key: "radio_description", label: "Description", type: "textarea" },
    ],
  },
};
