import { useState, useEffect } from "react";
import { useParams, useNavigate, NavLink, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { alertError } from "../../../../../shared/utils/uiAlerts";
import CreateExamenModal from "./CreateExamenModal";
import { getExamensByPatient } from "../../../services/examenCliniqueServices/examenCliniqueService";
import "./ExamenLayout.css";

const TABS = [
  { to: "signesCliniques",    label: "Signes Cliniques"    },
  { to: "signesFonctionnels", label: "Signes Fonctionnels" },
  { to: "habitudes",          label: "Habitudes de Vie"    },
  { to: "observation",        label: "Observation"         },
];

export default function ExamenLayout() {
  const { numero } = useParams();
  const navigate   = useNavigate();

  const [examenId, setExamenId]   = useState(null);
  const [dateExamen, setDateExamen] = useState(null);
  const [showModal, setShowModal]  = useState(false);
  const [loading, setLoading]    = useState(true);

  useEffect(() => {
    if (!numero) {
      alertError("Numéro de patient manquant").then(() => navigate("/medecin/patients"));
      return;
    }
    checkExamenExists();
  }, [numero]);

  const checkExamenExists = async () => {
    try {
      setLoading(true);
      const response = await getExamensByPatient(numero);
      if (response.success && response.examens?.length > 0) {
        const dernierExamen = response.examens[0];
        setExamenId(dernierExamen.id);
        setDateExamen(dernierExamen.date_examen);
      } else {
        // Pas d'examen → ouvrir la modal automatiquement
        setShowModal(true);
      }
    } catch {
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleExamenCreated = (examen) => {
    setExamenId(examen.id);
    setDateExamen(examen.date_examen);
    setShowModal(false);
    toast.success("Examen clinique créé avec succès");
  };

  const handleHideModal = () => setShowModal(false);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 400 }}>
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
        onHide={handleHideModal}
        onExamenCreated={handleExamenCreated}
        patientNumero={numero}
      />

      {/* Alerte si pas d'examen — avec bouton pour rouvrir la modal */}
      {!examenId && (
        <div className="alert alert-warning mb-3 d-flex align-items-center justify-content-between">
          <span>
            <i className="bi bi-exclamation-triangle me-2"></i>
            <strong>Action requise :</strong> Aucun examen clinique actif pour ce patient.
          </span>
          <button className="btn btn-sm btn-warning" onClick={() => setShowModal(true)}>
            <i className="bi bi-plus-circle me-1"></i>Créer l'examen
          </button>
        </div>
      )}

      {/* Onglets */}
      <div className="tabs">
        {TABS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `tab-link${isActive ? " active" : ""}${!examenId ? " tab-disabled" : ""}`
            }
            onClick={(e) => !examenId && e.preventDefault()}
          >
            {label}
          </NavLink>
        ))}
      </div>

      {/* Contenu */}
      <div className="tab-content">
        {examenId ? (
          <Outlet context={{ examenId, dateExamen, patientNumero: numero }} />
        ) : (
          <div className="p-5 text-center text-muted">
            <i className="bi bi-clipboard-x" style={{ fontSize: "3rem" }}></i>
            <p className="mt-3">Créez un examen clinique pour commencer</p>
          </div>
        )}
      </div>

    </div>
  );
}