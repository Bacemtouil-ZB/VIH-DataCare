import { useEffect, useMemo, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../../../../shared/hooks/useAuth";
import {
  createPatientConclusion,
  listPatientConclusions,
  updateConclusion,
} from "../../../services/conclusionsService";
import { DEFAULT_LIMIT } from "./conclusionConstants";
import {
  confirmAction,
  alertError,
} from "../../../../../shared/utils/uiAlerts";

export function useConclusionLogic(numero) {
  const { user } = useAuth();

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
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / limit)),
    [total, limit],
  );

  const loadHistory = async () => {
    setHistLoading(true);
    try {
      const data = await listPatientConclusions(numero, { limit, offset });
      setConclusions(data.conclusions || []);
      setTotal(data.total ?? 0);
    } catch (e) {
      alertError(e?.message || "Erreur chargement historique");
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

  const cancelEditor = () => {
    toast.dismiss();
    resetEditor();
  };

  const onSave = async () => {
    const text = editorValue.replace(/<[^>]*>/g, "").trim();
    if (text.length < 5) {
      toast.info("Veuillez saisir une conclusion (min 5 caractères).");
      return;
    }

const confirmed = await confirmAction(
  editingId ? "Modifier la conclusion" : "Enregistrer la conclusion",
  editingId ?
    "Voulez-vous enregistrer les modifications de cette conclusion ?"
  : "Voulez-vous enregistrer cette nouvelle conclusion ?"
);

    if (!confirmed) return;

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
      alertError(e?.message || "Erreur enregistrement");
    } finally {
      setSaving(false);
    }
  };

  const onEdit = async (c) => {
    
    setEditorValue(c.content || "");
    setEditingId(c.id);
    setShowEditor(true);
    setTimeout(() => {
      editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };
  const openEditor = () => {
    setEditingId(null);
    setEditorValue("");
    setShowEditor(true);
    setTimeout(() => {
      editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return {
    user,
    editorRef,
    editorValue,
    setEditorValue,
    editingId,
    saving,
    showEditor,
    previewItem,
    setPreviewItem,
    histOpen,
    setHistOpen,
    histLoading,
    conclusions,
    total,
    limit,
    offset,
    setOffset,
    page,
    totalPages,
    onSave,
    onEdit,
    resetEditor,
    cancelEditor,
    openEditor,
    onToggleHist: () => setHistOpen((v) => !v),
  };
}
