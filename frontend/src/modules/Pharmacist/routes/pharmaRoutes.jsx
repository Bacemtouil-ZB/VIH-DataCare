import { Navigate } from "react-router-dom";
import ProtectedRoute from "../../../routes/ProtectedRoute";
import { DashboardLayout } from "../../../shared/components";
import ProfilPage from "../../../pages/parametres/profile";
import PatientsPrescriptions from "../pages/workspace/prescriptionMedicale/PatientsPharmaPrescriptions.jsx";
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
        element: <Navigate to="prescriptions-medicales" replace />,
      },
      {
        path: "prescriptions-medicales",
        element: <PatientsPrescriptions />,
      },
      {
        path: "stock",
        element: <Stock />,
      },
      {
        path: "stock/:numero",
        element: <Stock />,
      },
      {
        path: "settings",
        element: <ProfilPage />,
      },
    ],
  },

];

export default pharmacienRoutes;
