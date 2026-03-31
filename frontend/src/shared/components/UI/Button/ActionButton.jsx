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
.ec-action-btn:disabled,
.ec-action-btn:disabled:hover,
.ec-action-btn[disabled],
.ec-action-btn[disabled]:hover {
  opacity: 0.75;
  cursor: not-allowed !important;
  pointer-events: auto !important;
}
.ec-action-btn.ec-delete-outline {
  border: 1.5px solid #dc3545 !important;
  color: #dc3545 !important;
  background: #fff !important;
}
.ec-action-btn.ec-delete-outline:hover {
  background: #dc3545 !important;
  color: #fff !important;
  box-shadow: 0 2px 6px rgba(220, 53, 69, 0.25);
}
/* Bouton "Annuler" (gris clair) */
.ec-action-btn.ec-annuler {
  background: #d6d8db !important;  /* Gris clair */
  color: #333 !important;
  border: none;
  box-shadow: 0 2px 8px rgba(169, 169, 169, 0.25);
}

.ec-action-btn.ec-annuler:hover {
  background: #c0c3c8 !important;  /* Gris plus foncé pour le survol */
  color: #333 !important;
  box-shadow: 0 2px 6px rgba(169, 169, 169, 0.25);
}

.ec-action-btn:disabled,
.ec-action-btn:disabled:hover,
.ec-action-btn[disabled],
.ec-action-btn[disabled]:hover {
  opacity: 0.75;
  cursor: not-allowed !important;
  pointer-events: auto !important;
}
`;
function actionIcon(action) {
  if (action === "edit") return "bi bi-pencil";
  if (action === "add") return "bi bi-plus-lg";
  if (action === "validate") return "bi bi-check-circle"; 
  if (action === "delete") return "bi bi-trash";
  if (action === "annuler") return "bi bi-x-lg"; 
  return "bi bi-check-lg";
}

export function ActionButton({
  action = "save",
  label,
  loading = false,
  loadingLabel = "Enregistrement...",
  onClick,
  type,
  disabled = false,
  variant = "filled",
  size = "sm",
  block = false,
  className = "",
  showIcon = true,
  height = "auto", 
}) {
  let toneClass;
  
  // Conditionner la classe pour "delete" et "annuler"
  if (action === "delete") {
    toneClass = variant === "outline" ? "ec-delete-outline" : "ec-delete-filled";
  } else if (action === "annuler") {
    toneClass = "ec-annuler";  // Classe spécifique pour le bouton Annuler
  } else {
    toneClass = variant === "outline" ? "ec-outline" : "ec-filled";
  }

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
        type={type}
        disabled={isDisabled}
        style={{ height }}
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

// Fonction pour obtenir le label par défaut en fonction de l'action
function defaultLabel(action) {
  if (action === "edit") return "Modifier";
  if (action === "add") return "Ajouter";
  if (action === "validate") return "Valider";
  if (action === "delete") return "Supprimer";
  if (action === "annuler") return "Annuler";

  return "Enregistrer";
}