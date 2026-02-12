import { useState } from "react";
import { NavLink } from "react-router-dom";
import AddButton from "../../../shared/components/UI/Button/AddButton";
import "./PatientsPage.css";

export default function PatientsPage() {

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  

  // Fake data temporaire (à remplacer par API)
  const patients = [
    {
      id: 1,
      numero: "P-001",
      name: "Ahmed",
      surname: "Ben Ali",
      hospitalisation: "oui",
    },
    {
      id: 2,
      numero: "P-002",
      name: "Sami",
      surname: "Trabelsi",
      hospitalisation: "non",
    },
  ];

  const filteredPatients = patients.filter((p) => {
    return (
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.numero.toLowerCase().includes(search.toLowerCase())) &&
      (filter === "" || p.hospitalisation === filter)
    );
  });

  return (
    <div className="patients-page">
      {/* HEADER */}
      <div className="patients-header">
        <h2>Mes Patients</h2>

        <div className="header-actions">
          <label>Filtrer</label>
          <input
            type="text"
            placeholder="par nom ou numéro..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">Tous</option>
            <option value="oui">Hospitalisé</option>
            <option value="non">Non hospitalisé</option>
          </select>

          <h1>
                  <NavLink 
                    to={`/medecin/patient/${1}/workspace`} 
                    className="td-link"
                  >
                    <AddButton />
                  </NavLink>   
                </h1> 

        </div>
      </div>

      {/* TABLE */}
      <div className="patients-table">
        <table>
          <thead>
            <tr>
              <th>Numéro dossier</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr
                key={patient.id}
              >
                <td>
                  <NavLink 
                    to={`/medecin/patient/${patient.id}/workspace`} 
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
                      patient.hospitalisation === "oui"
                        ? "badge red"
                        : "badge green"
                    }
                  >
                    {patient.hospitalisation === "oui"
                      ? "Hospitalisé"
                      : "Non hospitalisé"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}