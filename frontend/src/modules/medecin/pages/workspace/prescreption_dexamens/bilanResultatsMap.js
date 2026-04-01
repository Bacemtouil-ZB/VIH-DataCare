// bilanResultatsMap.js  — source de vérité unique

export const BILAN_RESULTATS_MAP = {



  bilan_biochimique: {
    label: "Bilan biochimique",
    champs: [
      { key: "asat",       label: "ASAT",       type: "number", unite: "UI/L" },
      { key: "alat",       label: "ALAT",       type: "number", unite: "UI/L" },
      { key: "phosphore",  label: "Phosphore",  type: "number", unite: "mmol/L" },
      { key: "calcemie",   label: "Calcémie",   type: "number", unite: "mmol/L" },
      { key: "créatinine",   label: "Créatinine",   type: "number", unite: "mmol/L" },

    ],
  },

  serologie_vhb: {
    label: "Sérologie VHB",
    champs: [
      { key: "vhb_ag_hbs",   label: " HBS",    type: "select", options: ["Positif", "Négatif"] },
      { key: "vhb_ac_hbs",   label: " anti-HBs", type: "select",options: ["Positif", "Négatif"]  },
      { key: "vhb_ac_hbc",   label: "anti-iHBc", type: "select", options: ["Positif", "Négatif"] },
    ],
  },

  nfs_complete: {                //            DONE
    label: "NFS complète",
    champs: [
      { key: "hemoglobine",   label: "Hémoglobine",   type: "number", unite: "g/dL" },
      { key: "plaquettes",    label: "Plaquettes",    type: "number", unite: "10³/mm³" },
      { key: "globules blancs",   label: "Globules blancs",   type: "number", unite: "10³/mm³" },
      { key: "lymphocytes",    label: "Lymphocytes",    type: "number", unite: "10³/mm³" },


    ],
  },

  charge_virale_vih: {                          //            DONE 
    label: "Charge Virale VIH",
    champs: [
      { key: "charge_virale_valeur", label: "Charge virale", type: "number", unite: "copies/mL" },    
    ],
  },

  cd4_cd8: {                //            DONE
    label: "CD4/CD8",
    champs: [
      { key: "cd4_absolu",  label: "CD4 absolu",  type: "number", unite: "cellules/mm³" },
      { key: "cd4_pourcent",label: "CD4 %",       type: "number", unite: "%" },
    ],
  },

  bilan_lipidique: {             //           DONE
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
      { key: "vha_igg", label: "Ac anti-VHA IgG", type: "select", options: ["Positif", "Négatif"] },
    ],
  },

  serologie_vhc: {
    label: "Sérologie VHC",
    champs: [
      { key: "vhc",       label: "VHC",  type: "select", options: ["Positif", "Négatif"] },
    ],
  },



  serologie_toxoplasmose: { // done
    label: "Sérologie toxoplasmose",
    champs: [
      { key: "toxo_igm", label: "IgM ", type: "select", options: ["Positif", "Négatif"] },
      { key: "toxo_igg", label: "IgG ", type: "select", options: ["Positif", "Négatif"] },
    ],
  },

  serologie_cmv: { // done 
    label: "Sérologie CMV",
    champs: [
      { key: "cmv_igm", label: "IgM ", type: "select", options: ["Positif", "Négatif"] },
      { key: "cmv_igg", label: "IgG ", type: "select", options: ["Positif", "Négatif"] },
    ],
  },


    serologie_Syphilis: { // done 
    label: "Sérologie Syphilis",
    champs: [
      { key: "VDRL", label: "VDRL", type: "select", options: ["Positif", "Négatif"] },
      { key: "TPHA", label: "TPHA", type: "select", options: ["Positif", "Négatif"] },

    ],
  },




  idr_tuberculine: { // done
    label: "IDR à la tuberculine",
    champs: [
      { key: "idr_tuberculine",  label: "IDR à la tuberculine", type: "select", options:["Négatif", "Douteux", "Positif"] },
     
    ],
  },
// non mentionnés :

  serologie_leishmaniose: {
    label: "Sérologie leishmaniose",
    champs: [
      { key: "leishmania_ac", label: "Ac anti-leishmania", type: "select",
        options: ["Positif", "Négatif"] },
      { key: "leishmania_titre", label: "Titre",           type: "number", unite: "" },
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


  serologie_vih: {
    label: "Sérologie VIH",
    champs: [
      { key: "vih_charge_log",  label: "Charge virale (log)", type: "number", unite: "log cp/ml" },
    ],
  },