import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPatientsWithOrdonnances } from "../services/patientOrdonnanceService";
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
          console.error("Format de données incorrect:", data);
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

  // Filtrer par nom ou prénom
  const filtered = Array.isArray(patients) 
    ? patients.filter((p) =>
        p.patient_name?.toLowerCase().includes(search.toLowerCase()) ||
        p.patient_surname?.toLowerCase().includes(search.toLowerCase()) ||
        p.nom_traitement?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR");
  };

  // Fonction pour obtenir la classe CSS selon le statut
  const getStatutClass = (statut) => {
    switch (statut) {
      case "perdu de vue":
        return "statut-perdu";
      case "en retard":
        return "statut-retard";
      case "retard léger":
        return "statut-retard-leger";
      case "à venir":
        return "statut-a-venir";
      case "en cours":
        return "statut-en-cours";
      default:
        return "statut-inconnu";
    }
  };

  if (loading) {
    return (
      <div className="patients-page">
        <div className="loading">
          <div className="spinner"></div>
          <p>Chargement des ordonnances...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="patients-page">
        <div className="error-container">
          <p className="error-message">❌ Erreur: {error}</p>
          <button onClick={() => window.location.reload()} className="btn-retry">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="patients-page">
      <div className="header">
        <h2>Liste des ordonnances VIH ({filtered.length})</h2>
        <input
          type="text"
          placeholder="Rechercher par nom, prénom ou traitement..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search"
        />
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>NOM</th>
            <th>PRÉNOM</th>
            <th>TRAITEMENT</th>
            <th>DATE DÉBUT</th>
            <th>PROCHAINE PRISE</th>
            <th>QUANTITÉ</th>
            <th>STATUT</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="8" className="no-data">
                {search ? "Aucun résultat trouvé" : "Aucune ordonnance disponible"}
              </td>
            </tr>
          ) : (
            filtered.map((p, index) => (
              <tr
                key={p.ordonnance_id || index}
                onClick={() => {
                  if (p.ordonnance_id) {
                    navigate(`/pharmacien/workspace?ordonnanceId=${p.ordonnance_id}`);
                  }
                }}
                className="table-row"
              >
                <td className="td-name">{p.patient_name || "-"}</td>
                <td className="td-surname">{p.patient_surname || "-"}</td>
                <td className="td-traitement">{p.nom_traitement || "-"}</td>
                <td>{formatDate(p.date_debut_traitement)}</td>
                <td>{formatDate(p.date_prochaine_prise)}</td>
                <td className="td-quantite">{p.quantite_prescrite || "-"}</td>
                <td>
                  <span className={`badge ${getStatutClass(p.statut_calcule)}`}>
                    {p.statut_calcule || p.statut || "-"}
                  </span>
                </td>
                <td>
                  {p.ordonnance_id && (
                    <button
                      className="btn-action"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/pharmacien/workspace?ordonnanceId=${p.ordonnance_id}`);
                      }}
                      title="Voir l'ordonnance"
                    >
                      👁️
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}