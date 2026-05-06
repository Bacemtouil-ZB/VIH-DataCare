import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPatientLeftPanel } from "../../../services/patientServices";
import "./LeftPanel.css";

export default function LeftPanel() {
  const { numero } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!numero) {
      setError("Aucun numéro de dossier fourni");
      setLoading(false);
      return;
    }

    if (numero === "new") {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getPatientLeftPanel(numero);
        if (response?.success && response.data) {
          setData(response.data);
        } else {
          setData(null);
          setError("Patient non trouvé");
        }
      } catch (err) {
        console.error("Erreur chargement left panel:", err);
        setData(null);
        setError(err?.message || "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [numero]);

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("fr-FR");
  };

  const getInitials = (nom, prenom) => {
    if (!nom || !prenom) return "??";
    return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
  };

  const getStatutBadgeClass = (statut) => {
    switch (statut?.toLowerCase()) {
      case "actif":     return "badge-active";
      case "en_retard": return "badge-warning";
      case "perdu_de_vue": return "badge-danger";
      case "recupere":  return "badge-info";
      default:          return "badge-neutral";
    }
  };

  const getStatutLabel = (statut) => {
    switch (statut?.toLowerCase()) {
      case "actif":        return "Actif";
      case "en_retard":    return "En retard";
      case "perdu_de_vue": return "Perdu de vue";
      case "recupere":     return "Récupéré";
      default:             return "En attente";
    }
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
          <p className="error-message">! {error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
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

      {/* ── Header ───────────────────────────────────────── */}
      <div className="patient-header">
        <div className="patient-avatar">
          {getInitials(data.surname, data.name)}
        </div>
        <h2 className="patient-name">
          {data.surname} {data.name}
        </h2>
        <p className="patient-id">Dossier: {data.numero || numero}</p>
      </div>

      {/* ── Infos ────────────────────────────────────────── */}
      <div className="patient-info">

        <div className="info-row">
          <span>Date de naissance</span>
          <span>{formatDate(data.birthdate)}</span>
        </div>

        <div className="info-row">
          <span>Hospitalisation</span>
          <span className={data.hospitalisation === "interne" ? "badge-danger" : "badge-active"}>
            {data.hospitalisation}
          </span>
        </div>

        <div className="info-row">
          <span>Statut</span>
          <span className={getStatutBadgeClass(data.statut_suivi)}>
            {getStatutLabel(data.statut_suivi)}
          </span>
        </div>

        <div className="info-row">
          <span>Dernier traitement</span>
          <span>{data.dernier_traitement ?? "—"}</span>
        </div>

       {/* ── Charge virale ────────────────────────────── */}
<div className="info-row">
  <span>Charge virale</span>
  <span>
    {data.charge_virale?.valeur != null
      ? `${data.charge_virale.valeur} cp/mL`
      : "—"}
  </span>
</div>

{/* ── CD4 ──────────────────────────────────────── */}
<div className="info-row">
  <span>CD4</span>
  <span>
    {data.cd4?.absolu != null
      ? `${data.cd4.absolu} cell/mm³${data.cd4.pourcent != null ? ` (${data.cd4.pourcent}%)` : ""}`
      : "—"}
  </span>
</div>

      </div>
    </div>
  );
}