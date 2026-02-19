import React from "react";
import "./ProfilForme.css";

export default function ProfilForm({
  formData,
  onChange,
  onSubmit,
  isNew,
  isEditing,
  setIsEditing,
  onCancel
}) {
  return (
    <div className="form-card">
      <form onSubmit={onSubmit} className="form-grid">

        <div className="form-group">
          <label>Numéro dossier</label>
          <input
            name="numero"
            value={formData.numero}
            onChange={onChange}
            disabled={!isNew}
            required
          />
        </div>

        <div className="form-group">
          <label>Hospitalisation</label>
          <select
            name="hospitalisation"
            value={formData.hospitalisation}
            onChange={onChange}
            disabled={!isEditing}
          >
            <option value="externe">Externe</option>
            <option value="interne">Interne</option>
          </select>
        </div>

        <div className="form-group">
          <label>Nom</label>
          <input
            name="name"
            value={formData.name}
            onChange={onChange}
            pattern="[A-Za-zÀ-ÿ\s]+"
            disabled={!isEditing}
            required
          />
        </div>

        <div className="form-group">
          <label>Prénom</label>
          <input
            name="surname"
            value={formData.surname}
            onChange={onChange}
            pattern="[A-Za-zÀ-ÿ\s]+"
            disabled={!isEditing}
            required
          />
        </div>

        <div className="form-group">
          <label>Date de naissance</label>
          <input
            type="date"
            name="birthdate"
            value={formData.birthdate}
            onChange={onChange}
            disabled={!isEditing}
          />
        </div>

        <div className="form-group">
          <label>Sexe</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={onChange}
            disabled={!isEditing}
          >
            <option value="">Sélectionner</option>
            <option value="Homme">Homme</option>
            <option value="Femme">Femme</option>
          </select>
        </div>

        <div className="form-group">
          <label>Téléphone</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={onChange}
            pattern="[0-9]{8}"
            title="Le numéro doit contenir 8 chiffres"
            disabled={!isEditing}
          />
        </div>

        <div className="form-group full-width">
          <label>Adresse</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={onChange}
            disabled={!isEditing}
          />
        </div>

        {!isNew && (
          <div className="form-group full-width">
            <label>Dernière modification</label>
            <input
              value={`${formData.updated_by_name || "-"} - ${formData.updated_at || "-"}`}
              disabled
            />
          </div>
        )}

        <div className="form-group full-width">
          {!isEditing ? (
            <button
              type="button"
              className="edit-btn"
              onClick={() => setIsEditing(true)}
            >
               Modifier
            </button>
          ) : (
            <div className="edit-actions">
              <button type="submit" className="save-btn">
                 {isNew ? "Créer" : "Enregistrer"}
              </button>

              {!isNew && (
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={onCancel}
                >
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