const styles = `
.ec-header-title { font-size: 1rem; }
.ec-header-icon { color: var(--ec-green); }
.ec-btn-ajouter { background: var(--ec-green) !important; border-radius: 9px; box-shadow: 0 2px 8px rgba(46, 125, 82, 0.25); border: none; color: #fff !important; }
.ec-btn-ajouter:hover, .ec-btn-ajouter:focus { background: #256643 !important; color: #fff !important; box-shadow: 0 3px 10px rgba(46, 125, 82, 0.4); }
.ec-btn-annuler { border: 1px solid var(--ec-slate); border-radius: 9px; }
`;

export function PageHeader({ title, icon, showForm, onOpen, onCancel, actionButton }) {
  return (
    <>
      <style>{styles}</style>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h6 className="mb-0 fw-bold text-dark ec-header-title">
          {icon && <i className={`bi ${icon} me-2 ec-header-icon`}></i>}
          {title}
        </h6>
        {actionButton ?? (
          !showForm ? (
            <button className="btn btn-sm fw-semibold d-flex align-items-center gap-2 ec-btn-ajouter" onClick={onOpen}>
              <i className="bi bi-plus-lg"></i>Ajouter
            </button>
          ) : (
            <button className="btn btn-sm fw-semibold text-secondary d-flex align-items-center gap-2 ec-btn-annuler" onClick={onCancel}>
              <i className="bi bi-x-lg"></i>Annuler
            </button>
          )
        )}
      </div>
    </>
  );
}

