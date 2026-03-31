// ── Mapper API → UI ───────────────────────────────────────────
export const toUiPrescriptionItem = (row) => ({
  prescriptionId:        row?.prescription_id        ?? row?.id           ?? null,
  suiviId:               row?.id                     ?? null,
  dateNaissance:         row?.date_naissance         ?? null,
  patientName:           row?.patient_name            ?? "",
  patientSurname:        row?.patient_surname         ?? "-",
  nomTraitement:         row?.nom_traitement          ?? row?.composition_medicament ?? "Aucun",
  compositionMedicament: row?.composition_medicament  ?? "-",
  dateProchainePrise:    row?.date_prochaine_prise    ?? null,
  dateDebutTraitement:   row?.date_debut_traitement   ?? null,
  dateDelivrance:        row?.date_delivrance         ?? null,
  quantitePrescrite:     row?.quantite_prescrite      ?? row?.quantite ?? "-",
  posologie:             row?.posologie               ?? "-",
  dosage:                row?.dosage                  ?? "-",
  statutPrescription:    row?.statut_prescription     ?? row?.statut  ?? "envoyee",
  statutPatient:         row?.statut_patient          ?? "",
  ecartJours:            Number(row?.ecart_jours      ?? 0),

  // ── NOUVEAU ──────────────────────────────────────────────
  rdv: row?.rdv_date
    ? {
        date:   row.rdv_date,
        heure:  row?.rdv_heure  ?? null,
        type:   row?.rdv_type   ?? null,
        statut: row?.rdv_statut ?? null,
      }
    : null,
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
  "Date naissance",
  "Patient",
  "Traitement",
  "Quantite",
  "Statut prescription",
  "S.therapeutique",
  " RDV",        // ← NOUVEAU
  "Action",
];  