import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPatientsWithOrdonnances } from "../services/Patientordonnanceservice";
import "./Patientsordonnances.css";


export default function Patientsordonnances() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getPatientsWithOrdonnances();
        
        if (data && data.patients && Array.isArray(data.patients)) {
          setPatients(data.patients);
        } else {
          setPatients([]);
        }
      } catch (err) {
        console.error("Erreur:", err);
        setError(err.message || "Erreur lors du chargement");
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtrer
  const filtered = Array.isArray(patients) 
    ? patients.filter((p) =>
        p.patient_name?.toLowerCase().includes(search.toLowerCase()) ||
        p.patient_surname?.toLowerCase().includes(search.toLowerCase()) ||
        p.numero_dossier?.toLowerCase().includes(search.toLowerCase()) ||
        p.nom_traitement?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  // Formater date
  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR");
  };

  // Badge statut
  const getStatutBadge = (statutCalcule, ecartJours) => {
    const statuts = {
      "perdu de vue": { class: "statut-perdu", text: "Perdu de vue" },
      "en retard": { class: "statut-retard", text: "En retard" },
      "retard léger": { class: "statut-leger", text: "Retard léger" },
      "à venir": { class: "statut-avenir", text: "À venir" },
      "en cours": { class: "statut-actif", text: "En cours" },
    };

    const badge = statuts[statutCalcule] || { class: "statut-default", text: statutCalcule };

    return (
      <div className="statut-wrapper">
        <span className={`statut-badge ${badge.class}`}>{badge.text}</span>
        {ecartJours !== null && ecartJours > 0 && (
          <span className="ecart-badge">+{ecartJours}j</span>
        )}
      </div>
    );
  };

  // Navigation
  const handleRowClick = (patient) => {
    if (patient.numero_dossier) {
      navigate(`/pharmacien/workspace/${patient.numero_dossier}`);
    }
  };

  if (loading) {
    return (
      <div className="ordonnances-page-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Chargement des ordonnances...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ordonnances-page-container">
        <div className="error-state">
          <p className="error-message"> {error}</p>
          <button onClick={() => window.location.reload()} className="btn-retry">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ordonnances-page-container">
      {/* HEADER */}
      <div className="ordonnances-header">
        <h2 className="page-title">Liste des ordonnances VIH ({filtered.length})</h2>
        <input
          type="text"
          placeholder="Rechercher par nom, prénom ou traitement"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {/* TABLE */}
      <div className="ordonnances-table-wrapper">
        <table className="ordonnances-table">
          <thead>
            <tr>
              <th className="col-numero">N° DOSSIER</th>
              <th className="col-nom">NOM</th>
              <th className="col-prenom">PRÉNOM</th>
              <th className="col-traitement">TRAITEMENT</th>
              <th className="col-date">DATE DÉBUT</th>
              <th className="col-date">PROCHAINE PRISE</th>
              <th className="col-quantite">QUANTITÉ</th>
              <th className="col-statut">STATUT</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  {search ? "Aucun résultat trouvé" : "Aucune ordonnance enregistrée"}
                </td>
              </tr>
            ) : (
              filtered.map((p, index) => (
                <tr
                  key={p.ordonnance_id || index}
                  onClick={() => handleRowClick(p)}
                  className="table-row"
                >
                  {/* N° Dossier - SANS EFFET VERT */}
                  <td className="td-numero">
                    <span className="numero-simple">{p.numero_dossier || "-"}</span>
                  </td>

                  {/* Nom */}
                  <td className="td-nom">{p.patient_name || "-"}</td>

                  {/* Prénom */}
                  <td className="td-prenom">{p.patient_surname || "-"}</td>

                  {/* Traitement */}
                  <td className="td-traitement">{p.nom_traitement || "Aucun"}</td>

                  {/* Date début */}
                  <td className="td-date">{formatDate(p.date_debut_traitement)}</td>

                  {/* Prochaine prise */}
                  <td className="td-date">
                    {p.date_prochaine_prise ? (
                      <span className={p.ecart_jours > 0 ? "date-retard" : "date-future"}>
                        {formatDate(p.date_prochaine_prise)}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>

                  {/* Quantité */}
                  <td className="td-quantite">{p.quantite_prescrite || "-"}</td>

                  {/* Statut */}
                  <td className="td-statut">
                    {getStatutBadge(p.statut_calcule, p.ecart_jours)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}