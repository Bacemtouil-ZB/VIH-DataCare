import React, { useEffect, useMemo, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

import HistoriqueAccordeon from "../../../../../shared/components/layouts/HistoriqueAccordeon";
import HistoriqueTable from "../../../../../shared/components/HistoriqueTable";
import HistoriqueActions from "../../../../../shared/components/HistoriqueActions";
import {
  createPatientConclusion,
  listPatientConclusions,
  updateConclusion,
} from "../../../services/conclusionsService";

import "./conclusion.css";

const DEFAULT_LIMIT = 10;

const TABLE_HEADERS = ["Date création", "Dernière modification", "Aperçu", "Actions"];

export default function PatientConclusionPage() {
  const { numero } = useParams();

  const [editorValue, setEditorValue] = useState("");
  const [editingId, setEditingId] = useState(null); // null = create mode
  const [saving, setSaving] = useState(false);

  const [histOpen, setHistOpen] = useState(true);
  const [histLoading, setHistLoading] = useState(false);
  const [conclusions, setConclusions] = useState([]);
  const [total, setTotal] = useState(0);
  const [limit] = useState(DEFAULT_LIMIT);
  const [offset, setOffset] = useState(0);

  const page = useMemo(() => Math.floor(offset / limit) + 1, [offset, limit]);
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  const loadHistory = async () => {
    setHistLoading(true);
    try {
      const data = await listPatientConclusions(numero, { limit, offset });
      setConclusions(data.conclusions || []);
      setTotal(data.total ?? 0);
    } catch (e) {
      toast.error(e?.message || "Erreur chargement historique");
    } finally {
      setHistLoading(false);
    }
  };

  useEffect(() => {
    if (numero) loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numero, offset]);

  const resetEditor = () => {
    setEditorValue("");
    setEditingId(null);
  };

  const onSave = async () => {
    const text = editorValue.replace(/<[^>]*>/g, "").trim();
    if (text.length < 5) {
      toast.info("Veuillez saisir une conclusion (min 5 caractères).");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await updateConclusion(editingId, { content: editorValue });
        toast.success("Conclusion mise à jour");
      } else {
        await createPatientConclusion(numero, { content: editorValue });
        toast.success("Conclusion enregistrée");
      }
      resetEditor();
      setOffset(0);
      await loadHistory();
      setHistOpen(true);
    } catch (e) {
      toast.error(e?.message || "Erreur enregistrement");
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (c) => {
    setEditorValue(c.content || "");
    setEditingId(c.id);
    setHistOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderRow = (c) => (
    <tr key={c.id}>
      <td className="align-middle text-nowrap" style={{ fontSize: 13 }}>
        <i className="bi bi-calendar3 me-1 text-muted" />
        {new Date(c.created_at).toLocaleString()}
      </td>
      <td className="align-middle text-nowrap" style={{ fontSize: 12, color: "#64748b" }}>
        {new Date(c.updated_at).toLocaleString()}
      </td>
      <td className="align-middle" style={{ maxWidth: 320 }}>
        <div
          className="pcPreviewInline"
          dangerouslySetInnerHTML={{ __html: c.content }}
        />
      </td>
      <td className="align-middle">
        <HistoriqueActions onEdit={() => onEdit(c)} />
      </td>
    </tr>
  );

  const isEditing = !!editingId;

  return (
    <div className="pcPage">
      {/* ── Header ── */}
      <div className="pcHeader">
        <div>
          <h2 className="pcTitle">
            <i className="bi bi-file-earmark-medical me-2" />
            Conclusion médicale
          </h2>
          <div className="pcSub">
            Patient : <span className="pcStrong">{numero}</span>
          </div>
        </div>

        <button
          className="pcBtn pcBtnGhost"
          type="button"
          onClick={() => setHistOpen((v) => !v)}
        >
          <i className={`bi bi-clock-history me-2`} />
          Historique
          {total > 0 && (
            <span className="pcBadge ms-2">{total}</span>
          )}
        </button>
      </div>

      {/* ── Editor card ── */}
      <div className="pcCard">
        <div className="pcCardHeader">
          <div className="pcLabel">
            {isEditing ? (
              <>
                <i className="bi bi-pencil-square me-2 text-warning" />
                Modifier la conclusion
              </>
            ) : (
              <>
                <i className="bi bi-plus-circle me-2 text-primary" />
                Nouvelle conclusion
              </>
            )}
          </div>

          {isEditing && (
            <button
              className="pcBtn pcBtnGhost pcBtnSm"
              type="button"
              onClick={resetEditor}
            >
              <i className="bi bi-x me-1" />
              Annuler
            </button>
          )}
        </div>

        <ReactQuill
          theme="snow"
          value={editorValue}
          onChange={setEditorValue}
          placeholder="Rédigez la conclusion médicale ici..."
        />

        <div className="pcActions">
          <button
            className={`pcBtn ${isEditing ? "pcBtnWarning" : "pcBtnPrimary"}`}
            type="button"
            onClick={onSave}
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Enregistrement…
              </>
            ) : (
              <>
                <i className={`bi ${isEditing ? "bi-arrow-repeat" : "bi-check2-circle"} me-2`} />
                {isEditing ? "Mettre à jour" : "Enregistrer"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── History ── */}
      <HistoriqueAccordeon
        title="Historique des conclusions"
        count={total}
        open={histOpen}
        onToggle={() => setHistOpen((v) => !v)}
        contentClassName="bg-white p-3"
      >
        {histLoading ? (
          <div className="d-flex align-items-center gap-2 text-muted py-2">
            <span className="spinner-border spinner-border-sm" />
            Chargement…
          </div>
        ) : (
          <>
            <HistoriqueTable
              headers={TABLE_HEADERS}
              items={conclusions}
              renderRow={renderRow}
              emptyMessage="Aucune conclusion enregistrée pour ce patient."
            />

            {conclusions.length > 0 && (
              <div className="pcPager">
                <div className="text-muted small">
                  Page {page} / {totalPages} — {total} résultat{total > 1 ? "s" : ""}
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="pcBtn pcBtnGhost pcBtnSm"
                    type="button"
                    onClick={() => setOffset(Math.max(0, offset - limit))}
                    disabled={page <= 1}
                  >
                    <i className="bi bi-chevron-left me-1" /> Précédent
                  </button>
                  <button
                    className="pcBtn pcBtnGhost pcBtnSm"
                    type="button"
                    onClick={() => setOffset(offset + limit)}
                    disabled={page >= totalPages}
                  >
                    Suivant <i className="bi bi-chevron-right ms-1" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </HistoriqueAccordeon>
    </div>
  );
}