import "./VihForm.css";
import { useState } from "react";

export default function VihForm() {

  const [formData, setFormData] = useState({
    mode_contamination: "",
    type_depistage: "",
    circonstance_decouverte: "",
    date_derniere_negative: "",
    date_contamination: "",
    date_vih_positif: "",
    stade_cdc: "",
    debut_stade_c: "",
    profil_seroconversion: false,
    typage_hla_b5701: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Fiche VIH :", formData);
    // Ici appeler API createVih(formData) ou updateVih(formData)
  };

  return (
    <div className="medical-page">

      <div className="page-header">
        <h2>Fiche VIH du patient</h2>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit} className="form-grid">

          <div className="form-group">
            <label>Mode de contamination</label>
            <input
              name="mode_contamination"
              value={formData.mode_contamination}
              onChange={handleChange}
              placeholder="Ex: Sexuelle, Mère-Enfant..."
            />
          </div>

          <div className="form-group">
            <label>Type de dépistage</label>
            <input
              name="type_depistage"
              value={formData.type_depistage}
              onChange={handleChange}
              placeholder="Ex: Routinier, Symptômes..."
            />
          </div>

          <div className="form-group full-width">
            <label>Circonstance de découverte</label>
            <input
              name="circonstance_decouverte"
              value={formData.circonstance_decouverte}
              onChange={handleChange}
              placeholder="Ex: Consultation, dépistage volontaire..."
            />
          </div>

          <div className="form-group">
            <label>Date dernière négative</label>
            <input
              type="date"
              name="date_derniere_negative"
              value={formData.date_derniere_negative}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Date de contamination</label>
            <input
              type="date"
              name="date_contamination"
              value={formData.date_contamination}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Date VIH positif</label>
            <input
              type="date"
              name="date_vih_positif"
              value={formData.date_vih_positif}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Stade CDC</label>
            <input
              name="stade_cdc"
              value={formData.stade_cdc}
              onChange={handleChange}
              placeholder="Ex: A, B, C"
            />
          </div>

          <div className="form-group">
            <label>Début stade C</label>
            <input
              type="date"
              name="debut_stade_c"
              value={formData.debut_stade_c}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="profil_seroconversion"
                checked={formData.profil_seroconversion}
                onChange={handleChange}
              />
              Profil de séroconversion
            </label>
          </div>

          <div className="form-group">
            <label>Typage HLA-B5701</label>
            <input
              name="typage_hla_b5701"
              value={formData.typage_hla_b5701}
              onChange={handleChange}
              placeholder="Ex: Positif, Négatif"
            />
          </div>

          <div className="form-group full-width">
            <button type="submit" className="save-btn">
              Enregistrer la fiche VIH
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
