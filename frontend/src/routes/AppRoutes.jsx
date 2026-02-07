import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Landing from "../pages/Landing/Landing";

import authRoutes from "./authRoutes";
import medecinRoutes from "../modules/medecin/routes/MedecinRoutes";
import AminRoutes from "../modules/admin/routes/AdminRoutes";
// plus tard : adminRoutes, analysteRoutes...

const router = createBrowserRouter([
  { path: "/", element: <Landing /> },

  ...authRoutes,
  ...medecinRoutes,
  ...AminRoutes,
]);

function AppRoutes() {
  return <RouterProvider router={router} />;
}

export default AppRoutes;
