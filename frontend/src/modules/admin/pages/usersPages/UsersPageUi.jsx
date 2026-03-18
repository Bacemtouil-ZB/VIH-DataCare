

import { Modal, Form } from "react-bootstrap";
import {
  ActionButton,
  Badge,
  HistoriqueTable,
  FilterToolbar,
  Spinner,
} from "../../../../shared/components/index";
import PageHeader from "../../components/PageHeader";
import UserStatsCards from "../../components/Userstatscards";
import { STATUS_OPTIONS, TABLE_HEADERS } from "./usersConstants";
import "./users_page.css";

export default function UsersPageUI({
  filteredUsers,
  loading,
  actionLoading,
  roleOptions,
  totals,
  // filtres
  query,        setQuery,
  roleFilter,   setRoleFilter,
  statusFilter, setStatusFilter,
  // modal
  showRoleModal,
  selectedUser,
  newRole,      setNewRole,
  // handlers
  onToggleActivation,
  onOpenRoleModal,
  onCloseRoleModal,
  onChangeRole,
}) {
  const { totalUsers, activeUsers, inactiveUsers } = totals;

  // Rendu d'une ligne du tableau
  const renderRow = (user) => {
    const busy = actionLoading === user.id;

    return (
      <tr key={user.id}>
        <td>{user._index + 1}</td>
        <td className="cell-strong">{user.nom}</td>
        <td>{user.prenom}</td>
        <td className="cell-email">{user.email}</td>
        <td>{user.role}</td>
        <td>
          <Badge
            bg={user.isactivated ? "#198754" : "rgba(55, 54, 54, 0.25)"}
            color="#0e0d0d"
          >
            <i
              className={`bi ${user.isactivated ? "bi-check-circle" : "bi-dash-circle"} me-1`}
              aria-hidden="true"
            />
            {user.isactivated ? "Activé" : "Inactif"}
          </Badge>
        </td>
        <td style={{ whiteSpace: "nowrap" }}>
          <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
            <ActionButton
              action={user.isactivated ? "annuler" : "validate"}
              label={user.isactivated ? "Désactiver" : "Activer"}
              loading={busy}
              loadingLabel="..."
              disabled={busy}
              variant={user.isactivated ? "outline" : "filled"}
              onClick={() => onToggleActivation(user.id, user.isactivated)}
            />
            <ActionButton
              action="edit"
              label="Changer rôle"
              disabled={busy}
              variant="outline"
              onClick={() => onOpenRoleModal(user)}
            />
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="users-page" style={{ display: "flex", flexDirection: "column", height: "100%" }}>

      <div className="users-page__header">
        <PageHeader
          title="Gestion des utilisateurs"
          icon="bi bi-people"
          noBorder
        />
        <UserStatsCards
          totalUsers={totalUsers}
          activeUsers={activeUsers}
          inactiveUsers={inactiveUsers}
        />
      </div>

      {/* Toolbar filtres */}
      <FilterToolbar
        className="users-page__toolbar"
        items={[
          {
            type: "search",
            value: query,
            onChange: (e) => setQuery(e.target.value),
            placeholder: "Rechercher (nom, prénom, email)...",
            wrapperClassName: "toolbar__search mb-0",
          },
          {
            type: "select",
            value: roleFilter,
            onChange: (e) => setRoleFilter(e.target.value),
            ariaLabel: "Filtrer par rôle",
            className: "toolbar__select form-select",
            options: [
              { value: "all", label: "Tous les rôles" },
              ...roleOptions,
            ],
          },
          {
            type: "select",
            value: statusFilter,
            onChange: (e) => setStatusFilter(e.target.value),
            ariaLabel: "Filtrer par statut",
            className: "toolbar__select form-select",
            options: STATUS_OPTIONS,
          },
        ]}
      />

      {loading ? (
        <div aria-busy="true">
          <Spinner />
        </div>
      ) : (
        <div className="users-table-wrap" style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
          <div style={{ flex: 1, overflowY: "auto" }}>
            <HistoriqueTable
              headers={TABLE_HEADERS}
              items={filteredUsers.map((u, i) => ({ ...u, _index: i }))}
              renderRow={renderRow}
              emptyMessage="Aucun utilisateur trouvé."
            />
          </div>
        </div>
      )}

      {/* Modal changement de rôle */}
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
                <option value={role.value} key={role.value}>{role.label}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          {/* ActionButton réutilisable depuis shared/components */}
          <ActionButton
            action="annuler"
            onClick={onCloseRoleModal}
            variant="outline"
          />
          <ActionButton
            action="validate"
            label="Confirmer"
            onClick={onChangeRole}
            loading={actionLoading === selectedUser?.id}
            loadingLabel="Enregistrement..."
            disabled={actionLoading === selectedUser?.id}
          />
        </Modal.Footer>
      </Modal>
    </div>
  );
}
