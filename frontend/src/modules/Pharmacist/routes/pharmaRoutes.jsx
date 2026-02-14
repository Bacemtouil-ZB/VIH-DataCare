import { Navigate } from "react-router-dom";
import ProtectedRoute from "../../../routes/ProtectedRoute";
import DashboardLayout from "../../../shared/components/layout/DashboardLayout";
import ProfilPage from "../../../pages/parametres/profile";
import Patientsordonnances from "../pages/Patientsordonnances.jsx";
import MainWorkspaceLayout from "../pages/MainWorkspaceLayout";

/**
 * ==========================================
 * ROUTES PHARMACIEN - CORRIGÉES
 * ==========================================
 */
const pharmacienRoutes = [
  {
    path: "/pharmacien",
    element: (
      <ProtectedRoute allowedRoles={["pharmacien"]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      // ✅ Redirection par défaut vers patients
      { 
        index: true, 
        element: <Navigate to="patients" replace /> 
      },
      
      // ✅ Liste des patients avec ordonnances
      { 
        path: "patients", 
        element: <Patientsordonnances /> 
      },
      
      // ✅ AJOUTER cette route si vous voulez /pharmacien/ordonnances
      { 
        path: "ordonnances", 
        element: <Patientsordonnances /> 
      },
      
      // Paramètres
      { 
        path: "settings", 
        element: <ProfilPage /> 
      },
    ],
  },

  // ==========================================
  // WORKSPACE
  // ==========================================
  {
    path: "/pharmacien/workspace",
    element: (
      <ProtectedRoute allowedRoles={["pharmacien"]}>
        <MainWorkspaceLayout />
      </ProtectedRoute>
    ),
    // PAS de children - MainPanel gère tout
  },
];

export default pharmacienRoutes;