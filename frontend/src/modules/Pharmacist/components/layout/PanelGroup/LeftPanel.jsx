import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPatientByNumero } from "../../../services/patientService";
import { getThreeLastPrise } from "../../../services/ordonnanceService";
import "./LeftPanel.css";

export default function LeftPanel() {
  const { numero } = useParams();

  const [patientData, setPatientData] = useState(null);
  const [derniersPrises, setDerniersPrises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const calculateAge = (birthdate) => {
    if (!birthdate) return "N/A";
    const birth = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("fr-FR");
  };

  const getInitials = (name, surname) => {
    if (!name && !surname) return "??";
    const first = surname ? surname.charAt(0) : "";
    const second = name ? name.charAt(0) : "";
    return `${first}${second}`.toUpperCase() || "??";
  };

  const getStatutBadgeClass = (statut) => {
    switch (statut?.toLowerCase()) {
      case "en cours de suivi":
        return "badge-active";
      case "perdu de vue":
        return "badge-warning";
      case "en fin de suivi":
        return "badge-info";
      case "décédé":
      case "decede":
        return "badge-danger";
      default:
        return "badge-neutral";
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  useEffect(() => {
    if (!numero) return;

    const fetchPatientData = async () => {
      try {
        setLoading(true);
        setError(null);

        const patientResponse = await getPatientByNumero(numero);

        if (patientResponse.success && patientResponse.patient) {
          const patient =
            patientResponse.patient?.patient || patientResponse.patient;
          setPatientData(patient);
        }

        const prisesResponse = await getThreeLastPrise(numero);
        if (prisesResponse) {
          const prises =
            prisesResponse.prises ||
            (Array.isArray(prisesResponse) ? prisesResponse : []);
          setDerniersPrises(prises);
        }
      } catch (err) {
        setError(err.message || "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [numero]);

  if (loading) {
    return (
      <div className="patient-panel">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="patient-panel">
        <div className="error-container">
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  if (!patientData) {
    return (
      <div className="patient-panel">
        <div className="empty-state">
          <p className="empty-message">Aucun patient sélectionné</p>
        </div>
      </div>
    );
  }

  return (
    <div className="patient-panel">

      {/* HEADER */}
      <div className="patient-header">
        <div className="photo-upload-container">
          {imagePreview ? (
            <div className="patient-photo-wrapper">
              <img src={imagePreview} alt="Patient" className="patient-photo" />
              <button
                onClick={handleRemoveImage}
                className="remove-photo-btn"
                title="Supprimer la photo"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="patient-avatar">
              {getInitials(patientData.name, patientData.surname)}
            </div>
          )}

          <label htmlFor="photo-upload" className="upload-photo-btn">
            📷 {imagePreview ? "Changer" : "Ajouter"} photo
          </label>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="photo-input"
          />
        </div>

        <h2 className="patient-name">
          {patientData.surname} {patientData.name}
        </h2>
        <p className="patient-id">
          Dossier: {patientData.numero || patientData.numero_dossier}
        </p>
      </div>

      {/* INFORMATIONS */}
      <div className="patient-info">
        <div className="info-row">
          <span>Date de naissance</span>
          <span>{formatDate(patientData.birthdate)}</span>
        </div>

        <div className="info-row">
          <span>Âge</span>
          <span>{calculateAge(patientData.birthdate)} ans</span>
        </div>

        <div className="info-row">
          <span>Genre</span>
          <span>{patientData.gender || "N/A"}</span>
        </div>

        <div className="info-row">
          <span>Ville</span>
          <span>
            {patientData.city_of_residence || patientData.city_of_birth || "N/A"}
          </span>
        </div>
        <div className="info-row">
          <span>Statut</span>
          <span className={getStatutBadgeClass(patientData.statut)}>
            {patientData.statut || "N/A"}
          </span>
        </div>

        <div className="info-row">
          <span>Dernière visite</span>
          <span>{formatDate(patientData.last_visit_date)}</span>
        </div>
      </div>

      {/* 3 DERNIÈRES PRISES */}
      {derniersPrises && derniersPrises.length > 0 && (
        <div className="dernieres-prises">
          <h3 className="section-title">Dernières prises</h3>
          <div className="prises-list">
            {derniersPrises.map((prise, index) => (
              <div key={prise.id || index} className="prise-item">
                <div className="prise-header">
                  <span className="prise-numero">#{index + 1}</span>
                  <span className="prise-date">
                    {formatDate(prise.date_prochaine_prise)}
                  </span>
                </div>
                <div className="prise-traitement">{prise.nom_traitement}</div>
                <div className="prise-quantite">
                  Quantité: {prise.quantite_prescrite}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BADGE STATUT */}
      <div className="patient-status">
        <span className={getStatutBadgeClass(patientData.statut)}>
          {patientData.statut || "Statut inconnu"}
        </span>
      </div>
    </div>
  );
}