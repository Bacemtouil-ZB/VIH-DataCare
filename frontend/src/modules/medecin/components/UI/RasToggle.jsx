const styles = `
.ec-ras-wrapper { cursor: pointer; user-select: none; }
.ec-ras-on { background: #f0fdf4; border: 1px solid #86efac; }
.ec-ras-off { background: #f8fafc; border: 1px solid #e2e8f0; }
.ec-track-on, .ec-track-off { width: 40px; height: 22px; border-radius: 11px; position: relative; transition: background 0.2s; }
.ec-track-on { background: #16a34a; }
.ec-track-off { background: #cbd5e1; }
.ec-thumb-on, .ec-thumb-off { width: 16px; height: 16px; border-radius: 50%; background: #fff; position: absolute; top: 3px; transition: left 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,.2); }
.ec-thumb-on { left: 21px; }
.ec-thumb-off { left: 3px; }
.ec-ras-label-on { font-weight: 700; font-size: 0.9rem; color: #166534; }
.ec-ras-label-off { font-weight: 700; font-size: 0.9rem; color: #475569; }
`;

export function RasToggle({ checked, onChange }) {
  return (
    <>
      <style>{styles}</style>
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className={`d-flex align-items-center gap-2 px-3 py-2 rounded ec-ras-wrapper ${checked ? "ec-ras-on" : "ec-ras-off"}`} onClick={() => onChange(!checked)}>
          <div className={checked ? "ec-track-on" : "ec-track-off"}><div className={checked ? "ec-thumb-on" : "ec-thumb-off"} /></div>
          <span className={checked ? "ec-ras-label-on" : "ec-ras-label-off"}>RAS - Rien a signaler</span>
        </div>
        {checked && <small className="text-success"><i className="bi bi-check-circle me-1"></i>Tous les signes sont a Non</small>}
      </div>
    </>
  );
}

