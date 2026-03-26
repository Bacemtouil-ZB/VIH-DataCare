import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  findMedicalTreatmentByNumeroDossier,
  updateDateProchainePrise,
} from "../../../services/prescriptionWorkflowService";
import "./PrescriptionDetail.css";

export default function PrescriptionDetail() {
  const { numero } = useParams();
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPrescriptions = async () => {
    const response = await findMedicalTreatmentByNumeroDossier(numero);
    const data = Array.isArray(response?.prescriptions) ? response.prescriptions : [];
    setPrescriptions(data);

    if (data.length > 0) {
      setSelectedPrescription((prev) => {
        if (!prev) return data[0];
        return data.find((item) => item.id === prev.id) || data[0];
      });
    } else {
      setSelectedPrescription(null);
    }
  };

  useEffect(() => {
    if (!numero) return;

    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        await loadPrescriptions();
      } catch (err) {
        setError(err?.message || "Erreur de chargement des prescriptions");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [numero]);

  const handleUpdateDate = async (dateProchainePrise) => {
    if (!selectedPrescription?.id) return;

    try {
      await updateDateProchainePrise(selectedPrescription.id, dateProchainePrise);
      await loadPrescriptions();
    } catch (err) {
      setError(err?.message || "Erreur de mise a jour");
    }
  };

  if (loading) {
    return (
      <div className="prescription-detail-container">
        <div className="detail-card">
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="prescription-detail-container">
        <div className="detail-card">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (prescriptions.length === 0) {
    return (
      <div className="prescription-detail-container">
        <div className="detail-card">
          <p>Aucune prescription pour ce patient</p>
        </div>
      </div>
    );
  }

  return (
    <div className="prescription-detail-container">
      <div className="detail-card">
        <h2 className="detail-title">Detail de la prescription</h2>

        {prescriptions.length > 1 && (
          <div className="prescription-selector">
            <label>Selectionner une prescription:</label>
            <select
              value={selectedPrescription?.id || ""}
              onChange={(e) => {
                const item = prescriptions.find((p) => p.id === parseInt(e.target.value, 10));
                setSelectedPrescription(item || null);
              }}
              className="select-prescription"
            >
              {prescriptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nom_traitement || "Traitement"} - {item.date_prescription || "Date inconnue"}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedPrescription && (
          <div className="detail-grid">
            <div>
              <strong>Traitement:</strong> {selectedPrescription.nom_traitement || "-"}
            </div>
            <div>
              <strong>Date debut:</strong> {selectedPrescription.date_debut_traitement || "-"}
            </div>
            <div>
              <strong>Date prochaine prise:</strong> {selectedPrescription.date_prochaine_prise || "-"}
            </div>
            <div>
              <strong>Quantite:</strong> {selectedPrescription.quantite_prescrite || "-"}
            </div>

            <button
              type="button"
              className="btn-update"
              onClick={() => {
                const next = new Date();
                next.setMonth(next.getMonth() + Number.parseInt(selectedPrescription.quantite_prescrite || 1, 10));
                handleUpdateDate(next.toISOString().slice(0, 10));
              }}
            >
              Recalculer prochaine prise
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
