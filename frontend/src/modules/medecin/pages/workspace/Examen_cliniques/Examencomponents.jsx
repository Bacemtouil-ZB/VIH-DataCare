import { useState } from "react";
import "./ExamenComponents.css";

// ── Exports de compatibilité ──────────────────────────────────────────────────
export const LABEL_CLS = "text-uppercase fw-semibold text-secondary d-block mb-1";
export const PAGE_BG   = { background: "#f5f6fa", padding: 24, minHeight: "100%" };
export const STYLES    = {
  tdDate:      { whiteSpace: "nowrap", fontSize: "0.875rem" },
  tdMax:       { fontSize: "0.875rem", maxWidth: 500 },
  thSm:        { fontSize: "0.78rem" },
  tdMaxMed:    { maxWidth: 240 },
  flexInput:   { flex: "1 1 140px" },
  flexInputL:  { flex: "1 1 200px" },
  imcBox:      { background: "#f8faf9", cursor: "default" },
  cardSigneOn:  { border: "1px solid #86efac", background: "#f0fdf4", transition: "all 0.15s" },
  cardSigneOff: { border: "1px solid #e2e8f0", background: "white",   transition: "all 0.15s" },
  rasOn:    { background: "#f0fdf4", border: "1px solid #86efac", cursor: "pointer", userSelect: "none" },
  rasOff:   { background: "#f8fafc", border: "1px solid #e2e8f0", cursor: "pointer", userSelect: "none" },
  trackOn:  { width: 40, height: 22, borderRadius: 11, position: "relative", background: "#16a34a", transition: "background 0.2s" },
  trackOff: { width: 40, height: 22, borderRadius: 11, position: "relative", background: "#cbd5e1", transition: "background 0.2s" },
  thumbOn:  { width: 16, height: 16, borderRadius: "50%", background: "white", position: "absolute", top: 3, left: 21, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" },
  thumbOff: { width: 16, height: 16, borderRadius: "50%", background: "white", position: "absolute", top: 3, left: 3,  transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" },
  habCard:  { background: "#fafafa" },
  habLabel: { fontSize: 15 },
  btnSave:  { background: "#2e7d52", borderRadius: 9, boxShadow: "0 2px 8px rgba(46,125,82,0.25)" },
};

// ── 1. Barre titre + bouton ───────────────────────────────────────────────────
export function PageHeader({ title, icon, showForm, onOpen, onCancel, actionButton }) {
  return (
    <div className="d-flex align-items-center justify-content-between mb-4">
      <h6 className="mb-0 fw-bold text-dark ec-header-title">
        {icon && <i className={`bi ${icon} me-2 ec-header-icon`}></i>}
        {title}
      </h6>
      {actionButton ?? (
        !showForm ? (
          <button
            className="btn btn-sm fw-semibold d-flex align-items-center gap-2 ec-btn-ajouter"
            onClick={onOpen}>
            <i className="bi bi-plus-lg"></i>Ajouter
          </button>
        ) : (
          <button
            className="btn btn-sm fw-semibold text-secondary d-flex align-items-center gap-2 ec-btn-annuler"
            onClick={onCancel}>
            <i className="bi bi-x-lg"></i>Annuler
          </button>
        )
      )}
    </div>
  );
}

// ── 2. Accordéon historique ───────────────────────────────────────────────────
export function HistoriqueAccordeon({ title, count, open, onToggle, children }) {
  return (
    <div className="mb-4 rounded overflow-hidden border">
      <div
        className="d-flex justify-content-between align-items-center px-4 py-3 ec-accordeon-header"
        onClick={onToggle}>
        <span className="ec-accordeon-title">
          <i className="bi bi-clock-history me-2"></i>
          {title}
          <span className="ms-2 badge bg-white bg-opacity-25 rounded-pill fw-normal ec-accordeon-count">
            {count}
          </span>
        </span>
        <i className={`bi bi-chevron-${open ? "up" : "down"}`}></i>
      </div>
      {open && <div className="bg-white p-3">{children}</div>}
    </div>
  );
}

// ── 2b. Barre section non-accordéon ──────────────────────────────────────────
export function SectionHeader({ title, icon, children }) {
  return (
    <div className="mb-4 rounded overflow-hidden border">
      <div className="d-flex justify-content-between align-items-center px-4 py-3 ec-section-header">
        <span className="ec-section-title">
          <i className={`bi ${icon} me-2`}></i>{title}
        </span>
        {children}
      </div>
    </div>
  );
}

// ── 3. État vide ──────────────────────────────────────────────────────────────
export function EmptyState({ message }) {
  return (
    <div className="text-center py-4 text-secondary">
      <i className="bi bi-inbox fs-4 d-block mb-2"></i>
      <small>{message}</small>
    </div>
  );
}

// ── 4. Wrapper formulaire ─────────────────────────────────────────────────────
// color est calculé dynamiquement → style inline conservé
export function FormulaireWrapper({ isModifying, labelCreate, labelModify, children }) {
  return (
    <div className="rounded overflow-hidden" style={{background: "white" }}>
<div className="px-4 py-3 d-flex align-items-center gap-2" style={{ background: "white", color: "#3C617E" }}>
        <i className={`bi ${isModifying ? "bi-pencil-square" : "bi-plus-circle"}`}></i>
        <span className="ec-form-label">{isModifying ? labelModify : labelCreate}</span>
      </div>
      <div className="px-4 py-4">{children}</div>
    </div>
  );
}

// ── 5. Section autres signes — avec édition inline de la description ──────────
export function AutresSignesSection({ title = "Autres signes", appareils, autresSignes, appareilSelectionne, descriptionSigne, onAppareilChange, onDescriptionChange, onAjouter, onSupprimer, onModifierDescription }) {
  const [editingId,  setEditingId]  = useState(null);
  const [editingVal, setEditingVal] = useState("");

  const startEdit  = (s) => { setEditingId(s.id); setEditingVal(s.description); };
  const cancelEdit = ()  => { setEditingId(null); setEditingVal(""); };

  const confirmEdit = (id) => {
    if (!editingVal.trim()) return;
    onModifierDescription(id, editingVal.trim());
    setEditingId(null); setEditingVal("");
  };

  return (
    <div>
      <p className="text-uppercase fw-bold text-secondary mb-3 ec-autres-title">{title}</p>

      {/* Ligne d'ajout */}
      <div className="d-flex gap-3 flex-wrap align-items-end mb-3">
        <div className="ec-flex-appareil">
          <label className="ec-label ec-th-sm">Appareil</label>
          <select className="form-select form-select-sm" value={appareilSelectionne} onChange={(e) => onAppareilChange(e.target.value)}>
            <option value="">Sélectionnez…</option>
            {appareils.map((app) => <option key={app.id} value={app.id}>{app.libelle}</option>)}
          </select>
        </div>
        <div className="ec-flex-desc">
          <label className="ec-label ec-th-sm">
            Description <span className="text-secondary fw-normal text-capitalize" style={{ letterSpacing: 0 }}>— Entrée pour ajouter</span>
          </label>
          <input type="text" className="form-control form-control-sm"
            placeholder="Décrivez les détails et appuyez sur Entrée…"
            value={descriptionSigne}
            onChange={(e) => onDescriptionChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onAjouter()} />
        </div>
      </div>

      {/* Tableau Appareil / Description / Actions */}
      {autresSignes.length > 0 && (
        <table className="table table-sm table-hover mb-4">
          <thead className="table-light">
            <tr>
              <th className="ec-th-appareil">Appareil</th>
              <th className="ec-th-desc">Description</th>
              <th className="ec-th-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {autresSignes.map((s) => (
              <tr key={s.id}>
                <td className="ec-td-vmiddle">
                  <Badge bg="#dbeafe" color="#1d4ed8">{s.appareil}</Badge>
                </td>
                <td className="ec-td-vmiddle">
                  {editingId === s.id ? (
                    <div className="d-flex align-items-center gap-2">
                      <input
                        type="text"
                        className="form-control form-control-sm ec-input-edit"
                        value={editingVal}
                        autoFocus
                        onChange={(e) => setEditingVal(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter")  confirmEdit(s.id);
                          if (e.key === "Escape") cancelEdit();
                        }}
                      />
                      <button className="btn btn-sm btn-success py-0 px-2" title="Confirmer" onClick={() => confirmEdit(s.id)}>
                        <i className="bi bi-check-lg"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-secondary py-0 px-2" title="Annuler" onClick={cancelEdit}>
                        <i className="bi bi-x-lg"></i>
                      </button>
                    </div>
                  ) : (
                    <span className="ec-desc-text">{s.description}</span>
                  )}
                </td>
                <td className="ec-td-actions">
                  <div className="d-flex gap-1 justify-content-center">
                    {editingId !== s.id && (
                      <button className="btn btn-sm btn-outline-primary py-0 px-2" title="Modifier la description" onClick={() => startEdit(s)}>
                        <i className="bi bi-pencil"></i>
                      </button>
                    )}
                    <button className="btn btn-sm btn-outline-danger py-0 px-2" title="Supprimer" onClick={() => onSupprimer(s.id)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
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
// background et opacity dynamiques → style inline conservé
export function BoutonEnregistrer({ isModifying, loading, onClick }) {
  return (
  <div className="rounded overflow-hidden" style={{ border: "1px solid #dee2e6", background: "#2e7d52 " }}>
      <button
        className="btn w-100 fw-bold text-white ec-btn-enregistrer"
        disabled={loading}
        onClick={onClick}>
        {loading
          ? <><span className="spinner-border spinner-border-sm me-2"></span>Enregistrement...</>
          : isModifying ? "✓ Enregistrer les modifications" : "✓ Enregistrer la fiche"}
      </button>
    </div>
  );
}

// ── 7. Bouton Modifier ────────────────────────────────────────────────────────
export function BtnModifier({ onClick }) {
  return (
    <button className="btn btn-sm fw-semibold ec-btn-modifier" onClick={onClick}>
      <i className="bi bi-pencil me-1"></i>Modifier
    </button>
  );
}

// ── 8. Badge coloré ───────────────────────────────────────────────────────────
// bg et color sont des props dynamiques → style inline conservé
export function Badge({ bg, color, children }) {
  return (
    <span className="badge ec-badge" style={{ background: bg, color }}>
      {children}
    </span>
  );
}

// ── 9. Spinner ────────────────────────────────────────────────────────────────
export function Spinner() {
  return (
    <div className="d-flex justify-content-center align-items-center ec-spinner-wrapper">
      <div className="spinner-border ec-spinner-color"></div>
    </div>
  );
}

// ── 10. Toggle RAS ────────────────────────────────────────────────────────────
export function RasToggle({ checked, onChange }) {
  return (
    <div className="d-flex align-items-center gap-3 mb-4">
      <div
        className={`d-flex align-items-center gap-2 px-3 py-2 rounded ec-ras-wrapper ${checked ? "ec-ras-on" : "ec-ras-off"}`}
        onClick={() => onChange(!checked)}>
        <div className={checked ? "ec-track-on" : "ec-track-off"}>
          <div className={checked ? "ec-thumb-on" : "ec-thumb-off"} />
        </div>
        <span className={checked ? "ec-ras-label-on" : "ec-ras-label-off"}>
          RAS — Rien à signaler
        </span>
      </div>
      {checked && (
        <small className="text-success">
          <i className="bi bi-check-circle me-1"></i>Tous les signes sont à Non
        </small>
      )}
    </div>
  );
}

// ── 11. Carte signe fonctionnel ───────────────────────────────────────────────
export function SigneCard({ label, value, disabled, onChange }) {
  return (
    <div className={`rounded p-2 ${value ? "ec-card-signe-on" : "ec-card-signe-off"}`}>
      <div className="text-uppercase fw-bold text-secondary mb-2 ec-signe-label">{label}</div>
      <div className="d-flex gap-1">
        {[true, false].map((val) => {
          const isActive    = value === val;
          const colorClass  = isActive ? (val ? "ec-signe-btn-yes" : "ec-signe-btn-no") : "ec-signe-btn-off";
          const cursorClass = disabled ? "ec-signe-btn-disabled" : "ec-signe-btn-enabled";
          return (
            <button
              key={String(val)}
              className={`btn btn-sm flex-fill py-0 ec-signe-btn ${colorClass} ${cursorClass}`}
              disabled={disabled}
              onClick={() => !disabled && onChange(val)}>
              {val ? "Oui" : "Non"}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── 12. Champ IMC calculé ─────────────────────────────────────────────────────
// imc.color est dynamique → style inline conservé
export function ImcField({ imc }) {
  return (
    <div className="form-control form-control-sm d-flex align-items-center gap-2 ec-imc-box">
      {imc
        ? <>
            <span className="ec-imc-value" style={{ color: imc.color }}>{imc.val}</span>
            <small style={{ color: imc.color }}>{imc.label}</small>
          </>
        : <small className="text-secondary">Saisissez taille et poids</small>}
    </div>
  );
}

// ── 13. Bouton compact Enregistrer / Modifier ─────────────────────────────────
export function BoutonSauvegarder({ saving, isModifying, onClick }) {
  return (
    <button
      className="btn btn-sm fw-semibold d-flex align-items-center gap-2 ec-btn-sauvegarder"
      onClick={onClick}
      disabled={saving}>
      {saving
        ? <><span className="spinner-border spinner-border-sm"></span><span>Enregistrement...</span></>
        : <><i className="bi bi-check-lg"></i>{isModifying ? "Modifier" : "Enregistrer"}</>}
    </button>
  );
}

// ── 14. Cellule historique : Appareil + Description séparés ──────────────────
export function AutresSignesHistorique({ autresSignes }) {
  if (!autresSignes?.length) return <small className="text-secondary">Aucun</small>;
  return (
    <div className="d-flex flex-column gap-1">
      {autresSignes.map((as, i) => (
        <div key={i} className="d-flex align-items-start gap-2">
          <Badge bg="#dbeafe" color="#1d4ed8">{as.appareil}</Badge>
          <span className="ec-histo-desc">{as.description}</span>
        </div>
      ))}
    </div>
  );
}