const styles = `
.ec-form-wrapper, .ec-form-header { background: #fff; }
.ec-form-header { color: #3c617e; }
.ec-form-label { font-weight: 700; font-size: 0.95rem; }
`;

export function FormulaireWrapper({ isModifying, labelCreate, labelModify, children }) {
  return (
    <>
      <style>{styles}</style>
      <div className="rounded overflow-hidden ec-form-wrapper mb-3 border">
        <div className="px-4 py-3 d-flex align-items-center gap-2 ec-form-header border-bottom">
          <i className={`bi ${isModifying ? "bi-pencil-square" : "bi-plus-circle"}`}></i>
          <span className="ec-form-label">{isModifying ? labelModify : labelCreate}</span>
        </div>
        <div className="px-4 py-4">{children}</div>
      </div>
    </>
  );
}

