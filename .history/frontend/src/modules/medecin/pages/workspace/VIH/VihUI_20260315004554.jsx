import { PageTitle, ActionButton, FieldLabel,FieldError, Input, RadioGroup, Spinner } from "../../../../../shared/components";
import {
  MODES_CONTAMINATION,
  TYPES_DEPISTAGE,
  CIRCONSTANCES_DECOUVERTE,
  STADES_CDC,
  PAGE_TITLE,
  TYPAGE_HLA_OPTIONS,
  PROFIL_SEROCONVERSION_OPTIONS,
} from "./vihConstants";
import "./VihForm.css";

export default function VihUI({
  isLoadingPage,
  isLoading,
  errors,
  isEditMode,
  isCreateMode,
  isDisabled,
  isStadeC,
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
                  {selectedModes.length === 0
                    ? <span className="multiselect-placeholder">-- Sélectionner --</span>
                    : <span className="multiselect-count">{selectedModes.length} sélectionné(s)</span>
                  }
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
                            onClick={(e) => { e.stopPropagation(); handleToggleMode(opt); }}
                          >
                            <input type="checkbox" readOnly checked={checked} className="multiselect-checkbox" />
                            <span className={checked ? "option-checked" : ""}>{opt}</span>
                            {checked && <span className="option-tick ms-auto">x</span>}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
              {errors.mode_contamination && <div className="text-danger small mt-1">{errors.mode_contamination}</div>}
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
               <FieldError error={errors.mode_contamination} />
            </div>

            <div className="col-md-6">
              <FieldLabel required>Type de dépistage</FieldLabel>
              <select
                name="type_depistage"
                className={`form-select ${errors.type_depistage ? "is-invalid" : ""}`}
                value={formData.type_depistage}
                onChange={handleFieldChange}
                disabled={isDisabled || isLoading}
                required
              >
                <option value="">-- Sélectionner --</option>
                {TYPES_DEPISTAGE.map((t) => <option key={t}>{t}</option>)}
              </select>
              {errors.type_depistage && <div className="invalid-feedback">{errors.type_depistage}</div>}
            </div>

            <div className="col-12">
              <FieldLabel required>Circonstance de découverte</FieldLabel>
              <select
                name="circonstance_decouverte"
                className={`form-select ${errors.circonstance_decouverte ? "is-invalid" : ""}`}
                value={formData.circonstance_decouverte}
                onChange={handleFieldChange}
                disabled={isDisabled || isLoading}
                required
              >
                <option value="">-- Sélectionner --</option>
                {CIRCONSTANCES_DECOUVERTE.map((c) => <option key={c}>{c}</option>)}
              </select>
              {errors.circonstance_decouverte && <div className="invalid-feedback">{errors.circonstance_decouverte}</div>}
            </div>

            <div className="col-md-6">
              <FieldLabel>Date derniére négative</FieldLabel>
              <Input
                type="date"
                name="date_derniere_negative"
                className={errors.date_derniere_negative ? "is-invalid" : ""}
                value={formData.date_derniere_negative}
                onChange={handleFieldChange}
                disabled={isDisabled || isLoading}
              />
              {errors.date_derniere_negative && <div className="invalid-feedback">{errors.date_derniere_negative}</div>}
            </div>

            <div className="col-md-6">
              <FieldLabel>Date de contamination</FieldLabel>
              <Input
                type="date"
                name="date_contamination"
                className={errors.date_contamination ? "is-invalid" : ""}
                value={formData.date_contamination}
                onChange={handleFieldChange}
                disabled={isDisabled || isLoading}
              />
              {errors.date_contamination && <div className="invalid-feedback">{errors.date_contamination}</div>}
            </div>

            <div className="col-md-6">
              <FieldLabel required>Date VIH positif</FieldLabel>
              <Input
                type="date"
                name="date_vih_positif"
                className={errors.date_vih_positif ? "is-invalid" : ""}
                value={formData.date_vih_positif}
                onChange={handleFieldChange}
                disabled={isDisabled || isLoading}
                required
              />
              {errors.date_vih_positif && <div className="invalid-feedback">{errors.date_vih_positif}</div>}
            </div>

            <div className="col-md-6">
              <FieldLabel required>Stade CDC</FieldLabel>
              <select
                name="stade_cdc"
                className={`form-select ${errors.stade_cdc ? "is-invalid" : ""}`}
                value={formData.stade_cdc}
                onChange={handleFieldChange}
                disabled={isDisabled || isLoading}
                required
              >
                <option value="">-- Sélectionner --</option>
                {STADES_CDC.map((s) => <option key={s}>{s}</option>)}
              </select>
              {errors.stade_cdc && <div className="invalid-feedback">{errors.stade_cdc}</div>}
            </div>

            {isStadeC && (
              <div className="col-md-6">
                <FieldLabel>Début stade C</FieldLabel>
                <Input
                  type="date"
                  name="debut_stade_c"
                  className={errors.debut_stade_c ? "is-invalid" : ""}
                  value={formData.debut_stade_c}
                  onChange={handleFieldChange}
                  disabled={isDisabled || isLoading}
                />
                {errors.debut_stade_c && <div className="invalid-feedback">{errors.debut_stade_c}</div>}
              </div>
            )}

            <div className="col-md-6">
              <FieldLabel required>Typage HLA-B5701</FieldLabel>
              <RadioGroup
                name="typage_hla_b5701"
                value={formData.typage_hla_b5701}
                onChange={handleFieldChange}
                options={TYPAGE_HLA_OPTIONS.map((label) => ({ label, value: label }))}
                disabled={isDisabled || isLoading}
                required={true}
                className="d-flex gap-3 mt-2 vih-radio-group"
                itemClassName="form-check vih-radio-item"
                inputClassName="form-check-input"
                labelTextClassName="form-check-label"
              />
              {errors.typage_hla_b5701 && <div className="text-danger small mt-1">{errors.typage_hla_b5701}</div>}
            </div>

            <div className="col-md-6">
              <FieldLabel>Profil de séroconversion (Fiebig I é V)</FieldLabel>
              <RadioGroup
                name="profil_seroconversion"
                value={formData.profil_seroconversion}
                onChange={handleFieldChange}
                options={PROFIL_SEROCONVERSION_OPTIONS}
                disabled={isDisabled || isLoading}
                className="d-flex gap-3 mt-2 vih-radio-group"
                itemClassName="form-check vih-radio-item"
                inputClassName="form-check-input"
                labelTextClassName="form-check-label"
              />
            </div>

            <div className="col-12 mt-2">
              {!isEditMode && !isCreateMode ? (
                <ActionButton type="button" action="edit" label="Modifier" onClick={handleEdit} block={true} />
              ) : (
                <div className="edit-actions">
                  <ActionButton
                    type="submit"
                    action="save"
                    label={
                      isLoading
                        ? "Enregistrement..."
                        : isCreateMode
                          ? "Créer"
                          : "Enregistrer"
                    }
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
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
