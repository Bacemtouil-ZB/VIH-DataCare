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
      <div className="patients-header">
        <h2>Mes Patients</h2>

        <div className="header-actions">
          <input
            type="text"
            placeholder="Rechercher par nom ou numéro..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">Tous</option>
            <option value="interne">Interne</option>
            <option value="externe">Externe</option>
          </select>

          <NavLink
            to="/medecin/patient/new/workspace"
            className="td-link"
          >
            <AddButton />
          </NavLink>
        </div>
      </div>

      <div className="patients-table">
        {loading ? (
          <p>Chargement...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Numéro dossier</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Statut</th>
                <th>Créé par</th>
                <th>Modifié par</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="6">Aucun patient trouvé</td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient.numero}>
                    <td>
                      <NavLink
                        to={`/medecin/patient/${patient.numero}/workspace`}
                        className="td-link"
                      >
                        {patient.numero}
                      </NavLink>
                    </td>

                    <td>{patient.name}</td>
                    <td>{patient.surname}</td>

                    <td>
                      <span
                        className={
                          patient.hospitalisation === "interne"
                            ? "badge red"
                            : "badge green"
                        }
                      >
                        {patient.hospitalisation === "interne"
                          ? "Interne"
                          : "Externe"}
                      </span>
                    </td>

                    <td>{patient.created_by_name || "-"}</td>
                    <td>{patient.updated_by_name || "-"}</td>
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