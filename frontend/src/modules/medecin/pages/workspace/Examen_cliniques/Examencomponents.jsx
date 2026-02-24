
// ── STYLES ────────────────────────────────────────────────────────────────────
export const PAGE_BG   = { background: "#f5f6fa", padding: 24, minHeight: "100%" };
export const LABEL_CLS = "text-uppercase fw-semibold text-secondary d-block mb-1";

// ── 1. Barre titre + bouton Ajouter / Annuler ─────────────────────────────────
export function PageHeader({ title, icon, showForm, onOpen, onCancel }) {
  return (
    <div className="d-flex align-items-center justify-content-between mb-4">
      <h6 className="mb-0 fw-bold text-dark" style={{ fontSize: "1rem" }}>
        <i className={`bi ${icon} me-2`} style={{ color: "#2e7d52" }}></i>
        {title}
      </h6>
      {!showForm ? (
        <button className="btn btn-sm fw-semibold text-white d-flex align-items-center gap-2"
          style={{ background: "#2e7d52", borderRadius: 9, boxShadow: "0 2px 8px rgba(46,125,82,0.25)" }}
          onClick={onOpen}>
          <i className="bi bi-plus-lg"></i>Ajouter
        </button>
      ) : (
        <button className="btn btn-sm fw-semibold text-secondary d-flex align-items-center gap-2"
          style={{ border: "1px solid #e2e8f0", borderRadius: 9 }}
          onClick={onCancel}>
          <i className="bi bi-x-lg"></i>Annuler
        </button>
      )}
    </div>
  );
}

// ── 2. Accordéon historique ───────────────────────────────────────────────────
export function HistoriqueAccordeon({ title, count, open, onToggle, children }) {
  return (
    <div className="mb-4 rounded overflow-hidden border">
      <div className="d-flex justify-content-between align-items-center px-4 py-3"
        style={{ background: "#1e40af", color: "white", cursor: "pointer", userSelect: "none" }}
        onClick={onToggle}>
        <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>
          <i className="bi bi-clock-history me-2"></i>
          {title}
          <span className="ms-2 badge bg-white bg-opacity-25 rounded-pill fw-normal"
            style={{ fontSize: "0.8rem" }}>
            {count}
          </span>
        </span>
        <i className={`bi bi-chevron-${open ? "up" : "down"}`}></i>
      </div>
      {open && <div className="bg-white p-3">{children}</div>}
    </div>
  );
}

// ── 3. État vide dans l'historique ────────────────────────────────────────────
export function EmptyState({ message }) {
  return (
    <div className="text-center py-4 text-secondary">
      <i className="bi bi-inbox fs-4 d-block mb-2"></i>
      <small>{message}</small>
    </div>
  );
}

// ── 4. En-tête + container du formulaire (vert ou orange si modification) ─────
export function FormulaireWrapper({ isModifying, labelCreate, labelModify, children }) {
  const color = isModifying ? "#f59e0b" : "#2e7d52";
  return (
    <div className="rounded overflow-hidden" style={{ border: `2px solid ${color}`, background: "white" }}>
      <div className="px-4 py-3 d-flex align-items-center gap-2 text-white"
        style={{ background: color }}>
        <i className={`bi ${isModifying ? "bi-pencil-square" : "bi-plus-circle"}`}></i>
        <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>
          {isModifying ? labelModify : labelCreate}
        </span>
      </div>
      <div className="px-4 py-4">{children}</div>
    </div>
  );
}

// ── 5. Section "Autres signes" — select appareil + input Enter + table ─────────
export function AutresSignesSection({ title = "Autres signes", appareils, autresSignes, appareilSelectionne, descriptionSigne, onAppareilChange, onDescriptionChange, onAjouter, onSupprimer }) {
  return (
    <div>
      <p className="text-uppercase fw-bold text-secondary mb-3" style={{ fontSize: "0.78rem", letterSpacing: "0.5px" }}>
        {title}
      </p>

      <div className="d-flex gap-3 flex-wrap align-items-end mb-3">
        <div style={{ flex: "1 1 180px" }}>
          <label className={LABEL_CLS} style={{ fontSize: "0.78rem" }}>Appareil</label>
          <select className="form-select form-select-sm" value={appareilSelectionne} onChange={(e) => onAppareilChange(e.target.value)}>
            <option value="">Sélectionnez…</option>
            {appareils.map((app) => (
              <option key={app.id} value={app.id}>{app.libelle}</option>
            ))}
          </select>
        </div>

        <div style={{ flex: "3 1 260px" }}>
          <label className={LABEL_CLS} style={{ fontSize: "0.78rem" }}>
            Description{" "}
            <span className="text-secondary fw-normal text-capitalize" style={{ letterSpacing: 0 }}>
              — Entrée pour ajouter
            </span>
          </label>
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Décrivez les détails et appuyez sur Entrée…"
            value={descriptionSigne}
            onChange={(e) => onDescriptionChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onAjouter()}
          />
        </div>
      </div>

      {autresSignes.length > 0 && (
        <table className="table table-sm table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th style={{ fontSize: "0.78rem" }}>Appareil</th>
              <th style={{ fontSize: "0.78rem" }}>Description</th>
              <th style={{ fontSize: "0.78rem", width: 60 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {autresSignes.map((s) => (
              <tr key={s.id}>
                <td><span className="badge" style={{ background: "#dbeafe", color: "#1d4ed8" }}>{s.appareil}</span></td>
                <td style={{ fontSize: "0.875rem" }}>{s.description}</td>
                <td>
                  <button className="btn btn-sm btn-outline-danger py-0 px-2" onClick={() => onSupprimer(s.id)}>
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ── 6. Bouton Enregistrer pleine largeur ──────────────────────────────────────
export function BoutonEnregistrer({ isModifying, loading, onClick }) {
  const color = isModifying ? "#f59e0b" : "#2e7d52";
  return (
    <div className="pt-3 mt-3 border-top">
      <button className="btn w-100 fw-bold text-white" disabled={loading}
        style={{ background: color, borderRadius: 10, fontSize: "0.95rem", opacity: loading ? 0.75 : 1 }}
        onClick={onClick}>
        {loading
          ? <><span className="spinner-border spinner-border-sm me-2"></span>Enregistrement...</>
          : isModifying ? "✓ Enregistrer les modifications" : "✓ Enregistrer la fiche"}
      </button>
    </div>
  );
}

// ── 7. Bouton Modifier dans les tables historique ─────────────────────────────
export function BtnModifier({ onClick }) {
  return (
    <button className="btn btn-sm fw-semibold"
      style={{ border: "1px solid #6ee7b7", color: "#065f46" }}
      onClick={onClick}>
      <i className="bi bi-pencil me-1"></i>Modifier
    </button>
  );
}

// ── 8. Badge coloré générique ─────────────────────────────────────────────────
export function Badge({ bg, color, children }) {
  return (
    <span className="badge" style={{ background: bg, color, fontSize: "0.82rem", fontWeight: 600 }}>
      {children}
    </span>
  );
}

// ── 9. Spinner de chargement ──────────────────────────────────────────────────
export function Spinner() {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 300 }}>
      <div className="spinner-border" style={{ color: "#2e7d52" }}></div>
    </div>
  );
}