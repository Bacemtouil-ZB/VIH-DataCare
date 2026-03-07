import React, { useEffect, useState } from "react";
import { Table, Button, Spinner, Badge, Modal, Form } from "react-bootstrap";
import { getUsers, activateUser, changeUserRole } from "../services/AdminServices.jsx";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers();
      setUsers(res.users);
    } catch (err) {
      console.error("Erreur lors de la récupération des utilisateurs :", err);
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
      await activateUser(id, !isActive);
      fetchUsers();
    } catch (err) {
      console.error("Erreur lors de l'activation :", err);
    } finally {
      setActionLoading(null);
    }
  };

  // ── Supprimer un utilisateur (UI seulement)
  const handleDeleteUser = (userId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      setUsers(users.filter((user) => user.id !== userId));
    }
  };

  // ── Ouvrir modal changement de rôle
  const handleOpenRoleModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setShowRoleModal(true);
  };

  // ── Changer le rôle
  const handleChangeRole = async () => {
    if (!selectedUser || !newRole) return;

    try {
      setActionLoading(selectedUser.id);
      await changeUserRole(selectedUser.id, newRole);
      setShowRoleModal(false);
      fetchUsers();
    } catch (err) {
      console.error("Erreur lors du changement de rôle :", err);
      alert("Erreur: " + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestion des Utilisateurs</h2>
      <p>Ici l'administrateur peut voir, activer et gérer les comptes utilisateurs.</p>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Table striped bordered hover responsive className="mt-4 bg-white shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.nom}</td>
                <td>{user.prenom}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <Badge bg={user.isactivated ? "success" : "secondary"}>
                    {user.isactivated ? "Activé" : "Inactif"}
                  </Badge>
                </td>
                <td className="d-flex gap-2">
                  <Button
                    size="sm"
                    variant={user.isactivated ? "secondary" : "success"}
                    disabled={actionLoading === user.id}
                    onClick={() => handleToggleActivation(user.id, user.isactivated)}
                  >
                    {actionLoading === user.id ? (
                      <Spinner as="span" animation="border" size="sm" />
                    ) : user.isactivated ? (
                      "Désactiver"
                    ) : (
                      "Activer"
                    )}
                  </Button>

                  <Button
                    size="sm"
                    variant="info"
                    disabled={actionLoading === user.id}
                    onClick={() => handleOpenRoleModal(user)}
                  >
                    Changer rôle
                  </Button>

                  <Button
                    size="sm"
                    variant="danger"
                    disabled={actionLoading === user.id}
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Supprimer
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal Changement de Rôle */}
      <Modal show={showRoleModal} onHide={() => setShowRoleModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Changer le rôle de {selectedUser?.prenom} {selectedUser?.nom}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Nouveau rôle</Form.Label>
            <Form.Select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
              <option value="admin">Admin</option>
              <option value="medecin">Médecin</option>
              <option value="pharmacien">Pharmacien</option>
              <option value="analyste">Analyste</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRoleModal(false)}>
            Annuler
          </Button>
          <Button 
            variant="primary" 
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
  );
}