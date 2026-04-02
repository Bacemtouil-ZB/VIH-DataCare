
export const SECTION_DATE_KEY = {
  serologie_vih:          "date_serologie_vih",
  bilan_biochimique:      "date_bilan_biochimique",
  serologie_vhb:          "date_serologie_vhb",
  nfs_complete:           "date_nfs_complete",
  charge_virale_vih:      "date_charge_virale_vih",
  cd4_cd8:                "date_cd4_cd8",
  bilan_lipidique:        "date_bilan_lipidique",
  serologie_vha:          "date_serologie_vha",
  serologie_vhc:          "date_serologie_vhc",
  serologie_syphilis:     "date_serologie_syphilis",
  serologie_toxoplasmose: "date_serologie_toxoplasmose",
  serologie_cmv:          "date_serologie_cmv",
  serologie_leishmaniose: "date_serologie_leishmaniose",
  idr_tuberculine:        "date_idr_tuberculine",
  radio_thorax:           "date_radio_thorax",
};

// ── En-têtes tableau historique ───────────────────────────────────────────────
export const HISTORIQUE_HEADERS = ["Date", "Résultats", "Observations", "Action"];

// ── Messages UI ───────────────────────────────────────────────────────────────
export const MESSAGES = {
  aucunBilan:        "Aucun bilan prescrit pour ce patient. Veuillez d'abord créer une prescription de bilans.",
  aucunBilanActif:   "Aucun bilan actif dans la prescription.",
  aucunResultat:     "Aucun résultat biologique enregistré.",
  erreurChargement:  "Erreur lors du chargement",
  erreurEnregistrement: "Erreur lors de l'enregistrement.",
  enregistrement:    "Enregistrement...",
  confirmerCreation: "Enregistrer ce résultat ?",
  confirmerModif:    "Enregistrer les modifications ?",
  confirmerModifSub: "Les données seront sauvegardées dans le dossier patient.",
  confirmerEdit:     "Modifier ce résultat ?",
  successCreation:   "Résultat enregistré.",
  successModif:      "Résultat mis à jour.",
  modeDetails:       "Mode détails actif",
  modeModif:         "Mode modification activé",
};