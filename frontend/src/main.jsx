import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./routes/AppRoutes.jsx"; // ton fichier de routes
import { AuthProvider } from "./context/authContext.jsx"; // ton contexte d'authentification
import "../src/assets/css/Tailwind.css"; // Tailwind + styles globaux
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/css/bootstrap.min.css'

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </React.StrictMode>
);
