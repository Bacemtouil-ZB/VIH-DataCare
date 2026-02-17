export default function VihHistory({ history, currentVihId, onLoadVih }) {
  
  const formatDateOnly = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR");
  };

  if (!history || history.length === 0) {
    return null;
  }

  return (
    <div className="card shadow-sm mt-4">
      <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <i className="bi bi-clipboard2-data me-2"></i>
          Historique des fiches VIH
        </h5>
        <span className="badge bg-light text-dark">{history.length} fiche(s)</span>
      </div>
      
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th className="text-center" style={{width: "80px"}}>#</th>
                <th>Mode contamination</th>
                <th>Type dépistage</th>
                <th>Circonstance découverte</th>
                <th className="text-center">Date VIH+</th>
                <th className="text-center">Stade CDC</th>
                <th className="text-center">HLA-B5701</th>
                <th>Créée par</th>
                <th className="text-center" style={{width: "100px"}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry, index) => {
                const isActive = entry.id === currentVihId;
                
                return (
                  <tr 
                    key={entry.id}
                    className={isActive ? "table-primary" : ""}
                  >
                    <td className="text-center fw-bold">
                      #{history.length - index}
                      {isActive && (
                        <div>
                          <span className="badge bg-primary mt-1" style={{fontSize: "9px"}}>
                            AFFICHÉE
                          </span>
                        </div>
                      )}
                    </td>
                    <td>{entry.mode_contamination || "-"}</td>
                    <td>{entry.type_depistage || "-"}</td>
                    <td><small>{entry.circonstance_decouverte || "-"}</small></td>
                    <td className="text-center">
                      <span className="badge bg-secondary">
                        {formatDateOnly(entry.date_vih_positif)}
                      </span>
                    </td>
                    <td className="text-center">
                      <span className={`badge ${
                        entry.stade_cdc?.startsWith('A') ? 'bg-info' :
                        entry.stade_cdc?.startsWith('B') ? 'bg-warning text-dark' :
                        entry.stade_cdc?.startsWith('C') ? 'bg-danger' : 'bg-secondary'
                      }`}>
                        {entry.stade_cdc || "-"}
                      </span>
                    </td>
                    <td className="text-center">
                      <span className={`badge ${
                        entry.typage_hla_b5701 === 'Positif' ? 'bg-danger' :
                        entry.typage_hla_b5701 === 'Négatif' ? 'bg-success' : 'bg-secondary'
                      }`}>
                        {entry.typage_hla_b5701 || "-"}
                      </span>
                    </td>
                    <td>
                      <small>
                        {entry.created_by_nom || "-"} {entry.created_by_prenom || ""}
                      </small>
                    </td>
                    <td className="text-center">
                      {!isActive && (
                        <button
                          onClick={() => onLoadVih(entry)}
                          className="btn btn-sm btn-outline-primary"
                          title="Charger cette fiche"
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}