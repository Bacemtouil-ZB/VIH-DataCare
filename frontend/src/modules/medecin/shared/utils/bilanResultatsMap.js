// bilanResultatsMap.js - source de verite unique
// Cle = colonne dans bilan_examens, valeur = champs de resultats a afficher

export const BILAN_RESULTATS_MAP = {
  serologie_vih: {
    label: "Sérologie VIH",
    hasDate: true,
    champs: [
      { key: "serologie_vih", label: "Charge virale", type: "select", options: ["Positif", "Négatif"] ,noNF: true },
    ],
  },

  bilan_biochimique: {
    label: "Bilan biochimique",
    hasDate: true,
    champs: [
      { key: "asat", label: "ASAT", type: "number", unite: "UI/L" },
      { key: "alat", label: "ALAT", type: "number", unite: "UI/L" },
      { key: "phosphore", label: "Phosphore", type: "number", unite: "mmol/L" },
      { key: "calcemie", label: "Calcémie", type: "number", unite: "mmol/L" },
      { key: "creatinine", label: "Créatinine", type: "number", unite: "mmol/L" },
    ],
  },

  serologie_vhb: {
    label: "Sérologie VHB",
    hasDate: true,
    champs: [
      { key: "vhb_ag_hbs", label: "HBs", type: "select", options: ["Positif", "Négatif"] },
      { key: "vhb_ac_hbs", label: "anti-HBs", type: "select", options: ["Positif", "Négatif"] },
      { key: "vhb_ac_hbc", label: "anti-iHBc", type: "select", options: ["Positif", "Négatif"] },
    ],
  },

  nfs_complete: {
    label: "NFS complète",
    hasDate: true,
    champs: [
      { key: "hemoglobine", label: "Hémoglobine", type: "number", unite: "g/dL" },
      { key: "plaquettes", label: "Plaquettes", type: "number", unite: "10³/mm³" },
      { key: "globules_blancs", label: "Globules blancs", type: "number", unite: "10³/mm³" },
      { key: "lymphocytes", label: "Lymphocytes", type: "number", unite: "10³/mm³" },
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
      { key: "cd4_absolu", label: "CD4", type: "number", unite: "cellules/mm³" },
      { key: "cd4_pourcent", label: "CD4 %", type: "number", unite: "%" },
    ],
  },

  bilan_lipidique: {
    label: "Bilan lipidique",
    hasDate: true,
    champs: [
      { key: "cholesterol_total", label: "Cholestérol total", type: "number", unite: "mmol/L" },
      { key: "hdl", label: "HDL", type: "number", unite: "mmol/L" },
      { key: "ldl", label: "LDL", type: "number", unite: "mmol/L" },
      { key: "triglycerides", label: "Triglycérides", type: "number", unite: "mmol/L" },
    ],
  },

  serologie_vha: {
    label: "Sérologie VHA",
    hasDate: true,
    champs: [
      { key: "vha_igg", label: "VHA IgG", type: "select", options: ["Positif", "Négatif"] },
    ],
  },

  serologie_vhc: {
    label: "Sérologie VHC",
    hasDate: true,
    champs: [
      { key: "vhc", label: "VHC", type: "select", options: ["Positif", "Négatif"] },
    ],
  },

  serologie_syphilis: {
    label: "Sérologie syphilis",
    hasDate: true,
    champs: [
      { key: "vdrl", label: "VDRL", type: "select", options: ["Positif", "Négatif"] },
      { key: "tpha", label: "TPHA", type: "select", options: ["Positif", "Négatif"] },
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
      { key: "leishmania_ac", label: "Leishmaniose", type: "select", options: ["Positif", "Négatif"] },
    ],
  },

  // ── IDR tuberculine : 3 options sur la même ligne (type "select" → radio) ─
  idr_tuberculine: {
    label: "IDR à la tuberculine",
    hasDate: true,
    // gridCols force la section sur 1 colonne pour que les 3 radios restent inline
    gridCols: 1,
    champs: [
      {
        key: "idr_tuberculine",
        label: "IDR à la tuberculine",
        type: "select",
        options: ["Négatif", "Positif"],
      },
    ],
  },

  test_genotypage: {
    label: "Test de génotypage",
    hasDate: true,
    champs: [
      {
        key: "genotypage_file_url",
        label: "Fichier(s) scanné(s)",
        type: "file",
        accept: "image/*,application/pdf",
        multiple: true,
      },
    ],
  },

  radio_thorax: {
    label: "Radio thorax",
    hasDate: true,
    champs: [
      { key: "radio_resultat", label: "Résultat radio", type: "select", options: ["Positif", "Négatif"] },
      { key: "radio_description", label: "Description", type: "textarea" },
    ],
  },
};

export const getChampActifs = (bilanPrescrit) => {

  if (!bilanPrescrit) return [];
  return Object.entries(BILAN_RESULTATS_MAP)
    .filter(([key]) => !!bilanPrescrit[key])
    .map(([key, section]) => ({ ...section, _key: key }));
    //{ label: "NFS complète", champs: [...], _key: "nfs_complete" }

};

const normalize = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

const getDefaultToggleValue = (champ) => {
  if (champ.type !== "select" || !Array.isArray(champ.options) || champ.options.length === 0) {
    return "";
  }

  const normalizedOptions = champ.options.map(normalize);
  const isPosNeg = normalizedOptions.length === 2 && normalizedOptions.every((value) =>
    value === "positif" || value === "negatif"
  );

  if (!isPosNeg) return "";
  return champ.options.find((option) => normalize(option) === "negatif") || champ.options[0];
};

// Helper : construire INITIAL_FORM dynamiquement , vide
export const buildInitialForm = (bilanPrescrit) => {
  const form = {};
  const sections = getChampActifs(bilanPrescrit);

  sections.forEach(({ _key, champs }) => {
    champs.forEach((champ) => {
      if (champ.type === "file") {
        form[champ.key] = [];   // multi-fichiers : tableau vide
      } else {
        form[champ.key] = getDefaultToggleValue(champ);
      }
    });

    const dateKey = `date_${_key}`;
    form[dateKey] = "";
  });

  return form;
};