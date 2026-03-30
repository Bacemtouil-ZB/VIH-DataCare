import { useEffect } from "react";
import { formatDateFr } from "../../../../shared/utils/logiqueTableHistory.js";
import { calculatePreviewDate } from "./../../pages/workspace/prescriptionMedicale/PrescriptionsPharmahelpers.js";


export default function ModalValidationPrescription({ item, saving, onClose, onConfirm }) {
  // Fermeture sur Escape (désactivée si saving)
  useEffect(() => {
    if (!item) return;
    const handler = (e) => { if (e.key === "Escape" && !saving) onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [item, saving, onClose]);

  if (!item) return null;

  const previewDate = calculatePreviewDate(item.quantitePrescrite);

  return (
    <div
      className="modal fade show"
      style={{ display: "block", background: "rgba(15,23,42,0.5)" }}
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
      onClick={!saving ? onClose : undefined}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        role="document"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content border-0 shadow-lg rounded-3">

          {/* ── Header ───────────────────────────────────────── */}
          <div className="modal-header border-bottom px-4 py-3"
               style={{ background: "#f0fdf4" }}>
            <div>
              <h5 className="modal-title fw-bold mb-0" style={{ color: "#166534" }}>
                Confirmer la validation
              </h5>
              <small className="text-muted">
                Cette action est irréversible
              </small>
            </div>
            <button
              type="button"
              className="btn-close"
              aria-label="Fermer"
              onClick={onClose}
              disabled={saving}
            />
          </div>

          {/* ── Body ─────────────────────────────────────────── */}
          <div className="modal-body px-4 py-4">

            {/* Récapitulatif patient */}
            <div className="p-3 rounded-2 mb-3"
                 style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
              <div className="d-flex justify-content-between mb-1">
                <span className="text-muted" style={{ fontSize: "0.82rem" }}>Patient</span>
                <span className="fw-semibold" style={{ fontSize: "0.9rem" }}>
                  {item.patientSurname} {item.patientName}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span className="text-muted" style={{ fontSize: "0.82rem" }}>Dossier</span>
                <span className="fw-semibold" style={{ fontSize: "0.9rem" }}>
                  {item.numeroDossier}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span className="text-muted" style={{ fontSize: "0.82rem" }}>Traitement</span>
                <span className="fw-semibold" style={{ fontSize: "0.9rem" }}>
                  {item.nomTraitement}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span className="text-muted" style={{ fontSize: "0.82rem" }}>Quantité</span>
                <span className="fw-semibold" style={{ fontSize: "0.9rem" }}>
                  {item.quantitePrescrite} mois
                </span>
              </div>
            </div>

            {/* Prochaine prise estimée */}
            <div className="p-3 rounded-2"
                 style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
              <p className="mb-1 text-muted" style={{ fontSize: "0.78rem" }}>
                Prochaine prise estimée après validation
              </p>
              <p className="mb-0 fw-bold" style={{ color: "#166534", fontSize: "1rem" }}>
                {formatDateFr(previewDate, "-")}
              </p>
            </div>
          </div>

          {/* ── Footer ───────────────────────────────────────── */}
          <div className="modal-footer border-top px-4 py-3"
               style={{ background: "#f8fafc" }}>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm px-4"
              onClick={onClose}
              disabled={saving}
            >
              Annuler
            </button>
            <button
              type="button"
              className="btn btn-success btn-sm px-4 fw-bold"
              onClick={onConfirm}
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"
                        role="status" aria-hidden="true" />
                  Validation...
                </>
              ) : (
                "Valider la prescription"
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}