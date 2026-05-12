export const HOSPITALISATION_OPTIONS = [
  { value: "",        label: "Hospitalisation"    },
  { value: "interne", label: "Interne" },
  { value: "externe", label: "Externe" },
];

export const RDV_FILTER_OPTIONS = [
  { value: "",          label: "Tous les RDV"   },
  { value: "this-week", label: "Cette semaine"  },
  { value: "next-week", label: "Sem. prochaine" },
  { value: "later",     label: "Plus tard"      },
  { value: "none",      label: "Sans RDV"       },
];

export const TABLE_COLUMNS = [
  "N° Dossier",
  "Nom du patient",
  "Date de naissance",
  "Dernier traitement",
  "Prochain rendez-vous",
  "Hospitalisation",
];