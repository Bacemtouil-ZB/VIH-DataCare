import { useState, useEffect, useMemo } from "react";
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

  useEffect(() => {
    if (!numero) {
      setError("Aucun numéro de dossier fourni");
      setLoading(false);
      return;
    }

    // Creating a new patient: left panel shows empty state
    if (numero === "new") {
      setPatientData(null);
      setDerniersPrises([]);
      setError(null);
      setLoading(false);
      return;
    }

    const fetchPatientData = async () => {
      try {
        setLoading(true);
        setError(null);

        const patientResponse = await getPatientByNumero(numero);
        if (patientResponse?.success && patientResponse.patient) {
          setPatientData(patientResponse.patient);
        } else {
          setPatientData(null);
          setError("Patient non trouvé");
        }

        try {
          const prisesResponse = await getThreeLastPrise(numero);
          if (prisesResponse?.success && Array.isArray(prisesResponse.prises)) {
            setDerniersPrises(prisesResponse.prises);
          } else {
            setDerniersPrises([]);
          }
        } catch (err) {
          // Not fatal (patient can exist without prises)
          setDerniersPrises([]);
          console.log("Pas de prises trouvées:", err);
        }
      } catch (err) {
        console.error("Erreur chargement patient:", err);
        setPatientData(null);
        setDerniersPrises([]);
        setError(err?.message || "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [numero]);

  const calculateAge = (dateNaissance) => {
    if (!dateNaissance) return "N/A";
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
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("fr-FR");
  };

  // nom = surname, prenom = name
  const getInitials = (nom, prenom) => {
    if (!nom || !prenom) return "??";
    return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
  };

  const getStatutBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "en cours de suivi":
      case "actif":
        return "badge-active";
      case "perdu de vue":
        return "badge-danger";
      case "en fin de suivi":
        return "badge-info";
      default:
        return "badge-neutral";
    }
  };

  // Mobile-first logic: photo comes from backend (stored as URL or derived from photo_key)
  const patientPhotoUrl = useMemo(() => {
    if (!patientData) return null;

    // Accept a few possible field names to be future-proof
    return (
      patientData.photo_url ||
      patientData.photoUrl ||
      patientData.avatar_url ||
      patientData.avatarUrl ||
      null
    );
  }, [patientData]);

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
          <p className="error-message">! {error}</p>
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
          {patientPhotoUrl ? (
            <div className="patient-photo-wrapper">
              <img src={patientPhotoUrl} alt="Patient" className="patient-photo" />
            </div>
          ) : (
            <div className="patient-avatar">
              {getInitials(patientData.surname, patientData.name)}
            </div>
          )}
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
          <span className={patientData.hospitalisation === "interne" ? "badge-danger" : "badge-active"}>
            {patientData.hospitalisation}
          </span>
        </div>

        <div className="info-row">
          <span>Statut</span>
          <span className={getStatutBadgeClass(patientData.status)}>
            {patientData.status || "Actif"}
          </span>
        </div>
      </div>

      {Array.isArray(derniersPrises) && derniersPrises.length > 0 && (
        <div className="dernieres-prises">
          <h3 className="section-title">Dernières prises</h3>
          <div className="prises-list">
            {derniersPrises.map((prise, index) => (
              <div key={prise.id || index} className="prise-item">
                <div className="prise-header">
                  <span className="prise-numero">#{index + 1}</span>
                  <span className="prise-date">{formatDate(prise.date_prochaine_prise)}</span>
                </div>
                <div className="prise-traitement">{prise.nom_traitement}</div>
                <div className="prise-quantite">Quantité: {prise.quantite_prescrite}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
