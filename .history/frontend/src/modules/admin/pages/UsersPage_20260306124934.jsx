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
import "./admin_users_page.css";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");

  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

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
      setError("Impossible de charger les utilisateurs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleActivation = async (id, isActive) => {
    try {
      setActionLoading(id);
      await activateUser(id, !isActive);
      await fetchUsers();
    } finally {
      setActionLoading(null);
    }
  };

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setShowRoleModal(true);
  };

  const changeRole = async () => {
    try {
      setActionLoading(selectedUser.id);
      await changeUserRole(selectedUser.id, newRole);
      setShowRoleModal(false);
      await fetchUsers();
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = useMemo(() => {
    const q = query.toLowerCase();

    return users.filter((u) =>
      `${u.nom} ${u.prenom} ${u.email}`.toLowerCase().includes(q)
    );
  }, [users, query]);

  const total = users.length;
  const active = users.filter((u) => u.isactivated).length;

  return (
    <div className="admin-users">

      <div className="admin-users__header">
        <div>
          <h2>Gestion des utilisateurs</h2>
          <p>Administration des comptes et rôles.</p>
        </div>

        <div className="admin-users__stats">
          <div className="stat">
            <span>Total</span>
            <strong>{total}</strong>
          </div>

          <div className="stat stat-success">
            <span>Actifs</span>
            <strong>{active}</strong>
          </div>

          <div className="stat stat-muted">
            <span>Inactifs</span>
            <strong>{total - active}</strong>
          </div>
        </div>
      </div>

      {error && <div className="admin-alert">{error}</div>}

      <div className="admin-toolbar">
        <InputGroup className="search">
          <InputGroup.Text>🔎</InputGroup.Text>
          <Form.Control
            placeholder="Rechercher utilisateur..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </InputGroup>
      </div>

      {loading ? (
        <div className="admin-loading">
          <Spinner animation="border" />
        </div>
      ) : (
        <div className="table-container">

          <Table hover responsive className="admin-table">

            <thead>
              <tr>
                <th>#</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>

            <tbody>

              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty">
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, i) => {
                  const busy = actionLoading === user.id;

                  return (
                    <tr key={user.id}>
                      <td>{i + 1}</td>
                      <td>{user.nom}</td>
                      <td>{user.prenom}</td>
                      <td>{user.email}</td>

                      <td>
                        <span className={`role role-${user.role}`}>
                          {user.role}
                        </span>
                      </td>

                      <td>
                        <Badge bg={user.isactivated ? "success" : "secondary"}>
                          {user.isactivated ? "Actif" : "Inactif"}
                        </Badge>
                      </td>

                      <td className="actions">

                        <Button
                          size="sm"
                          variant="outline-primary"
                          disabled={busy}
                          onClick={() => openRoleModal(user)}
                        >
                          Rôle
                        </Button>

                        <Button
                          size="sm"
                          variant={
                            user.isactivated
                              ? "outline-secondary"
                              : "success"
                          }
                          disabled={busy}
                          onClick={() =>
                            toggleActivation(user.id, user.isactivated)
                          }
                        >
                          {busy ? (
                            <Spinner size="sm" />
                          ) : user.isactivated ? (
                            "Désactiver"
                          ) : (
                            "Activer"
                          )}
                        </Button>

                      </td>
                    </tr>
                  );
                })
              )}

            </tbody>
          </Table>
        </div>
      )}

      <Modal show={showRoleModal} onHide={() => setShowRoleModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Modifier rôle
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>

          <Form.Select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
          >
            {roleOptions.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </Form.Select>

        </Modal.Body>

        <Modal.Footer>

          <Button
            variant="secondary"
            onClick={() => setShowRoleModal(false)}
          >
            Annuler
          </Button>

          <Button
            variant="primary"
            onClick={changeRole}
          >
            Confirmer
          </Button>

        </Modal.Footer>
      </Modal>

    </div>
  );
}