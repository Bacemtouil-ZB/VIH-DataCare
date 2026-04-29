import { Navigate } from "react-router-dom";
import ProtectedRoute from "../../../routes/ProtectedRoute";
import { DashboardLayout } from "../../../shared/components";
import FileActiveOrchestrer from "../pages/file-active/FileActiveOrchestrer";
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
      { path: "statistiques", element: <FileActiveOrchestrer /> },
      { path: "nouveaux-malades", element: <NouveauxMaladesOrchestrer /> },
      { path: "settings", element: <ProfilPage /> }, 

    ],
  },
];

export default analysteRoutes;
