// cheked 15/04/2026
import "./ProfilForme.css";
import { ActionButton, FieldLabel,FieldError, Input, RadioGroup, Spinner } from "../../../../../shared/components";
import { confirmAction } from "../../../../../shared/utils/uiAlerts.js";
import { STATUTS_ADMINISTRATIFS, STATUTS_LABELS, STATUTS_COLORS , STATUTS_CREATION } from './profileConstants.js';

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
        <div className="form-row">
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
                <span className="error-text">Format invalide : ex. 0001-2026</span>
              )}
              {errors.numero && <FieldError error={errors.numero} />}
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
              {errors.hospitalisation && <FieldError error={errors.hospitalisation} />}
            </div>

           <div className="form-group">
            <FieldLabel>Statut</FieldLabel>
            {isNew ? (
              <select
                name="status"
                value={formData.status || ""}
                onChange={handleChange}
              >
                <option value="">Sélectionner</option>
                {STATUTS_CREATION.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            ) : isEditing ? (
              <select
                name="status"
                value={formData.status || ""}
                onChange={handleChange}
              >
                <option value="">Sélectionner</option> //dans bd c'est en attente stade par defaut.
                {STATUTS_ADMINISTRATIFS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={STATUTS_LABELS[formData.status] || 'Normal'}
                disabled
                readOnly
              />
            )}
          </div>
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
          {errors.name && <FieldError error={errors.name} />}
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
          {errors.surname && <FieldError error={errors.surname} />}
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
          {errors.birthdate && <FieldError error={errors.birthdate} />}
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
              { label: "Transgenre", value: "transgenre" },

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
          {errors.phone && <FieldError error={errors.phone} />}
        </div>
        
        <div className="form-group">
          <FieldLabel>whatsapp </FieldLabel>
          <Input
            name="whatsapp"
            value={formData.whatsapp || ""}
            onChange={handleChange}
            pattern="^[24597][0-9]{7}$"
            title="Numéro tunisien invalide "
            disabled={!isEditing}
          />
          {errors.whatsapp && <FieldError error={errors.whatsapp} />}
        </div>

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
          <FieldLabel>Délégation de naissance</FieldLabel>
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
          {errors.birth_postal_code_id && <FieldError error={errors.birth_postal_code_id} />}
        </div>

        <div className="form-group">
          <FieldLabel >Gouvernorat résidence</FieldLabel>
          <select
            name="residence_governorate"
            value={formData.residence_governorate || ""}
            onChange={handleChange}
            disabled={!isEditing}
          >
            <option value="">Sélectionner</option>
            {renderGovernorateOptions()}
          </select>
        </div>

        <div className="form-group">
          <FieldLabel >Délégation de résidence</FieldLabel>
          <select
            name="residence_postal_code_id"
            value={formData.residence_postal_code_id || ""}
            onChange={handleChange}
            disabled={!isEditing || !formData.residence_governorate}
            
          >
            <option value="">
              {formData.residence_governorate ? "Sélectionner" : "Choisir d'abord un gouvernorat"}
            </option>
            {renderPostalOptions(filteredResidencePostalCodes)}
          </select>
          {errors.residence_postal_code_id && <FieldError error={errors.residence_postal_code_id} />}
        </div>

        <div className="form-group ">
          <FieldLabel>Email</FieldLabel>
          <Input
            type="email"          
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            disabled={!isEditing}
          />
          {errors.email && <FieldError error={errors.email} />}
        </div>

        <div className="form-group">
          <FieldLabel >Médecin traitant</FieldLabel>
          <select
            name="doctor_id"
            value={formData.doctor_id || ""}
            onChange={handleChange}
            disabled={!isEditing}
            
          >
            <option value="">Sélectionner</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.nom} {doc.prenom}
              </option>
            ))}
          </select>
          {errors.doctor_id && <FieldError error={errors.doctor_id} />}
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
          {errors.remarks && <FieldError error={errors.remarks} />}

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

