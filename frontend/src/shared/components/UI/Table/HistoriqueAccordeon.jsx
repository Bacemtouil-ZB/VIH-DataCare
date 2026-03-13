const styles = `
.ec-accordeon-root { border-color: #e2e8f0 !important; background: #ffffff; }
.ec-accordeon-header { background: #f8fafc; color: #64748b; cursor: pointer; user-select: none; border-bottom: 1px solid #e2e8f0; }
.ec-accordeon-title { font-weight: 700; font-size: 0.9rem; color: #475569; }
.ec-accordeon-count { font-size: 0.75rem; color: #475569 !important; background: #eef2f7 !important; border: 1px solid #e2e8f0; }
.ec-accordeon-chevron { color: #64748b; }
`;

export default function HistoriqueAccordeon({
  title,
  count,
  open,
  onToggle,
  children,
  hideTitle = false,
  showCount = true,
  contentClassName = "bg-white p-3",
}) {
  return (
    <>
      <style>{styles}</style>
      <div className="mb-4 rounded overflow-hidden border ec-accordeon-root">
        <div className="d-flex justify-content-between align-items-center px-4 py-3 ec-accordeon-header" onClick={onToggle}>
          <span className="ec-accordeon-title">
            {!hideTitle ? (
              <>
                <i className="bi bi-clock-history me-2"></i>
                {title}
              </>
            ) : null}
            {showCount ? (
              <span className={`${hideTitle ? "" : "ms-2"} badge rounded-pill fw-normal ec-accordeon-count`}>
                {count}
              </span>
            ) : null}
          </span>
          <i className={`bi bi-chevron-${open ? "up" : "down"} ec-accordeon-chevron`}></i>
        </div>
        {open && <div className={contentClassName}>{children}</div>}
      </div>
    </>
  );
}
