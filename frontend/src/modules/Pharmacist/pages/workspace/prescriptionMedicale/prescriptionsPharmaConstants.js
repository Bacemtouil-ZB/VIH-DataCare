export const toUiPrescriptionItem = (row) => ({
  prescriptionId:       row?.prescription_id      ?? null,
  numeroDossier:        row?.numero_dossier        ?? null,
  dateNaissance:        row?.date_naissance        ?? null,
  patientName:          row?.patient_name          ?? "",
  patientSurname:       row?.patient_surname       ?? "-",
  nomTraitement:        row?.nom_traitement        ?? "Aucun",
  dateProchainePrise:   row?.date_prochaine_prise  ?? null,
  dateDebutTraitement:  row?.date_debut_traitement ?? null,
  dateDelivrance:       row?.date_delivrance       ?? null,
  periode:              row?.periode               ?? null,
  periodePrescrite:     row?.periode_prescrite     ?? null,
  periodeModifiee:      row?.periode_modifiee      ?? null,
  posologie:            row?.posologie             ?? "-",
  statutPrescription:   row?.statut_prescription   ?? "envoyee",
  statutPatient:        row?.statut_patient        ?? "standard", 
  suiviStatutPatient:   row?.suivi_statut_patient  ?? null,
  dateEcart:            Number(row?.date_ecart     ?? 0),
  alerteContradiction:  row?.alerte_contradiction  ?? false,
  rdv: row?.rdv_date ? {
    date:   row.rdv_date,
    heure:  row?.rdv_heure  ?? null,
    type:   row?.rdv_type   ?? null,
    statut: row?.rdv_statut ?? null,
  } : null,
});

export const PRESCRIPTION_BADGE_MAP = {
  delivree: { badgeClass: "statut-actif",   badgeText: "Délivrée" },
  modifie:  { badgeClass: "statut-modifie", badgeText: "Modifiée" },
  envoyee:  { badgeClass: "statut-avenir",  badgeText: "Envoyée"  },
};

export const STATUT_PATIENT_BADGE_MAP = {
  //  fallback affichage
  en_attente:       { badgeClass: "statut-attente",   badgeText: "En attente"   },
  //  statuts suivi_therapeutique
  actif:            { badgeClass: "statut-actif",     badgeText: "Actif"        },
  en_retard:        { badgeClass: "statut-retard",    badgeText: "En retard"    },
  perdu_de_vue:     { badgeClass: "statut-perdu",     badgeText: "Perdu de vue" },
  recupere:         { badgeClass: "statut-recupere",  badgeText: "Récupéré"     },
  //  statuts patients.status
  standard:         { badgeClass: "statut-standard",  badgeText: "Standard"     },
  standard_inactif: { badgeClass: "statut-inactif",   badgeText: "Inactif"      },
  migrant:          { badgeClass: "statut-migrant",   badgeText: "Migrant"      },
  migrant_inactif:  { badgeClass: "statut-inactif",   badgeText: "Inactif"      },
  decede:           { badgeClass: "statut-decede",    badgeText: "Décédé"       },
  decede_sida:      { badgeClass: "statut-decede",    badgeText: "Décédé SIDA"  },
  transfere:        { badgeClass: "statut-transfere", badgeText: "Transféré"    },
};

export const BADGE_COLORS = {
  //  fallback affichage
  en_attente:       { bg: "#f1f5f9", color: "#475569" },
  //  statuts suivi_therapeutique
  actif:            { bg: "#dbeafe", color: "#1e40af" },
  en_retard:        { bg: "#fff7ed", color: "#c2410c" },
  perdu_de_vue:     { bg: "#fee2e2", color: "#991b1b" },
  recupere:         { bg: "#f0fdf4", color: "#15803d" },
  //  statuts prescription
  delivree:         { bg: "#dcfce7", color: "#166534" },
  modifie:          { bg: "#ffedd5", color: "#9a3412" },
  envoyee:          { bg: "#fef9c3", color: "#854d0e" },
};

export const MESSAGES = {
  loading:            "Chargement des prescriptions médicales...",
  erreurChargement:   "Erreur lors du chargement",
  erreurValidation:   "Erreur lors de la validation",
  reessayer:          "Réessayer",
  aucunResultat:      "Aucun résultat trouvé",
  aucunePrescription: "Aucune prescription enregistrée",
  titrePage:          "Prescriptions médicales",
};

export const TABLE_HEADERS = [
  "Date naissance",
  "Patient",
  "Traitement",
  "Prochaine prise",
  "Statut",
  "RDV",
  "Action",
];