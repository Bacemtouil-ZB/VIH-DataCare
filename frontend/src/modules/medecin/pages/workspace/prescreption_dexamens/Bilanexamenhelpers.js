import { ALL_BILAN_KEYS } from "./Bilanexamenconstants";

// ── Nombre de bilans cochés dans un formulaire ────────────────
export const countChecked = (form) =>
  ALL_BILAN_KEYS.filter((k) => form[k]).length;

// ── Résumé textuel d'un bilan pour la colonne tableau ────────
export const formatBilanSummary = (bilan) => {
  const checked = ALL_BILAN_KEYS.filter((k) => bilan[k]);
  if (checked.length === 0)                    return "Aucun bilan";
  if (checked.length === ALL_BILAN_KEYS.length) return "Bilan initial complet";
  return `${checked.length} bilan(s) sélectionné(s)`;
};

// ── Applique la logique du toggle master / individuel ─────────
// Retourne le nouvel état du formulaire après un toggle.
// Pur : reçoit l'état courant, retourne le nouvel état.
export const applyToggle = (formData, key) => {
  if (key === "bilan_initial_complet") {
    // Master : coche ou décoche tous les bilans individuels
    const newVal = !formData.bilan_initial_complet;
    const allChecked = Object.fromEntries(ALL_BILAN_KEYS.map((k) => [k, newVal]));
    return { ...formData, bilan_initial_complet: newVal, ...allChecked };
  }

  // Bilan individuel : toggle + recalcul du master
  const updated = { ...formData, [key]: !formData[key] };
  updated.bilan_initial_complet = ALL_BILAN_KEYS.every((k) => updated[k]);
  return updated;
};

// ── Extrait les champs bilan d'un item (pour openEdit) ────────
export const extractBilanFields = (item) =>
  Object.fromEntries([
    ...ALL_BILAN_KEYS.map((k) => [k, item[k] ?? false]),
    ["bilan_initial_complet", item.bilan_initial_complet ?? false],
    ["observations",          item.observations          ?? ""],
  ]);