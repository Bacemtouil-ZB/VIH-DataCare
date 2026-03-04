const styles = `
.ec-btn-sauvegarder { background: var(--ec-green) !important; border-radius: 9px; box-shadow: 0 2px 8px rgba(46, 125, 82, 0.25); border: none; color: #fff !important; }
.ec-btn-sauvegarder:hover, .ec-btn-sauvegarder:focus { background: #256643 !important; color: #fff !important; }
`;

export function BoutonSauvegarder({ saving, isModifying, onClick }) {
  return (
    <>
      <style>{styles}</style>
      <button className="btn btn-sm fw-semibold d-flex align-items-center gap-2 ec-btn-sauvegarder" onClick={onClick} disabled={saving}>
        {saving
          ? <><span className="spinner-border spinner-border-sm"></span><span>Enregistrement...</span></>
          : <><i className="bi bi-check-lg"></i>{isModifying ? "Modifier" : "Enregistrer"}</>}
      </button>
    </>
  );
}

