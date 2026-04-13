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
import { clearFieldError } from "../../../shared/utils/clearFieldError.js";

export function useConclusionLogic(numero) {
  const { user } = useAuth();

  const [editorValue, setEditorValue] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);
  const [errors, setErrors] = useState({});

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

  // ====== Chargement historique ======
  // Erreur réseau / serveur → alertError (pas une erreur de champ)
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

  // ====== handleEditorChange ======
  // Efface l'erreur du champ "content" dès que l'utilisateur tape
  const handleEditorChange = (value) => {
    setEditorValue(value);
    clearFieldError("content", setErrors);
  };

  // ====== Reset éditeur ======
  const resetEditor = () => {
    setEditorValue("");
    setEditingId(null);
    setShowEditor(false);
    setErrors({});                    // ← efface les erreurs à la fermeture
  };

  const cancelEditor = () => {
    toast.dismiss();
    resetEditor();
  };

  // ====== Soumission ======
  const onSave = async () => {

    // ── Validation frontend ─────────────────────────────────────────────────
    // → FieldError sous l'éditeur, jamais de toast pour les erreurs de champ
    const text = editorValue.replace(/<[^>]*>/g, "").trim();

    if (!text) {
      setErrors({ content: "Le contenu de la conclusion est requis" });
      return;
    }
    if (text.length < 5) {
      setErrors({ content: "La conclusion doit contenir au moins 5 caractères" });
      return;
    }

    const confirmed = await confirmAction(
      editingId ? "Modifier la conclusion" : "Enregistrer la conclusion",
      editingId
        ? "Voulez-vous enregistrer les modifications de cette conclusion ?"
        : "Voulez-vous enregistrer cette nouvelle conclusion ?",
    );
    if (!confirmed) return;

    setSaving(true);
    setErrors({});

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

      // Cas 1 — errors[] avec field (express-validator via handleValidation)
      // → FieldError affiché sous l'éditeur pour chaque champ concerné
      // CORRECTION : err.message (pas e.message) pour récupérer le message du champ
      if (e?.errors && Array.isArray(e.errors)) {
        const errorObj = {};
        e.errors.forEach((err) => {
          errorObj[err.field] = err.message;    // ← err.message, pas e.message
        });
        setErrors(errorObj);
        return;
      }

      // Cas 2 — message simple sans tableau de champs (ex: erreur métier serveur)
      // → FieldError sous "content" (seul champ du formulaire)
      if (e?.message) {
        setErrors({ content: e.message });
        return;
      }

      // Cas 3 — fallback inattendu (erreur réseau, serveur indisponible…)
      alertError("Une erreur s'est produite lors de l'enregistrement");

    } finally {
      setSaving(false);
    }
  };

  // ====== Édition d'une conclusion existante ======
  const onEdit = async (c) => {
    setEditorValue(c.content || "");
    setEditingId(c.id);
    setShowEditor(true);
    setErrors({});                    // ← reset erreurs à chaque ouverture
    setTimeout(() => {
      editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // ====== Nouvelle conclusion ======
  const openEditor = () => {
    setEditingId(null);
    setEditorValue("");
    setShowEditor(true);
    setErrors({});                    // ← reset erreurs à chaque ouverture
    setTimeout(() => {
      editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return {
    user,
    editorRef,
    editorValue,
    setEditorValue,
    handleEditorChange,               // ← à brancher dans ConclusionEditor onChange
    errors,                           // ← exposé pour <FieldError error={errors.content} />
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