import React from "react";
import { Navigate } from "react-router-dom";
import UsersPage from "../pages/usersPages/UsersPage";
import AuditLogsPage from "../pages/auditLogsPage/AuditLogsPage";
import ProfilPage from "../../../pages/parametres/profile";
import ContactsUrgencePage from "../pages/urgence/ContactsUrgencePage";

import ProtectedRoute from "../../../routes/ProtectedRoute";
import { DashboardLayout } from "../../../shared/components";

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
      { path: "users", element: <UsersPage /> },
      { path: "audit-logs", element: <AuditLogsPage /> },
      { path: "settings", element: <ProfilPage /> },
      { path: "contacts-urgence", element: <ContactsUrgencePage /> },
    ],
  },
];

export default adminRoutes;
