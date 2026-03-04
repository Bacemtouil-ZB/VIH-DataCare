const styles = `
.ec-enregistrer-wrap { border: 1px solid #dee2e6; background: #2e7d52; }
.ec-btn-enregistrer { border-radius: 10px; font-size: 0.95rem; }
.ec-btn-enregistrer:disabled { opacity: 0.75; }
`;

export function BoutonEnregistrer({ isModifying, loading, onClick }) {
  return (
    <>
      <style>{styles}</style>
      <div className="rounded overflow-hidden ec-enregistrer-wrap">
        <button className="btn w-100 fw-bold text-white ec-btn-enregistrer" disabled={loading} onClick={onClick}>
          {loading
            ? <><span className="spinner-border spinner-border-sm me-2"></span>Enregistrement...</>
            : isModifying ? "? Enregistrer les modifications" : "? Enregistrer la fiche"}
        </button>
      </div>
    </>
  );
}

