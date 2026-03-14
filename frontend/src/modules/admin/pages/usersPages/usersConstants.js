// ── usersConstants.js ────────────────────────────────────────────────────────
// Constantes de la page UsersPage

export const ROLE_OPTIONS = [
  { value: "admin",       label: "Admin" },
  { value: "medecin",     label: "Médecin" },
  { value: "pharmacien",  label: "Pharmacien" },
  { value: "analyste",    label: "Analyste" },
];

export const STATUS_OPTIONS = [
  { value: "all",      label: "Tous les statuts" },
  { value: "active",   label: "Activés" },
  { value: "inactive", label: "Inactifs" },
];

export const TABLE_HEADERS = ["#", "Nom", "Prénom", "Email", "Rôle", "Statut", "Actions"];

// Couleur de badge selon le rôle
export function roleBadgeColor(role) {
  const r = (role || "").toLowerCase();
  if (r === "medecin")    return { bg: "#dbd1b6", color: "#fff" };
  if (r === "pharmacien") return { bg: "#c2a899", color: "#ffffff" };
  return { bg: "#6c757d", color: "#fff" };
}