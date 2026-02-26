import "./ProfilForme.css";
import { toast } from "react-toastify";
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

  /* ------------------ HANDLE CHANGE ------------------ */
  const handleChange = (e) => {
    let { name, value } = e.target;

    if (typeof value === "string") {
      value = value.replace(/[<>]/g, "");
    }

    setFormData(prev => {
      if (name === "birth_governorate") {
        return { ...prev, birth_governorate: value, birth_postal_code_id: "" };
      }
      if (name === "residence_governorate") {
        return { ...prev, residence_governorate: value, residence_postal_code_id: "" };
      }
      return { ...prev, [name]: value };
    });
  };

  /* ------------------ FILTRES ------------------ */
  // birth_governorate et residence_governorate stockent le NAME du gouvernorat
 const filteredBirthPostalCodes = postalCodes.filter(
  pc => pc.governorate === formData.birth_governorate
);

const filteredResidencePostalCodes = postalCodes.filter(
  pc => pc.governorate === formData.residence_governorate
);
  return (
    <div className="form-card">
      <form onSubmit={onSubmit} className="form-grid">

        {/* Numéro dossier */}
        <div className="form-group">
          <label>Numéro dossier</label>
          <input
            name="numero"
            value={formData.numero || ""}
            onChange={(e) => {
              let value = e.target.value.replace(/[<>]/g, "");

              // Supprimer F- si utilisateur tente de le mettre manuellement
              value = value.replace(/^F-/, "");

              // Autoriser uniquement chiffres + -
              value = value.replace(/[^0-9-]/g, "");

              // Format attendu: 001-2025
              const regex = /^(\d{3})-(\d{4})$/;
              const match = value.match(regex);

              if (match) {
                const year = parseInt(match[2], 10);
                const currentYear = new Date().getFullYear();

                if (year > currentYear) {
                  toast.error(`L'année doit être ≤ ${currentYear}`);
                }
              }

              setFormData(prev => ({ ...prev, numero: value }));
            }}
            disabled={!isNew}
            required
            placeholder="Ex: 001-2025"
          />

          {/* Validation affichée */}
          {formData.numero &&
            !/^\d{3}-\d{4}$/.test(
              formData.numero.replace(/^F-/, "")
            ) && (
              <span className="error-text">
                Format invalide : ex. 001-2025
              </span>
          )}
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
            required
          />
        </div>

        {/* Prénom */}
        <div className="form-group">
          <label>Prénom</label>
          <input
            name="surname"
            value={formData.surname || ""}
            onChange={handleChange}
            pattern="[A-Za-zÀ-ÿ\s]+"
            disabled={!isEditing}
            required
          />
        </div>

        {/* Date naissance */}
        <div className="form-group">
          <label>Date de naissance</label>
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

        {/* Sexe */}
        <div className="form-group">
          <label>Sexe</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="gender"
                value="homme"
                checked={formData.gender === "homme"}
                onChange={handleChange}
                disabled={!isEditing}
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
              />
              Femme
            </label>
          </div>
        </div>

        {/* Téléphone */}
        <div className="form-group">
          <label>Téléphone</label>
          <input
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            pattern="^[24597][0-9]{7}$"
            title="Numéro tunisien invalide (ex: 20123456)"
            disabled={!isEditing}
            required
          />
        </div>

        {/* Gouvernorat naissance */}
        <div className="form-group">
          <label>Gouvernorat naissance</label>
          <select
            name="birth_governorate"
            value={formData.birth_governorate || ""}
            onChange={handleChange}
            disabled={!isEditing}
            required
          >
            <option value="">Sélectionner</option>
            {governorates.map((g) => (
              <option key={g.id} value={g.name}>{g.name}</option>
            ))}
          </select>
        </div>

        {/* Code postal naissance */}
        <div className="form-group">
          <label>Code postal naissance</label>
          <select
            name="birth_postal_code_id"
            value={formData.birth_postal_code_id || ""}
            onChange={handleChange}
            disabled={!isEditing || !formData.birth_governorate}
            required
          >
            <option value="">
              {formData.birth_governorate ? "Sélectionner" : "Choisir d'abord un gouvernorat"}
            </option>
            {filteredBirthPostalCodes.map((pc) => (
              <option key={pc.id} value={pc.id}>{pc.code_postal}</option>
            ))}
          </select>
        </div>

        {/* Gouvernorat résidence */}
        <div className="form-group">
          <label>Gouvernorat résidence</label>
          <select
            name="residence_governorate"
            value={formData.residence_governorate || ""}
            onChange={handleChange}
            disabled={!isEditing}
            required
          >
            <option value="">Sélectionner</option>
            {governorates.map((g) => (
              <option key={g.id} value={g.name}>{g.name}</option>
            ))}
          </select>
        </div>

        {/* Code postal résidence */}
        <div className="form-group">
          <label>Code postal résidence</label>
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
            {filteredResidencePostalCodes.map((pc) => (
              <option key={pc.id} value={pc.id}>{pc.code_postal}</option>
            ))}
          </select>
        </div>

        {/* Médecin */}
        <div className="form-group">
          <label>Médecin traitant</label>
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
        </div>

        {/* Remarques */}
        <div className="form-group full-width">
          <label>Remarques</label>
          <textarea
            name="remarks"
            value={formData.remarks || ""}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        {/* Actions */}
        <div className="form-group full-width">
          {!isEditing ? (
            <button type="button" className="edit-btn" onClick={() => setIsEditing(true)}>
              Modifier
            </button>
          ) : (
            <div className="edit-actions">
              <button type="submit" className="save-btn">
                {isNew ? "Créer" : "Enregistrer"}
              </button>
              {!isNew && (
                <button type="button" className="cancel-btn" onClick={onCancel}>
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