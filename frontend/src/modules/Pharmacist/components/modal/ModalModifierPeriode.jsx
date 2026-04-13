import { useEffect, useState } from "react";

export default function ModalModifierPeriode({ item, saving, onClose, onConfirm }) {
  const [periodeModifiee, setPeriodeModifiee] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!item) return;
    const handler = (e) => {
      if (e.key === "Escape" && !saving) onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [item, saving, onClose]);

  if (!item) return null;

  const periodePrescrite = Number(item.periode ?? 0);
  const maxPeriodeAutorisee = periodePrescrite - 1;
  const canModifyPeriode = Number.isInteger(periodePrescrite) && periodePrescrite > 1;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const pm = Number(periodeModifiee);

    if (!periodeModifiee || Number.isNaN(pm) || pm <= 0) {
      setError("La période doit être supérieure à 0");
      return;
    }

    if (!Number.isInteger(pm)) {
      setError("La période doit être un nombre entier");
      return;
    }

    if (!canModifyPeriode) {
      setError("La période prescrite ne permet pas de proposer une durée plus courte");
      return;
    }

    if (pm >= periodePrescrite) {
      setError(`La période doit être strictement inférieure à ${periodePrescrite} jours`);
      return;
    }

    onConfirm(pm);
  };

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
          <div
            className="modal-header border-bottom px-4 py-3"
            style={{ background: "#fffbeb" }}
          >
            <div>
              <h5 className="modal-title fw-bold mb-0" style={{ color: "#92400e" }}>
                <i className="bi bi-pencil-square me-2" />
                Modifier la période prescrite
              </h5>
            </div>
            <button
              type="button"
              className="btn-close"
              aria-label="Fermer"
              onClick={onClose}
              disabled={saving}
            />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body px-4 py-4">
              <div
                className="p-3 rounded-2 mb-3"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
              >
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted" style={{ fontSize: "0.82rem" }}>Patient</span>
                  <span className="fw-semibold" style={{ fontSize: "0.9rem" }}>
                    {item.patientSurname} {item.patientName}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted" style={{ fontSize: "0.82rem" }}>Traitement</span>
                  <span className="fw-semibold" style={{ fontSize: "0.9rem" }}>
                    {item.nomTraitement}
                  </span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted" style={{ fontSize: "0.82rem" }}>Période prescrite</span>
                  <span
                    className="fw-bold"
                    style={{ fontSize: "0.9rem", color: "#92400e" }}
                  >
                    {periodePrescrite} jours
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <label
                  className="form-label fw-semibold"
                  style={{ fontSize: "0.85rem" }}
                >
                  Nouvelle période (jours) <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  type="number"
                  className={`form-control ${error ? "is-invalid" : ""}`}
                  min="1"
                  max={canModifyPeriode ? maxPeriodeAutorisee : undefined}
                  value={periodeModifiee}
                  onChange={(e) => {
                    setPeriodeModifiee(e.target.value);
                    setError("");
                  }}
                  placeholder={
                    canModifyPeriode
                      ? `Maximum : ${maxPeriodeAutorisee} jours`
                      : "Aucune période plus courte possible"
                  }
                  disabled={saving || !canModifyPeriode}
                  required
                  autoFocus
                />
                {error && (
                  <div className="invalid-feedback d-block" style={{ fontSize: "0.8rem" }}>
                    {error}
                  </div>
                )}
              </div>

              <div
                className="p-3 rounded-2"
                style={{ background: "#fffbeb", border: "1px solid #fde68a" }}
              >
                <p className="mb-0" style={{ fontSize: "0.8rem", color: "#78350f" }}>
                  <i className="bi bi-exclamation-triangle me-1" />
                  <strong>Attention :</strong> La période modifiée doit être strictement
                  inférieure à la période prescrite par le médecin ({periodePrescrite} jours).
                </p>
              </div>
            </div>

            <div
              className="modal-footer border-top px-4 py-3"
              style={{ background: "#f8fafc" }}
            >
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm px-4"
                onClick={onClose}
                disabled={saving}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn btn-warning btn-sm px-4 fw-bold"
                disabled={saving || !canModifyPeriode}
                style={{ color: "#78350f" }}
              >
                {saving ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-lg me-1" />
                    Valider avec modification
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
