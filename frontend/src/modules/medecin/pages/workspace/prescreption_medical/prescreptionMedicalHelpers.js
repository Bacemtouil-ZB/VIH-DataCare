// ══════════════════════════════════════════════════════════════
// 🔧 Layer 2 — Utilitaires & Helpers (Fonctions Pures)
// ══════════════════════════════════════════════════════════════

import { STATUT_STYLE } from "./prescreptionMedicalConstants";
import { toInputDate } from "../../../../../shared/utils/dateHelpers";

// ── Styles ────────────────────────────────────────────────────
export function getStatutStyle(statut) {
  return STATUT_STYLE[statut] || { bg: "#f1f5f9", color: "#475569" };
}

// ── Filtrage & Recherche ──────────────────────────────────────
/**
 * Filtre les médicaments en stock selon un terme de recherche
 */
export function filterStockItems(items, searchTerm) {
  const q = searchTerm.toLowerCase();
  if (!q) return items;

  return items.filter(
    (m) =>
      (m.composition || "").toLowerCase().includes(q) ||
      (m.code || "").toLowerCase().includes(q) ||
      (m.nom || "").toLowerCase().includes(q)
  );
}

/**
 * Filtre les prescriptions selon un terme et une date
 */
export function filterPrescriptions(
  prescriptions,
  searchTerm,
  searchDate
) {
  const q = searchTerm.trim().toLowerCase();
  const dateQ = searchDate.trim();

  return prescriptions.filter((p) => {
    // les noms viennent depuis medicaments[]
    const nomsStr = (p.medicaments || [])
      .map((m) => m.medicament_nom_snapshot || "")
      .join(", ")
      .toLowerCase();

    const matchesText =
      !q ||
      nomsStr.includes(q) ||
      (p.statut || "").toLowerCase().includes(q);

    if (!matchesText) return false;
    if (!dateQ) return true;

    const raw = p.date || p.created_at || "";
    if (!raw) return false;
    return toInputDate(raw) === dateQ;
  });
}

// ── Formatage & Extraction ────────────────────────────────────
/**
 * Obtient les médicaments sélectionnés à partir de leurs IDs
 */
export function getSelectedMedicines(stockItems, selectedIds) {
  return stockItems.filter((m) => selectedIds.includes(String(m.id)));
}

/**
 * Formate la liste des médicaments en label lisible
 */
export function formatMedicinesLabel(medicines) {
  return medicines
    .map((m) => m.code || m.composition || "Medicament")
    .join(", ");
}

/**
 * Extrait les données affichables pour la modal de confirmation
 */
export function buildConfirmationData(
  formData,
  stockItems,
  patient,
  numero
) {
  const selectedMeds = getSelectedMedicines(
    stockItems,
    formData.medicament_ids
  );
  const traitementsLabel = formatMedicinesLabel(selectedMeds);

  return {
    patient: patient
      ? `${patient.surname || ""} ${patient.name || ""}`.trim()
      : "-",
    dossier: numero || "-",
    traitement: traitementsLabel || "-",
    posologie: formData.posologie || "-",
    periode: formData.periode ? `${formData.periode} jours` : "-",
    remarque: formData.remarque || "-",
    // Données techniques pour l'API
    _medicament_ids: formData.medicament_ids,
    _posologie: formData.posologie || null,
    _periode: Number(formData.periode),
    _remarque: formData.remarque || null,
  };
}

// ── Validation ────────────────────────────────────────────────
/**
 * Valide les données du formulaire
 */
export function validatePrescriptionForm(formData) {
  if (!formData.medicament_ids.length) {
    return {
      valid: false,
      error: "Veuillez selectionner au moins un medicament.",
    };
  }

  if (!formData.periode || Number(formData.periode) <= 0) {
    return {
      valid: false,
      error: "La duree prescrite doit etre superieure a 0.",
    };
  }

  return { valid: true };
}

// ── État du Stock ─────────────────────────────────────────────
/**
 * Vérifie si un médicament est en rupture de stock
 */
export function isOutOfStock(medicament) {
  const qty = medicament.quantite ?? medicament.quantity ?? 0;
  return qty === 0;
}

/**
 * Filtre les médicaments disponibles
 */
export function getAvailableMedicines(stockItems) {
  return stockItems.filter((m) => !isOutOfStock(m));
}
