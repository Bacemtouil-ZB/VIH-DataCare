import { NavLink }  from "react-router-dom";
import { useRef, useState, useEffect }  from "react";

import { ActionButton, PageTitle, FilterToolbar, Spinner} from "../../../../shared/components/index.js";

import usePatientsPage    from "./usePatientsPage.js";
import useNotifications   from "./notification/useNotifications.js";
import { daysUntil, getRdvBarWidth, getDaysLabel } from "./patientsPageHelpers.js";
import { HOSPITALISATION_OPTIONS, RDV_FILTER_OPTIONS, TABLE_COLUMNS} from "./patientsPageConstants.js";
import { NOTIF_ICON_MAP, NOTIF_TITLE_COLOR_MAP } from "./notification/notificationConstants.js";
import { formatNotifDate } from "./notification/notificationHelpers.js";

import "./PatientsPage.css";

/* ── NotificationBell ────────────────────────────────────────────────────── */
function NotificationBell({
  notifications,
  unreadCount,
  onMarkOne,
  onMarkAll,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // Fermer si clic dehors
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="notif-wrapper">

      {/* ── Cloche ── */}
      <button
        className={`notif-bell-btn ${open ? "active" : ""}`}
        onClick={() => setOpen((o) => !o)}
      >
        <i className={`bi ${open ? "bi-bell-fill" : "bi-bell"}`} />

        {/* Badge nombre non lus */}
        {unreadCount > 0 && (
          <span className="notif-badge">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* ── Dropdown ── */}
      {open && (
        <div className="notif-dropdown">

          {/* Header */}
          <div className="notif-header">
            <span className="notif-header-title">
              <i className="bi bi-bell-fill me-2" />
              Notifications
              {unreadCount > 0 && (
                <span className="notif-header-count">{unreadCount}</span>
              )}
            </span>
            {unreadCount > 0 && (
              <button className="notif-mark-all" onClick={onMarkAll}>
                <i className="bi bi-check2-all me-1" />
                Tout lu
              </button>
            )}
          </div>

          {/* Liste */}
          <div className="notif-list">
            {notifications.length === 0 ? (
              <div className="notif-empty">
                <i className="bi bi-bell-slash" />
                <span>Aucune notification</span>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.notif_id}
                  className={`notif-item ${notif.isRead ? "read" : "unread"}`}
                  onClick={() => onMarkOne(notif)}
                >
                  <div className={`notif-icon-wrap type-${notif.type}`}>
                    <i className={NOTIF_ICON_MAP[notif.type] ?? "bi bi-info-circle"} />
                  </div>

                  <div className="notif-content">
                    <div className={`notif-title ${NOTIF_TITLE_COLOR_MAP[notif.type] ?? ""}`}>{notif.title}</div>
                    <div className="notif-message">{notif.message}</div>
                    {/* ── Date ── */}
                      <div className="notif-date">
                        <i className="bi bi-clock me-1" />
                        {formatNotifDate(notif.created_at)}
                      </div>
                    {/* Lien uniquement si rdv_url existe */}
                    {notif.rdv_url && (
                      <NavLink
                        to={notif.rdv_url}
                        className="notif-link"
                        onClick={(e) => {
                          e.stopPropagation();
                          onMarkOne(notif); // enregistre clicked_at
                        }}
                      >
                        Voir détails
                        <i className="bi bi-arrow-right ms-1" />
                      </NavLink>
                    )}
                  </div>

                  {!notif.isRead && <span className="notif-dot" />}
                </div>
              ))
            )}
          </div>

        </div>
      )}
    </div>
  );
}

/* ── PatientsPage ────────────────────────────────────────────────────────── */
export default function PatientsPage() {
  const {
    filteredPatients, prescMap, rdvMap, loading,
    search, setSearch, filter, setFilter,
    rdvFilter, setRdvFilter, handleNewPatient,
  } = usePatientsPage();

  const {
  notifications,
  unreadCount,
  markOne,
  markAll,
} = useNotifications();

  return (
    <div className="patients-page">

      {/* ── Toolbar ── */}
      <div className="patients-toolbar">
        <div className="toolbar-left">
          <PageTitle title="Patients" className="mb-0" />
          <span className="count">{filteredPatients.length} resultats</span>
        </div>

        <div className="patients-controls-row">
          <FilterToolbar
            className="toolbar-search"
            items={[
              {
                type: "search", value: search,
                onChange: (e) => setSearch(e.target.value),
                placeholder: "Rechercher patient...",
                wrapperClassName: "search-box mb-0", height: "40px", width: "520px",
              },
              {
                type: "select", value: filter,
                onChange: (e) => setFilter(e.target.value),
                className: "filter-select", options: HOSPITALISATION_OPTIONS,
              },
              {
                type: "select", value: rdvFilter,
                onChange: (e) => setRdvFilter(e.target.value),
                className: "filter-select", options: RDV_FILTER_OPTIONS,
              },
            ]}
          />

          <div className="toolbar-actions">
            <NotificationBell
              notifications={notifications}
              unreadCount={unreadCount}
              onMarkOne={markOne}
              onMarkAll={markAll}
            />
            <FilterToolbar
              className="toolbar-right"
              actions={[
                <ActionButton
                  key="add" action="add" label="Nouveau patient"
                  onClick={handleNewPatient} height="40px"
                />,
              ]}
            />
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="table-wrapper">
        {loading ? <Spinner /> : (
          <table>
            <thead>
              <tr>{TABLE_COLUMNS.map((col) => <th key={col}>{col}</th>)}</tr>
            </thead>
            <tbody>
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={TABLE_COLUMNS.length} className="empty">
                    Aucun patient trouve
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <PatientRow
                    key={patient.numero} patient={patient}
                    traitement={prescMap[patient.id]?.traitement ?? null}
                    rdv={rdvMap[patient.id] ?? null}
                  />
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ── PatientRow ── */
function PatientRow({ patient, traitement, rdv }) {
  const days      = rdv ? daysUntil(rdv.date) : null;
  const daysLabel = days !== null ? getDaysLabel(days) : null;
  const rdvDate   = rdv ? new Date(rdv.date).toLocaleDateString("fr-FR") : null;
  const bar       = rdv ? getRdvBarWidth(days) : null;

  return (
    <tr>
      <td>
        <NavLink to={`/medecin/patient/${patient.numero}/workspace`} className="link">
          {patient.numero}
        </NavLink>
      </td>
      <td>
        <div className="patient-cell">
          <div className="avatar">{patient.name?.charAt(0)}</div>
          <div className="name">{patient.name} {patient.surname}</div>
        </div>
      </td>
      <td>
        {patient.birthdate
          ? new Date(patient.birthdate).toLocaleDateString("fr-FR")
          : "-"}
      </td>
      <td>
        {traitement && traitement !== "Aucun"
          ? <span className="badge traitement-active">{traitement}</span>
          : <span className="badge traitement-none">Aucun</span>}
      </td>
      <td>
        {rdv ? (
          <div className="rdv-bar-cell">
            <div className="rdv-bar-top">
              <span className="rdv-bar-date">{rdvDate}</span>
              <span className="rdv-bar-days">{daysLabel}</span>
            </div>
            <div className="rdv-bar-track">
              <div className={`rdv-bar-fill ${bar.cls}`} style={{ width: `${bar.width}%` }} />
            </div>
          </div>
        ) : <span className="badge rdv-none">Aucun RDV</span>}
      </td>
      <td>
        <span className={patient.hospitalisation === "interne" ? "badge danger" : "badge success"}>
          {patient.hospitalisation}
        </span>
      </td>
    </tr>
  );
}