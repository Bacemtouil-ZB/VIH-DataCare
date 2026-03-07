export const PROBLEME_OPTIONS = [
  { value: "precarite_logement", label: "Précarité logement" },
  {
    value: "instabilite_professionnelle",
    label: "Instabilité professionnelle",
  },
  { value: "difficultes_financieres", label: "Difficultés financières" },
  { value: "conflits_familiaux", label: "Conflits familiaux" },
  { value: "isolement_social", label: "Isolement social" },
  { value: "violence_domestique", label: "Violence domestique" },
  { value: "problemes_transport", label: "Problèmes transport" },
  { value: "difficulte_acces_soins", label: "Difficulté accès soins" },
];

export const NIVEAU_ETUDE_OPTIONS = [
  { value: "sans_instruction", label: "Sans instruction" },
  { value: "primaire", label: "Primaire" },
  { value: "secondaire", label: "Secondaire" },
  { value: "universite", label: "Université" },
];

export const ACTIVITE_OPTIONS = [
  { value: "etudiant", label: "Étudiant(e)" },
  { value: "salarie", label: "Salarié(e)" },
  { value: "sans_emploi", label: "Sans emploi" },
  { value: "retraite", label: "Retraité(e)" },
  { value: "personne_au_foyer", label: "Personne au foyer" },
];

export const SITUATION_SOCIAL_OPTIONS = [
  { value: "celibataire", label: "Célibataire" },
  { value: "marie", label: "Marié(e)" },
  { value: "divorce", label: "Divorcé(e)" },
  { value: "veuf", label: "Veuf(ve)" },
  { value: "autre", label: "Autre" },
];

export const INITIAL_SOCIAL_FORM_DATA = {
  situation_social: "",
  niveau_etude: "",
  nombre_enfants: 0,
  type_ressource: "",
  activite_professionnelle: "",
  probleme: [],
  remarque: "",
};
