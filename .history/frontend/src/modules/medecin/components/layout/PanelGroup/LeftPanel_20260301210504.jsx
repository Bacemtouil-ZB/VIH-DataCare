import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPatientByNumero } from "../../../../../shared/services/patientService";
import { getThreeLastPrise, findMedicalTreatmentByNumeroDossier } from "../../../services/ordonnancesService";
import "./LeftPanel.css";

/**
 * ==========================================
 * LEFT PANEL MÉDECIN - MAPPING CORRIGÉ
 * ==========================================
 */

export default function LeftPanel() {
  const { numero } = useParams(); 
  
  const [patientData, setPatientData] = useState(null);
  const [derniersPrises, setDerniersPrises] = useState([]);
  const [traitementEnCours, setTraitementEnCours] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);


  useEffect(() => {
    console.log("🔍 LeftPanel - Numéro patient:", numero);

    if (!numero) {
      setError("Aucun numéro de dossier fourni");
      setLoading(false);
      return;
    }
    if (numero === "new") {
  
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
          console.log("✅ Données patient:", patientResponse.patient);
          setPatientData(patientResponse.patient);
        } else {
          setError("Patient non trouvé");
        }

        // Récupérer 3 dernières prises
        try {
          console.log("📡 Chargement dernières prises...");
          const prisesResponse = await getThreeLastPrise(numero);
          if (prisesResponse.success && prisesResponse.prises) {
            setDerniersPrises(prisesResponse.prises);
          }
        } catch (err) {
          console.log("Pas de prises trouvées:", err);
        }

      } catch (err) {
        console.error("❌ Erreur chargement:", err);
        setError(err.message || "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [numero]);

  // ==========================================
  // UTILITAIRES - MAPPING CORRIGÉ
  // ==========================================

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

  const getStatutClass = (statut) => {
    switch (statut?.toLowerCase()) {
      case 'en cours de suivi':
      case 'actif':
        return 'statut-actif';
      case 'perdu de vue':
        return 'statut-warning';
      case 'en fin de suivi':
        return 'statut-info';
      case 'décédé':
        return 'statut-danger';
      default:
        return 'statut-neutral';
    }
  };
  
  // ==========================================
  // PHOTO
  // ==========================================

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

  // ==========================================
  // ÉTATS
  // ==========================================

  if (loading) {
    return (
      <div className="left-panel">
        <div className="panel-loading">
          <div className="spinner"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="left-panel">
        <div className="panel-error">
          <p>⚠️ {error}</p>
        </div>
      </div>
    );
  }

  if (!patientData) {
    return (
      <div className="left-panel">
        <div className="panel-empty">
          <p>Aucun patient sélectionné</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDU - UTILISE LES BONS CHAMPS BDD
  // ==========================================

  return (
    <div className="left-panel">
      {/* PHOTO */}
      <div className="panel-header">
        <div className="photo-container">
          {imagePreview ? (
            <div className="photo-wrapper">
              <img src={imagePreview} alt="Patient" className="photo-img" />
              <button onClick={handleRemoveImage} className="photo-remove">✕</button>
            </div>
          ) : (
            <div className="photo-avatar">
              {getInitials(patientData.name, patientData.surname)}
            </div>
          )}
          
          <label htmlFor="photo-upload" className="photo-btn">
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
        
        <h2 className="patient-fullname">
          {patientData.surname} {patientData.name}
        </h2>
        <p className="patient-numero">Dossier: {patientData.numero || numero}</p>
      </div>

      {/* INFORMATIONS */}
      <div className="panel-info">
        {/* Nom */}
        <div className="info-item">
          <span className="info-label">Nom</span>
          <span className="info-value">{patientData.name || 'N/A'}</span>
        </div>

        {/* Prénom */}
        <div className="info-item">
          <span className="info-label">Prénom</span>
          <span className="info-value">{patientData.surname || 'N/A'}</span>
        </div>

        {/* Date de naissance - MAPPING CORRIGÉ */}
        <div className="info-item">
          <span className="info-label">Date de naissance</span>
          <span className="info-value">{formatDate(patientData.birthdate)}</span>
        </div>

        {/* Âge - MAPPING CORRIGÉ */}
        <div className="info-item">
          <span className="info-label">Âge</span>
          <span className="info-value">{calculateAge(patientData.birthdate)} ans</span>
        </div>

        {/* Téléphone */}
        <div className="info-item">
          <span className="info-label">Téléphone</span>
          <span className="info-value">{patientData.phone || 'Non renseigné'}</span>
        </div>

        {/* Genre - MAPPING CORRIGÉ */}
        <div className="info-item">
          <span className="info-label">Genre</span>
          <span className="info-value">{patientData.gender || 'Non renseigné'}</span>
        </div>

        {/* Ville de résidence - MAPPING CORRIGÉ */}
        <div className="info-item">
          <span className="info-label">Ville</span>
          <span className="info-value">{patientData.city_of_residence || 'Non renseigné'}</span>
        </div>

        {/* Traitement en cours */}
        <div className="info-item">
          <span className="info-label">Traitement en cours</span>
          {traitementEnCours ? (
            <span className="info-value traitement-badge">
              {traitementEnCours.nom_traitement}
            </span>
          ) : (
            <span className="info-value secondary">Aucun</span>
          )}
        </div>

        {/* Hospitalisation */}
        <div className="info-item">
          <span className="info-label">Hospitalisation</span>
          <span className={`info-value ${patientData.hospitalisation === 'Oui' ? 'hosp-oui' : 'hosp-non'}`}>
            {patientData.hospitalisation || 'Non'}
          </span>
        </div>
      </div>

      {/* DERNIÈRES PRISES */}
      <div className="panel-prises">
        <h3 className="prises-title">3 Dernières prises</h3>
        
        {derniersPrises && derniersPrises.length > 0 ? (
          <div className="prises-list">
            {derniersPrises.map((prise, index) => (
              <div key={prise.id || index} className="prise-card">
                <div className="prise-top">
                  <span className="prise-num">Prise #{index + 1}</span>
                  <span className="prise-date">{formatDate(prise.date_prochaine_prise)}</span>
                </div>
                <div className="prise-nom">{prise.nom_traitement}</div>
                <div className="prise-qte">Quantité: {prise.quantite_prescrite}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="prises-empty">
            Aucune prise enregistrée
          </div>
        )}
      </div>
    </div>
  );
}