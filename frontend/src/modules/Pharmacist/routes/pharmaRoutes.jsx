import { Navigate } from "react-router-dom";
import ProtectedRoute from "../../../routes/ProtectedRoute";
import DashboardLayout from "../../../shared/components/Layout/DashboardLayout";
import ProfilPage from "../../../pages/parametres/profile";
import Patientsordonnances from "../pages/workspace/ordonnance/Patientsordonnances.jsx";
import Stock from "../pages/workspace/stock/Stock.jsx";

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
        path: "stock", 
        element: <Stock /> 
      },
      {
        path: "stock/:numero",
        element: <Stock />,
      },
      { 
        path: "settings", 
        element: <ProfilPage /> 
      },
    ],
  },

];

export default pharmacienRoutes;
