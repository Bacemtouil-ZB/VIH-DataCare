import { Navigate } from "react-router-dom";
import ProtectedRoute from "../../../routes/ProtectedRoute";
import { DashboardLayout } from "../../../shared/components";
import StatistiquesPage from "../pages/StatistiquesPage";
import RapportsPage from "../pages/RapportsPage";
import DashboardAnalyste from "../pages/DashboardAnalyste";
import ProfilPage from "../../../pages/parametres/profile";


const analysteRoutes = [
  {
    path: "/analyste",
    element: (
      <ProtectedRoute allowedRoles={["analyste"]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="statistiques" replace /> },
      { path: "statistiques", element: <StatistiquesPage /> },
      { path: "rapports", element: <RapportsPage /> },
      { path: "dashboard", element: <DashboardAnalyste /> },
      { path: "settings", element: <ProfilPage /> }, 

    ],
  },
];

export default analysteRoutes;
