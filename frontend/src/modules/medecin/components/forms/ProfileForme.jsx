import React from "react";
import "./ProfilForme.css";

export default function ProfilForm({ formData, onChange, onSubmit, isNew }) {
  return (
    <div className="form-card">
      <form onSubmit={onSubmit} className="form-grid">

        <div className="form-group">
          <label>Numéro dossier</label>
          <input
            name="numero"
            value={formData.numero}
            onChange={onChange}
            disabled={!isNew} // bloqué si patient existant
          />
        </div>

        <div className="form-group">
          <label>Nom</label>
          <input
            name="name"
            value={formData.name}
            onChange={onChange}
          />
        </div>

        <div className="form-group">
          <label>Prénom</label>
          <input
            name="surname"
            value={formData.surname}
            onChange={onChange}
          />
        </div>

        <div className="form-group">
          <label>Date de naissance</label>
          <input
            type="date"
            name="birthdate"
            value={formData.birthdate}
            onChange={onChange}
          />
        </div>

        <div className="form-group">
          <label>Sexe</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={onChange}
          >
            <option value="">Sélectionner</option>
            <option value="Homme">Homme</option>
            <option value="Femme">Femme</option>
          </select>
        </div>

        <div className="form-group">
          <label>Ville de naissance</label>
          <input
            name="city_of_birth"
            value={formData.city_of_birth}
            onChange={onChange}
          />
        </div>

        <div className="form-group">
          <label>Ville de résidence</label>
          <input
            name="city_of_residence"
            value={formData.city_of_residence}
            onChange={onChange}
          />
        </div>

        <div className="form-group">
          <label>Téléphone</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={onChange}
          />
        </div>

        <div className="form-group full-width">
          <label>Adresse</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={onChange}
          />
        </div>

        <div className="form-group">
          <label>Hospitalisation</label>
          <select
            name="hospitalisation"
            value={formData.hospitalisation}
            onChange={onChange}
          >
            <option value="externe">Externe</option>
            <option value="interne">Interne</option>
          </select>
        </div>

        <div className="form-group full-width">
          <button type="submit" className="save-btn">
            {isNew ? "Créer" : "Mettre à jour"}
          </button>
        </div>

      </form>
    </div>
  );
}