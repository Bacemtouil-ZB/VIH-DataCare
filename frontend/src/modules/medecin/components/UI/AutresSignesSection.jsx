import { useState } from "react";
import { Badge } from "../../../../shared/components";

const styles = `
.ec-autres-title { font-size: .78rem; letter-spacing: .5px; }
.ec-flex-appareil { flex: 1 1 180px; }
.ec-flex-desc { flex: 3 1 260px; }
.ec-input-edit { border-radius: 6px; font-size: .875rem; }
.ec-desc-add-hint { letter-spacing: 0; }
`;

export function AutresSignesSection({ title = "Autres signes", appareils, autresSignes, appareilSelectionne, descriptionSigne, onAppareilChange, onDescriptionChange, onAjouter, onSupprimer, onModifierDescription }) {
  const [editingId, setEditingId] = useState(null);
  const [editingVal, setEditingVal] = useState("");

  const startEdit = (s) => { setEditingId(s.id); setEditingVal(s.description); };
  const cancelEdit = () => { setEditingId(null); setEditingVal(""); };
  const confirmEdit = (id) => {
    if (!editingVal.trim()) return;
    onModifierDescription(id, editingVal.trim());
    setEditingId(null);
    setEditingVal("");
  };

  return (
    <>
      <style>{styles}</style>
      <div>
        <p className="text-uppercase fw-bold text-secondary mb-3 ec-autres-title">{title}</p>
        <div className="d-flex gap-3 flex-wrap align-items-end mb-3">
          <div className="ec-flex-appareil">
            <label className="ec-label ec-th-sm">Appareil</label>
            <select className="form-select form-select-sm" value={appareilSelectionne} onChange={(e) => onAppareilChange(e.target.value)}>
              <option value="">Selectionnez...</option>
              {appareils.map((app) => <option key={app.id} value={app.id}>{app.libelle}</option>)}
            </select>
          </div>
          <div className="ec-flex-desc">
            <label className="ec-label ec-th-sm">Description <span className="text-danger fw-normal text-capitalize ec-desc-add-hint">- Entree pour ajouter</span></label>
            <input type="text" className="form-control form-control-sm" placeholder="Decrivez les details et appuyez sur Entree..." value={descriptionSigne} onChange={(e) => onDescriptionChange(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onAjouter()} />
          </div>
        </div>

        {autresSignes.length > 0 && (
          <table className="table table-sm table-hover mb-4">
            <thead className="table-light"><tr><th className="ec-th-appareil">Appareil</th><th className="ec-th-desc">Description</th><th className="ec-th-actions">Actions</th></tr></thead>
            <tbody>
              {autresSignes.map((s) => (
                <tr key={s.id}>
                  <td className="ec-td-vmiddle"><Badge bg="#dbeafe" color="#1d4ed8">{s.appareil}</Badge></td>
                  <td className="ec-td-vmiddle">
                    {editingId === s.id ? (
                      <div className="d-flex align-items-center gap-2">
                        <input type="text" className="form-control form-control-sm ec-input-edit" value={editingVal} autoFocus onChange={(e) => setEditingVal(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") confirmEdit(s.id); if (e.key === "Escape") cancelEdit(); }} />
                        <button className="btn btn-sm btn-success py-0 px-2" title="Confirmer" onClick={() => confirmEdit(s.id)}><i className="bi bi-check-lg"></i></button>
                        <button className="btn btn-sm btn-outline-secondary py-0 px-2" title="Annuler" onClick={cancelEdit}><i className="bi bi-x-lg"></i></button>
                      </div>
                    ) : (<span className="ec-desc-text">{s.description}</span>)}
                  </td>
                  <td className="ec-td-actions"><div className="d-flex gap-1 justify-content-center">{editingId !== s.id && (<button className="btn btn-sm btn-outline-primary py-0 px-2" title="Modifier la description" onClick={() => startEdit(s)}><i className="bi bi-pencil"></i></button>)}<button className="btn btn-sm btn-outline-danger py-0 px-2" title="Supprimer" onClick={() => onSupprimer(s.id)}><i className="bi bi-trash"></i></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

