import "./ProfilForme.css";
import { ActionButton, FieldLabel,FieldError, Input, RadioGroup, Spinner } from "../../../../../shared/components";
import { confirmAction } from "../../../../../shared/utils/uiAlerts.js";

export default function ProfileForme({
  loading,
  formData,
  errors,
  isNew,
  isEditing,
  setIsEditing,
  doctors,
  governorates,
  filteredBirthPostalCodes,
  filteredResidencePostalCodes,
  canEditNumero,
  numeroHasError,
  handleChange,
  handleNumeroChange,
  handleHospitalisationChange,
  handleSubmit,
  handleCancel,
}) {
  if (loading) return <Spinner />;

  /* -- Select renderers -- */
  const renderGovernorateOptions = () =>
    (governorates || []).map((g) => (
      <option key={g.id} value={g.name}>{g.name}</option>
    ));

  const renderPostalOptions = (items) =>
    (items || []).map((pc) => (
      <option key={pc.id} value={pc.id}>{pc.place_name}</option>
    ));

  return (
    <div className="form-card">
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group">
          <FieldLabel required>Numéro dossier</FieldLabel>
          <Input
            name="numero"
            value={formData.numero || ""}
            onChange={handleNumeroChange}
            disabled={!canEditNumero}
            required
            placeholder="Ex: 0001-2026"
          />
          {numeroHasError && (
              <FieldError error={errors.numero} />
          )}
        </div>

        <div className="form-group">
          <FieldLabel required>Hospitalisation</FieldLabel>
          <select
            name="hospitalisation"
            value={formData.hospitalisation || "interne"}
            onChange={handleHospitalisationChange}
            disabled={!isEditing}
            required
          >
            <option value="interne">Interne</option>
            <option value="externe">Externe</option>
          </select>
        </div>

        <div className="form-group">
          <FieldLabel required>Nom</FieldLabel>
          <Input
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            pattern="[A-Za-zé-é\s]+"
            disabled={!isEditing}
            required
          />
        </div>

        <div className="form-group">
          <FieldLabel required>Prénom</FieldLabel>
          <Input
            name="surname"
            value={formData.surname || ""}
            onChange={handleChange}
            pattern="[A-Za-zé-é\s]+"
            disabled={!isEditing}
            required
          />
        </div>

        <div className="form-group">
          <FieldLabel required>Date de naissance</FieldLabel>
          <Input
            type="date"
            name="birthdate"
            value={formData.birthdate || ""}
            onChange={handleChange}
            max={new Date().toISOString().split("T")[0]}
            disabled={!isEditing}
            required
          />
        </div>

        <div className="form-group">
          <FieldLabel required>Sexe</FieldLabel>
          <RadioGroup
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            disabled={!isEditing}
            required
            className="radio-group"
            options={[
              { label: "Homme", value: "homme" },
              { label: "Femme", value: "femme" },
            ]}
          />
        </div>

        <div className="form-group">
          <FieldLabel>Téléphone</FieldLabel>
          <Input
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            pattern="^[24597][0-9]{7}$"
            title="Numéro tunisien invalide (ex: 20123456)"
            disabled={!isEditing}
          />
        </div>

        <br />

        <div className="form-group">
          <FieldLabel>Gouvernorat naissance</FieldLabel>
          <select
            name="birth_governorate"
            value={formData.birth_governorate || ""}
            onChange={handleChange}
            disabled={!isEditing}
          >
            <option value="">Sélectionner</option>
            {renderGovernorateOptions()}
          </select>
        </div>

        <div className="form-group">
          <FieldLabel>Code postal naissance</FieldLabel>
          <select
            name="birth_postal_code_id"
            value={formData.birth_postal_code_id || ""}
            onChange={handleChange}
            disabled={!isEditing || !formData.birth_governorate}
          >
            <option value="">
              {formData.birth_governorate ? "Sélectionner" : "Choisir d'abord un gouvernorat"}
            </option>
            {renderPostalOptions(filteredBirthPostalCodes)}
          </select>
        </div>

        <div className="form-group">
          <FieldLabel required>Gouvernorat résidence</FieldLabel>
          <select
            name="residence_governorate"
            value={formData.residence_governorate || ""}
            onChange={handleChange}
            disabled={!isEditing}
            required
          >
            <option value="">Sélectionner</option>
            {renderGovernorateOptions()}
          </select>
        </div>

        <div className="form-group">
          <FieldLabel required>Code postal résidence</FieldLabel>
          <select
            name="residence_postal_code_id"
            value={formData.residence_postal_code_id || ""}
            onChange={handleChange}
            disabled={!isEditing || !formData.residence_governorate}
            required
          >
            <option value="">
              {formData.residence_governorate ? "Sélectionner" : "Choisir d'abord un gouvernorat"}
            </option>
            {renderPostalOptions(filteredResidencePostalCodes)}
          </select>
        </div>

        <div className="form-group full-width">
          <FieldLabel>Adresse exacte</FieldLabel>
          <Input
            name="exact_address"
            value={formData.exact_address || ""}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Rue, immeuble, étage, numéro..."
          />
        </div>

        <div className="form-group">
          <FieldLabel required>Médecin traitant</FieldLabel>
          <select
            name="doctor_id"
            value={formData.doctor_id || ""}
            onChange={handleChange}
            disabled={!isEditing}
            required
          >
            <option value="">Sélectionner</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.nom} {doc.prenom}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group full-width">
          <FieldLabel>Remarques</FieldLabel>
          <Input
            as="textarea"
            rows={3}
            name="remarks"
            value={formData.remarks || ""}
            onChange={handleChange}
            disabled={!isEditing}
          />
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
                  "Vous allez pouvoir modifier les informations du patient."
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
                label={isNew ? "Créer" : "Enregistrer"}
                showIcon={false}
              />
              {!isNew && (
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

