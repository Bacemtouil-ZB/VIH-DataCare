import { FormulaireWrapper, FieldLabel, FieldError, ActionButton } from "../../../../../../shared/components/index.js";
import Textarea from "../../../../components/UI/Textarea.jsx";

const lockedFieldStyle = { cursor: "not-allowed", opacity: 0.75 };

const inputStyle = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 6,
  border: "1px solid #e5e7eb",
  fontSize: 13.5,
  color: "#111827",
  background: "#fafafa",
  outline: "none",
  boxSizing: "border-box",
};

export default function GynecoUI({
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
      labelCreate="Créer l'antécédent gynécologique"
      labelModify="Antécédent gynécologique"
    >
      {/* Gestité / Parité / Avortement */}
      <div
        className="row g-3 mb-3"
        onClick={handleLockedClick}
        style={readOnly ? lockedFieldStyle : {}}
      >
        <div className="col-md-4">
          <FieldLabel>Gestité</FieldLabel>
          <input
            type="number"
            min={0}
            value={form.gestite}
            onChange={(e) => onChange("gestite", e.target.value)}
            disabled={readOnly}
            placeholder="0"
            style={{
              ...inputStyle,
              background: readOnly ? "#f3f4f6" : inputStyle.background,
              cursor: readOnly ? "not-allowed" : "text",
            }}
          />
          <FieldError error={errors.gestite} />
        </div>
        <div className="col-md-4">
          <FieldLabel>Parité</FieldLabel>
          <input
            type="number"
            min={0}
            value={form.parite}
            onChange={(e) => onChange("parite", e.target.value)}
            disabled={readOnly}
            placeholder="0"
            style={{
              ...inputStyle,
              background: readOnly ? "#f3f4f6" : inputStyle.background,
              cursor: readOnly ? "not-allowed" : "text",
            }}
          />
          <FieldError error={errors.parite} />
        </div>
        <div className="col-md-4">
          <FieldLabel>Avortement</FieldLabel>
          <input
            type="number"
            min={0}
            value={form.avortement}
            onChange={(e) => onChange("avortement", e.target.value)}
            disabled={readOnly}
            placeholder="0"
            style={{
              ...inputStyle,
              background: readOnly ? "#f3f4f6" : inputStyle.background,
              cursor: readOnly ? "not-allowed" : "text",
            }}
          />
          <FieldError error={errors.avortement} />
        </div>
      </div>

      {/* Complications */}
      <div
        className="mb-3"
        onClick={handleLockedClick}
        style={readOnly ? lockedFieldStyle : {}}
      >
        <FieldLabel>Complications</FieldLabel>
        <Textarea
          value={form.complications}
          onChange={(e) => onChange("complications", e.target.value)}
          placeholder="Complications obstétricales..."
          disabled={readOnly}
        />
        <FieldError error={errors.complications} />
      </div>

      {/* Suivi gynécologique */}
      <div
        className="mb-3"
        onClick={handleLockedClick}
        style={readOnly ? lockedFieldStyle : {}}
      >
        <FieldLabel>Suivi gynécologique</FieldLabel>
        <Textarea
          value={form.suivi_gynecologique}
          onChange={(e) => onChange("suivi_gynecologique", e.target.value)}
          placeholder="Détails du suivi gynécologique..."
          disabled={readOnly}
        />
        <FieldError error={errors.suivi_gynecologique} />
      </div>

      {/* Dépistage cancer col */}
      <div
        className="mb-3"
        onClick={handleLockedClick}
        style={readOnly ? lockedFieldStyle : {}}
      >
        <FieldLabel>Dépistage cancer du col</FieldLabel>
        <Textarea
          value={form.depistage_cancer_col}
          onChange={(e) => onChange("depistage_cancer_col", e.target.value)}
          placeholder="Résultats du dépistage..."
          disabled={readOnly}
        />
        <FieldError error={errors.depistage_cancer_col} />
      </div>

      {/* Remarque */}
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