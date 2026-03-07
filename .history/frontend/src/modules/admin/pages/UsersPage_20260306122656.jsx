// import React, { useEffect, useState } from "react";
// import { Table, Button, Spinner, Badge, Modal, Form } from "react-bootstrap";
// import { getUsers, activateUser, changeUserRole } from "../services/AdminServices.jsx";

// export default function UsersPage() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(null);
//   const [showRoleModal, setShowRoleModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [newRole, setNewRole] = useState("");

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const res = await getUsers();
//       setUsers(res.users);
//     } catch (err) {
//       console.error("Erreur lors de la récupération des utilisateurs :", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const handleToggleActivation = async (id, isActive) => {
//     try {
//       setActionLoading(id);
//       await activateUser(id, !isActive);
//       fetchUsers();
//     } catch (err) {
//       console.error("Erreur lors de l'activation :", err);
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   // ── Supprimer un utilisateur (UI seulement)
//   const handleDeleteUser = (userId) => {
//     if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
//       setUsers(users.filter((user) => user.id !== userId));
//     }
//   };

//   // ── Ouvrir modal changement de rôle
//   const handleOpenRoleModal = (user) => {
//     setSelectedUser(user);
//     setNewRole(user.role);
//     setShowRoleModal(true);
//   };

//   // ── Changer le rôle
//   const handleChangeRole = async () => {
//     if (!selectedUser || !newRole) return;

//     try {
//       setActionLoading(selectedUser.id);
//       await changeUserRole(selectedUser.id, newRole);
//       setShowRoleModal(false);
//       fetchUsers();
//     } catch (err) {
//       console.error("Erreur lors du changement de rôle :", err);
//       alert("Erreur: " + (err.response?.data?.message || err.message));
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">Gestion des Utilisateurs</h2>
//       <p>Ici l'administrateur peut voir, activer et gérer les comptes utilisateurs.</p>

//       {loading ? (
//         <div className="text-center py-5">
//           <Spinner animation="border" variant="primary" />
//         </div>
//       ) : (
//         <Table striped bordered hover responsive className="mt-4 bg-white shadow-sm">
//           <thead className="table-dark">
//             <tr>
//               <th>#</th>
//               <th>Nom</th>
//               <th>Prénom</th>
//               <th>Email</th>
//               <th>Rôle</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user, index) => (
//               <tr key={user.id}>
//                 <td>{index + 1}</td>
//                 <td>{user.nom}</td>
//                 <td>{user.prenom}</td>
//                 <td>{user.email}</td>
//                 <td>{user.role}</td>
//                 <td>
//                   <Badge bg={user.isactivated ? "success" : "secondary"}>
//                     {user.isactivated ? "Activé" : "Inactif"}
//                   </Badge>
//                 </td>
//                 <td className="d-flex gap-2">
//                   <Button
//                     size="sm"
//                     variant={user.isactivated ? "secondary" : "success"}
//                     disabled={actionLoading === user.id}
//                     onClick={() => handleToggleActivation(user.id, user.isactivated)}
//                   >
//                     {actionLoading === user.id ? (
//                       <Spinner as="span" animation="border" size="sm" />
//                     ) : user.isactivated ? (
//                       "Désactiver"
//                     ) : (
//                       "Activer"
//                     )}
//                   </Button>

//                   <Button
//                     size="sm"
//                     variant="info"
//                     disabled={actionLoading === user.id}
//                     onClick={() => handleOpenRoleModal(user)}
//                   >
//                     Changer rôle
//                   </Button>

//                   <Button
//                     size="sm"
//                     variant="danger"
//                     disabled={actionLoading === user.id}
//                     onClick={() => handleDeleteUser(user.id)}
//                   >
//                     Supprimer
//                   </Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       )}

//       {/* Modal Changement de Rôle */}
//       <Modal show={showRoleModal} onHide={() => setShowRoleModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Changer le rôle de {selectedUser?.prenom} {selectedUser?.nom}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form.Group>
//             <Form.Label>Nouveau rôle</Form.Label>
//             <Form.Select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
//               <option value="admin">Admin</option>
//               <option value="medecin">Médecin</option>
//               <option value="pharmacien">Pharmacien</option>
//               <option value="analyste">Analyste</option>
//             </Form.Select>
//           </Form.Group>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowRoleModal(false)}>
//             Annuler
//           </Button>
//           <Button 
//             variant="primary" 
//             onClick={handleChangeRole}
//             disabled={actionLoading === selectedUser?.id}
//           >
//             {actionLoading === selectedUser?.id ? (
//               <Spinner as="span" animation="border" size="sm" />
//             ) : (
//               "Confirmer"
//             )}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// }

import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  Button,
  Spinner,
  Badge,
  Modal,
  Form,
  InputGroup,
} from "react-bootstrap";
import {
  getUsers,
  activateUser,
  changeUserRole,
} from "../services/AdminServices.jsx";
import "./users_page.css";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");

  const [error, setError] = useState("");
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
      setError("");
      const res = await getUsers();
      setUsers(res?.users || []);
    } catch (err) {
      console.error("Erreur lors de la récupération des utilisateurs :", err);
      setError("Impossible de charger les utilisateurs. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleActivation = async (id, isActive) => {
    try {
      setActionLoading(id);
      setError("");
      await activateUser(id, !isActive);
      await fetchUsers();
    } catch (err) {
      console.error("Erreur lors de l'activation :", err);
      setError("Échec du changement d’état utilisateur.");
    } finally {
      setActionLoading(null);
    }
  };

  // Delete only in UI (same behavior as your old version)
  const handleDeleteUser = (userId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      setUsers((prev) => prev.filter((user) => user.id !== userId));
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

    try {
      setActionLoading(selectedUser.id);
      setError("");
      await changeUserRole(selectedUser.id, newRole);
      handleCloseRoleModal();
      await fetchUsers();
    } catch (err) {
      console.error("Erreur lors du changement de rôle :", err);
      setError(err?.response?.data?.message || "Échec du changement de rôle.");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();

    return users.filter((u) => {
      const searchable = `${u.nom || ""} ${u.prenom || ""} ${u.email || ""}`.toLowerCase();
      const matchQuery = q ? searchable.includes(q) : true;
      const matchRole = roleFilter === "all" ? true : u.role === roleFilter;

      const matchStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "active"
          ? !!u.isactivated
          : !u.isactivated;

      return matchQuery && matchRole && matchStatus;
    });
  }, [users, query, roleFilter, statusFilter]);

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.isactivated).length;
  const inactiveUsers = totalUsers - activeUsers;

  return (
    <div className="users-page">
      <div className="users-page__container">
        <div className="users-page__header card-ui">
          <div>
            <h2>Gestion des Utilisateurs</h2>
            <p>Supervisez les comptes, les rôles et les statuts d’activation.</p>
          </div>

          <div className="users-page__stats">
            <div className="stat-card">
              <span>Total</span>
              <strong>{totalUsers}</strong>
            </div>
            <div className="stat-card">
              <span>Activés</span>
              <strong>{activeUsers}</strong>
            </div>
            <div className="stat-card">
              <span>Inactifs</span>
              <strong>{inactiveUsers}</strong>
            </div>
          </div>
        </div>

        {error && <div className="users-page__alert">{error}</div>}

        <div className="users-page__toolbar card-ui">
          <InputGroup className="toolbar__search">
            <InputGroup.Text>🔎</InputGroup.Text>
            <Form.Control
              placeholder="Rechercher par nom, prénom ou email..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </InputGroup>

          <Form.Select
            className="toolbar__select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">Tous les rôles</option>
            {roleOptions.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </Form.Select>

          <Form.Select
            className="toolbar__select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Activés</option>
            <option value="inactive">Inactifs</option>
          </Form.Select>
        </div>

        {loading ? (
          <div className="users-page__loading card-ui">
            <Spinner animation="border" />
          </div>
        ) : (
          <div className="users-table-wrap card-ui">
            <Table className="users-table mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Statut</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="users-table__empty">
                      Aucun utilisateur trouvé.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, index) => {
                    const busy = actionLoading === user.id;

                    return (
                      <tr key={user.id}>
                        <td>{index + 1}</td>
                        <td>{user.nom}</td>
                        <td>{user.prenom}</td>
                        <td>{user.email}</td>
                        <td className="text-capitalize">{user.role}</td>
                        <td>
                          <Badge bg={user.isactivated ? "success" : "secondary"}>
                            {user.isactivated ? "Activé" : "Inactif"}
                          </Badge>
                        </td>
                        <td>
                          <div className="users-table__actions">
                            <Button
                              size="sm"
                              variant={user.isactivated ? "outline-secondary" : "success"}
                              disabled={busy}
                              onClick={() =>
                                handleToggleActivation(user.id, user.isactivated)
                              }
                            >
                              {busy ? (
                                <Spinner as="span" animation="border" size="sm" />
                              ) : user.isactivated ? (
                                "Désactiver"
                              ) : (
                                "Activer"
                              )}
                            </Button>

                            <Button
                              size="sm"
                              className="btn-role"
                              disabled={busy}
                              onClick={() => handleOpenRoleModal(user)}
                            >
                              Changer rôle
                            </Button>

                            <Button
                              size="sm"
                              variant="outline-danger"
                              disabled={busy}
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              Supprimer
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </Table>
          </div>
        )}

        <Modal show={showRoleModal} onHide={handleCloseRoleModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              Changer le rôle de {selectedUser?.prenom} {selectedUser?.nom}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Nouveau rôle</Form.Label>
              <Form.Select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                {roleOptions.map((role) => (
                  <option value={role.value} key={role.value}>
                    {role.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={handleCloseRoleModal}>
              Annuler
            </Button>
            <Button
              className="btn-main"
              onClick={handleChangeRole}
              disabled={actionLoading === selectedUser?.id}
            >
              {actionLoading === selectedUser?.id ? (
                <Spinner as="span" animation="border" size="sm" />
              ) : (
                "Confirmer"
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}