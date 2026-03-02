import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { alertError } from "../../../../../shared/utils/uiAlerts";
import { createExamenClinique } from "../../../services/examenCliniqueServices/examenCliniqueService";

const CreateExamenModal = ({ show, onHide, onExamenCreated, patientNumero }) => {
  const [dateExamen, setDateExamen] = useState(new Date().toISOString().split("T")[0]);
  const [loading,    setLoading]    = useState(false);

  const handleCreate = async () => {
    if (!dateExamen) {
      await alertError("Veuillez sélectionner une date");
      return;
    }
    if (!patientNumero) {
      await alertError("Numéro de patient manquant");
      return;
    }

    setLoading(true);
    try {
      const response = await createExamenClinique({
        patient_numero: patientNumero,
        date_examen:    dateExamen,
      });

      if (response.success && response.examen) {
        // ✅ toast pour succès — rapide, non bloquant
        toast.success("Examen clinique créé avec succès");
        onExamenCreated(response.examen);
        onHide();
      } else {
        await alertError(response.message || "Erreur lors de la création");
      }
    } catch (error) {
      await alertError(error.message || "Erreur lors de la création de l'examen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop keyboard>
      <Modal.Header
        closeButton
        style={{ background: "#2e7d52", color: "white", borderBottom: "none" }}
      >
        <Modal.Title style={{ fontSize: "1rem", fontWeight: 700 }}>
          <i className="bi bi-clipboard-pulse me-2"></i>
          Nouvel Examen Clinique
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ padding: "24px 28px" }}>
        <div className="mb-4 px-3 py-2 rounded d-flex align-items-start gap-2"
          style={{ background: "#f0f9ff", border: "1px solid #bae6fd" }}>
          <i className="bi bi-info-circle mt-1" style={{ color: "#0369a1" }}></i>
          <small style={{ color: "#0369a1" }}>
            Créez un examen clinique pour pouvoir enregistrer les signes fonctionnels et cliniques du patient.
          </small>
        </div>

        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold"
            style={{ fontSize: "0.82rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.4px" }}>
            Date de l'examen <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="date"
            value={dateExamen}
            onChange={(e) => setDateExamen(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            style={{ borderRadius: 8 }}
          />
          <Form.Text style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
            Par défaut : date du jour
          </Form.Text>
        </Form.Group>

        <div className="px-3 py-2 rounded"
          style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
          <small style={{ color: "#64748b" }}>
            Patient :{" "}
            <span className="badge" style={{ background: "#dcfce7", color: "#166534", fontWeight: 600 }}>
              {patientNumero}
            </span>
          </small>
        </div>
      </Modal.Body>

      <Modal.Footer style={{ borderTop: "1px solid #f1f5f9", padding: "12px 28px" }}>
        <Button variant="light" onClick={onHide} disabled={loading}
          style={{ borderRadius: 8, border: "1px solid #e2e8f0", color: "#475569" }}>
          Annuler
        </Button>
        <Button onClick={handleCreate} disabled={loading}
          style={{ background: "#2e7d52", border: "none", borderRadius: 8, fontWeight: 600, padding: "8px 24px" }}>
          {loading ? (
            <><span className="spinner-border spinner-border-sm me-2"></span>Création...</>
          ) : (
            <><i className="bi bi-check-circle me-2"></i>Créer et continuer</>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateExamenModal;