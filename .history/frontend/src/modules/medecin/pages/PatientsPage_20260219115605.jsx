import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import AddButton from "../../../shared/components/UI/Button/AddButton";
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
                <tr>
                  <th>Dossier</th>
                  <th>Patient</th>
                  <th>Statut</th>
                  <th>Créé par</th>
                  <th>Modifié par</th> 
                </tr>
              </thead>

              <tbody>
                {filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty">
                      Aucun patient trouvé
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((patient) => (
                    <tr key={patient.numero}>
                      <td>
                        <NavLink
                          to={`/medecin/patient/${patient.numero}/workspace`}
                          className="link"
                        >
                          {patient.numero}
                        </NavLink>
                      </td>

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

                      <td>
                        <span
                          className={
                            patient.hospitalisation === "interne"
                              ? "badge danger"
                              : "badge success"
                          }
                        >
                          {patient.hospitalisation}
                        </span>
                      </td>

                      <td>
                        <div className="user-cell">
                          <div className="mini-avatar">
                            {patient.created_by_name?.charAt(0) || "-"}
                          </div>
                          {patient.created_by_name }
                        </div>
                      </td>

                      <td>
                        <div className="user-cell">
                          <div className="mini-avatar">
                            {patient.updated_by_name?.charAt(0) || "-"}
                          </div>
                          {patient.updated_by_name }
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
