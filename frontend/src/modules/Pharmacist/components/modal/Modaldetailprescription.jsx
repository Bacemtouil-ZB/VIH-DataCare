import { useEffect } from "react";
import { formatDateFr } from "../../../../shared/utils/logiqueTableHistory";

/**
 * ModalDetailPrescription
 * Modale Bootstrap indépendante — affiche les détails d'une prescription
 * Props :
 *   item    : objet UI (toUiPrescriptionItem)
 *   onClose : () => void
 */
export default function ModalDetailPrescription({ item, onClose }) {
  // Fermeture sur Escape
  useEffect(() => {
    if (!item) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [item, onClose]);

  if (!item) return null;

  return (
    <>
      {/* Backdrop Bootstrap */}
      <div
        className="modal fade show"
        style={{ display: "block", background: "rgba(15,23,42,0.5)" }}
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        onClick={onClose}
      >
        <div
          className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
          role="document"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content border-0 shadow-lg rounded-3">

            {/* ── Header ─────────────────────────────────────── */}
            <div className="modal-header border-bottom px-4 py-3"
                 style={{ background: "#f8fafc" }}>
              <div>
                <h5 className="modal-title fw-bold mb-0" style={{ color: "#0f172a" }}>
                  Détails de la prescription
                </h5>
                <small className="text-muted">
                  Dossier {item.numeroDossier} —{" "}
                  {item.patientSurname} {item.patientName}
                </small>
              </div>
              <button
                type="button"
                className="btn-close"
                aria-label="Fermer"
                onClick={onClose}
              />
            </div>

            {/* ── Body ───────────────────────────────────────── */}
            <div className="modal-body px-4 py-3">

              {/* Section Patient */}
              <p className="text-uppercase fw-bold mb-2"
                 style={{ fontSize: "0.7rem", color: "#64748b", letterSpacing: "0.08em" }}>
                Informations patient
              </p>
              <div className="row g-3 mb-4">
                <InfoField label="Numéro dossier"  value={item.numeroDossier} />
                <InfoField label="Nom"             value={item.patientSurname} />
                <InfoField label="Prénom"          value={item.patientName} />
              </div>

              <hr className="my-3" />

              {/* Section Prescription */}
              <p className="text-uppercase fw-bold mb-2"
                 style={{ fontSize: "0.7rem", color: "#64748b", letterSpacing: "0.08em" }}>
                Prescription médicale
              </p>
              <div className="row g-3 mb-4">
                <InfoField label="Traitement"         value={item.nomTraitement} />
                <InfoField label="Composition"        value={item.compositionMedicament} />
                <InfoField label="Posologie"          value={item.posologie} />
                <InfoField label="Dosage"             value={item.dosage} />
                <InfoField label="Quantité prescrite" value={item.quantitePrescrite} />
                <InfoField label="Statut prescription"
                           value={item.statutPrescription}
                           badge
                           badgeClass={item.statutPrescription === "delivree"
                             ? "bg-success-subtle text-success"
                             : "bg-warning-subtle text-warning"} />
              </div>

              <hr className="my-3" />

              {/* Section Suivi */}
              <p className="text-uppercase fw-bold mb-2"
                 style={{ fontSize: "0.7rem", color: "#64748b", letterSpacing: "0.08em" }}>
                Suivi thérapeutique
              </p>
              <div className="row g-3">
                <InfoField label="Date délivrance"
                           value={formatDateFr(item.dateDelivrance, "-")} />
                <InfoField label="Prochaine prise"
                           value={formatDateFr(item.dateProchainePrise, "-")} />
                <InfoField label="Statut patient"   value={item.statutPatient || "-"} />
                <InfoField label="Écart (jours)"
                           value={item.ecartJours > 0 ? `+${item.ecartJours} j` : "-"}
                           highlight={item.ecartJours > 0} />
              </div>
            </div>

            {/* ── Footer ─────────────────────────────────────── */}
            <div className="modal-footer border-top px-4 py-3"
                 style={{ background: "#f8fafc" }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm px-4"
                onClick={onClose}
              >
                Fermer
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

// ── Sous-composant champ ──────────────────────────────────────
function InfoField({ label, value, badge = false, badgeClass = "", highlight = false }) {
  return (
    <div className="col-md-4 col-sm-6">
      <p className="mb-1 text-muted" style={{ fontSize: "0.75rem" }}>{label}</p>
      {badge ? (
        <span className={`badge rounded-pill px-3 py-2 ${badgeClass}`}
              style={{ fontSize: "0.8rem" }}>
          {value}
        </span>
      ) : (
        <p className={`mb-0 fw-semibold ${highlight ? "text-danger" : ""}`}
           style={{ fontSize: "0.9rem" }}>
          {value || "-"}
        </p>
      )}
    </div>
  );
}