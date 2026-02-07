import MainAdmin from "../pages/MainPageAdmin"
import ProtectedRoute from "../../../routes/ProtectedRoute";

const adminRoutes = [
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <MainAdmin/>
      </ProtectedRoute>
    ),
    children: [
    //   { path: "/", element: <MainPageAdmin /> },
    ],
  },
];
export default adminRoutes;