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
      <div className="card-header bg-success bg-opacity-10 text-success d-flex justify-content-between align-items-center">
        <h6 className="mb-0 fw-normal">
          <i className="bi bi-clipboard2-data me-2"></i>
          Historique des fiches VIH
        </h6>
        <span className="badge bg-success bg-opacity-25 text-success">{history.length} fiche(s)</span>
      </div>
      
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-sm table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th className="text-center fw-normal" style={{width: "70px"}}>#</th>
                <th className="fw-normal">Mode contamination</th>
                <th className="fw-normal">Type dépistage</th>
                <th className="fw-normal">Circonstance découverte</th>
                <th className="text-center fw-normal">Date VIH+</th>
                <th className="text-center fw-normal">Stade CDC</th>
                <th className="text-center fw-normal">HLA-B5701</th>
                <th className="fw-normal">Créée par</th>
                <th className="text-center fw-normal" style={{width: "90px"}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry, index) => {
                const isActive = entry.id === currentVihId;
                
                return (
                  <tr 
                    key={entry.id}
                    className={isActive ? "table-info" : ""}
                  >
                    <td className="text-center">
                      <span className="text-muted">#{history.length - index}</span>
                      {isActive && (
                        <div>
                          <span className="badge bg-info text-dark mt-1" style={{fontSize: "9px"}}>
                            AFFICHÉE
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="text-secondary">{entry.mode_contamination || "-"}</td>
                    <td className="text-secondary">{entry.type_depistage || "-"}</td>
                    <td className="text-secondary"><small>{entry.circonstance_decouverte || "-"}</small></td>
                    <td className="text-center">
                      <small className="text-muted">
                        {formatDateOnly(entry.date_vih_positif)}
                      </small>
                    </td>
                    <td className="text-center">
                      <span className={`badge ${
                        entry.stade_cdc?.startsWith('A') ? 'bg-info bg-opacity-75' :
                        entry.stade_cdc?.startsWith('B') ? 'bg-warning bg-opacity-75 text-dark' :
                        entry.stade_cdc?.startsWith('C') ? 'bg-danger bg-opacity-75' : 'bg-secondary bg-opacity-75'
                      }`} style={{fontSize: "11px"}}>
                        {entry.stade_cdc || "-"}
                      </span>
                    </td>
                    <td className="text-center">
                      <span className={`badge ${
                        entry.typage_hla_b5701 === 'Positif' ? 'bg-danger bg-opacity-75' :
                        entry.typage_hla_b5701 === 'Négatif' ? 'bg-success bg-opacity-75' : 'bg-secondary bg-opacity-75'
                      }`} style={{fontSize: "11px"}}>
                        {entry.typage_hla_b5701 || "-"}
                      </span>
                    </td>
                    <td>
                      <small className="text-muted">
                        {entry.created_by_nom || "-"} {entry.created_by_prenom || ""}
                      </small>
                    </td>
                    <td className="text-center">
                      {!isActive && (
                        <button
                          onClick={() => onLoadVih(entry)}
                          className="btn btn-sm btn-outline-secondary"
                          title="Charger cette fiche"
                          style={{fontSize: "12px", padding: "2px 8px"}}
                        >
                          <i className="bi bi-eye"></i> Voir
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