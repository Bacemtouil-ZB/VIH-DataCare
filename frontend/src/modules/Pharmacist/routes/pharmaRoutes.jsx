import { Navigate } from "react-router-dom";
import ProtectedRoute from "../../../routes/ProtectedRoute";
import DashboardLayout from "../../../shared/components/layout/DashboardLayout";
import ProfilPage from "../../../pages/parametres/profile";
import Patientsordonnances from "../pages/Patientsordonnances.jsx";
import MainWorkspaceLayout from "../pages/MainWorkspaceLayout";
import Ordonnancedetail from "../pages/workspace/Ordonnancedetail.jsx";

const pharmacienRoutes = [
  {
    path: "/pharmacien",
    element: (
      <ProtectedRoute allowedRoles={["pharmacien"]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { 
        index: true, 
        element: <Navigate to="ordonnances" replace /> 
      },
      { 
        path: "ordonnances", 
        element: <Patientsordonnances /> 
      },
      { 
        path: "settings", 
        element: <ProfilPage /> 
      },
    ],
  },

  {
    path: "/pharmacien/workspace/:numero",
    element: (
      <ProtectedRoute allowedRoles={["pharmacien"]}>
        <MainWorkspaceLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Ordonnancedetail />
      }
    ],
  },
];

export default pharmacienRoutes;