import React from "react";
import "./SocialForm.css";
import ToggleSwitch from "../../../components/buttons/ToggleSwitch.jsx";
import { confirmAction } from "../../../../../shared/utils/uiAlerts.js";
import { ActionButton, FieldLabel,FieldError, Input, Spinner } from "../../../../../shared/components";

export default function SocialForm({
  loading,
  formData,
  isEditing,
  setIsEditing,
  handleChange,
  ficheExists,
  handleProblemeChange,
  handleSubmit,
  handleCancel,
  problemeOptions,
  niveauEtudeOptions,
  activiteOptions,
  situationSocialOptions,
  errors,
}) {
  if (loading) return <Spinner />;

  return (
    <div className="form-card">
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
        className="form-grid"
      >
        {/* Famille */}
        <h3>Famille</h3>
        <div className="form-group">
          <FieldLabel required>Situation familiale</FieldLabel>
          <select
            name="situation_social"
            value={formData.situation_social}
            onChange={handleChange}
            disabled={!isEditing}
            required
          >
            <option value="">Sélectionner</option>
            {situationSocialOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {errors.situation_social && <FieldError message={errors.situation_social} />}
        </div>

        <div className="form-group">
          <FieldLabel>Nombre d'enfants</FieldLabel>
          <Input
            type="number"
            name="nombre_enfants"
            value={formData.nombre_enfants}
            onChange={handleChange}
            min="0"
            disabled={!isEditing}
          />
          {errors.nombre_enfants && <FieldError message={errors.nombre_enfants} />}
        </div>

        {/* éducation */}
        <h3>éducation</h3>
        <div className="form-group">
          <FieldLabel required>Niveau d'étude</FieldLabel>
          <select
            name="niveau_etude"
            value={formData.niveau_etude}
            onChange={handleChange}
            disabled={!isEditing}
            required
          >
            <option value="">Sélectionner</option>
            {niveauEtudeOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {errors.niveau_etude && <FieldError message={errors.niveau_etude} />}
        </div>

        {/* Activité */}
        <h3>Activité & Ressources</h3>
        <div className="form-group">
          <FieldLabel required>Activité professionnelle</FieldLabel>
          <select
            name="activite_professionnelle"
            value={formData.activite_professionnelle}
            onChange={handleChange}
            disabled={!isEditing}
            required
          >
            <option value="">Sélectionner</option>
            {activiteOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {errors.activite_professionnelle && <FieldError message={errors.activite_professionnelle} />}
        </div>

        {/* Problémes */}
        <h3>Problémes rencontrés</h3>
        <div className="form-group full-width">
          <div className="toggle-grid">
            {problemeOptions.map(opt => (
              <ToggleSwitch
                key={opt.value}
                id={`probleme-${opt.value}`}
                label={opt.label}
                checked={formData.probleme?.includes(opt.value) || false}
                disabled={!isEditing}
                onChange={(checked) => handleProblemeChange(opt.value, checked)}
              />
            ))}
          </div>
          {errors.probleme && <FieldError message={errors.probleme} />}
        </div>

        {/* Remarques */}
        <div className="form-group full-width">
          <FieldLabel>Remarques générales</FieldLabel>
          <Input
            as="textarea"
            rows={3}
            name="remarque"
            value={formData.remarque}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Informations complémentaires max 500 caractéres"
            maxLength={500}
          />
          {errors.remarque && <FieldError message={errors.remarque} />}
        </div>

        <div className="form-group full-width">
          {!isEditing ? (
            <ActionButton
              type="button"
              action="edit"
              label="Modifier"
              onClick={async () => {
                const confirmed = await confirmAction(
                  "Activer le mode modification ?",
                  "Vous allez pouvoir modifier les informations sociales."
                );
                if (!confirmed) return;
                setIsEditing(true);
              }}
            />
          ) : (
            <div className="edit-actions">
              <ActionButton
                type="submit"
                action="save"
                label={!ficheExists ? "Créer" : "Enregistrer"}
                showIcon={false}
              />
              {ficheExists && (
                <ActionButton
                  type="button"
                  action="annuler"
                  label="Annuler"
                  onClick={handleCancel}
                  showIcon={false}
                />
              )}
            </div>
          )}
        </div>

      </form>
    </div>
  );
}

