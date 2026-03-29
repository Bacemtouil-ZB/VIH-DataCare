// PatientsPage.jsx — UI only

import { NavLink } from "react-router-dom";
import {
  ActionButton,
  PageTitle,
  FilterToolbar,
  Spinner,
} from "../../../../shared/components/index.js";

import usePatientsPage                           from "./usePatientsPage.js";
import { daysUntil, getRdvBarWidth, getDaysLabel } from "./patientsPageHelpers.js";
import {
  HOSPITALISATION_OPTIONS,
  RDV_FILTER_OPTIONS,
  TABLE_COLUMNS,
}                                                from "./patientsPageConstants.js";

import "./PatientsPage.css";

export default function PatientsPage() {
  const {
    filteredPatients,
    prescMap,
    rdvMap,
    loading,
    search,    setSearch,
    filter,    setFilter,
    rdvFilter, setRdvFilter,
    handleNewPatient,
  } = usePatientsPage();

  return (
    <div className="patients-page">

      {/* ── Toolbar ────────────────────────────────────────────────────────── */}
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
                type: "search",
                value: search,
                onChange: (e) => setSearch(e.target.value),
                placeholder: "Rechercher patient...",
                wrapperClassName: "search-box mb-0",
                height: "40px",
                width: "520px",
              },
              {
                type: "select",
                value: filter,
                onChange: (e) => setFilter(e.target.value),
                className: "filter-select",
                options: HOSPITALISATION_OPTIONS,
              },
              {
                type: "select",
                value: rdvFilter,
                onChange: (e) => setRdvFilter(e.target.value),
                className: "filter-select",
                options: RDV_FILTER_OPTIONS,
              },
            ]}
          />

          <FilterToolbar
            className="toolbar-right"
            actions={[
              <ActionButton
                key="add"
                action="add"
                label="Nouveau patient"
                onClick={handleNewPatient}
                height="40px"
              />,
            ]}
          />
        </div>
      </div>

      {/* ── Table ──────────────────────────────────────────────────────────── */}
      <div className="table-wrapper">
        {loading ? (
          <Spinner />
        ) : (
          <table>
            <thead>
              <tr>
                {TABLE_COLUMNS.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
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
                    key={patient.numero}
                    patient={patient}
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

/* ── PatientRow ──────────────────────────────────────────────────────────── */
function PatientRow({ patient, traitement, rdv }) {
  const days      = rdv ? daysUntil(rdv.date) : null;
  const daysLabel = days !== null ? getDaysLabel(days) : null;
  const rdvDate   = rdv ? new Date(rdv.date).toLocaleDateString("fr-FR") : null;
  const bar       = rdv ? getRdvBarWidth(days) : null; // { width, cls }

  return (
    <tr>
      {/* Dossier */}
      <td>
        <NavLink
          to={`/medecin/patient/${patient.numero}/workspace`}
          className="link"
        >
          {patient.numero}
        </NavLink>
      </td>

      {/* Patient */}
      <td>
        <div className="patient-cell">
          <div className="avatar">{patient.name?.charAt(0)}</div>
          <div className="name">{patient.name} {patient.surname}</div>
        </div>
      </td>

      {/* Date naissance */}
      <td>
        {patient.birthdate
          ? new Date(patient.birthdate).toLocaleDateString("fr-FR")
          : "-"}
      </td>

      {/* Traitement */}
      <td>
        {traitement && traitement !== "Aucun" ? (
          <span className="badge traitement-active">{traitement}</span>
        ) : (
          <span className="badge traitement-none">Aucun</span>
        )}
      </td>

      {/* Rendez-vous — Option D: progress bar */}
      <td>
        {rdv ? (
          <div className="rdv-bar-cell">
            <div className="rdv-bar-top">
              <span className="rdv-bar-date">{rdvDate}</span>
              <span className="rdv-bar-days">{daysLabel}</span>
            </div>
            <div className="rdv-bar-track">
              <div
                className={`rdv-bar-fill ${bar.cls}`}
                style={{ width: `${bar.width}%` }}
              />
            </div>
          </div>
        ) : (
          <span className="badge rdv-none">Aucun RDV</span>
        )}
      </td>

      {/* Statut */}
      <td>
        <span
          className={
            patient.hospitalisation === "interne" ? "badge danger" : "badge success"
          }
        >
          {patient.hospitalisation}
        </span>
      </td>
    </tr>
  );
}