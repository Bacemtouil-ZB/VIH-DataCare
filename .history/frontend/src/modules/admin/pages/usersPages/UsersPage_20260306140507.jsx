import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { confirmAction } from "../../../../shared/utils/uiAlerts.js";
import { getUsers, activateUser, changeUserRole } from "../../services/AdminServices.jsx";
import UsersPageUI from "./UsersPageUi.jsx";

export default function UsersPageContainer() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");

  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const roleOptions = [
    { value: "admin", label: "Admin" },
    { value: "medecin", label: "Médecin" },
    { value: "pharmacien", label: "Pharmacien" },
    { value: "analyste", label: "Analyste" },
  ];

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers();
      setUsers(res?.users || []);
    } catch (err) {
      console.error("Erreur lors de la récupération des utilisateurs :", err);
      toast.error("Impossible de charger les utilisateurs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleActivation = async (id, isActive) => {
    const actionLabel = isActive ? "désactiver" : "activer";

    const ok = await confirmAction(
      "Confirmer l’action ?",
      `Voulez-vous ${actionLabel} cet utilisateur ?`,
    );
    if (!ok) return;

    try {
      setActionLoading(id);
      await activateUser(id, !isActive);
      toast.success(`Utilisateur ${isActive ? "désactivé" : "activé"} avec succès.`);
      await fetchUsers();
    } catch (err) {
      console.error("Erreur lors du changement d’activation :", err);
      toast.error("Échec du changement d’état utilisateur.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleOpenRoleModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.role || "");
    setShowRoleModal(true);
  };

  const handleCloseRoleModal = () => {
    setShowRoleModal(false);
    setSelectedUser(null);
    setNewRole("");
  };

  const handleChangeRole = async () => {
    if (!selectedUser || !newRole) return;

    const ok = await confirmAction(
      "Confirmer la modification ?",
      `Voulez-vous changer le rôle de ${selectedUser.prenom || ""} ${
        selectedUser.nom || ""
      } en "${newRole}" ?`,
    );
    if (!ok) return;

    try {
      setActionLoading(selectedUser.id);
      await changeUserRole(selectedUser.id, newRole);
      toast.success("Rôle mis à jour avec succès.");
      handleCloseRoleModal();
      await fetchUsers();
    } catch (err) {
      console.error("Erreur lors du changement de rôle :", err);
      toast.error(err?.response?.data?.message || "Échec du changement de rôle.");
    } finally {
      setActionLoading(null);
    }
  };

  // Simple filter (no useMemo needed for max ~20 users)
  const q = query.trim().toLowerCase();
  const filteredUsers = users.filter((u) => {
    const fullText = `${u.nom || ""} ${u.prenom || ""} ${u.email || ""}`.toLowerCase();
    const matchQuery = q ? fullText.includes(q) : true;
    const matchRole = roleFilter === "all" ? true : u.role === roleFilter;
    const matchStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? !!u.isactivated
        : !u.isactivated;

    return matchQuery && matchRole && matchStatus;
  });

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.isactivated).length;
  const inactiveUsers = totalUsers - activeUsers;

  return (
    <UsersPageUI
      // data
      users={users}
      filteredUsers={filteredUsers}
      loading={loading}
      actionLoading={actionLoading}
      roleOptions={roleOptions}
      totals={{ totalUsers, activeUsers, inactiveUsers }}
      // filters
      query={query}
      setQuery={setQuery}
      roleFilter={roleFilter}
      setRoleFilter={setRoleFilter}
      statusFilter={statusFilter}
      setStatusFilter={setStatusFilter}
      // modal state
      showRoleModal={showRoleModal}
      selectedUser={selectedUser}
      newRole={newRole}
      setNewRole={setNewRole}
      // handlers
      onToggleActivation={handleToggleActivation}
      onOpenRoleModal={handleOpenRoleModal}
      onCloseRoleModal={handleCloseRoleModal}
      onChangeRole={handleChangeRole}
    />
  );
}