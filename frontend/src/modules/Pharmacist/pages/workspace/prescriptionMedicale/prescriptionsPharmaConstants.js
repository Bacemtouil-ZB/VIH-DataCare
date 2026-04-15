export const toUiPrescriptionItem = (row) => ({
  prescriptionId:        row?.prescription_id        ?? row?.id           ?? null,
  suiviId:               row?.id                     ?? null,
  numeroDossier:         row?.numero_dossier          ?? row?.numeroDossier ?? null,
  dateNaissance:         row?.date_naissance         ?? null,
  patientName:           row?.patient_name            ?? "",
  patientSurname:        row?.patient_surname         ?? "-",
  nomTraitement:         row?.nom_traitement          ?? row?.composition_medicament ?? "Aucun",
  compositionMedicament: row?.composition_medicament  ?? "-",
  dateProchainePrise:    row?.date_prochaine_prise    ?? null,
  dateDebutTraitement:   row?.date_debut_traitement   ?? null,
  dateDelivrance:        row?.date_delivrance         ?? null,
  // Période effective retenue (jours) — pharmacien prioritaire sur médecin
  periode:               row?.periode                 ?? null,
  periodePrescrite:      row?.periode_prescrite       ?? null,
  periodeModifiee:       row?.periode_modifiee        ?? null,
  posologie:             row?.posologie               ?? "-",
  statutPrescription:    row?.statut_prescription     ?? row?.statut  ?? "envoyee",
  statutPatient:         row?.statut_patient          ?? "",
  ecartJours:            Number(row?.ecart_jours      ?? 0),

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
// Couvre tous les statuts calculés par le SQL :
//   "en attente" | "actif" | "en retard" | "perdue de vue" | "récupéré perdue de vue"
export const SUIVI_BADGE_MAP = {
  attente:   { badgeClass: "statut-leger",    badgeText: "En attente"              },
  actif:     { badgeClass: "statut-actif",    badgeText: "Actif"                   },
  retard:    { badgeClass: "statut-retard",   badgeText: "En retard"               },
  perdu:     { badgeClass: "statut-perdu",    badgeText: "Perdue de vue"           },
  recupere:  { badgeClass: "statut-recupere", badgeText: "Récupéré perdue de vue"  },
};

// ── Badges statut prescription ────────────────────────────────
export const PRESCRIPTION_BADGE_MAP = {
  delivree: { badgeClass: "statut-actif",   badgeText: "Delivrée"  },
  modifie:  { badgeClass: "statut-modifie", badgeText: "Modifiée"  },
  envoyee:  { badgeClass: "statut-avenir",  badgeText: "Envoyée"   },
};

// ── Messages UI ───────────────────────────────────────────────
export const MESSAGES = {
  loading:            "Chargement des prescriptions médicales...",
  erreurChargement:   "Erreur lors du chargement",
  erreurValidation:   "Erreur lors de la validation.",
  reessayer:          "Réessayer",
  aucunResultat:      "Aucun résultat trouvé",
  aucunePrescription: "Aucune prescription enregistrée",
  titrePage:          "Liste des prescriptions VIH",
};

// ── En-têtes tableau (sans colonne Quantité) ──────────────────
export const TABLE_HEADERS = [
  "Date naissance",
  "Patient",
  "Traitement",
  "Date prochaine prise",
  "Statut prescription",
  "S.thérapeutique",
  "RDV",
  "Action",
];