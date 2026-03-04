const styles = `.ec-section-header { background: #fff; color: #6e6d6d; user-select: none; } .ec-section-title { font-weight: 700; font-size: 0.95rem; }`;

export function SectionHeader({ title, icon, children }) {
  return (
    <>
      <style>{styles}</style>
      <div className="mb-4 rounded overflow-hidden border">
        <div className="d-flex justify-content-between align-items-center px-4 py-3 ec-section-header">
          <span className="ec-section-title"><i className={`bi ${icon} me-2`}></i>{title}</span>
          {children}
        </div>
      </div>
    </>
  );
}

