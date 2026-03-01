import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./routes/AppRoutes.jsx"; // ton fichier de routes
import { AuthProvider } from "./context/authContext.jsx"; // ton contexte d'authentification
import "../src/assets/css/Tailwind.css"; // Tailwind + styles globaux
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        newestOnTop
        closeOnClick
        pauseOnHover
      />
  </React.StrictMode>
);