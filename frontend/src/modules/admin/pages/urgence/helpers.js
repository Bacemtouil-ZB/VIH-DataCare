// helpers.js — Contacts d'urgence

export const validerForm = (form) => {
  if (!form.nom?.trim()) return "Le nom est obligatoire.";
  return null;
};