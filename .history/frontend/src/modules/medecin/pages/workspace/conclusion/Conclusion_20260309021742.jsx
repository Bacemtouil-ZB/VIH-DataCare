import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import {
  listPatientConclusions,
  createPatientConclusion,
  updateConclusion
} from "../services/conclusionService";

import HistoriqueTable from "../../../shared/components/HistoriqueTable";
import HistoriqueActions from "../../../shared/components/HistoriqueActions";

const PatientConclusionsPage = ({ numero }) => {

  const [conclusions, setConclusions] = useState([]);
  const [editorValue, setEditorValue] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const headers = [
    "Date",
    "Aperçu",
    "Actions"
  ];

  const loadConclusions = async () => {
    try {
      setLoading(true);
      const data = await listPatientConclusions(numero);
      setConclusions(data.items || data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (numero) {
      loadConclusions();
    }
  }, [numero]);

  const handleSave = async () => {
    if (!editorValue.trim()) return;

    try {
      setSaving(true);

      if (editingId) {
        await updateConclusion(editingId, { content: editorValue });
      } else {
        await createPatientConclusion(numero, { content: editorValue });
      }

      setEditorValue("");
      setEditingId(null);
      loadConclusions();

    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (conclusion) => {
    setEditorValue(conclusion.content);
    setEditingId(conclusion.id);
  };

  const handleCancel = () => {
    setEditorValue("");
    setEditingId(null);
  };

  const renderRow = (c) => (
    <tr key={c.id}>
      <td>
        {new Date(c.created_at).toLocaleString()}
      </td>

      <td style={{ maxWidth: "400px" }}>
        <div
          dangerouslySetInnerHTML={{
            __html: c.content.substring(0, 120) + "..."
          }}
        />
      </td>

      <td>
        <HistoriqueActions
          onDetails={() => handleEdit(c)}
          onEdit={() => handleEdit(c)}
        />
      </td>
    </tr>
  );

  return (
    <div className="container mt-4">

      <h4 className="mb-4">
        Conclusions médicales
      </h4>

      {/* Editor */}

      <div className="card mb-4 shadow-sm">

        <div className="card-header fw-semibold">
          {editingId ? "Modifier la conclusion" : "Nouvelle conclusion"}
        </div>

        <div className="card-body">

          <ReactQuill
            theme="snow"
            value={editorValue}
            onChange={setEditorValue}
            style={{ height: "200px", marginBottom: "40px" }}
          />

          <div className="d-flex gap-2">

            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={saving}
            >
              {editingId ? "Mettre à jour" : "Enregistrer"}
            </button>

            <button
              className="btn btn-outline-secondary"
              onClick={handleCancel}
            >
              Annuler
            </button>

          </div>

        </div>

      </div>

      {/* History */}

      <div className="card shadow-sm">

        <div className="card-header fw-semibold">
          Historique des conclusions
        </div>

        <div className="card-body p-0">

          <HistoriqueTable
            headers={headers}
            items={conclusions}
            renderRow={renderRow}
            emptyMessage="Aucune conclusion enregistrée"
            loading={loading}
          />

        </div>

      </div>

    </div>
  );
};

export default PatientConclusionsPage;