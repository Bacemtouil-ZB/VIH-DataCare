import { Navigate } from "react-router-dom";
import ProtectedRoute from "../../../routes/ProtectedRoute";
import StockPage from "../pages/StockPage";
import DashboardLayout from "../../../shared/components/layout/DashboardLayout";
import DashboardPharma from "../pages/DashboardPharma";
import ProfilPage from "../../../pages/parametres/profile";
import Patients from "../pages/Patients";
import MainWorkspaceLayout from "../pages/MainWorkspaceLayout";


const pharmacienRoutes = [
  {
    path: "/pharmacien",
    element: (
      <ProtectedRoute allowedRoles={["pharmacien"]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="patients" replace /> },
      { path: "patients", element: <Patients /> },
      { path: "stock", element: <StockPage /> },
      { path: "dashboard", element: <DashboardPharma /> },
      { path: "settings", element: <ProfilPage /> }, 

    ],
  },
  {
  path: "/pharmacien/workspace",
  element: (
    <ProtectedRoute allowedRoles={["pharmacien"]}>
      <MainWorkspaceLayout />
    </ProtectedRoute>
  ),
  // children: [
  //     { index: true, element: <Navigate to="profil" replace /> },

  //   {
  //     path: "profil",
  //     element: <Profilpage />,
  //   },
  //   {
  //     path: "social",
  //     element: <Social />,
     
  //   },
  //   {
  //     path: "VIH",
  //     element: <VIH/>,
  //   },],
    
  },
];

export default pharmacienRoutes;
