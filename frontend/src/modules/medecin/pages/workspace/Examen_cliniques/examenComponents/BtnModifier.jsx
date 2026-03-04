const styles = `
.ec-btn-modifier { border: 1.5px solid var(--ec-green) !important; color: var(--ec-green) !important; background: #fff !important; font-weight: 500; transition: all 0.2s ease; padding: 0.375rem 0.75rem; border-radius: 6px; }
.ec-btn-modifier:hover { background: var(--ec-green) !important; color: #fff !important; box-shadow: 0 2px 6px rgba(46, 125, 82, 0.25); transform: translateY(-1px); }
.ec-btn-modifier:active { transform: translateY(0); }
`;

export function BtnModifier({ onClick }) {
  return (
    <>
      <style>{styles}</style>
      <button className="btn btn-sm fw-semibold ec-btn-modifier" onClick={onClick}>
        <i className="bi bi-pencil me-1"></i>Modifier
      </button>
    </>
  );
}

