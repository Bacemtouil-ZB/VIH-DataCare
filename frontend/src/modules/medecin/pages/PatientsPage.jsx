import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getAllPatients } from "../../../shared/services/patientService";
import { ActionButton, PageTitle, SearchBar, Spinner } from "../../../shared/components";
import {  getAllDoctors } from "../services/patientServices";

import "./PatientsPage.css";

export default function PatientsPage() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState({});

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const [response, docs] = await Promise.all([getAllPatients(), getAllDoctors()]);
        setPatients(response.patients || response || []);
        const map = {};
        (docs || []).forEach(d => { map[d.id] = `Dr. ${d.nom} ${d.prenom}`; });
        setDoctors(map);
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
          <PageTitle title="Patients" className="mb-0" />
          <span className="count">{filteredPatients.length} résultats</span>
        </div>

        <div className="toolbar-right">
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher patient..."
            wrapperClassName="search-box mb-0"
          />

          <select
            className="filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">Tous</option>
            <option value="interne">Interne</option>
            <option value="externe">Externe</option>
          </select>

          <ActionButton
            action="add"
            label="Nouveau patient"
            onClick={() => navigate("/medecin/patient/new/workspace")}
          />
        </div>
      </div>

      <div className="table-wrapper">
        {loading ? (
          <Spinner />
        ) : (
          <table>
            {/* ✅ Un seul thead, pas de double imbrication */}
            <thead>
              <tr>
                <th>Dossier</th>
                <th>Patient</th>
                <th>Date naissance</th>
                <th>Médecin Traitant</th>
                <th>Derniére consultation</th>
                <th>Traitement</th>
                <th>Statut</th>
              </tr>
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
                        <div className="name">
                          {patient.name} {patient.surname}
                        </div>
                      </div>
                    </td>

                    {/* DATE NAISSANCE */}
                    <td>
                      {patient.birthdate
                        ? new Date(patient.birthdate).toLocaleDateString()
                        : "-"}
                    </td>

                    {/* MEDECIN */}
                    <td>
                      {doctors[patient.doctor_id] || "-"}
                    </td>

                    {/* DERNIERE CONSULTATION */}
                    <td>
                      {patient.last_visit_date
                        ? new Date(patient.last_visit_date).toLocaleDateString()
                        : "Non encore"}
                    </td>

                    {/* TRAITEMENT */}
                    <td>Aucun</td>

                    {/* STATUT */}
                    <td>
                      <span
                        className={
                          patient.hospitalisation === "interne"
                            ? "badge danger"
                            : "badge success"
                        }
                      >
                        {patient.hospitalisation }
                      </span>
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


