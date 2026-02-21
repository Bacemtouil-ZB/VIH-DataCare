import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink, Outlet } from 'react-router-dom';
import Swal from 'sweetalert2';
import CreateExamenModal from '../../../components/forms/CreateExamenModal';
import { getExamensByPatient } from '../../../services/examenCliniqueService';
import './ExamenLayout.css';


const ExamenCliniqueWrapper = () => {
  const { numero } = useParams();
  const navigate = useNavigate();

  const [examenId, setExamenId] = useState(null);
  const [dateExamen, setDateExamen] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasExistingExam, setHasExistingExam] = useState(false);

  // ==========================================
  // CHARGEMENT
  // ==========================================

  useEffect(() => {
    if (!numero) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Numéro de patient manquant'
      });
      navigate('/medecin/patients');
      return;
    }

    checkExamenExists();
  }, [numero]);

  const checkExamenExists = async () => {
    try {
      setLoading(true);

      const response = await getExamensByPatient(numero);

      if (response.success && response.examens && response.examens.length > 0) {
        const dernierExamen = response.examens[0];
        setExamenId(dernierExamen.id);
        setDateExamen(dernierExamen.date_examen);
        setHasExistingExam(true);
      } else {
        if (!hasExistingExam) {
          setShowModal(true);
        }
      }
    } catch (error) {
      console.error('Erreur chargement examen:', error);
      if (!hasExistingExam) {
        setShowModal(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExamenCreated = (examen) => {
    setExamenId(examen.id);
    setDateExamen(examen.date_examen);
    setHasExistingExam(true);
    setShowModal(false);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  // ==========================================
  // RENDU
  // ==========================================

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="examen-container">
      <CreateExamenModal
        show={showModal}
        onHide={() => {
          if (hasExistingExam) {
            setShowModal(false);
          } else {
            Swal.fire({
              icon: 'warning',
              title: 'Action requise',
              text: 'Veuillez créer un examen pour continuer'
            });
          }
        }}
        onExamenCreated={handleExamenCreated}
        patientNumero={numero}
      />

      {/* Header avec bouton À GAUCHE */}
      <div className="examen-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '1rem 1.5rem',
        background: 'white',
        borderBottom: '2px solid #e5e7eb',
        marginBottom: '1rem'
      }}>
        {/* BOUTON À GAUCHE */}
        <button
          className="btn btn-success"
          onClick={handleOpenModal}
          style={{
            padding: '0.5rem 1.5rem',
            fontWeight: '600'
          }}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Nouvel examen
        </button>

        {/* INFO À DROITE */}
        <div style={{ textAlign: 'right' }}>
          <h4 style={{ 
            margin: 0, 
            fontSize: '1.25rem', 
            fontWeight: '700',
            color: '#2e7d52'
          }}>
            <i className="bi bi-clipboard2-pulse me-2"></i>
            Examen Clinique
          </h4>
          <small style={{ color: '#6b7280' }}>
            Patient: {numero}
            {dateExamen && (
              <>
                {' '}• Date: {new Date(dateExamen).toLocaleDateString('fr-FR')}
              </>
            )}
            {examenId && (
              <>
                {' '}• Examen #{examenId}
              </>
            )}
          </small>
        </div>
      </div>

      {/* Message si pas d'examen */}
      {!examenId && (
        <div className="alert alert-warning mx-3">
          <i className="bi bi-exclamation-triangle me-2"></i>
          <strong>Action requise:</strong> Veuillez créer un examen clinique pour enregistrer les signes.
          <button
            className="btn btn-sm btn-warning ms-3"
            onClick={handleOpenModal}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Créer l'examen
          </button>
        </div>
      )}

      {/* Onglets */}
      <div className="tabs">
        <NavLink 
          to="signesCliniques" 
          className={({ isActive }) => `tab-link ${!examenId ? 'disabled' : ''} ${isActive ? 'active' : ''}`}
          onClick={(e) => !examenId && e.preventDefault()}
        >
          Signes Cliniques
        </NavLink>

        <NavLink 
          to="signesFonctionnels" 
          className={({ isActive }) => `tab-link ${!examenId ? 'disabled' : ''} ${isActive ? 'active' : ''}`}
          onClick={(e) => !examenId && e.preventDefault()}
        >
          Signes Fonctionnels
        </NavLink>

        <NavLink 
          to="habitudes" 
          className={({ isActive }) => `tab-link ${!examenId ? 'disabled' : ''} ${isActive ? 'active' : ''}`}
          onClick={(e) => !examenId && e.preventDefault()}
        >
          Habitudes de Vie
        </NavLink>

        <NavLink 
          to="observation" 
          className={({ isActive }) => `tab-link ${!examenId ? 'disabled' : ''} ${isActive ? 'active' : ''}`}
          onClick={(e) => !examenId && e.preventDefault()}
        >
          Observation
        </NavLink>
      </div>

      {/* Contenu */}
      <div className="tab-content">
        {examenId ? (
          <Outlet context={{ examenId, dateExamen, patientNumero: numero }} />
        ) : (
          <div className="p-4 text-center text-muted">
            <i className="bi bi-clipboard-x" style={{ fontSize: '3rem' }}></i>
            <p className="mt-3">Créez un examen pour commencer</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamenCliniqueWrapper;