import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import "./antecedents_style.css";

import { SECTIONS, BOOL_FIELDS, initialState } from "./antecedentsConfig.jsx";
import TabNavigation from "../../../components/UI/TabNavigation";
import SectionRenderer from "../../../components/UI/SectionRenderer";

import antecedentsService from "../../../services/antecedentsService.jsx";
import { confirmAction } from "../../../../../shared/utils/uiAlerts.js";
import { sanitizeForApi, getErrorMessage } from "./helpers.js";
import { apiBySection } from "./antecedents.api.js";
import { buildFormFromSnapshot, formatDate } from "./antecedents.utils.js";

export default function AntecedentsForm() {
  const { numero } = useParams();

  const [active, setActive] = useState("medical");
  const [form, setForm] = useState(initialState);

  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [readOnly, setReadOnly] = useState(false);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // smoother tab switches in React 18
  const [isPending, startTransition] = useTransition();

  // snapshot for Annuler
  const savedRef = useRef(initialState);

  // fast dirty tracking
  const dirtyRef = useRef(new Set());
  const [, force] = useState(0);
  const dirtyCount = dirtyRef.current.size;

  const canEdit = !readOnly && isEditing;

  const resetDirty = useCallback(() => {
    dirtyRef.current = new Set();
    force((x) => x + 1);
  }, []);

  const markDirty = useCallback((sectionId) => {
    if (!dirtyRef.current.has(sectionId)) {
      dirtyRef.current.add(sectionId);
      force((x) => x + 1);
    }
  }, []);

  /**
   * Ensure an active antecedent exists.
   * If not: create one (so user sees open form, not "closed").
   */
  const ensureActiveExists = useCallback(async () => {
    const header = await antecedentsService.getActiveAntecedent(numero);
    if (!header?.antecedent) {
      await antecedentsService.postNewAntecedentVersion(numero);
      return { created: true };
    }
    return { created: false };
  }, [numero]);

  const loadVersions = useCallback(async () => {
    const data = await antecedentsService.getAntecedentVersions(numero);
    const list = Array.isArray(data?.versions) ? data.versions : [];
    setVersions(list);

    const activeHeader = list.find((v) => v.status === "active");
    const def = activeHeader?.version_number ?? list[0]?.version_number ?? null;
    setSelectedVersion((prev) => prev ?? def);
  }, [numero]);

  const loadSnapshot = useCallback(
    async (versionNumber) => {
      if (!numero || !versionNumber) return;

      setLoading(true);
      try {
        const snap = await antecedentsService.getAntecedentVersionSnapshot(
          numero,
          versionNumber,
        );

        const next = buildFormFromSnapshot(snap);

        // keep UI stable (no "flash"), update state together
        setForm(next);
        savedRef.current = next;

        resetDirty();

        const archived = snap?.antecedent?.status === "archived";
        setReadOnly(archived);

        // don't force exit edit mode if we're creating the first sheet
        if (archived) setIsEditing(false);
      } catch (e) {
        toast.error(getErrorMessage(e));
      } finally {
        setLoading(false);
      }
    },
    [numero, resetDirty],
  );

  // Boot: if no fiche -> create + enter editing automatically
  useEffect(() => {
    if (!numero) return;
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const { created } = await ensureActiveExists();
        await loadVersions();

        if (!mounted) return;

        if (created) {
          setIsEditing(true);
          toast.info("Nouvelle fiche créée. Vous pouvez commencer à remplir.");
        }
      } catch (e) {
        toast.error(getErrorMessage(e));
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [numero, ensureActiveExists, loadVersions]);

  // When version changes => load snapshot
  useEffect(() => {
    if (!selectedVersion) return;
    loadSnapshot(selectedVersion);
  }, [selectedVersion, loadSnapshot]);

  // helper for updates
  const patchSection = useCallback(
    (sectionId, producer) => {
      if (!canEdit) return;
      setForm((f) => {
        const nextSection = producer(f[sectionId]);
        markDirty(sectionId);
        return { ...f, [sectionId]: nextSection };
      });
    },
    [canEdit, markDirty],
  );

  const updateSection = useCallback(
    (sectionId, key, value) =>
      patchSection(sectionId, (cur) => ({ ...(cur || {}), [key]: value })),
    [patchSection],
  );

  const updateList = useCallback(
    (sectionId, index, key, value) =>
      patchSection(sectionId, (cur) => {
        const arr = Array.isArray(cur) ? [...cur] : [];
        arr[index] = { ...(arr[index] || {}), [key]: value };
        return arr;
      }),
    [patchSection],
  );

  const addRow = useCallback(
    (sectionId, template) =>
      patchSection(sectionId, (cur) => [
        ...(Array.isArray(cur) ? cur : []),
        { ...template },
      ]),
    [patchSection],
  );

  const removeRow = useCallback(
    (sectionId, index) =>
      patchSection(sectionId, (cur) =>
        Array.isArray(cur) ? cur.filter((_, i) => i !== index) : [],
      ),
    [patchSection],
  );

  const handleEdit = useCallback(async () => {
    if (readOnly) return toast.info("Version archivée : lecture seule");

    const ok = await confirmAction({
      title: "Activer le mode modification ?",
      text: "Vous pourrez modifier plusieurs sections puis enregistrer en une seule fois.",
      confirmButtonText: "Modifier",
    });
    if (ok) setIsEditing(true);
  }, [readOnly]);

  const handleCancel = useCallback(() => {
    setForm(savedRef.current);
    resetDirty();
    setIsEditing(false);
    toast.info("Modifications annulées");
  }, [resetDirty]);

  const handleSaveAll = useCallback(async () => {
    if (!numero) return;
    if (readOnly) return toast.info("Version archivée : lecture seule");
    if (!isEditing) return toast.info("Cliquez sur “Modifier” avant d’enregistrer");
    if (dirtyRef.current.size === 0) return toast.info("Aucune modification à enregistrer");

    const ok = await confirmAction({
      title: "Enregistrer toutes les sections ?",
      text: `Vous allez enregistrer ${dirtyRef.current.size} section(s).`,
      confirmButtonText: "Enregistrer",
    });
    if (!ok) return;

    setSaving(true);
    try {
      await ensureActiveExists();

      for (const sectionId of dirtyRef.current) {
        const api = apiBySection[sectionId];
        if (!api?.put) continue;
        await api.put(numero, sanitizeForApi(sectionId, form[sectionId]));
      }

      toast.success("Enregistré");

      // refresh versions + snapshot without "hard blank"
      await loadVersions();
      await loadSnapshot(selectedVersion);

      setIsEditing(false);
      resetDirty();
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setSaving(false);
    }
  }, [
    numero,
    readOnly,
    isEditing,
    form,
    selectedVersion,
    ensureActiveExists,
    loadVersions,
    loadSnapshot,
    resetDirty,
  ]);

  const handleNewVersion = useCallback(async () => {
    if (saving || loading) return;

    const ok = await confirmAction({
      title: "Nouvelle version",
      text: "Créer une nouvelle version ? L’actuelle sera archivée.",
      confirmButtonText: "Créer",
    });
    if (!ok) return;

    setLoading(true);
    try {
      const created = await antecedentsService.postNewAntecedentVersion(numero);
      toast.success("Nouvelle version créée");

      await loadVersions();
      const newV = created?.antecedent?.version_number;
      if (newV) setSelectedVersion(newV);

      // better UX: user can edit immediately
      setIsEditing(true);
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [saving, loading, numero, loadVersions]);

  // smooth tab switching: defer heavy rendering
  const onChangeTab = useCallback(
    (nextId) => {
      startTransition(() => setActive(nextId));
    },
    [startTransition],
  );

  const busy = loading || saving || isPending;
  const sectionAnimationKey = useMemo(() => `section-${active}`, [active]);

  return (
    <div className="antecedents-wrapper">
      <div className="antecedents-header">
        <div className="header-content">
          <div className="header-left">
            <div className="version-bar">
              <span className="version-label">Version</span>

              <select
                className="version-select"
                value={selectedVersion ?? ""}
                onChange={(e) => setSelectedVersion(Number(e.target.value))}
                disabled={busy}
              >
                {versions.map((v) => (
                  <option key={v.id} value={v.version_number}>
                    {`v${v.version_number} — ${
                      v.status === "active" ? "active" : "archivée"
                    } — ${formatDate(v.created_at)}`}
                  </option>
                ))}
              </select>

              <button
                onClick={handleNewVersion}
                className="btn-tertiary"
                disabled={busy}
                title="Créer une nouvelle version"
              >
                + Nouvelle version
              </button>

              {readOnly ? (
                <span className="pill pill-readonly">Lecture seule</span>
              ) : dirtyCount > 0 ? (
                <span className="pill pill-dirty">{dirtyCount} modifiée(s)</span>
              ) : null}
            </div>
          </div>

          <div className="header-right">
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="btn-secondary"
                disabled={busy || readOnly}
              >
                Modifier
              </button>
            ) : (
              <>
                <button
                  onClick={handleSaveAll}
                  className="btn-primary"
                  disabled={busy || readOnly}
                >
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
                <button
                  onClick={handleCancel}
                  className="btn-secondary"
                  disabled={busy}
                >
                  Annuler
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="antecedents-container">
        <TabNavigation sections={SECTIONS} active={active} onChange={onChangeTab} />

        {/* Keep content visible during loading => no "crash" feel */}
        <div className="antecedents-content">
          <div key={sectionAnimationKey} className="section-shell">
            <SectionRenderer
              active={active}
              form={form}
              BOOL_FIELDS={BOOL_FIELDS}
              updateSection={updateSection}
              updateList={updateList}
              addRow={addRow}
              removeRow={removeRow}
              readOnly={!canEdit}
            />
          </div>

          {loading ? (
            <div className="loading" style={{ marginTop: 8 }}>
              Chargement…
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}