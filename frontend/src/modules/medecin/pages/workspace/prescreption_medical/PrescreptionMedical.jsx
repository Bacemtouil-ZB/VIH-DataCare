// ══════════════════════════════════════════════════════════════
// 🏗️ Layer 4 — Orchestration (Assemblage des layers)
// ══════════════════════════════════════════════════════════════
// Rôle  : Assembler les composants UI et connecter la logique métier
// Contient : usePrescreptionMedicalLogic + PrescreptionMedicalUI
// Règle    : Zéro useState direct, zéro appel API

import { useParams } from "react-router-dom";
import { usePrescreptionMedicalLogic } from "./usePrescreptionMedicalLogic";
import PrescreptionMedicalUI from "./PrescreptionMedicalUI";
import { useAuth } from "../../../../../shared/hooks/useAuth";
import "./PrescreptionMedical.css";

export default function PrescriptionMedical() {
  // ── Récupération des params et de l'utilisateur ────────────
  const { numero } = useParams();
  const { user } = useAuth();

  // ── Logique métier ────────────────────────────────────────
  const logic = usePrescreptionMedicalLogic(numero, user);

  // ── Rendu ─────────────────────────────────────────────────
  // Tous les props viennent de `logic` (hook)
  return (
    <PrescreptionMedicalUI
      // Données
      filtered={logic.filtered}
      loading={logic.loading}
      stockItems={logic.stockItems}
      formData={logic.formData}
      detailItem={logic.detailItem}
      confirmationModal={logic.confirmationModal}
      medecinDisplayName={logic.medecinDisplayName}
      // État d'affichage
      showHistory={logic.showHistory}
      showForm={logic.showForm}
      saving={logic.saving}
      isModifying={logic.isModifying}
      // Handlers
      setShowHistory={logic.setShowHistory}
      handleShowDetails={logic.handleShowDetails}
      setDetailItem={logic.setDetailItem}
      openCreate={logic.openCreate}
      closeForm={logic.closeForm}
      handleSubmit={logic.handleSubmit}
      confirmPrescription={logic.confirmPrescription}
      closeConfirmationModal={logic.closeConfirmationModal}
      // Champs de formulaire
      field={logic.field}
      setMedicamentIds={logic.setMedicamentIds}
      setSearchTerm={logic.setSearchTerm}
      setSearchDate={logic.setSearchDate}
      // Props dynamiques
      searchTerm={logic.searchTerm}
      searchDate={logic.searchDate}
    />
  );
}