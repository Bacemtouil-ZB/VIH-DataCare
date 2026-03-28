import { usePrescriptionsLogic } from "./usePrescriptionsLogic";
import PrescriptionsUI           from "./PrescriptionsUI";
import { MESSAGES }              from "./prescriptionsConstants";
import "./PatientsPrescriptions.css";

export default function PatientsPrescriptions() {
  const logic = usePrescriptionsLogic();

  // ── Écran de chargement ──────────────────────────────────
  if (logic.loading) {
    return (
      <div className="prescriptions-page-container">
        <div className="loading-state">
          <div className="spinner" />
          <p>{MESSAGES.loading}</p>
        </div>
      </div>
    );
  }

  // ── Écran d'erreur ───────────────────────────────────────
  if (logic.error) {
    return (
      <div className="prescriptions-page-container">
        <div className="error-state">
          <p className="error-message">{logic.error}</p>
          <button type="button" className="btn-retry" onClick={logic.loadPatients}>
            {MESSAGES.reessayer}
          </button>
        </div>
      </div>
    );
  }

  // ── Rendu principal : délègue tout à PrescriptionsUI ────
  return (
    <PrescriptionsUI
      // données
      search={logic.search}
      showHistory={logic.showHistory}
      filtered={logic.filtered}
      detailItem={logic.detailItem}
      validationItem={logic.validationItem}
      savingValidation={logic.savingValidation}
      // setters
      setSearch={logic.setSearch}
      setShowHistory={logic.setShowHistory}
      // actions
      openDetail={logic.openDetail}
      closeDetail={logic.closeDetail}
      openValidation={logic.openValidation}
      closeValidation={logic.closeValidation}
      handleValidate={logic.handleValidate}
    />
  );
}