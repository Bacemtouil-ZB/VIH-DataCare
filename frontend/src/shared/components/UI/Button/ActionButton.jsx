const styles = `
.ec-action-btn {
  border-radius: 9px;
  transition: all 0.2s ease;
}
.ec-action-btn.ec-filled {
  background: var(--ec-green) !important;
  border: none;
  color: #fff !important;
  box-shadow: 0 2px 8px rgba(46, 125, 82, 0.25);
}
.ec-action-btn.ec-filled:hover,
.ec-action-btn.ec-filled:focus {
  background: #256643 !important;
  color: #fff !important;
}
.ec-action-btn.ec-outline {
  border: 1.5px solid var(--ec-green) !important;
  color: var(--ec-green) !important;
  background: #fff !important;
}
.ec-action-btn.ec-outline:hover {
  background: var(--ec-green) !important;
  color: #fff !important;
  box-shadow: 0 2px 6px rgba(46, 125, 82, 0.25);
}
.ec-action-btn:disabled {
  opacity: 0.75;
}
`;

function defaultLabel(action) {
  if (action === "edit") return "Modifier";
  if (action === "add") return "Ajouter";
  if (action === "validate") return "Valider";
  
  return "Enregistrer";
}

function actionIcon(action) {
  if (action === "edit") return "bi bi-pencil";
  if (action === "add") return "bi bi-plus-lg";
  if (action === "validate") return "bi bi-check-circle";  // Icône pour "Valider"

  return "bi bi-check-lg";
}

export function ActionButton({
  action = "save",
  label,
  loading = false,
  loadingLabel = "Enregistrement...",
  onClick,
  disabled = false,
  variant = "filled",
  size = "sm",
  block = false,
  className = "",
  showIcon = true,
}) {
  const toneClass = variant === "outline" ? "ec-outline" : "ec-filled";
  const sizeClass = size === "sm" ? "btn-sm" : "";
  const widthClass = block ? "w-100" : "";
  const finalLabel = label || defaultLabel(action);
  const isDisabled = disabled || loading;

  return (
    <>
      <style>{styles}</style>
      <button
        className={`btn fw-semibold d-flex align-items-center justify-content-center gap-2 ec-action-btn ${toneClass} ${sizeClass} ${widthClass} ${className}`.trim()}
        onClick={onClick}
        disabled={isDisabled}
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm"></span>
            <span>{loadingLabel}</span>
          </>
        ) : (
          <>
            {showIcon && <i className={actionIcon(action)}></i>}
            <span>{finalLabel}</span>
          </>
        )}
      </button>
    </>
  );
}
