const styles = `
.ec-card-signe-on { border: 1px solid #86efac; background: #f0fdf4; transition: all .15s; }
.ec-card-signe-off { border: 1px solid #e2e8f0; background: #fff; transition: all .15s; }
.ec-signe-label { font-size: .72rem; }
.ec-signe-btn { border-radius: 6px !important; border: none !important; font-size: .78rem !important; font-weight: 600 !important; }
.ec-signe-btn-yes { background: #16a34a !important; color: #fff !important; }
.ec-signe-btn-no { background: #ef4444 !important; color: #fff !important; }
.ec-signe-btn-off { background: #f1f5f9 !important; color: #64748b !important; }
.ec-signe-btn-disabled { cursor: not-allowed !important; }
.ec-signe-btn-enabled { cursor: pointer !important; }
`;

export function SigneCard({ label, value, disabled, onChange }) {
  return (
    <>
      <style>{styles}</style>
      <div className={`rounded p-2 ${value ? "ec-card-signe-on" : "ec-card-signe-off"}`}>
        <div className="text-uppercase fw-bold text-secondary mb-2 ec-signe-label">{label}</div>
        <div className="d-flex gap-1">
          {[true, false].map((val) => {
            const isActive = value === val;
            const colorClass = isActive ? (val ? "ec-signe-btn-yes" : "ec-signe-btn-no") : "ec-signe-btn-off";
            const cursorClass = disabled ? "ec-signe-btn-disabled" : "ec-signe-btn-enabled";
            return (
              <button key={String(val)} className={`btn btn-sm flex-fill py-0 ec-signe-btn ${colorClass} ${cursorClass}`} disabled={disabled} onClick={() => !disabled && onChange(val)}>
                {val ? "Oui" : "Non"}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

