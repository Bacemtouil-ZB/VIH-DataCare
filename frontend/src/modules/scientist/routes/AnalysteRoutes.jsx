import { Navigate } from "react-router-dom";
import ProtectedRoute from "../../../routes/ProtectedRoute";
import { DashboardLayout } from "../../../shared/components";
import StatistiquesPage from "../pages/StatistiquesPage";
import Dashboard from "../pages/DashboardAnalyste";
import RapportsPage from "../pages/RapportsPage";
import NouveauxMaladesOrchestrer from "../pages/nouveaux-malades/orchestrer/NouveauxMaladesOrchestrer";
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
      { path: "dashboard", element: <Dashboard /> },
      { path: "rapports", element: <RapportsPage /> },
      { path: "nouveaux-malades", element: <NouveauxMaladesOrchestrer /> },
      { path: "settings", element: <ProfilPage /> }, 

    ],
  },
];

export default analysteRoutes;
