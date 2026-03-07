// import React, { useEffect, useState } from "react";
// import { Table, Button, Spinner, Badge, Modal, Form, InputGroup } from "react-bootstrap";
// import { toast } from "react-toastify";
// import { confirmAction } from "../../../../shared/utils/uiAlerts.js";
// import { getUsers, activateUser, changeUserRole } from "../../services/AdminServices.jsx";
// import "./users_page.css";

// export default function UsersPage() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(null);

//   const [showRoleModal, setShowRoleModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [newRole, setNewRole] = useState("");

//   const [query, setQuery] = useState("");
//   const [roleFilter, setRoleFilter] = useState("all");
//   const [statusFilter, setStatusFilter] = useState("all");

//   const roleOptions = [
//     { value: "admin", label: "Admin" },
//     { value: "medecin", label: "Médecin" },
//     { value: "pharmacien", label: "Pharmacien" },
//     { value: "analyste", label: "Analyste" },
//   ];

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const res = await getUsers();
//       setUsers(res?.users || []);
//     } catch (err) {
//       console.error("Erreur lors de la récupération des utilisateurs :", err);
//       toast.error("Impossible de charger les utilisateurs.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const handleToggleActivation = async (id, isActive) => {
//     const actionLabel = isActive ? "désactiver" : "activer";

//     const ok = await confirmAction(
//       "Confirmer l’action ?",
//       `Voulez-vous ${actionLabel} cet utilisateur ?`,
//     );
//     if (!ok) return;

//     try {
//       setActionLoading(id);
//       await activateUser(id, !isActive);
//       toast.success(`Utilisateur ${isActive ? "désactivé" : "activé"} avec succès.`);
//       await fetchUsers();
//     } catch (err) {
//       console.error("Erreur lors du changement d’activation :", err);
//       toast.error("Échec du changement d’état utilisateur.");
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   const handleOpenRoleModal = (user) => {
//     setSelectedUser(user);
//     setNewRole(user.role || "");
//     setShowRoleModal(true);
//   };

//   const handleCloseRoleModal = () => {
//     setShowRoleModal(false);
//     setSelectedUser(null);
//     setNewRole("");
//   };

//   const handleChangeRole = async () => {
//     if (!selectedUser || !newRole) return;

//     const ok = await confirmAction(
//       "Confirmer la modification ?",
//       `Voulez-vous changer le rôle de ${selectedUser.prenom || ""} ${selectedUser.nom || ""} en "${newRole}" ?`,
//     );
//     if (!ok) return;

//     try {
//       setActionLoading(selectedUser.id);
//       await changeUserRole(selectedUser.id, newRole);
//       toast.success("Rôle mis à jour avec succès.");
//       handleCloseRoleModal();
//       await fetchUsers();
//     } catch (err) {
//       console.error("Erreur lors du changement de rôle :", err);
//       toast.error(err?.response?.data?.message || "Échec du changement de rôle.");
//     } finally {
//       setActionLoading(null);
//     }
//   };

  
//   const q = query.trim().toLowerCase();
//   const filteredUsers = users.filter((u) => {
//     const fullText = `${u.nom || ""} ${u.prenom || ""} ${u.email || ""}`.toLowerCase();
//     const matchQuery = q ? fullText.includes(q) : true;
//     const matchRole = roleFilter === "all" ? true : u.role === roleFilter;
//     const matchStatus =
//       statusFilter === "all"
//         ? true
//         : statusFilter === "active"
//         ? !!u.isactivated
//         : !u.isactivated;

//     return matchQuery && matchRole && matchStatus;
//   });

//   const totalUsers = users.length;
//   const activeUsers = users.filter((u) => u.isactivated).length;
//   const inactiveUsers = totalUsers - activeUsers;

//   return (
//     <div className="users-page">
//       <div className="users-page__header">
//         <div className="users-page__title">
//           <h2>Utilisateurs</h2>
//           <p>Gérez les comptes, les rôles et l’activation.</p>
//         </div>

//         <div className="users-page__stats" aria-label="Statistiques utilisateurs">
//           <div className="stat-card">
//             <span>Total</span>
//             <strong>{totalUsers}</strong>
//           </div>
//           <div className="stat-card stat-card--success">
//             <span>Activés</span>
//             <strong>{activeUsers}</strong>
//           </div>
//           <div className="stat-card stat-card--muted">
//             <span>Inactifs</span>
//             <strong>{inactiveUsers}</strong>
//           </div>
//         </div>
//       </div>

//       <div className="users-page__toolbar">
//         <InputGroup className="toolbar__search">
//           <InputGroup.Text aria-label="Rechercher">
//             <i className="bi bi-search" aria-hidden="true" />
//           </InputGroup.Text>
//           <Form.Control
//             placeholder="Rechercher (nom, prénom, email)..."
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             aria-label="Rechercher par nom, prénom ou email"
//           />
//         </InputGroup>

//         <Form.Select
//           className="toolbar__select"
//           value={roleFilter}
//           onChange={(e) => setRoleFilter(e.target.value)}
//           aria-label="Filtrer par rôle"
//         >
//           <option value="all">Tous les rôles</option>
//           {roleOptions.map((r) => (
//             <option key={r.value} value={r.value}>
//               {r.label}
//             </option>
//           ))}
//         </Form.Select>

//         <Form.Select
//           className="toolbar__select"
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//           aria-label="Filtrer par statut"
//         >
//           <option value="all">Tous les statuts</option>
//           <option value="active">Activés</option>
//           <option value="inactive">Inactifs</option>
//         </Form.Select>
//       </div>

//       {loading ? (
//         <div className="users-page__loading" aria-busy="true">
//           <Spinner animation="border" variant="primary" />
//         </div>
//       ) : (
//         <div className="users-table-wrap">
//           <Table hover responsive className="users-table mb-0">
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>Nom</th>
//                 <th>Prénom</th>
//                 <th>Email</th>
//                 <th>Rôle</th>
//                 <th>Statut</th>
//                 <th className="text-end">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredUsers.length === 0 ? (
//                 <tr>
//                   <td colSpan={7} className="users-table__empty">
//                     Aucun utilisateur trouvé.
//                   </td>
//                 </tr>
//               ) : (
//                 filteredUsers.map((user, index) => {
//                   const busy = actionLoading === user.id;

//                   return (
//                     <tr key={user.id}>
//                       <td>{index + 1}</td>
//                       <td className="cell-strong">{user.nom}</td>
//                       <td>{user.prenom}</td>
//                       <td className="cell-email">{user.email}</td>
//                       <td className="text-capitalize">{user.role}</td>
//                       <td>
//                         <Badge
//                           bg={user.isactivated ? "success" : "secondary"}
//                           className="status-badge"
//                         >
//                           <i
//                             className={`bi ${
//                               user.isactivated ? "bi-check-circle" : "bi-dash-circle"
//                             } me-1`}
//                             aria-hidden="true"
//                           />
//                           {user.isactivated ? "Activé" : "Inactif"}
//                         </Badge>
//                       </td>
//                       <td>
//                         <div className="users-table__actions">
//                           <Button
//                             size="sm"
//                             variant={user.isactivated ? "outline-secondary" : "success"}
//                             disabled={busy}
//                             onClick={() =>
//                               handleToggleActivation(user.id, user.isactivated)
//                             }
//                             className="btn-icon"
//                           >
//                             {busy ? (
//                               <Spinner as="span" animation="border" size="sm" />
//                             ) : (
//                               <>
//                                 <i
//                                   className={`bi ${
//                                     user.isactivated ? "bi-pause-circle" : "bi-play-circle"
//                                   } me-2`}
//                                   aria-hidden="true"
//                                 />
//                                 {user.isactivated ? "Désactiver" : "Activer"}
//                               </>
//                             )}
//                           </Button>

//                           <Button
//                             size="sm"
//                             variant="outline-primary"
//                             disabled={busy}
//                             onClick={() => handleOpenRoleModal(user)}
//                             className="btn-icon"
//                           >
//                             <i className="bi bi-person-gear me-2" aria-hidden="true" />
//                             Changer rôle
//                           </Button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </Table>
//         </div>
//       )}

//       <Modal show={showRoleModal} onHide={handleCloseRoleModal} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>
//             Changer le rôle de {selectedUser?.prenom} {selectedUser?.nom}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form.Group>
//             <Form.Label>Nouveau rôle</Form.Label>
//             <Form.Select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
//               {roleOptions.map((role) => (
//                 <option value={role.value} key={role.value}>
//                   {role.label}
//                 </option>
//               ))}
//             </Form.Select>
//           </Form.Group>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="outline-secondary" onClick={handleCloseRoleModal}>
//             Annuler
//           </Button>
//           <Button
//             variant="primary"
//             onClick={handleChangeRole}
//             disabled={actionLoading === selectedUser?.id}
//             className="btn-icon"
//           >
//             {actionLoading === selectedUser?.id ? (
//               <Spinner as="span" animation="border" size="sm" />
//             ) : (
//               <>
//                 <i className="bi bi-check2 me-2" aria-hidden="true" />
//                 Confirmer
//               </>
//             )}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { confirmAction } from "../../../../shared/utils/uiAlerts.js";
import { getUsers, activateUser, changeUserRole } from "../../services/AdminServices.jsx";
import UsersPageUI from "./users_page_ui.jsx";

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