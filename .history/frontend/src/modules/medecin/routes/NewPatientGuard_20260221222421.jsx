import { Navigate, useParams } from "react-router-dom";
import { confirmAction } from "../../../../../shared/utils/uiAlerts.js";

export default function NewPatientGuard({ children }) {
  const { numero } = useParams();

  // Si c'est un nouveau patient, on force l'accès seulement au profil
  if (numero === "new") {
    alert("Veuillez d'abord compléter le profil du patient avant d'accéder aux autres sections.");
    return <Navigate to="/medecin/patient/new/workspace/profil" replace />;
    
  }

  return children;
}