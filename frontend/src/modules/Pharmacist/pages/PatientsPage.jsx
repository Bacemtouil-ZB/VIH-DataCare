import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { getAllPatients } from "../services/patientService";
import "./PatientsPage.css";

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ==========================================
  // CHARGER LES PATIENTS AU MONTAGE
  // ==========================================
  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await getAllPatients();
        
        // Le backend retourne: { success: true, patients: [...], total: X, count: X }
        if (response.success && response.patients) {
          setPatients(response.patients);
        } else {
          setPatients([]);
        }
      } catch (err) {
        console.error("Erreur chargement patients:", err);
        setError(err.message || "Erreur lors du chargement des patients");
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // ==========================================
  // FILTRAGE DES PATIENTS
  // ==========================================
  const filteredPatients = Array.isArray(patients)
    ? patients.filter((patient) => {
        const matchSearch = 
          patient.name?.toLowerCase().includes(search.toLowerCase()) ||
          patient.surname?.toLowerCase().includes(search.toLowerCase()) ||
          patient.numero?.toLowerCase().includes(search.toLowerCase());

        const matchFilter = 
          filter === "" || patient.hospitalisation === filter;

        return matchSearch && matchFilter;
      })
    : [];

  return (
    <div className="patients-page">
      {/* HEADER */}
      <div className="patients-header">
        <h2>Mes Patients ({patients.length})</h2>

        <div className="header-actions">
          {/* Barre de recherche */}
          <input
            type="text"
            placeholder="Rechercher par nom, prénom ou numéro..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />

          {/* Filtre par statut */}
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">Tous les statuts</option>
            <option value="interne">Interne</option>
            <option value="externe">Externe</option>
          </select>
        </div>
      </div>

      {/* TABLEAU */}
      <div className="patients-table">
        {loading ? (
          <div className="loading-state">
            <p>Chargement des patients...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p className="error-message">❌ {error}</p>
            <button onClick={() => window.location.reload()}>
              Réessayer
            </button>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Numéro dossier</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Date de naissance</th>
                <th>Téléphone</th>
                <th>Statut</th>
                <th>Créé par</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-data">
                    {search || filter 
                      ? "Aucun patient ne correspond à votre recherche" 
                      : "Aucun patient enregistré"}
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient.numero || patient.id}>
                    {/* Numéro de dossier (cliquable) */}
                    <td>
                      <NavLink
                        to={`/pharmacien/patient/${patient.numero}/workspace`}
                        className="td-link"
                      >
                        {patient.numero}
                      </NavLink>
                    </td>

                    {/* Nom */}
                    <td>{patient.name}</td>

                    {/* Prénom */}
                    <td>{patient.surname}</td>

                    {/* Date de naissance */}
                    <td>
                      {patient.birthdate 
                        ? new Date(patient.birthdate).toLocaleDateString('fr-FR')
                        : '-'}
                    </td>

                    {/* Téléphone */}
                    <td>{patient.phone || '-'}</td>

                    {/* Statut hospitalisation */}
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

                    {/* Créé par */}
                    <td>
                      {patient.created_by_nom && patient.created_by_prenom
                        ? `${patient.created_by_nom} ${patient.created_by_prenom}`
                        : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* STATISTIQUES (optionnel) */}
      {!loading && !error && (
        <div className="patients-footer">
          <p>
            Affichage de {filteredPatients.length} patient(s) 
            {search || filter ? ` sur ${patients.length} total` : ''}
          </p>
        </div>
      )}
    </div>
  );
}