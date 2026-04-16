import { useState, useEffect } from "react";
import { useParams, useNavigate, NavLink, Outlet } from "react-router-dom";
import { alertError } from "../../../../../../shared/utils/uiAlerts";
import { createExamenClinique, getExamensByPatient } from "../../../../services/examenCliniqueServices/examenCliniqueService";
import "./ExamenLayout.css";

const TABS = [
  { to: "signesCliniques", label: "Signes Cliniques" },
  { to: "signesFonctionnels", label: "Signes Fonctionnels" },
  { to: "observance", label: "Observance" },
  { to: "observation", label: "Observation" },
];

export default function ExamenLayout() {
  const { numero } = useParams();
  const navigate = useNavigate();

  const [examenId, setExamenId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!numero) {
      alertError("Numero de patient manquant").then(() => navigate("/medecin/patients"));
      return;
    }
    initExamenClinique();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numero, navigate]);

  const initExamenClinique = async () => {
    try {
      setLoading(true);
      const response = await getExamensByPatient(numero);
      if (response.success && response.examens?.length > 0) {
        const dernierExamen = response.examens[0];
        setExamenId(dernierExamen.id);
      } else {
        const created = await createExamenClinique({ patient_numero: numero });
        if (!created?.success || !created?.examen?.id) {
          throw new Error(created?.message || "Creation examen clinique impossible");
        }
        setExamenId(created.examen.id);
      }
    } catch (error) {
      await alertError(error?.message || "Erreur lors de l'initialisation de l'examen clinique");
      navigate("/medecin/patients");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center examen-loading">
        <div className="spinner-border text-primary">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="examen-container">
      <div className="tabs">
        {TABS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `tab-link${isActive ? " active" : ""}`}
          >
            {label}
          </NavLink>
        ))}
      </div>

      <div className="tab-content">
        {examenId ? (
          <Outlet context={{ examenId, patientNumero: numero }} />
        ) : (
          <div className="p-5 text-center text-muted">
            <i className="bi bi-clipboard-x examen-empty-icon"></i>
            <p className="mt-3">Creez un examen clinique pour commencer</p>
          </div>
        )}
      </div>
    </div>
  );
}
