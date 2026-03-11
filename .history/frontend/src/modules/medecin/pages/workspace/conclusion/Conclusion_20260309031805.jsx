import React, { useEffect, useMemo, useState ,useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

import HistoriqueAccordeon from "../../../../../shared/components/layouts/HistoriqueAccordeon";
import HistoriqueTable from "../../../../../shared/components/layouts/HistoriqueTable";
import HistoriqueActions from "../../../../../shared/components/layouts/HistoriqueActions";
import {
  createPatientConclusion,
  listPatientConclusions,
  updateConclusion,
} from "../../../services/conclusionsService";

import "./conclusion.css";

const DEFAULT_LIMIT = 10;
const TABLE_HEADERS = ["Médecin", "Date création", "Dernière modification", "Actions"];

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["blockquote", "code-block"],
    ["link"],
    ["clean"],
  ],
};

const QUILL_FORMATS = [
  "header", "bold", "italic", "underline", "strike",
  "color", "background", "list", "bullet", "align",
  "blockquote", "code-block", "link",
];

export default function PatientConclusionPage() {
  const { numero } = useParams();

  const [editorValue, setEditorValue] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);

  const [histOpen, setHistOpen] = useState(true);
  const [histLoading, setHistLoading] = useState(false);
  const [conclusions, setConclusions] = useState([]);
  const [total, setTotal] = useState(0);
  const [limit] = useState(DEFAULT_LIMIT);
  const [offset, setOffset] = useState(0);

  const editorRef = useRef(null);

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
    setShowEditor(false);
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
    setShowEditor(true);
    setTimeout(() => {
      editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const renderRow = (c) => (
    <tr key={c.id}>
      <td className="align-middle" style={{ fontSize: 13, fontWeight: 600 }}>
        <i className="bi bi-person-circle me-1 text-muted" />
        {c.doctor_name || "—"}
      </td>
      <td className="align-middle text-nowrap" style={{ fontSize: 13 }}>
        {new Date(c.created_at).toLocaleDateString("fr-FR")}
      </td>
      <td className="align-middle text-nowrap" style={{ fontSize: 12, color: "#64748b" }}>
        {new Date(c.updated_at).toLocaleDateString("fr-FR")}
      </td>
      <td className="align-middle">
        <HistoriqueActions
          onDetails={() => setPreviewItem(c)}
          onEdit={() => onEdit(c)}
        />
      </td>
    </tr>
  );

  const isEditing = !!editingId;

  return (
    <div className="pcPage">

      {/* ── Page title ── */}
      <div className="page-header">
        <h2>Conclusions médicales</h2>
      </div>

      {/* ── Top bar ── */}
      <div className="pcTopBar">
        <button
          className="pcBtnAdd"
          type="button"
          onClick={() => {
            setEditingId(null);
            setEditorValue("");
            setShowEditor(true);
            setTimeout(() => {
              editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
          }}
        >
          <i className="bi bi-plus-lg me-2" />
          Ajouter
        </button>
      </div>

      {/* ── History table FIRST ── */}
      <HistoriqueAccordeon
        title="Historique des conclusions"
        count={total}
        open={histOpen}
        onToggle={() => setHistOpen((v) => !v)}
        contentClassName="bg-white p-3"
      >
        {histLoading ? (
          <div className="d-flex align-items-center gap-2 text-muted py-2">
            <span className="spinner-border spinner-border-sm" /> Chargement…
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
                    className="pcBtnPager"
                    type="button"
                    onClick={() => setOffset(Math.max(0, offset - limit))}
                    disabled={page <= 1}
                  >
                    <i className="bi bi-chevron-left me-1" /> Précédent
                  </button>
                  <button
                    className="pcBtnPager"
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

      {/* ── Editor BELOW history ── */}
      {showEditor && (
        <div className="pcCard" ref={editorRef}>
          <div className="pcCardHeader">
            <div className="pcLabel">
              <i className={`bi ${isEditing ? "bi-pencil-square" : "bi-plus-circle"} me-2`} />
              {isEditing ? "Modifier la conclusion" : "Nouvelle conclusion"}
            </div>
            <button className="pcBtnCancel" type="button" onClick={resetEditor}>
              <i className="bi bi-x-lg me-1" /> Annuler
            </button>
          </div>

          <ReactQuill
            theme="snow"
            value={editorValue}
            onChange={setEditorValue}
            modules={QUILL_MODULES}
            formats={QUILL_FORMATS}
            placeholder="Rédigez la conclusion médicale ici..."
            className="pcQuillLarge"
          />

          <div className="pcActions">
            <button
              className={`pcBtnSave ${isEditing ? "pcBtnSaveEdit" : ""}`}
              type="button"
              onClick={onSave}
              disabled={saving}
            >
              {saving ? (
                <><span className="spinner-border spinner-border-sm me-2" />Enregistrement…</>
              ) : (
                <>
                  <i className={`bi ${isEditing ? "bi-arrow-repeat" : "bi-check2-circle"} me-2`} />
                  {isEditing ? "Mettre à jour" : "Enregistrer"}
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ── Preview modal ── */}
      {previewItem && (
        <div className="pcModalOverlay" onClick={() => setPreviewItem(null)}>
          <div className="pcModal" onClick={(e) => e.stopPropagation()}>
            <div className="pcModalHeader">
              <div>
                <div className="pcModalTitle">
                  <i className="bi bi-file-earmark-text me-2" />
                  Conclusion — {new Date(previewItem.created_at).toLocaleDateString("fr-FR")}
                </div>
                <div className="pcModalMeta">
                  <i className="bi bi-person-circle me-1" />
                  {previewItem.doctor_name || "—"}
                  <span className="mx-2">·</span>
                  Modifié le {new Date(previewItem.updated_at).toLocaleDateString("fr-FR")}
                </div>
              </div>
              <button className="pcBtnCancel" onClick={() => setPreviewItem(null)}>
                <i className="bi bi-x-lg" />
              </button>
            </div>
            <div
              className="pcModalBody"
              dangerouslySetInnerHTML={{ __html: previewItem.content }}
            />
            <div className="pcModalFooter">
              <button
                className="pcBtnSave"
                onClick={() => { onEdit(previewItem); setPreviewItem(null); }}
              >
                <i className="bi bi-pencil-square me-2" /> Modifier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}