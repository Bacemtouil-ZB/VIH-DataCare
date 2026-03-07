const styles = `.ec-spinner-wrapper { min-height: 300px; } .ec-spinner-color { color: var(--ec-green, #2e7d52); }`;

export function Spinner() {
  return (
    <>
      <style>{styles}</style>
      <div className="d-flex justify-content-center align-items-center ec-spinner-wrapper">
        <div className="spinner-border ec-spinner-color"></div>
      </div>
    </>
  );
}
