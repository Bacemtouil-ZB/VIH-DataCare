import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  findMedicalTreatmentByNumeroDossier,
  updateDateProchainePrise,
} from "../../../services/ordonnanceService";
import "./Ordonnancedetail.css";

export default function Ordonnancedetail() {
  const { numero } = useParams();

  const [ordonnances, setOrdonnances] = useState([]);
  const [selectedOrd, setSelectedOrd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [quantiteDelivree, setQuantiteDelivree] = useState("");

  const loadOrdonnances = async () => {
    const response = await findMedicalTreatmentByNumeroDossier(numero);
    const ordonnancesData = Array.isArray(response?.ordonnances) ? response.ordonnances : [];
    setOrdonnances(ordonnancesData);
    if (ordonnancesData.length > 0) {
      setSelectedOrd((prev) => {
        if (!prev) return ordonnancesData[0];
        return ordonnancesData.find((o) => o.id === prev.id) || ordonnancesData[0];
      });
    } else {
      setSelectedOrd(null);
    }
  };

  useEffect(() => {
    if (!numero) {
      setError("Aucun numero de dossier fourni");
      setLoading(false);
      return;
    }

    const fetchOrdonnances = async () => {
      setLoading(true);
      setError(null);
      try {
        await loadOrdonnances();
      } catch (err) {
        console.error("Erreur:", err);
        setError(err?.message || err?.error || "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchOrdonnances();
  }, [numero]);

  const calculateNextDate = (quantite) => {
    if (!quantite) return null;
    const today = new Date();
    const moisAjoutes = parseInt(quantite, 10);
    if (Number.isNaN(moisAjoutes) || moisAjoutes <= 0) return null;
    const nextDate = new Date(today);
    nextDate.setMonth(nextDate.getMonth() + moisAjoutes);
    return nextDate;
  };

  const handleSave = async () => {
    if (!quantiteDelivree || !selectedOrd) {
      alert("Veuillez entrer une quantite delivree");
      return;
    }

    const nextDate = calculateNextDate(quantiteDelivree);
    if (!nextDate) {
      alert("Erreur de calcul de la date");
      return;
    }

    setSaving(true);
    try {
      await updateDateProchainePrise(selectedOrd.id, nextDate.toISOString().split("T")[0]);
      alert("Date prochaine prise mise a jour avec succes !");
      await loadOrdonnances();
      setQuantiteDelivree("");
    } catch (err) {
      console.error("Erreur sauvegarde:", err);
      alert(err?.message || err?.error || "Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("fr-FR");
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
          <p>Aucune ordonnance pour ce patient</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ordonnance-detail-container">
      <div className="detail-header">
        <h2 className="detail-title">Detail de l'ordonnance</h2>
        <span className="patient-badge">Patient: {numero}</span>
      </div>

      {ordonnances.length > 1 && (
        <div className="ordonnance-selector">
          <label>Selectionner une ordonnance:</label>
          <select
            value={selectedOrd?.id || ""}
            onChange={(e) => {
              const ord = ordonnances.find((o) => o.id === parseInt(e.target.value, 10));
              setSelectedOrd(ord || null);
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

      {selectedOrd && (
        <div className="detail-form">
          <div className="form-group">
            <label className="form-label">Nom du traitement</label>
            <input type="text" value={selectedOrd.nom_traitement || ""} disabled className="form-input disabled" />
          </div>

          <div className="form-group">
            <label className="form-label">Quantite prescrite</label>
            <input type="number" value={selectedOrd.quantite_prescrite || ""} disabled className="form-input disabled" />
          </div>

          <div className="form-group">
            <label className="form-label">Date debut du traitement</label>
            <input type="date" value={selectedOrd.date_debut_traitement || ""} disabled className="form-input disabled" />
          </div>

          <div className="form-group form-group-compact">
            <label className="form-label">Date prochaine prise actuelle</label>
            <input type="date" value={selectedOrd.date_prochaine_prise || ""} disabled className="form-input disabled" />
          </div>

          <div className="form-group form-group-compact highlight">
            <label className="form-label active">Quantite delivree (mois)</label>
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
              <p className="preview-label">Nouvelle date prochaine prise:</p>
              <p className="preview-date">{formatDate(calculateNextDate(quantiteDelivree))}</p>
            </div>
          )}

          <div className="form-actions">
            <button onClick={handleSave} disabled={!quantiteDelivree || saving} className="btn-save">
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
