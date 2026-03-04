import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { alertError } from "../../../../../shared/utils/uiAlerts";
import { createExamenClinique } from "../../../services/examenCliniqueServices/examenCliniqueService";
import "./CreateExamenModal.css";

const CreateExamenModal = ({ show, onHide, onExamenCreated, patientNumero }) => {
  const [dateExamen, setDateExamen] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!dateExamen) {
      await alertError("Veuillez selectionner une date");
      return;
    }
    if (!patientNumero) {
      await alertError("Numero de patient manquant");
      return;
    }

    setLoading(true);
    try {
      const response = await createExamenClinique({ patient_numero: patientNumero, date_examen: dateExamen });
      if (response.success && response.examen) {
        onExamenCreated(response.examen);
        onHide();
      } else {
        await alertError(response.message || "Erreur lors de la creation");
      }
    } catch (error) {
      await alertError(error.message || "Erreur lors de la creation de l'examen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop keyboard>
      <Modal.Header closeButton className="ecm-header">
        <Modal.Title className="ecm-title">
          <i className="bi bi-clipboard-pulse me-2"></i>
          Nouvel Examen Clinique
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="ecm-body">
        <div className="mb-4 px-3 py-2 rounded d-flex align-items-start gap-2 ecm-info">
          <i className="bi bi-info-circle mt-1"></i>
          <small>Creez un examen clinique pour pouvoir enregistrer les signes fonctionnels et cliniques du patient.</small>
        </div>

        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold ecm-label">
            Date de l'examen <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="date"
            value={dateExamen}
            onChange={(e) => setDateExamen(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className="ecm-date"
          />
          <Form.Text className="ecm-help">Par defaut : date du jour</Form.Text>
        </Form.Group>

        <div className="px-3 py-2 rounded ecm-patient">
          <small>
            Patient : <span className="badge ecm-patient-badge">{patientNumero}</span>
          </small>
        </div>
      </Modal.Body>

      <Modal.Footer className="ecm-footer">
        <Button variant="light" onClick={onHide} disabled={loading} className="ecm-cancel">
          Annuler
        </Button>
        <Button onClick={handleCreate} disabled={loading} className="ecm-confirm">
          {loading ? (
            <><span className="spinner-border spinner-border-sm me-2"></span>Creation...</>
          ) : (
            <><i className="bi bi-check-circle me-2"></i>Creer et continuer</>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateExamenModal;
