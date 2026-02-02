import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Landing from "../pages/Landing/Landing";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";

const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
]);

function AppRoutes() {
  return <RouterProvider router={router} />;
}

export default AppRoutes;