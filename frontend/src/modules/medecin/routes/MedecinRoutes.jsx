import MainPageMed from "../pages/MainPage";
import ProtectedRoute from "../../../routes/ProtectedRoute";

const medecinRoutes = [
  {
    path: "/medecin",
    element: (
      <ProtectedRoute allowedRoles={["medecin"]}>
        <MainPageMed />
      </ProtectedRoute>
    ),
    children: [
    //   { path: "/", element: <MainPageMed /> },
    ],
  },
];
export default medecinRoutes;