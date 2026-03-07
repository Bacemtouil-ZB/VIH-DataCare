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
        } catch {
          setDerniersPrises([]);
        }
      } catch (err) {
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
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("fr-FR") : "N/A";

  const getInitials = (nom, prenom) => {
    if (!nom || !prenom) return "??";
    return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
  };

  const getStatutBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "en cours de suivi":
      case "actif":         return "badge-active";
      case "perdu de vue":  return "badge-danger";
      case "en fin de suivi": return "badge-info";
      default:              return "badge-neutral";
    }
  };

  const patientPhotoUrl = useMemo(() => {
    if (!patientData) return null;
    return patientData.photo_url || patientData.photoUrl || patientData.avatar_url || null;
  }, [patientData]);

  if (loading) return (
    <div className="patient-panel">
      <div className="loading-container">
        <div className="spinner" />
        <p>Chargement...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="patient-panel">
      <div className="error-container">
        <p className="error-message">⚠️ {error}</p>
      </div>
    </div>
  );

  if (!patientData) return (
    <div className="patient-panel">
      <div className="empty-state">
        <p className="empty-message">Aucun patient sélectionné</p>
      </div>
    </div>
  );

  const birthdate = patientData.birthdate || patientData.date_naissance;

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
        <h2 className="patient-name">{patientData.surname} {patientData.name}</h2>
        <p className="patient-id">Dossier: {patientData.numero || numero}</p>
      </div>

      <div className="patient-info">
        <div className="info-row">
          <span>Naissance</span>
          <span>{formatDate(birthdate)}</span>
        </div>
        <div className="info-row">
          <span>Âge</span>
          <span>{calculateAge(birthdate)} ans</span>
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

      {derniersPrises.length > 0 && (
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
                <div className="prise-quantite">Qté: {prise.quantite_prescrite}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}