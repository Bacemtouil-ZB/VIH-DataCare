import "./ProfilForme.css";
import FieldLabel from "../../../components/UI/FieldLabel";
import { confirmAction } from "../../../../../shared/utils/uiAlerts.js";

import { toast } from "react-toastify";
export default function ProfileForme({
  formData,
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

  /* ── Select renderers ── */
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
        <div className="form-group">
          <FieldLabel required>Numéro dossier</FieldLabel>
          <input
            name="numero"
            value={formData.numero || ""}
            onChange={handleNumeroChange}
            disabled={!canEditNumero}
            required
            placeholder="Ex: 0001-2026"
            onFocus={() => toast.info("Le tiret sera ajouté automatiquement")}
          />
          {numeroHasError && (
            <span className="error-text">Format invalide : ex. 0001-2025</span>
          )}
        </div>
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
          <input
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            pattern="[A-Za-zÀ-ÿ\s]+"
            disabled={!isEditing}
            required
          />
        </div>

        <div className="form-group">
          <FieldLabel required>Prénom</FieldLabel>
          <input
            name="surname"
            value={formData.surname || ""}
            onChange={handleChange}
            pattern="[A-Za-zÀ-ÿ\s]+"
            disabled={!isEditing}
            required
          />
        </div>

        <div className="form-group">
          <FieldLabel required>Date de naissance</FieldLabel>
          <input
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
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="gender"
                value="homme"
                checked={formData.gender === "homme"}
                onChange={handleChange}
                disabled={!isEditing}
                required
              />
              Homme
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="femme"
                checked={formData.gender === "femme"}
                onChange={handleChange}
                disabled={!isEditing}
                required
              />
              Femme
            </label>
          </div>
        </div>

        <div className="form-group">
          <FieldLabel>Téléphone</FieldLabel>
          <input
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
          <input
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
          <textarea
            name="remarks"
            value={formData.remarks || ""}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div className="form-group full-width">
          {!isEditing ? (
            <button
              type="button"
              className="edit-btn"
              onClick={async () => {
                const confirmed = await confirmAction(
                  "Activer le mode modification ?",
                  "Vous allez pouvoir modifier les informations du patient."
                );
                if (!confirmed) return;
                setIsEditing(true);
              }}
            >
              Modifier
            </button>
          ) : (
            <div className="edit-actions">
              <button type="submit" className="save-btn">
                {isNew ? "Créer" : "Enregistrer"}
              </button>
              {!isNew && (
                <button type="button" className="cancel-btn" onClick={handleCancel}>
                  Annuler
                </button>
              )}
            </div>
          )}
        </div>

      </form>
    </div>
  );
}
