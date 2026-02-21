import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { getAllPatients } from "../../../shared/services/patientService";
import "./PatientsPage.css";

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await getAllPatients();
        setPatients(response.patients || response || []);
      } catch (error) {
        console.error("Erreur chargement patients:", error);
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients = Array.isArray(patients)
    ? patients.filter((p) => {
        return (
          (p.name?.toLowerCase().includes(search.toLowerCase()) ||
            p.numero?.toLowerCase().includes(search.toLowerCase())) &&
          (filter === "" || p.hospitalisation === filter)
        );
      })
    : [];

  return (
    <div className="patients-page">
      <div className="patients-toolbar">
          <div className="toolbar-left">
            <h2>Patients</h2>
            <span className="count">{filteredPatients.length} résultats</span>
          </div>

          <div className="toolbar-right">
            <div className="search-box">
              <input
                type="text"
                placeholder="Rechercher patient..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="filter-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="">Tous</option>
              <option value="interne">Interne</option>
              <option value="externe">Externe</option>
            </select>

            <NavLink
              to="/medecin/patient/new/workspace"
              className="btn-primary"
            >
              + Nouveau patient
            </NavLink>
          </div>
        </div>

        <div className="table-wrapper">
          {loading ? (
            <div className="skeleton-table">
              <div className="skeleton-row" />
              <div className="skeleton-row" />
              <div className="skeleton-row" />
            </div>
          ) : (
            <table>
              <thead>
               <thead>
                  <tr>
                    <th>Dossier</th>
                    <th>Patient</th>
                    <th>Date naissance</th>
                    <th>Médecin</th>
                    <th>1ère consultation</th>
                    <th>Traitement</th>
                    <th>Statut</th>
                    <th>Créé par</th>
                  </tr>
                </thead>
              </thead>

              <tbody>
                {filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="empty">
                      Aucun patient trouvé
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((patient) => (
                    <tr key={patient.numero}>
                      {/* DOSSIER */}
                      <td>
                        <NavLink
                          to={`/medecin/patient/${patient.numero}/workspace`}
                          className="link"
                        >
                          {patient.numero}
                        </NavLink>
                      </td>

                      {/* PATIENT */}
                      <td>
                        <div className="patient-cell">
                          <div className="avatar">
                            {patient.name?.charAt(0)}
                          </div>
                          <div>
                            <div className="name">
                              {patient.name} {patient.surname}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* DATE NAISSANCE */}
                      <td>
                        {new Date(patient.birthdate).toLocaleDateString()}
                      </td>

                      {/* MEDECIN (temporairement ID) */}
                      <td>
                        {patient.doctor_id ? `Dr #${patient.doctor_id}` : "-"}
                      </td>

                      {/* 1ERE CONSULTATION */}
                      <td>
                        {patient.last_visit_date
                          ? new Date(patient.last_visit_date).toLocaleDateString()
                          : "Non encore"}
                      </td>

                      {/* TRAITEMENT (placeholder) */}
                      <td>
                        Aucun
                      </td>

                      {/* STATUT basé sur hospitalisation */}
                      <td>
                        <span
                          className={
                            patient.hospitalisation === "interne"
                              ? "badge danger"
                              : "badge success"
                          }
                        >
                          {patient.hospitalisation === "interne"
                            ? "Hospitalisé"
                            : "Ambulatoire"}
                        </span>
                      </td>

                      {/* CREE PAR */}
                      <td>
                        {patient.created_by}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
  );
}
