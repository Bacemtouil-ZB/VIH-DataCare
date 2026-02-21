import "./ProfilForme.css";
import { toast } from "react-toastify";
import { Alert } from "../../../../../shared/utils/alertService.js";
import { useState } from "react";

export default function ProfilForm({
  formData,
  setFormData,
  onSubmit,
  isNew,
  isEditing,
  setIsEditing,
  onCancel,
  doctors = [],
  formDataOptions = { governorates: [], postalCodes: [] }
}) {

  const { governorates, postalCodes } = formDataOptions;

  const [errors, setErrors] = useState({}); // pour validation inline

  /* ------------------ HANDLE CHANGE ------------------ */
  const handleChange = (e) => {
    let { name, value } = e.target;

    // Nettoyage rapide des caractères indésirables
    if (typeof value === "string") {
      value = value.replace(/[<>]/g, "");
    }

    // Reset code postal si le gouvernorat change
    setFormData(prev => {
      if (name === "birth_governorate") return { ...prev, birth_governorate: value, birth_postal_code_id: "" };
      if (name === "residence_governorate") return { ...prev, residence_governorate: value, residence_postal_code_id: "" };
      return { ...prev, [name]: value };
    });

    // Reset erreur pour ce champ
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  /* ------------------ FILTRES ------------------ */
  const filteredBirthPostalCodes = postalCodes.filter(pc => pc.governorate === formData.birth_governorate);
  const filteredResidencePostalCodes = postalCodes.filter(pc => pc.governorate === formData.residence_governorate);

  /* ------------------ VALIDATION AVANT SUBMIT ------------------ */
  const validate = () => {
    const newErrors = {};

    if (!formData.numero?.trim()) newErrors.numero = "Le numéro de dossier est obligatoire.";
    if (!formData.name?.trim()) newErrors.name = "Le nom est obligatoire.";
    if (!formData.surname?.trim()) newErrors.surname = "Le prénom est obligatoire.";
    if (!formData.birthdate) newErrors.birthdate = "La date de naissance est obligatoire.";
    if (!["homme", "femme"].includes(formData.gender)) newErrors.gender = "Veuillez sélectionner le sexe.";
    if (!formData.phone?.match(/^[24597][0-9]{7}$/)) newErrors.phone = "Numéro tunisien invalide.";
    if (!formData.birth_governorate) newErrors.birth_governorate = "Sélectionner un gouvernorat.";
    if (!formData.birth_postal_code_id) newErrors.birth_postal_code_id = "Sélectionner un code postal.";
    if (!formData.residence_governorate) newErrors.residence_governorate = "Sélectionner un gouvernorat.";
    if (!formData.residence_postal_code_id) newErrors.residence_postal_code_id = "Sélectionner un code postal.";
    if (!formData.doctor_id) newErrors.doctor_id = "Sélectionner un médecin.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Veuillez corriger les erreurs dans le formulaire.");
      return;
    }
    await onSubmit(e);
  };

  /* ------------------ RENDER SELECTS AVEC ERREURS ------------------ */
  const renderSelect = (name, value, options, placeholder, disabled) => (
    <>
      <select
        name={name}
        value={value || ""}
        onChange={handleChange}
        disabled={disabled}
        className={errors[name] ? "error-input" : ""}
      >
        <option value="">{placeholder}</option>
        {options.map(opt => (
          <option key={opt.id} value={opt.id || opt.name}>
            {opt.code_postal || opt.name || `${opt.nom} ${opt.prenom}`}
          </option>
        ))}
      </select>
      {errors[name] && <span className="error-text">{errors[name]}</span>}
    </>
  );

  return (
    <div className="form-card">
      <form onSubmit={handleSubmit} className="form-grid">

        {/* Exemple d'un champ texte avec erreur */}
        <div className="form-group">
          <label>Numéro dossier</label>
          <input
            name="numero"
            value={formData.numero || ""}
            onChange={handleChange}
            disabled={!isNew}
            className={errors.numero ? "error-input" : ""}
            required
          />
          {errors.numero && <span className="error-text">{errors.numero}</span>}
        </div>

        {/* Nom */}
        <div className="form-group">
          <label>Nom</label>
          <input
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            pattern="[A-Za-zÀ-ÿ\s]+"
            disabled={!isEditing}
            className={errors.name ? "error-input" : ""}
            required
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        {/* Gouvernorat naissance */}
        <div className="form-group">
          <label>Gouvernorat naissance</label>
          {renderSelect(
            "birth_governorate",
            formData.birth_governorate,
            governorates,
            "Sélectionner",
            !isEditing
          )}
        </div>

        {/* Code postal naissance */}
        <div className="form-group">
          <label>Code postal naissance</label>
          {renderSelect(
            "birth_postal_code_id",
            formData.birth_postal_code_id,
            filteredBirthPostalCodes,
            formData.birth_governorate ? "Sélectionner" : "Choisir d'abord un gouvernorat",
            !isEditing || !formData.birth_governorate
          )}
        </div>

        {/* Gouvernorat résidence */}
        <div className="form-group">
          <label>Gouvernorat résidence</label>
          {renderSelect(
            "residence_governorate",
            formData.residence_governorate,
            governorates,
            "Sélectionner",
            !isEditing
          )}
        </div>

        {/* Code postal résidence */}
        <div className="form-group">
          <label>Code postal résidence</label>
          {renderSelect(
            "residence_postal_code_id",
            formData.residence_postal_code_id,
            filteredResidencePostalCodes,
            formData.residence_governorate ? "Sélectionner" : "Choisir d'abord un gouvernorat",
            !isEditing || !formData.residence_governorate
          )}
        </div>

        {/* Médecin */}
        <div className="form-group">
          <label>Médecin traitant</label>
          {renderSelect("doctor_id", formData.doctor_id, doctors, "Sélectionner", !isEditing)}
        </div>

        {/* Actions */}
        <div className="form-group full-width">
          {!isEditing ? (
            <button type="button" className="edit-btn" onClick={() => setIsEditing(true)}>
              Modifier
            </button>
          ) : (
            <div className="edit-actions">
              <button type="submit" className="save-btn">{isNew ? "Créer" : "Enregistrer"}</button>
              {!isNew && <button type="button" className="cancel-btn" onClick={onCancel}>Annuler</button>}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}