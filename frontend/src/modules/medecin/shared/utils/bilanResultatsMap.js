// bilanResultatsMap.js — source de vérité unique
// Clé = colonne dans bilan_examens, valeur = champs de résultats à afficher

export const BILAN_RESULTATS_MAP = {

  serologie_vih: {
    label: "Sérologie VIH",
    hasDate: true, 
    champs: [
      { key: "vih_charge", label: "Charge virale", type: "select", options: ["Positif", "Négatif"] },
    ],
  },

  bilan_biochimique: {
    label: "Bilan biochimique",
    hasDate: true, 
    champs: [
      { key: "asat",       label: "ASAT",       type: "number", unite: "UI/L" },
      { key: "alat",       label: "ALAT",       type: "number", unite: "UI/L" },
      { key: "phosphore",  label: "Phosphore",  type: "number", unite: "mmol/L" },
      { key: "calcemie",   label: "Calcémie",   type: "number", unite: "mmol/L" },
      { key: "creatinine", label: "Créatinine", type: "number", unite: "mmol/L" },
    ],
  },

  serologie_vhb: {
    label: "Sérologie VHB",
    hasDate: true, 
    champs: [
      { key: "vhb_ag_hbs", label: "HBs",      type: "select", options: ["Positif", "Négatif"] },
      { key: "vhb_ac_hbs", label: "anti-HBs", type: "select", options: ["Positif", "Négatif"] },
      { key: "vhb_ac_hbc", label: "anti-HBc", type: "select", options: ["Positif", "Négatif"] },
    ],
  },

  nfs_complete: {
    label: "NFS complète",
    hasDate: true, 
    champs: [
      { key: "hemoglobine",    label: "Hémoglobine",    type: "number", unite: "g/dL" },
      { key: "plaquettes",     label: "Plaquettes",     type: "number", unite: "10³/mm³" },
      { key: "globules_blancs",label: "Globules blancs",type: "number", unite: "10³/mm³" },
      { key: "lymphocytes",    label: "Lymphocytes",    type: "number", unite: "10³/mm³" },
    ],
  },

  charge_virale_vih: {
    label: "Charge Virale VIH",
    hasDate: true, 
    champs: [
      { key: "charge_virale_valeur", label: "Charge virale", type: "number", unite: "copies/mL" },
    ],
  },

  cd4_cd8: {
    label: "CD4/CD8",
    hasDate: true, 
    champs: [
      { key: "cd4_absolu",   label: "CD4 absolu", type: "number", unite: "cellules/mm³" },
      { key: "cd4_pourcent", label: "CD4 %",      type: "number", unite: "%" },
    ],
  },

  bilan_lipidique: {
    label: "Bilan lipidique",
    hasDate: true, 
    champs: [
      { key: "cholesterol_total", label: "Cholestérol total", type: "number", unite: "mmol/L" },
      { key: "hdl",               label: "HDL",               type: "number", unite: "mmol/L" },
      { key: "ldl",               label: "LDL",               type: "number", unite: "mmol/L" },
      { key: "triglycerides",     label: "Triglycérides",     type: "number", unite: "mmol/L" },
    ],
  },

  serologie_vha: {
    label: "Sérologie VHA",
    hasDate: true, 
    champs: [
      { key: "vha_igg", label: "Ac anti-VHA IgG", type: "select", options: ["Positif", "Négatif"] },
    ],
  },

  serologie_vhc: {
    label: "Sérologie VHC",
    hasDate: true, 
    champs: [
      { key: "vhc", label: "VHC", type: "select", options: ["Positif", "Négatif"] },
    ],
  },

  "serologie_syphilis": {
    label: "Sérologie syphilis",
    hasDate: true, 
    champs: [
      { key: "VDRL", label: "VDRL", type: "select", options: ["Positif", "Négatif"] },
      { key: "TPHA", label: "TPHA", type: "select", options: ["Positif", "Négatif"] },
    ],
  },

  serologie_toxoplasmose: {
    label: "Sérologie toxoplasmose",
    hasDate: true, 

    champs: [
      { key: "toxo_igm", label: "IgM", type: "select", options: ["Positif", "Négatif"] },
      { key: "toxo_igg", label: "IgG", type: "select", options: ["Positif", "Négatif"] },
    ],
  },

  serologie_cmv: {
    label: "Sérologie CMV",
    hasDate: true, 
    champs: [
      { key: "cmv_igm", label: "IgM", type: "select", options: ["Positif", "Négatif"] },
      { key: "cmv_igg", label: "IgG", type: "select", options: ["Positif", "Négatif"] },
    ],
  },

  serologie_leishmaniose: {
    label: "Sérologie leishmaniose",
    hasDate: true, 
    champs: [
      { key: "leishmania_ac",    label: "Ac anti-leishmania", type: "select", options: ["Positif", "Négatif"] },
    ],
  },

  idr_tuberculine: {
    label: "IDR à la tuberculine",
    hasDate: true, 
    champs: [
      { key: "idr_tuberculine", label: "IDR à la tuberculine", type: "select", options: ["Négatif", "Douteux", "Positif"] },
    ],
  },



  radio_thorax: {
    label: "Radio thorax",
    hasDate: true,
    champs: [
      { key: "radio_resultat",    label: "Résultat",    type: "select", options: ["Normal", "Anomalie "] },
      { key: "radio_description", label: "Description", type: "textarea" },
    ],
  },
};
export const getChampActifs = (bilanPrescrit) => {
  if (!bilanPrescrit) return [];
  return Object.entries(BILAN_RESULTATS_MAP)
    .filter(([key]) => !!bilanPrescrit[key])
    .map(([key, section]) => ({ ...section, _key: key }));
};
 
// ── Helper : construire INITIAL_FORM dynamiquement ────────────────────────────
// Inclut les champs de date par section
export const buildInitialForm = (bilanPrescrit) => {
  const form = {};
  const sections = getChampActifs(bilanPrescrit);
 
  sections.forEach(({ _key, champs }) => {
    // Champs de résultats
    champs.forEach(({ key }) => { form[key] = ""; });
    // Champ date de la section
    const dateKey = `date_${_key}`;
    form[dateKey] = "";
  });
 
  return form;
};
 