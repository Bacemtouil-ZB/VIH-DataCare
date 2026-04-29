// cheked 15/04/2026
import {
  PageTitle,
  ActionButton,
  FieldLabel,
  FieldError,
  Input,
  Spinner,
} from "../../../../../shared/components";
import { toInputDate } from "../../../../../shared/utils/dateHelpers";
import {
  MODES_CONTAMINATION,
  TYPES_DEPISTAGE,
  CIRCONSTANCES_DECOUVERTE,
  STADES_CDC,
  PAGE_TITLE,
} from "./vihConstants";
import "./VihForm.css";

export default function VihUI({
  isLoadingPage,
  isLoading,
  errors,
  isEditMode,
  isCreateMode,
  isDisabled,
  formData,
  selectedModes,
  isModesOpen,
  toggleModesOpen,
  closeModesOpen,
  handleToggleMode,
  handleRemoveMode,
  handleFieldChange,
  handleFormSubmit,
  handleEdit,
  handleCancel,
}) {
  if (isLoadingPage) return <Spinner />;
  const today = toInputDate(new Date());

  return (
    <div className="medical-page">
      <PageTitle title={PAGE_TITLE} />

      <div className="bg-white border rounded">
        <form onSubmit={handleFormSubmit} className="p-4">
          <div className="row g-3">
            <div className="col-md-6">
              <FieldLabel required>Mode de contamination</FieldLabel>
              <div className="multiselect-wrapper">
                <div
                  className={`form-control multiselect-box ${isDisabled || isLoading ? "bg-light" : ""}`}
                  onClick={() => !(isDisabled || isLoading) && toggleModesOpen()}
                >
                  {selectedModes.length === 0 ?
                    <span className="multiselect-placeholder">-- Selectionner --</span>
                  : <span className="multiselect-count">{selectedModes.length} selectionne(s)</span>}
                  <span className="multiselect-chevron">{isModesOpen ? "^" : "v"}</span>
                </div>

                {isModesOpen && (
                  <>
                    <div className="multiselect-overlay" onClick={closeModesOpen} />
                    <div className="multiselect-dropdown">
                      {MODES_CONTAMINATION.map((opt) => {
                        const checked = selectedModes.includes(opt);
                        return (
                          <div
                            key={opt}
                            className={`multiselect-option ${checked ? "checked" : ""}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleMode(opt);
                            }}
                          >
                            <input
                              type="checkbox"
                              readOnly
                              checked={checked}
                              className="multiselect-checkbox"
                            />
                            <span className={checked ? "option-checked" : ""}>{opt}</span>
                            {checked && <span className="option-tick ms-auto">x</span>}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
              <FieldError error={errors.mode_contamination} />
              {selectedModes.length > 0 && (
                <div className="d-flex flex-wrap gap-1 mt-2">
                  {selectedModes.map((opt) => (
                    <span key={opt} className="badge-light-green">
                      {opt}
                      {!(isDisabled || isLoading) && (
                        <span
                          className="badge-light-remove"
                          onClick={() => handleRemoveMode(opt)}
                        >
                          x
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="col-md-6">
              <FieldLabel required>Type de depistage</FieldLabel>
              <select
                name="type_depistage"
                className={`form-select ${errors.type_depistage ? "is-invalid" : ""}`}
                value={formData.type_depistage}
                onChange={handleFieldChange}
                disabled={isDisabled || isLoading}
                required
              >
                <option value="">-- Selectionner --</option>
                {TYPES_DEPISTAGE.map((t) => <option key={t}>{t}</option>)}
              </select>
              <FieldError error={errors.type_depistage} />
            </div>

            <div className="col-md-6">
              <FieldLabel >Circonstance de decouverte</FieldLabel>
              <select
                name="circonstance_decouverte"
                className={`form-select ${errors.circonstance_decouverte ? "is-invalid" : ""}`}
                value={formData.circonstance_decouverte}
                onChange={handleFieldChange}
                disabled={isDisabled || isLoading}
                
              >
                <option value="">-- Selectionner --</option>
                {CIRCONSTANCES_DECOUVERTE.map((c) => <option key={c}>{c}</option>)}
              </select>
              <FieldError error={errors.circonstance_decouverte} />
            </div>
            <div className="col-md-6">
              <FieldLabel>Date derniere negative</FieldLabel>
              <Input
                type="date"
                name="date_derniere_negative"
                className={errors.date_derniere_negative ? "is-invalid" : ""}
                value={formData.date_derniere_negative}
                onChange={handleFieldChange}
                max={today}
                disabled={isDisabled || isLoading}
              />
              <FieldError error={errors.date_derniere_negative} />
            </div>


            <div className="col-md-6">
              <FieldLabel required>Date VIH positif</FieldLabel>
              <Input
                type="date"
                name="date_vih_positif"
                className={errors.date_vih_positif ? "is-invalid" : ""}
                value={formData.date_vih_positif}
                onChange={handleFieldChange}
                max={today}
                disabled={isDisabled || isLoading}
                required
              />
              <FieldError error={errors.date_vih_positif} />
            </div>

            <div className="col-md-6">
              <FieldLabel>Stade CDC</FieldLabel>
              <select
                name="stade_cdc"
                className={`form-select ${errors.stade_cdc ? "is-invalid" : ""}`}
                value={formData.stade_cdc}
                onChange={handleFieldChange}
                disabled={isDisabled || isLoading}
              >
                <option value="">-- Selectionner --</option>
                {STADES_CDC.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            

            <div className="col-12 mt-4">
              {!isEditMode && !isCreateMode ?
                <ActionButton type="button" action="edit" label="Modifier" onClick={handleEdit} block={true} />
              : <div className="edit-actions">
                  <ActionButton
                    type="submit"
                    action="save"
                    label={isLoading ? "Enregistrement..." : isCreateMode ? "Creer" : "Enregistrer"}
                    disabled={isLoading}
                    showIcon={false}
                  />
                  {!isCreateMode && (
                    <ActionButton
                      type="button"
                      action="annuler"
                      label="Annuler"
                      onClick={handleCancel}
                      disabled={isLoading}
                      showIcon={false}
                    />
                  )}
                </div>}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
