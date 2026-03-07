import React from "react";
import { Navigate } from "react-router-dom";
import UsersPage from "../pages/usersPages/UsersPage";
import AuditLogsPage from "../pages/auditLogsPage/AuditLogsPage";
import AdminDashboard from "../pages/AdminDashboard";

import ProtectedRoute from "../../../routes/ProtectedRoute";
import DashboardLayout from "../../../shared/components/layout/DashboardLayout";
import ProfilPage from "../../../pages/parametres/profile";

const adminRoutes = [
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="users" replace /> }, // default /admin
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "users", element: <UsersPage /> },
      { path: "audit-logs", element: <AuditLogsPage /> },
      { path: "settings", element: <ProfilPage /> }, 
    ],
  },
];

export default adminRoutes;
