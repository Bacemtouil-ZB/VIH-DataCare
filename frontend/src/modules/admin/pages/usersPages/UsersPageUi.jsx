import { Modal, Form } from "react-bootstrap";
import {
  ActionButton,
  Badge,
  HistoriqueActions,
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
  roleOptionsForModal,
  totals,
  // filtres
  query, setQuery,
  roleFilter, setRoleFilter,
  statusFilter, setStatusFilter,
  // modal
  showRoleModal,
  selectedUser,
  newRole, setNewRole,
  // handlers
  onToggleActivation,
  onOpenRoleModal,
  onCloseRoleModal,
  onChangeRole,
}) {
  const { totalUsers, activeUsers, inactiveUsers } = totals;

  const renderRow = (user) => {
    const busy = actionLoading === user.id;

    // Rôle verrouillé si l'utilisateur est activé OU si son rôle est "patient"
    const roleIsLocked = user.isactivated || user.role === "patient";

    const editLabel = user.isactivated
      ? "Verrouillé (activé)"
      : user.role === "patient"
      ? "Non modifiable"
      : "Changer rôle";

    return (
      <tr key={user.id}>
        <td>{user._index + 1}</td>
        <td className="cell-strong">{user.nom}</td>
        <td>{user.prenom}</td>
        <td className="cell-email">
          {user.email || (
            <span style={{ color: "#9ca3af", fontStyle: "italic" }}>
              Aucun email
            </span>
          )}
        </td>
        <td>{user.role}</td>

        <td>
          <Badge
            bg={user.isactivated ? "#198754" : "rgba(55, 54, 54, 0.25)"}
            color="#ffffff"
          >
            <i
              className={`bi ${
                user.isactivated ? "bi-check-circle" : "bi-dash-circle"
              } me-1`}
            />
            {user.isactivated ? "Activé" : "Inactif"}
          </Badge>
        </td>

        <td style={{ whiteSpace: "nowrap" }}>
          <HistoriqueActions
            onValidate={
              !user.isactivated
                ? () => onToggleActivation(user.id, user.isactivated)
                : undefined
            }
            onCancel={
              user.isactivated
                ? () => onToggleActivation(user.id, user.isactivated)
                : undefined
            }

            // BLOQUÉ si activé OU si patient
            onEdit={() => {
              if (roleIsLocked) return;
              onOpenRoleModal(user);
            }}

            validateProps={{
              label: "Activer",
              loading: busy && !user.isactivated,
              loadingLabel: "...",
              disabled: busy,
              variant: "filled",
            }}

            cancelProps={{
              label: "Désactiver",
              loading: busy && user.isactivated,
              loadingLabel: "...",
              disabled: busy,
              variant: "outline",
            }}

            // BOUTON VERROUILLÉ SI ACTIVÉ OU PATIENT
            editProps={{
              label: editLabel,
              disabled: busy || roleIsLocked,
              variant: "outline",
            }}
          />
        </td>
      </tr>
    );
  };

  return (
    <div
      className="users-page"
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
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
            className: "toolbar__select form-select",
            options: [{ value: "all", label: "Tous les rôles" }, ...roleOptions],
          },
          {
            type: "select",
            value: statusFilter,
            onChange: (e) => setStatusFilter(e.target.value),
            className: "toolbar__select form-select",
            options: STATUS_OPTIONS,
          },
        ]}
      />

      {loading ? (
        <Spinner />
      ) : (
        <div
          className="users-table-wrap"
          style={{ flex: 1, overflowY: "auto" }}
        >
          <HistoriqueTable
            headers={TABLE_HEADERS}
            items={filteredUsers.map((u, i) => ({ ...u, _index: i }))}
            renderRow={renderRow}
            emptyMessage="Aucun utilisateur trouvé."
          />
        </div>
      )}

      {/* MODAL CHANGEMENT DE RÔLE */}
      <Modal show={showRoleModal} onHide={onCloseRoleModal} centered>
        <Modal.Header closeButton>
          <Modal.Title className="custom-title">
            Changer le rôle de {selectedUser?.prenom} {selectedUser?.nom}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group>
            <Form.Label>Nouveau rôle</Form.Label>

            {/* SELECT BLOQUÉ SI PATIENT OU DÉJÀ ACTIVÉ */}
            <Form.Select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              disabled={
                selectedUser?.role === "patient" || selectedUser?.isactivated
              }
            >
              {roleOptionsForModal.map((role) => (
                <option value={role.value} key={role.value}>
                  {role.label}
                </option>
              ))}
            </Form.Select>

            {/* Message d'info si verrouillé car activé */}
            {selectedUser?.isactivated && (
              <Form.Text style={{ color: "#d92d20" }}>
                <i className="bi bi-lock-fill me-1" />
                Le rôle ne peut plus être modifié après activation du compte.
              </Form.Text>
            )}
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <ActionButton
            action="annuler"
            onClick={onCloseRoleModal}
            variant="outline"
          />

          {/* CONFIRM BLOQUÉ SI PATIENT OU ACTIVÉ */}
          <ActionButton
            action="validate"
            label="Confirmer"
            onClick={onChangeRole}
            loading={actionLoading === selectedUser?.id}
            loadingLabel="Enregistrement..."
            disabled={
              actionLoading === selectedUser?.id ||
              selectedUser?.role === "patient" ||
              selectedUser?.isactivated
            }
          />
        </Modal.Footer>
      </Modal>
    </div>
  );
}