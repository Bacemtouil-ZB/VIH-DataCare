import { Navigate } from "react-router-dom";
import ProtectedRoute from "../../../routes/ProtectedRoute";
import DashboardLayout from "../../../shared/layouts/DashboardLayout";
import StockPage from "../pages/StockPage";
import DashboardPharma from "../pages/DashboardPharma";
import ProfilPage from "../../../pages/parametres/profile";


const pharmacienRoutes = [
  {
    path: "/pharmacien",
    element: (
      <ProtectedRoute allowedRoles={["pharmacien"]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="stock" replace /> },
      { path: "stock", element: <StockPage /> },
      { path: "dashboard", element: <DashboardPharma /> },
      { path: "settings", element: <ProfilPage /> }, 

    ],
  },
];

export default pharmacienRoutes;
