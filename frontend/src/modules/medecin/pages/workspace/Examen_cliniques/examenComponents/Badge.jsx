const styles = `.ec-badge { font-size: 0.82rem; font-weight: 600; }`;

export function Badge({ bg, color, children }) {
  return (
    <>
      <style>{styles}</style>
      <span className="badge ec-badge" style={{ background: bg, color }}>
        {children}
      </span>
    </>
  );
}

