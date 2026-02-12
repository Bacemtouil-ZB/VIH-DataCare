import "./ProfilPage.css";
import { useState } from "react";

export default function ProfilPage() {

  const [formData, setFormData] = useState({
    numero: "",
    name: "",
    surname: "",
    birthdate: "",
    gender: "",
    city_of_birth: "",
    city_of_residence: "",
    phone: "",
    address: "",
    hospitalisation: "non",
  });

  // 🔹 Gestion changement champs
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔹 Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Données envoyées :", formData);

    // Ici plus tard :
    // createPatient(formData) ou updatePatient(formData)
  };

  return (
    <div className="medical-page">

      <div className="page-header">
        <h2>Profil du patient</h2>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit} className="form-grid">

          <div className="form-group">
            <label>Numéro dossier</label>
            <input
              name="numero"
              value={formData.numero}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Nom</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Prénom</label>
            <input
              name="surname"
              value={formData.surname}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Date de naissance</label>
            <input
              type="date"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Sexe</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
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
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Ville de résidence</label>
            <input
              name="city_of_residence"
              value={formData.city_of_residence}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Téléphone</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group full-width">
            <label>Adresse</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Hospitalisation</label>
            <select
              name="hospitalisation"
              value={formData.hospitalisation}
              onChange={handleChange}
            >
              <option value="non">Non hospitalisé</option>
              <option value="oui">Hospitalisé</option>
            </select>
          </div>

          <div className="form-group full-width">
            <button type="submit" className="save-btn">
              Enregistrer
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
  