import { FormulaireWrapper, FieldLabel, FieldError, ActionButton } from "../../../../../../shared/components/index.js";
import Toggle from "../../../../components/UI/Toggle.jsx";
import { BASE_HABITS, COMPLEMENTS, DROGUES } from "./habitudesVieConstants";

const lockedFieldStyle = { cursor: "not-allowed", opacity: 0.75 };

const inputStyle = {
  width: "100%",
  padding: "6px 10px",
  borderRadius: 6,
  border: "1px solid #e5e7eb",
  fontSize: 13,
  color: "#111827",
  background: "#fafafa",
  outline: "none",
  boxSizing: "border-box",
};

const SectionTitle = ({ children }) => (
  <div style={{ borderBottom: "2px solid #e5e7eb", marginBottom: 12, paddingBottom: 4 }}>
    <span style={{ fontSize: 13, fontWeight: 700, color: "#1a7a5e", textTransform: "uppercase", letterSpacing: 0.5 }}>
      {children}
    </span>
  </div>
);

export default function HabitudesVieUI({
  form,
  errors = {},
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

  const wrapLocked = (content) => (
    <div onClick={handleLockedClick} style={readOnly ? lockedFieldStyle : {}}>
      {content}
    </div>
  );

  return (
    <FormulaireWrapper
      isModifying={isExisting}
      labelCreate="Créer les habitudes de vie"
      labelModify="Habitudes de vie"
    >
      {/* ── Habitudes de base ── */}
      <div className="mb-4">
        <SectionTitle>Habitudes de base</SectionTitle>
        {wrapLocked(
          <div className="d-flex flex-wrap gap-3">
            {BASE_HABITS.map(({ key, label }) => (
              <Toggle
                key={key}
                label={label}
                checked={form[key]}
                onChange={() => onToggle(key)}
                disabled={readOnly}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Compléments alimentaires ── */}
      <div className="mb-4">
        <SectionTitle>Compléments alimentaires / Vitamines</SectionTitle>
        <div className="d-flex flex-column gap-3">
          {COMPLEMENTS.map(({ key, label, hasType, hasDate }) => (
            <div key={key}>
              {wrapLocked(
                <Toggle
                  label={label}
                  checked={form[key]}
                  onChange={() => onToggle(key)}
                  disabled={readOnly}
                />
              )}
              {form[key] && (
                <div className="d-flex gap-2 mt-2 ms-4">
                  {hasType && (
                    <div style={{ flex: 1 }}>
                      <FieldLabel>Type</FieldLabel>
                      {wrapLocked(
                        <input
                          type="text"
                          value={form[`${key}_type`] ?? ""}
                          onChange={(e) => onChange(`${key}_type`, e.target.value)}
                          disabled={readOnly}
                          placeholder="Précisez..."
                          style={{ ...inputStyle, background: readOnly ? "#f3f4f6" : inputStyle.background }}
                        />
                      )}
                      <FieldError error={errors[`${key}_type`]} />
                    </div>
                  )}
                  {hasDate && (
                    <div style={{ flex: 1 }}>
                      <FieldLabel>Date de début</FieldLabel>
                      {wrapLocked(
                        <input
                          type="date"
                          value={form[`${key}_date`] ?? ""}
                          onChange={(e) => onChange(`${key}_date`, e.target.value)}
                          disabled={readOnly}
                          style={{ ...inputStyle, background: readOnly ? "#f3f4f6" : inputStyle.background }}
                          max={new Date().toISOString().split('T')[0]}
                        />
                      )}
                      <FieldError error={errors[`${key}_date`]} />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Autres consommations ── */}
      <div className="mb-4">
        <SectionTitle>Autres consommations</SectionTitle>
        <div className="d-flex flex-wrap gap-3">
          {DROGUES.map(({ key, label }) => (
            <div key={key} style={{ minWidth: 200, flex: "1 1 200px" }}>
              {wrapLocked(
                <Toggle
                  label={label}
                  checked={form[key]}
                  onChange={() => onToggle(key)}
                  disabled={readOnly}
                />
              )}
              {form[key] && (
                <div className="mt-2 ms-2" style={{ maxWidth: 220 }}>
                  <FieldLabel>Date de début</FieldLabel>
                  {wrapLocked(
                    <input
                      type="date"
                      value={form[`${key}_date`] ?? ""}
                      onChange={(e) => onChange(`${key}_date`, e.target.value)}
                      disabled={readOnly}
                      style={{ ...inputStyle, background: readOnly ? "#f3f4f6" : inputStyle.background }}
                      max={new Date().toISOString().split('T')[0]}
                    />
                  )}
                  <FieldError error={errors[`${key}_date`]} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Actions ── */}
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