import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  findMedicalTreatmentByNumeroDossier,
  updateDateProchainePrise,
} from "../../services/ordonnanceService";
import "./Ordonnancedetail.css";

export default function Ordonnancedetail() {
  const { numero } = useParams();

  const [ordonnances, setOrdonnances] = useState([]);
  const [selectedOrd, setSelectedOrd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [quantiteDelivree, setQuantiteDelivree] = useState("");

  const extractOrdonnances = (response) => {
    if (response && response.success && Array.isArray(response.ordonnances)) {
      return response.ordonnances;
    } else if (Array.isArray(response)) {
      return response;
    } else if (response && response.data && Array.isArray(response.data)) {
      return response.data;
    } else if (response && Array.isArray(response.ordonnances)) {
      return response.ordonnances;
    }
    return [];
  };

  useEffect(() => {
    if (!numero) {
      setError("Aucun numéro de dossier fourni");
      setLoading(false);
      return;
    }

    const fetchOrdonnances = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await findMedicalTreatmentByNumeroDossier(numero);
        const ordonnancesData = extractOrdonnances(response);
        setOrdonnances(ordonnancesData);
        setSelectedOrd(ordonnancesData.length > 0 ? ordonnancesData[0] : null);
      } catch (err) {
        setError(err.message || "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchOrdonnances();
  }, [numero]);

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString("fr-FR");
    } catch {
      return "-";
    }
  };

  const calculateNextDate = (quantite) => {
    if (!quantite) return null;
    const nextDate = new Date();
    nextDate.setMonth(nextDate.getMonth() + parseInt(quantite));
    return nextDate;
  };

  const handleSave = async () => {
    if (!quantiteDelivree || !selectedOrd) {
      alert("Veuillez entrer une quantité délivrée");
      return;
    }

    const nextDate = calculateNextDate(quantiteDelivree);
    if (!nextDate) {
      alert("Erreur de calcul de la date");
      return;
    }

    setSaving(true);
    try {
      await updateDateProchainePrise(
        selectedOrd.id,
        nextDate.toISOString().split("T")[0]
      );

      alert("Date prochaine prise mise à jour avec succès !");

      const response = await findMedicalTreatmentByNumeroDossier(numero);
      const ordonnancesData = extractOrdonnances(response);

      setOrdonnances(ordonnancesData);
      setQuantiteDelivree("");

      const updatedOrd = ordonnancesData.find((o) => o.id === selectedOrd.id);
      if (updatedOrd) setSelectedOrd(updatedOrd);
    } catch (err) {
      alert("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="ordonnance-detail-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ordonnance-detail-container">
        <div className="error-box">
          <p className="error-text">{error}</p>
        </div>
      </div>
    );
  }

  if (ordonnances.length === 0) {
    return (
      <div className="ordonnance-detail-container">
        <div className="empty-state">
          <p> Aucune ordonnance pour ce patient</p>
          <small>Vérifiez que des ordonnances existent dans la base de données</small>
        </div>
      </div>
    );
  }

  return (
    <div className="ordonnance-detail-container">

      {/* HEADER */}
      <div className="detail-header">
        <h2 className="detail-title">Détail de l'Ordonnance</h2>
        <span className="patient-badge">Patient: {numero}</span>
      </div>

      {/* SÉLECTION ORDONNANCE */}
      {ordonnances.length > 1 && (
        <div className="ordonnance-selector">
          <label>Sélectionner une ordonnance :</label>
          <select
            value={selectedOrd?.id || ""}
            onChange={(e) => {
              const ord = ordonnances.find(
                (o) => o.id === parseInt(e.target.value)
              );
              setSelectedOrd(ord);
              setQuantiteDelivree("");
            }}
            className="select-ordonnance"
          >
            {ordonnances.map((ord) => (
              <option key={ord.id} value={ord.id}>
                {ord.nom_traitement} - {formatDate(ord.date_prescription)}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* FORMULAIRE */}
      {selectedOrd ? (
        <div className="detail-form">

          <div className="form-group">
            <label className="form-label">Nom du traitement</label>
            <input
              type="text"
              value={selectedOrd.nom_traitement || ""}
              disabled
              className="form-input disabled"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Quantité prescrite</label>
            <input
              type="number"
              value={selectedOrd.quantite_prescrite || ""}
              disabled
              className="form-input disabled"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Date début du traitement</label>
            <input
              type="date"
              value={formatDateForInput(selectedOrd.date_debut_traitement)}
              disabled
              className="form-input disabled"
            />
          </div>

          <div className="form-group form-group-compact">
            <label className="form-label">Date prochaine prise actuelle</label>
            <input
              type="date"
              value={formatDateForInput(selectedOrd.date_prochaine_prise)}
              disabled
              className="form-input disabled"
            />
          </div>

          <div className="form-group form-group-compact highlight">
            <label className="form-label active">
              Quantité délivrée (mois) ⚡
            </label>
            <input
              type="number"
              value={quantiteDelivree}
              onChange={(e) => setQuantiteDelivree(e.target.value)}
              min="1"
              className="form-input active"
              placeholder="Entrer le nombre de mois"
            />
          </div>

          {quantiteDelivree && (
            <div className="calculation-preview">
              <p className="preview-label">✨ Nouvelle date prochaine prise :</p>
              <p className="preview-date">
                {formatDate(calculateNextDate(quantiteDelivree))}
              </p>
            </div>
          )}

          <div className="form-actions">
            <button
              onClick={handleSave}
              disabled={!quantiteDelivree || saving}
              className="btn-save"
            >
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            padding: "20px",
            textAlign: "center",
            background: "#fff3cd",
            borderRadius: "8px",
          }}
        >
          <p style={{ margin: 0, color: "#856404" }}>
             Aucune ordonnance sélectionnée
          </p>
        </div>
      )}
    </div>
  );
}