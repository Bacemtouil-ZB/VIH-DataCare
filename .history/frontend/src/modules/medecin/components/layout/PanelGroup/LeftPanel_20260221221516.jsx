import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPatientByNumero } from "../../../services/patientServices";
import { getThreeLastPrise } from "../../../services/ordonnancesService";
import "./LeftPanel.css";

export default function LeftPanel() {
  const { numero } = useParams(); 
  
  const [patientData, setPatientData] = useState(null);
  const [derniersPrises, setDerniersPrises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (!numero) {
      setError("Aucun numéro de dossier fourni");
      setLoading(false);
      return;
    }
    if (numero === "new") {
      setIsNewPatient(true);
      setPatientData(null);
      setLoading(false);
      return;
    }

    const fetchPatientData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Récupérer les données du patient
        const patientResponse = await getPatientByNumero(numero);
        if (patientResponse.success && patientResponse.patient) {
          setPatientData(patientResponse.patient);
        } else {
          setError("Patient non trouvé");
        }

        // Récupérer les 3 dernières prises
        try {
          const prisesResponse = await getThreeLastPrise(numero);
          if (prisesResponse.success && prisesResponse.prises) {
            setDerniersPrises(prisesResponse.prises);
          }
        } catch (err) {
          console.log("Pas de prises trouvées:", err);
        }

      } catch (err) {
        console.error("Erreur chargement patient:", err);
        setError(err.message || "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [numero]);

  const calculateAge = (dateNaissance) => {
    if (!dateNaissance) return 'N/A';
    const birth = new Date(dateNaissance);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const getInitials = (nom, prenom) => {
    if (!nom || !prenom) return '??';
    return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
  };

  const getStatutBadgeClass = (statut) => {
    switch (statut?.toLowerCase()) {
      case 'en cours de suivi':
      case 'actif':
        return 'badge-active';
      case 'perdu de vue':
        return 'badge-warning';
      case 'en fin de suivi':
        return 'badge-info';
      case 'décédé':
        return 'badge-danger';
      default:
        return 'badge-neutral';
    }
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

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
          <p className="error-message">⚠️ {error}</p>
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
      <div className="patient-header">
        <div className="photo-upload-container">
          {imagePreview ? (
            <div className="patient-photo-wrapper">
              <img src={imagePreview} alt="Patient" className="patient-photo" />
              <button onClick={handleRemoveImage} className="remove-photo-btn" title="Supprimer la photo">
                ✕
              </button>
            </div>
          ) : (
            <div className="patient-avatar">
              {getInitials(patientData.name, patientData.surname)}
            </div>
          )}
          
          <label htmlFor="photo-upload" className="upload-photo-btn">
             {imagePreview ? 'Changer' : 'Ajouter'} photo
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
        <p className="patient-id">Dossier: {patientData.numero || numero}</p>
      </div>

      <div className="patient-info">
        <div className="info-row">
          <span>Date de naissance</span>
          <span>{formatDate(patientData.birthdate || patientData.date_naissance)}</span>
        </div>

        <div className="info-row">
          <span>Âge</span>
          <span>{calculateAge(patientData.birthdate || patientData.date_naissance)} ans</span>
        </div>

        {patientData.phone && (
          <div className="info-row">
            <span>Téléphone</span>
            <span>{patientData.phone}</span>
          </div>
        )}

        <div className="info-row">
          <span>Hospitalisation</span>
          <span className={patientData.hospitalisation === 'Oui' ? 'badge-warning' : 'badge-neutral'}>
            {patientData.hospitalisation || 'Non'}
          </span>
        </div>

        <div className="info-row">
          <span>Statut</span>
          <span className={getStatutBadgeClass(patientData.statut)}>
            {patientData.statut || 'Actif'}
          </span>
        </div>
      </div>

      {derniersPrises && derniersPrises.length > 0 && (
        <div className="dernieres-prises">
          <h3 className="section-title">Dernières prises</h3>
          <div className="prises-list">
            {derniersPrises.map((prise, index) => (
              <div key={prise.id || index} className="prise-item">
                <div className="prise-header">
                  <span className="prise-numero">#{index + 1}</span>
                  <span className="prise-date">{formatDate(prise.date_prochaine_prise)}</span>
                </div>
                <div className="prise-traitement">
                  {prise.nom_traitement}
                </div>
                <div className="prise-quantite">
                  Quantité: {prise.quantite_prescrite}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="patient-status">
        <span className={getStatutBadgeClass(patientData.statut)}>
          {patientData.statut || 'Statut inconnu'}
        </span>
      </div>
    </div>
  );
}