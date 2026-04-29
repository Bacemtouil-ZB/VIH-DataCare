import { Modal, Button } from "react-bootstrap";

export default function ConfirmPrescriptionModal({
  show,
  data,
  saving,
  onConfirm,
  onClose,
}) {
  if (!data) return null;

  const traitements = data.traitement ? data.traitement.split(", ") : [];

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      size="md"
      backdrop={saving ? "static" : true}
      keyboard={!saving}
      dialogClassName="confirm-prescription-dialog"
    >
      {/* ── Header ───────────────────────────────────────────── */}
      <Modal.Header
        closeButton={!saving}
        style={{
          background:   "#f0faf4",
          borderBottom: "1px solid #c3e6cb",
          padding:      "1.1rem 1.5rem 0.85rem",
        }}
      >
        <Modal.Title
          style={{ fontSize: "1.15rem", fontWeight: 700, color: "#1a5c35" }}
        >
          Confirmer la prescription
        </Modal.Title>
      </Modal.Header>

      {/* ── Body ─────────────────────────────────────────────── */}
      <Modal.Body style={{ padding: "1.5rem" }}>

        {/* Carte info grise */}
        <div
          style={{
            background:   "#f8f9fa",
            border:       "1px solid #e2e6ea",
            borderRadius: "0.6rem",
            padding:      "1.1rem 1.4rem",
            marginBottom: "1.1rem",
          }}
        >
          {/* Lignes fixes */}
          {[
            { label: "Patient",  value: data.patient  || "—" },
            { label: "Dossier",  value: data.dossier  || "—" },
            { label: "Période",  value: data.periode  || "—" },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="d-flex justify-content-between align-items-center"
              style={{
                padding:      "0.38rem 0",
                borderBottom: "1px solid #eaecef",
                fontSize:     "0.92rem",
              }}
            >
              <span style={{ color: "#6c757d" }}>{label}</span>
              <span style={{ fontWeight: 700, color: "#1a1a2e" }}>{value}</span>
            </div>
          ))}

          {/* Traitement — pills (1 par médicament) */}
          <div
            style={{
              padding:      "0.5rem 0",
              borderBottom: "1px solid #eaecef",
              fontSize:     "0.92rem",
            }}
          >
            <div className="d-flex justify-content-between align-items-start">
              <span style={{ color: "#6c757d", flexShrink: 0, marginRight: "1rem" }}>
                Traitement
              </span>
              <div
                style={{
                  display:        "flex",
                  flexWrap:       "wrap",
                  gap:            "0.35rem",
                  justifyContent: "flex-end",
                }}
              >
                {traitements.length > 0 ? traitements.map((t, i) => (
                  <span
                    key={i}
                    style={{
                      background:   "#e8f5e9",
                      color:        "#1a5c35",
                      border:       "1px solid #a7d7b0",
                      borderRadius: "999px",
                      padding:      "2px 10px",
                      fontWeight:   600,
                      fontSize:     "0.82rem",
                      whiteSpace:   "nowrap",
                    }}
                  >
                    {t}
                  </span>
                )) : (
                  <span style={{ fontWeight: 700, color: "#1a1a2e" }}>—</span>
                )}
              </div>
            </div>
          </div>

          {/* Posologie — optionnelle */}
          {data.posologie && data.posologie !== "-" && (
            <div
              className="d-flex justify-content-between align-items-center"
              style={{ padding: "0.38rem 0", fontSize: "0.92rem" }}
            >
              <span style={{ color: "#6c757d" }}>Posologie</span>
              <span style={{ color: "#495057" }}>{data.posologie}</span>
            </div>
          )}
        </div>

        {/* Remarque — fond vert très clair */}
        {data.remarque && data.remarque !== "-" && (
          <div
            style={{
              background:   "#f0faf4",
              border:       "1px solid #c3e6cb",
              borderRadius: "0.6rem",
              padding:      "1rem 1.4rem",
            }}
          >
            <p className="mb-1" style={{ fontSize: "0.82rem", color: "#4a7c5e" }}>
              Remarque :
            </p>
            <p
              className="mb-0"
              style={{ fontSize: "1rem", fontWeight: 600, color: "#1a5c35" }}
            >
              {data.remarque}
            </p>
          </div>
        )}
      </Modal.Body>

      {/* ── Footer ───────────────────────────────────────────── */}
      <Modal.Footer
        style={{
          borderTop: "1px solid #e9ecef",
          padding:   "0.85rem 1.5rem",
          gap:       "0.6rem",
        }}
      >
        <Button
          variant="outline-secondary"
          onClick={onClose}
          disabled={saving}
          style={{ minWidth: "110px" }}
        >
          Annuler
        </Button>

        <Button
          variant="success"
          onClick={onConfirm}
          disabled={saving}
          style={{ minWidth: "200px", fontWeight: 600 }}
        >
          {saving ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              />
              Validation...
            </>
          ) : (
            "Valider la prescription"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}