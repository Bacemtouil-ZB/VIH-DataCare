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

  const filtered = Array.isArray(patients)
    ? patients.filter(
        (p) =>
          p.patient_name?.toLowerCase().includes(search.toLowerCase()) ||
          p.patient_surname?.toLowerCase().includes(search.toLowerCase()) ||
          p.numero_dossier?.toLowerCase().includes(search.toLowerCase()) ||
          p.nom_traitement?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR");
  };

  // Fonction pour obtenir la classe de couleur selon le statut
  const getColorClass = (statutCalcule, joursRetard) => {
    if (statutCalcule === "perdu de vue") {
      return "color-perdu";
    } else if (statutCalcule === "actif") {
      return "color-actif";
    } else if (statutCalcule && statutCalcule.startsWith("retard de")) {
      return "color-retard";
    }
    return "color-default";
  };

  // Badge statut
  const getStatutBadge = (statutCalcule, joursRetard, colorClass) => {
    let badgeText = "En cours";

    if (statutCalcule === "perdu de vue") {
      badgeText = "Perdu de vue";
    } else if (statutCalcule === "actif") {
      badgeText = "Actif";
    } else if (statutCalcule && statutCalcule.startsWith("retard de")) {
      badgeText = "En retard";
    } else {
      badgeText = statutCalcule || "En cours";
    }

    return (
      <div className="statut-wrapper">
        <span className={`badge ${colorClass}`}>{badgeText}</span>
        {joursRetard > 0 && <span className="badge-jours">+{joursRetard}j</span>}
      </div>
    );
  };

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
          <p className="error-message">{error}</p>
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
              <th className="col-date">PROCHAINE PRISE</th>
              <th className="col-quantite">QUANTITÉ</th>
              <th className="col-statut">STATUT</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">
                  {search ? "Aucun résultat trouvé" : "Aucune ordonnance enregistrée"}
                </td>
              </tr>
            ) : (
              filtered.map((p, index) => {
                const colorClass = getColorClass(p.statut_calcule, p.jours_retard);

                return (
                  <tr
                    key={p.ordonnance_id || index}
                    onClick={() => handleRowClick(p)}
                    className="table-row"
                  >
                    <td className="td-numero">
                      <span className="numero-simple">{p.numero_dossier || "-"}</span>
                    </td>
                    <td className="td-nom">{p.patient_name || "-"}</td>
                    <td className="td-prenom">{p.patient_surname || "-"}</td>
                    <td className="td-traitement">{p.nom_traitement || "Aucun"}</td>
                    <td className="td-date">
                      {p.date_prochaine_prise ? (
                        <span className={`date-badge ${colorClass}`}>
                          {formatDate(p.date_prochaine_prise)}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="td-quantite">{p.quantite_prescrite || "-"}</td>
                    <td className="td-statut">
                      {getStatutBadge(p.statut_calcule, p.jours_retard, colorClass)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}