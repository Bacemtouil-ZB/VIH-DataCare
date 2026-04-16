//cheked 15/04/2026
import { FormulaireWrapper, FieldLabel, FieldError, ActionButton } from "../../../../../../shared/components/index.js";
import Textarea from "../../../../components/UI/Textarea.jsx";

const lockedFieldStyle = { cursor: "not-allowed", opacity: 0.75 };

export default function TherapeuticUI({
  form,
  errors = {},
  isExisting,
  isEditing,
  saving,
  onChange,
  onSave,
  onEdit,
  onCancel,
}) {
  const readOnly = isExisting && !isEditing;

  const handleLockedClick = (e) => {
    if (!readOnly) return;
    const circle = document.createElement("span");
    circle.style.cssText = `
      position: fixed; width: 18px; height: 18px; border-radius: 50%;
      background: #dc3545; opacity: 0.7; pointer-events: none;
      transform: translate(-50%, -50%); z-index: 9999;
      left: ${e.clientX}px; top: ${e.clientY}px; transition: opacity 0.4s;
    `;
    document.body.appendChild(circle);
    setTimeout(() => { circle.style.opacity = "0"; setTimeout(() => circle.remove(), 400); }, 100);
  };

  return (
    <FormulaireWrapper
      isModifying={isExisting}
      labelCreate="Créer l'antécédent thérapeutique"
      labelModify="Antécédent thérapeutique"
    >
      <div
        className="mb-3"
        onClick={handleLockedClick}
        style={readOnly ? lockedFieldStyle : {}}
      >
        <FieldLabel>Médicaments chroniques</FieldLabel>
        <Textarea
          value={form.medicaments_chroniques}
          onChange={(e) => onChange("medicaments_chroniques", e.target.value)}
          placeholder="Liste des médicaments pris de façon chronique..."
          disabled={readOnly}
        />
        <FieldError error={errors.medicaments_chroniques} />
      </div>

      <div
        className="mb-3"
        onClick={handleLockedClick}
        style={readOnly ? lockedFieldStyle : {}}
      >
        <FieldLabel>Allergies aux médicaments</FieldLabel>
        <Textarea
          value={form.allergies_medicaments}
          onChange={(e) => onChange("allergies_medicaments", e.target.value)}
          placeholder="Médicaments causant des allergies..."
          disabled={readOnly}
        />
        <FieldError error={errors.allergies_medicaments} />
      </div>

      <div
        className="mb-4"
        onClick={handleLockedClick}
        style={readOnly ? lockedFieldStyle : {}}
      >
        <FieldLabel>Remarque</FieldLabel>
        <Textarea
          value={form.remarque}
          onChange={(e) => onChange("remarque", e.target.value)}
          placeholder="Remarque générale..."
          disabled={readOnly}
        />
        <FieldError error={errors.remarque} />
      </div>

      <div className="d-flex justify-content-end gap-2">
        {readOnly ? (
          <ActionButton action="edit" label="Modifier" onClick={onEdit} />
        ) : (
          <>
            {isExisting && (
              <ActionButton action="annuler" label="Annuler" onClick={onCancel} disabled={saving} />
            )}
            <ActionButton
              action={isExisting ? "edit" : "add"}
              label={isExisting ? "Mettre à jour" : "Enregistrer"}
              loading={saving}
              loadingLabel="Enregistrement..."
              onClick={onSave}
            />
          </>
        )}
      </div>
    </FormulaireWrapper>
  );
}