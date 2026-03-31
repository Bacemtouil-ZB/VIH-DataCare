import { FormulaireWrapper, FieldLabel, ActionButton } from "../../../../../../shared/components/index.js";
import Toggle from "../../../../components/UI/Toggle.jsx";
import Textarea from "../../../../components/UI/Textarea.jsx";
import { FAMILY_FIELDS } from "./familyConstants";

const lockedFieldStyle = { cursor: "not-allowed", opacity: 0.75 };

export default function FamilyUI({
  form,
  isExisting,
  isEditing,
  saving,
  onToggle,
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
      labelCreate="Créer l'antécédent familial"
      labelModify="Antécédent familial"
    >
      <div className="mb-3">
        <FieldLabel>Antécédents familiaux</FieldLabel>
        <div
          className="d-flex flex-wrap gap-3 mt-2"
          onClick={handleLockedClick}
          style={readOnly ? lockedFieldStyle : {}}
        >
          {FAMILY_FIELDS.map(({ key, label }) => (
            <Toggle
              key={key}
              label={label}
              checked={form[key]}
              onChange={() => onToggle(key)}
              disabled={readOnly}
            />
          ))}
        </div>
      </div>

      <div className="mb-3" onClick={handleLockedClick} style={readOnly ? lockedFieldStyle : {}}>
        <FieldLabel>Autres</FieldLabel>
        <Textarea
          value={form.autres}
          onChange={(e) => onChange("autres", e.target.value)}
          placeholder="Précisez d'autres antécédents familiaux..."
          disabled={readOnly}
        />
      </div>

      <div className="mb-4" onClick={handleLockedClick} style={readOnly ? lockedFieldStyle : {}}>
        <FieldLabel>Remarque</FieldLabel>
        <Textarea
          value={form.remarque}
          onChange={(e) => onChange("remarque", e.target.value)}
          placeholder="Remarque générale..."
          disabled={readOnly}
        />
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