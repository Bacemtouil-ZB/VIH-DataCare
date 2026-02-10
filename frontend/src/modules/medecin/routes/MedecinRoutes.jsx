import { Navigate } from "react-router-dom";
import ProtectedRoute from "../../../routes/ProtectedRoute";
import DashboardLayout from "../../../shared/components/layout/DashboardLayout";
import PatientsPage from "../pages/PatientsPage";
import DashboardMed from "../pages/DashboardMed";
import ProfilPage from "../../../pages/parametres/profile";

const medecinRoutes = [
  {
    path: "/medecin",
    element: (
      <ProtectedRoute allowedRoles={["medecin"]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="patients" replace /> }, // default /medecin
      { path: "patients", element: <PatientsPage /> },
      { path: "dashboard", element: <DashboardMed /> },
      { path: "settings", element: <ProfilPage /> }, 

    ],
  },
];

export default medecinRoutes;
