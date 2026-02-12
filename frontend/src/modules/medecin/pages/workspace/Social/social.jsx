import "./SocialForm.css";
import { useState } from "react";

export default function SocialForm() {

  const [formData, setFormData] = useState({
    remarque: "",
    niveau_etude: "",
    nombre_enfants: "",
    ressources: "",
    activite_professionnelle: "",
    probleme: "",
    acces_soins: "",
    situation_social: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Fiche sociale :", formData);
    // Ici appeler API createSocial(formData) ou updateSocial(formData)
  };

  return (
    <div className="medical-page">

      <div className="page-header">
        <h2>Fiche sociale du patient</h2>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit} className="form-grid">

          <div className="form-group full-width">
            <label>Remarques générales</label>
            <textarea
              name="remarque"
              value={formData.remarque}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Niveau d'études</label>
            <input
              name="niveau_etude"
              value={formData.niveau_etude}
              onChange={handleChange}
              placeholder="Primaire, Secondaire, Universitaire..."
            />
          </div>

          <div className="form-group">
            <label>Nombre d'enfants</label>
            <input
              type="number"
              name="nombre_enfants"
              value={formData.nombre_enfants}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="form-group full-width">
            <label>Ressources financières</label>
            <textarea
              name="ressources"
              value={formData.ressources}
              onChange={handleChange}
              placeholder="Détails des revenus, aides, etc."
            />
          </div>

          <div className="form-group full-width">
            <label>Activité professionnelle</label>
            <input
              name="activite_professionnelle"
              value={formData.activite_professionnelle}
              onChange={handleChange}
              placeholder="Ex: Enseignant, Employé, Autre..."
            />
          </div>

          <div className="form-group full-width">
            <label>Problèmes rencontrés</label>
            <textarea
              name="probleme"
              value={formData.probleme}
              onChange={handleChange}
              placeholder="Ex: Logement, transport, santé..."
            />
          </div>

          <div className="form-group full-width">
            <label>Accès aux soins</label>
            <textarea
              name="acces_soins"
              value={formData.acces_soins}
              onChange={handleChange}
              placeholder="Facilité, difficultés rencontrées..."
            />
          </div>

          <div className="form-group">
            <label>Situation familiale</label>
            <select
              name="situation_social"
              value={formData.situation_social}
              onChange={handleChange}
            >
              <option value="">Sélectionner</option>
              <option value="Célibataire">Célibataire</option>
              <option value="Marié(e)">Marié(e)</option>
              <option value="Divorcé(e)">Divorcé(e)</option>
              <option value="Veuf/Veuve">Veuf/Veuve</option>
            </select>
          </div>

          <div className="form-group full-width">
            <button type="submit" className="save-btn">
              Enregistrer la fiche sociale
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
