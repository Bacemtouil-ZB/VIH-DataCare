export const INITIAL_FORM = {
  medicament_id: "",
  traitement: "",
  posologie: "",
  date: new Date().toISOString().slice(0, 10),
  quantite: "",
  dosage: "",
  remarque: "",
};

export const STATUT_LABELS = {
  En_attente: "En attente",
  En_cours: "En cours",
  Effectue: "Effectué",
  Annule: "Annulé",
};

export const STATUT_STYLE = {
  En_attente: { bg: "#fef9c3", color: "#854d0e" },
  En_cours: { bg: "#e0f2fe", color: "#075985" },
  Effectue: { bg: "#dcfce7", color: "#166534" },
  Annule: { bg: "#fee2e2", color: "#991b1b" },
};
