const styles = `.ec-imc-box { background: #f8faf9; cursor: default; } .ec-imc-value { font-weight: 700; }`;

export function ImcField({ imc }) {
  return (
    <>
      <style>{styles}</style>
      <div className="form-control form-control-sm d-flex align-items-center gap-2 ec-imc-box">
        {imc
          ? <><span className="ec-imc-value" style={{ color: imc.color }}>{imc.val}</span><small style={{ color: imc.color }}>{imc.label}</small></>
          : <small className="text-secondary">Saisissez taille et poids</small>}
      </div>
    </>
  );
}

