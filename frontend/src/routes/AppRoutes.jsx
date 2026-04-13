import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Landing from "../pages/Landing/Landing";

import authRoutes from "./authRoutes";
import medecinRoutes from "../modules/medecin/routes/MedecinRoutes";
import AdminRoutes from "../modules/admin/routes/AdminRoutes";
import PharmacienRoutes from "../modules/Pharmacist/routes/pharmaRoutes";
import AnalysteRoutes from "../modules/scientist/routes/AnalysteRoutes";

const router = createBrowserRouter([
  { path: "/", element: <Landing /> },

  ...authRoutes,
  ...medecinRoutes,
  ...AdminRoutes,
  ...PharmacienRoutes,
  ...AnalysteRoutes,
]);

function AppRoutes() {
  return <RouterProvider router={router} />;
}

export default AppRoutes;
