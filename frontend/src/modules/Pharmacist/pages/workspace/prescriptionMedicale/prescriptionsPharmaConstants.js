// ── Mapper API → UI ───────────────────────────────────────────
// Aligne les champs retournés par getSuiviByNumeroDossier (backend)
// avec les props attendues par PrescriptionsUI
export const toUiPrescriptionItem = (row) => ({
  prescriptionId:       row?.prescription_id        ?? row?.id           ?? null,
  suiviId:              row?.id                      ?? null,
  patientName:          row?.patient_name             ?? "",
  patientSurname:       row?.patient_surname          ?? "-",
  // Traitement : code du médicament (stock_medicaments.code) OU composition
  nomTraitement:        row?.nom_traitement           ?? row?.composition_medicament ?? "Aucun",
  compositionMedicament:row?.composition_medicament   ?? "-",
  dateDebutTraitement:  row?.date_debut_traitement     ?? null,
  dateDelivrance:       row?.date_delivrance           ?? null,
  quantitePrescrite:    row?.quantite_prescrite        ?? row?.quantite ?? "-",
  dosage:               row?.dosage                    ?? "-",
  statutPrescription:   row?.statut_prescription       ?? row?.statut  ?? "envoyee",
  statutPatient:        row?.statut_patient             ?? "",
  ecartJours:           Number(row?.ecart_jours         ?? 0),
});

// ── Badges suivi thérapeutique ────────────────────────────────
export const SUIVI_BADGE_MAP = {
  perdu:   { badgeClass: "statut-perdu",  badgeText: "Perdue de vue" },
  attente: { badgeClass: "statut-leger",  badgeText: "En attente"    },
  actif:   { badgeClass: "statut-actif",  badgeText: "Actif"         },
};

// ── Badges statut prescription ────────────────────────────────
export const PRESCRIPTION_BADGE_MAP = {
  delivree: { badgeClass: "statut-actif",  badgeText: "Delivree" },
  envoyee:  { badgeClass: "statut-avenir", badgeText: "Envoyee"  },
};

// ── Messages UI ───────────────────────────────────────────────
export const MESSAGES = {
  loading:            "Chargement des prescriptions medicales...",
  erreurChargement:   "Erreur lors du chargement",
  erreurValidation:   "Erreur lors de la validation.",
  reessayer:          "Reessayer",
  aucunResultat:      "Aucun resultat trouve",
  aucunePrescription: "Aucune prescription enregistree",
  titrePage:          "Liste des prescriptions VIH",
};

// ── En-têtes tableau ──────────────────────────────────────────
export const TABLE_HEADERS = [
  "Patient",
  "Traitement",
  "Quantite",
  "Statut prescription",
  "Suivi therapeutique",
  "Action",
];