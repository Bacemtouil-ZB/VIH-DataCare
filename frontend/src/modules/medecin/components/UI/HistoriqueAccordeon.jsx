const styles = `
.ec-accordeon-header { background: #fff; color: #6e6d6d; cursor: pointer; user-select: none; }
.ec-accordeon-title { font-weight: 700; font-size: 0.95rem; }
.ec-accordeon-count { font-size: 0.8rem; }
`;

export function HistoriqueAccordeon({ title, count, open, onToggle, children }) {
  return (
    <>
      <style>{styles}</style>
      <div className="mb-4 rounded overflow-hidden border">
        <div className="d-flex justify-content-between align-items-center px-4 py-3 ec-accordeon-header" onClick={onToggle}>
          <span className="ec-accordeon-title">
            <i className="bi bi-clock-history me-2"></i>
            {title}
            <span className="ms-2 badge bg-white bg-opacity-25 rounded-pill fw-normal ec-accordeon-count">{count}</span>
          </span>
          <i className={`bi bi-chevron-${open ? "up" : "down"}`}></i>
        </div>
        {open && <div className="bg-white p-3">{children}</div>}
      </div>
    </>
  );
}

