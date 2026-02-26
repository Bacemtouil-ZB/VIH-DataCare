import React from "react";
import "./PrescreptionMedical.css";
const PrescriptionMedical = () => {
  return (
    <div className="medical-page">
      <h2 className="section-title">Prescription Médicale</h2>

      <div className="form-grid">
        <input placeholder="Nom du médicament" />
        <input placeholder="Posologie (ex: 1 cp x 2/j)" />
        <input placeholder="Durée (ex: 30 jours)" />
        <textarea placeholder="Instructions ou commentaires" rows={3}></textarea>
      </div>

      <div className="mt-4">
        <button className="btn-primary">
          Ajouter à la prescription
        </button>
      </div>
    </div>
  );
};

export default PrescriptionMedical;
