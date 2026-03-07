import React from "react";
import { Table, Button, Spinner, Badge, Modal, Form, InputGroup } from "react-bootstrap";
import "./users_page.css";

export default function UsersPageUI({
  filteredUsers,
  loading,
  actionLoading,
  roleOptions,
  totals,

  query,
  setQuery,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,

  showRoleModal,
  selectedUser,
  newRole,
  setNewRole,

  onToggleActivation,
  onOpenRoleModal,
  onCloseRoleModal,
  onChangeRole,
}) {
  const { totalUsers, activeUsers, inactiveUsers } = totals;

  return (
    <div className="users-page">
      <div className="users-page__header">
        <div className="users-page__title">
          <h2>Utilisateurs</h2>
          <p>Gérez les comptes, les rôles et l’activation.</p>
        </div>

        <div className="users-page__stats" aria-label="Statistiques utilisateurs">
          <div className="stat-card">
            <span>Total</span>
            <strong>{totalUsers}</strong>
          </div>
          <div className="stat-card stat-card--success">
            <span>Activés</span>
            <strong>{activeUsers}</strong>
          </div>
          <div className="stat-card stat-card--muted">
            <span>Inactifs</span>
            <strong>{inactiveUsers}</strong>
          </div>
        </div>
      </div>

      <div className="users-page__toolbar">
        <InputGroup className="toolbar__search">
          <InputGroup.Text aria-label="Rechercher">
            <i className="bi bi-search" aria-hidden="true" />
          </InputGroup.Text>
          <Form.Control
            placeholder="Rechercher (nom, prénom, email)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Rechercher par nom, prénom ou email"
          />
        </InputGroup>

        <Form.Select
          className="toolbar__select"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          aria-label="Filtrer par rôle"
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
          aria-label="Filtrer par statut"
        >
          <option value="all">Tous les statuts</option>
          <option value="active">Activés</option>
          <option value="inactive">Inactifs</option>
        </Form.Select>
      </div>

      {loading ? (
        <div className="users-page__loading" aria-busy="true">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div className="users-table-wrap">
          <Table hover responsive className="users-table mb-0">
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
                      <td className="cell-strong">{user.nom}</td>
                      <td>{user.prenom}</td>
                      <td className="cell-email">{user.email}</td>
                      <td className="text-capitalize">{user.role}</td>
                      <td>
                        <Badge
                          bg={user.isactivated ? "success" : "secondary"}
                          className="status-badge"
                        >
                          <i
                            className={`bi ${
                              user.isactivated ? "bi-check-circle" : "bi-dash-circle"
                            } me-1`}
                            aria-hidden="true"
                          />
                          {user.isactivated ? "Activé" : "Inactif"}
                        </Badge>
                      </td>
                      <td>
                        <div className="users-table__actions">
                          <Button
                            size="sm"
                            variant={user.isactivated ? "outline-secondary" : "success"}
                            disabled={busy}
                            onClick={() => onToggleActivation(user.id, user.isactivated)}
                            className="btn-icon"
                          >
                            {busy ? (
                              <Spinner as="span" animation="border" size="sm" />
                            ) : (
                              <>
                                <i
                                  className={`bi ${
                                    user.isactivated ? "bi-pause-circle" : "bi-play-circle"
                                  } me-2`}
                                  aria-hidden="true"
                                />
                                {user.isactivated ? "Désactiver" : "Activer"}
                              </>
                            )}
                          </Button>

                          <Button
                            size="sm"
                            variant="outline-primary"
                            disabled={busy}
                            onClick={() => onOpenRoleModal(user)}
                            className="btn-icon"
                          >
                            <i className="bi bi-person-gear me-2" aria-hidden="true" />
                            Changer rôle
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

      <Modal show={showRoleModal} onHide={onCloseRoleModal} centered>
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
          <Button variant="outline-secondary" onClick={onCloseRoleModal}>
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={onChangeRole}
            disabled={actionLoading === selectedUser?.id}
            className="btn-icon"
          >
            {actionLoading === selectedUser?.id ? (
              <Spinner as="span" animation="border" size="sm" />
            ) : (
              <>
                <i className="bi bi-check2 me-2" aria-hidden="true" />
                Confirmer
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}