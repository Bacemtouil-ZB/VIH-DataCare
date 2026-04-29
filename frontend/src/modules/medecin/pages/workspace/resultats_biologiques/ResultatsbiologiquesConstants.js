// ── ResultatsbiologiquesConstants.js ─────────────────────────────────────────
// Uniquement des constantes pures : maps statiques, messages, en-têtes.
// Aucune logique, aucun mapper, aucune fonction ici.

// ── Mapping clé de section → colonne date dans la DB ─────────────────────────
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
  test_genotypage:        "date_test_genotypage",
  radio_thorax:           "date_radio_thorax",
};

// ── En-têtes du tableau historique des BILANS (remplace celui des résultats) ──
// La table affichée est maintenant celle des bilans prescrits.
export const BILAN_HISTORIQUE_HEADERS = ["Date", "Bilans prescrits", "Observations", "Action"];

// ── En-têtes de l'ancien tableau résultats (conservé pour la vue détail) ──────
export const HISTORIQUE_HEADERS = ["Date", "Résultats", "Observations", "Action"];

// ── Options radio 3 états pour les champs sérologiques ───────────────────────
// Remplace le select Positif/Négatif des champs de type "select" dans bilanResultatsMap.
export const RADIO_OPTIONS_3 = [
  { value: "Négatif", label: "Négatif" },
  { value: "Positif", label: "Positif" },
  { value: "NF",      label: "NF"      },
];

// ── Messages UI ───────────────────────────────────────────────────────────────
export const MESSAGES = {
  aucunBilan:           "Aucun bilan prescrit pour ce patient. Veuillez d'abord créer une prescription de bilans.",
  aucunBilanActif:      "Aucun bilan actif dans la prescription.",
  aucunResultat:        "Aucun résultat biologique enregistré.",
  aucunBilanPrescrit:   "Aucun bilan prescrit.",
  erreurChargement:     "Erreur lors du chargement",
  erreurEnregistrement: "Erreur lors de l'enregistrement.",
  enregistrement:       "Enregistrement...",
  confirmerCreation:    "Enregistrer ce résultat ?",
  confirmerModif:       "Enregistrer les modifications ?",
  confirmerModifSub:    "Les données seront sauvegardées dans le dossier patient.",
  confirmerEdit:        "Modifier ce résultat ?",
  successCreation:      "Résultat enregistré.",
  successModif:         "Résultat mis à jour.",
  modeDetails:          "Mode détails actif",
  modeModif:            "Mode modification activé",
};