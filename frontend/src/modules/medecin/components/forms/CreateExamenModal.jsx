import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { createExamenClinique } from '../../services/examenCliniqueService';

/**
 * ==========================================
 * MODAL CRÉATION EXAMEN CLINIQUE - FINAL
 * Avec appel API correct
 * ==========================================
 */

const CreateExamenModal = ({ show, onHide, onExamenCreated, patientNumero }) => {
  const [dateExamen, setDateExamen] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!dateExamen) {
      toast.error('Veuillez sélectionner une date');
      return;
    }

    if (!patientNumero) {
      toast.error('Numéro de patient manquant');
      return;
    }

    setLoading(true);

    try {
      const response = await createExamenClinique({
        patient_numero: patientNumero,
        date_examen: dateExamen,
      });

      if (response.success && response.examen) {
        toast.success('Examen clinique créé avec succès !');
        onExamenCreated(response.examen);
      } else {
        toast.error(response.message || 'Erreur lors de la création');
      }
    } catch (error) {
      console.error('Erreur création examen:', error);
      toast.error(error.message || 'Erreur lors de la création de l\'examen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      centered
      backdrop="static"  // Empêche la fermeture en cliquant dehors
      keyboard={false}   // Empêche la fermeture avec Esc
    >
      <Modal.Header style={{ backgroundColor: '#2e7d52', color: 'white' }}>
        <Modal.Title>
          <i className="bi bi-clipboard-pulse me-2"></i>
          Nouvel Examen Clinique
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="mb-3">
          <div className="alert alert-info mb-3">
            <i className="bi bi-info-circle me-2"></i>
            <strong>Étape obligatoire :</strong> Créez d'abord un examen clinique pour pouvoir enregistrer les signes fonctionnels et cliniques.
          </div>

          <Form.Group>
            <Form.Label className="fw-bold">
              Date de l'examen <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="date"
              value={dateExamen}
              onChange={(e) => setDateExamen(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="form-control-lg"
            />
            <Form.Text className="text-muted">
              <i className="bi bi-calendar-check me-1"></i>
              Par défaut : date du jour
            </Form.Text>
          </Form.Group>
        </div>

        <div className="alert alert-light border mb-0">
          <small>
            <strong>Patient :</strong> <span className="badge bg-primary">{patientNumero}</span>
          </small>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button
          style={{ backgroundColor: '#2e7d52', border: 'none' }}
          onClick={handleCreate}
          disabled={loading}
          size="lg"
          className="w-100"
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Création en cours...
            </>
          ) : (
            <>
              <i className="bi bi-check-circle me-2"></i>
              Créer l'examen et continuer
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateExamenModal;