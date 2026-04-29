import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { confirmAction } from "../../../../shared/utils/uiAlerts.js";
import { getUsers, activateUser, changeUserRole } from "../../services/AdminServices.js";
import { ROLE_OPTIONS } from "./usersConstants.js";

export function useUsersLogic() {
  // ── État données ────────────────────────────────────────────────────────
  const [users, setUsers]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // ── État modal rôle ─────────────────────────────────────────────────────
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser]   = useState(null);
  const [newRole, setNewRole]             = useState("");

  // ── État filtres ────────────────────────────────────────────────────────
  const [query, setQuery]               = useState("");
  const [roleFilter, setRoleFilter]     = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // ── Chargement ──────────────────────────────────────────────────────────
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers();
      console.log("USERS BACKEND:", res?.users);
      setUsers(res?.users || []);
    } catch (err) {
      console.error("Erreur récupération utilisateurs :", err);
      toast.error("Impossible de charger les utilisateurs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // ── Activer / Désactiver ────────────────────────────────────────────────
  const handleToggleActivation = async (id, isActive) => {
    const actionLabel = isActive ? "désactiver" : "activer";
    const ok = await confirmAction(
      "Confirmer l'action ?",
      `Voulez-vous ${actionLabel} cet utilisateur ?`,
    );
    if (!ok) return;

    try {
      setActionLoading(id);
      await activateUser(id, !isActive);
      toast.success(`Utilisateur ${isActive ? "désactivé" : "activé"} avec succès.`);
      await fetchUsers();
    } catch (err) {
      console.error("Erreur changement activation :", err);
      toast.error("Échec du changement d'état utilisateur.");
    } finally {
      setActionLoading(null);
    }
  };

  // ── Modal rôle ──────────────────────────────────────────────────────────
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

    try {
      setActionLoading(selectedUser.id);
      await changeUserRole(selectedUser.id, newRole);
      toast.success("Rôle mis à jour avec succès.");
      handleCloseRoleModal();
      await fetchUsers();
    } catch (err) {
      console.error("Erreur changement rôle :", err);
      toast.error(err?.response?.data?.message || "Échec du changement de rôle.");
    } finally {
      setActionLoading(null);
    }
  };

  

  // ── Filtrage ────────────────────────────────────────────────────────────
  const q = query.trim().toLowerCase();
  const filteredUsers = users.filter((u) => {
    const fullText   = `${u.nom || ""} ${u.prenom || ""} ${u.email || ""}`.toLowerCase();
    const matchQuery  = q ? fullText.includes(q) : true;
    const matchRole   = roleFilter === "all" ? true : u.role === roleFilter;
    const matchStatus =
      statusFilter === "all"    ? true
      : statusFilter === "active" ? !!u.isactivated
      : !u.isactivated;
    return matchQuery && matchRole && matchStatus;
  });

  // ── Totaux ──────────────────────────────────────────────────────────────
  const totalUsers    = users.length;
  const activeUsers   = users.filter((u) => u.isactivated).length;
  const inactiveUsers = totalUsers - activeUsers;

// ── Options pour modal (sans patient) ────────────────────────────────
  const roleOptionsForModal = ROLE_OPTIONS.filter(
    (role) => role.value !== "patient"
  );

  return {
    // données
    filteredUsers,
    loading,
    actionLoading,
    roleOptions: ROLE_OPTIONS,
    roleOptionsForModal,
    totals: { totalUsers, activeUsers, inactiveUsers },
    // filtres
    query,       setQuery,
    roleFilter,  setRoleFilter,
    statusFilter, setStatusFilter,
    // modal
    showRoleModal,
    selectedUser,
    newRole,     setNewRole,
    // handlers
    onToggleActivation: handleToggleActivation,
    onOpenRoleModal:    handleOpenRoleModal,
    onCloseRoleModal:   handleCloseRoleModal,
    onChangeRole:       handleChangeRole,
  };
}