import React, { useEffect, useMemo, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

import HistoriqueAccordeon from "../../../../../shared/components/layouts/HistoriqueAccordeon";
import {
  createPatientConclusion,
  listPatientConclusions,
  updateConclusion,
} from "../../../services/conclusionsService";

import "./conclusion.css";

const DEFAULT_LIMIT = 10;

export default function PatientConclusionPage() {
  const { numero } = useParams();

  const [editorValue, setEditorValue] = useState("");
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

  const onSave = async () => {
    if (!editorValue || editorValue.replace(/<[^>]*>/g, "").trim().length < 5) {
      toast.info("Veuillez saisir une conclusion (min 5 caractères).");
      return;
    }

    setSaving(true);
    try {
      await createPatientConclusion(numero, { content: editorValue });
      toast.success("Conclusion enregistrée");
      setEditorValue("");
      setOffset(0);
      await loadHistory();
      setHistOpen(true);
    } catch (e) {
      toast.error(e?.message || "Erreur enregistrement conclusion");
    } finally {
      setSaving(false);
    }
  };

  const onEdit = async (c) => {
    // Minimal edit UX: load content to editor and update in place
    setEditorValue(c.content || "");
    setHistOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onUpdate = async (id) => {
    setSaving(true);
    try {
      await updateConclusion(id, { content: editorValue });
      toast.success("Conclusion mise à jour");
      setEditorValue("");
      setOffset(0);
      await loadHistory();
      setHistOpen(true);
    } catch (e) {
      toast.error(e?.message || "Erreur mise à jour");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pcPage">
      <div className="pcHeader">
        <div>
          <h2 className="pcTitle">
            <i className="bi bi-file-earmark-medical me-2" />
            Conclusion médicale
          </h2>
          <div className="pcSub">
            Patient: <span className="pcStrong">{numero}</span>
          </div>
        </div>

        <button className="pcBtn pcBtnGhost" type="button" onClick={() => setHistOpen((v) => !v)}>
          <i className={`bi bi-chevron-${histOpen ? "up" : "down"} me-2`} />
          Historique
        </button>
      </div>

      <div className="pcCard">
        <div className="pcLabel">Rédiger la conclusion</div>
        <ReactQuill theme="snow" value={editorValue} onChange={setEditorValue} />

        <div className="pcActions">
          <button className="pcBtn pcBtnPrimary" type="button" onClick={onSave} disabled={saving}>
            <i className="bi bi-check2-circle me-2" />
            Enregistrer
          </button>
        </div>
      </div>

      <HistoriqueAccordeon
        title="Historique des conclusions"
        count={total}
        open={histOpen}
        onToggle={() => setHistOpen((v) => !v)}
        contentClassName="bg-white p-3"
      >
        {histLoading ? (
          <div className="text-muted">Chargement...</div>
        ) : conclusions.length === 0 ? (
          <div className="text-muted">Aucune conclusion.</div>
        ) : (
          <>
            <div className="pcHistList">
              {conclusions.map((c) => (
                <div className="pcHistItem" key={c.id}>
                  <div className="pcHistTop">
                    <div className="pcHistMeta">
                      <div className="pcStrong">
                        <i className="bi bi-clock me-2" />
                        {new Date(c.created_at).toLocaleString()}
                      </div>
                      <div className="text-muted small">
                        Modifié: {new Date(c.updated_at).toLocaleString()}
                      </div>
                    </div>

                    <div className="pcHistBtns">
                      <button className="pcBtn pcBtnGhost pcBtnSm" type="button" onClick={() => onEdit(c)}>
                        <i className="bi bi-pencil-square me-2" />
                        Modifier
                      </button>

                      <button
                        className="pcBtn pcBtnGhost pcBtnSm"
                        type="button"
                        onClick={() => onUpdate(c.id)}
                        disabled={saving}
                        title="Mettre à jour avec le contenu actuel de l'éditeur"
                      >
                        <i className="bi bi-save2 me-2" />
                        Sauver
                      </button>
                    </div>
                  </div>

                  {/* Preview (safe minimal) */}
                  <div
                    className="pcPreview"
                    dangerouslySetInnerHTML={{ __html: c.content }}
                  />
                </div>
              ))}
            </div>

            {/* simple pagination */}
            <div className="pcPager">
              <div className="text-muted small">
                Page {page}/{totalPages} — Total {total}
              </div>
              <div className="d-flex gap-2">
                <button className="pcBtn pcBtnGhost pcBtnSm" type="button" onClick={() => setOffset(Math.max(0, offset - limit))} disabled={page <= 1}>
                  <i className="bi bi-chevron-left me-1" /> Précédent
                </button>
                <button className="pcBtn pcBtnGhost pcBtnSm" type="button" onClick={() => setOffset(offset + limit)} disabled={page >= totalPages}>
                  Suivant <i className="bi bi-chevron-right ms-1" />
                </button>
              </div>
            </div>
          </>
        )}
      </HistoriqueAccordeon>
    </div>
  );
}