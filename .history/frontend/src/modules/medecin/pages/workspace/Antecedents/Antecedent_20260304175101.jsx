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

  const [isPending, startTransition] = useTransition();

  const savedRef = useRef(initialState);
  const dirtyRef = useRef(new Set());
  const [, force] = useState(0);
  const dirtyCount = dirtyRef.current.size;

  const canEdit = !readOnly && isEditing;
  const busy = loading || saving || isPending;

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

  const loadVersions = useCallback(async () => {
    const data = await antecedentsService.getAntecedentVersions(numero);
    const list = Array.isArray(data?.versions) ? data.versions : [];
    setVersions(list);

    // If none => keep selectedVersion null (empty state)
    if (list.length === 0) {
      setSelectedVersion(null);
      return;
    }

    // Prefer active
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
        setForm(next);
        savedRef.current = next;

        resetDirty();

        const archived = snap?.antecedent?.status === "archived";
        setReadOnly(archived);
        setIsEditing(false);
      } catch (e) {
        toast.error(getErrorMessage(e));
      } finally {
        setLoading(false);
      }
    },
    [numero, resetDirty],
  );

  // Enter page: only load versions (NO auto-create)
  useEffect(() => {
    if (!numero) return;

    (async () => {
      setLoading(true);
      try {
        await loadVersions();
      } catch (e) {
        toast.error(getErrorMessage(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [numero, loadVersions]);

  // When a version is selected => load snapshot
  useEffect(() => {
    if (!selectedVersion) return;
    loadSnapshot(selectedVersion);
  }, [selectedVersion, loadSnapshot]);

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
      for (const sectionId of dirtyRef.current) {
        const api = apiBySection[sectionId];
        if (!api?.put) continue;
        await api.put(numero, sanitizeForApi(sectionId, form[sectionId]));
      }

      toast.success("Enregistré");
      await loadVersions();
      await loadSnapshot(selectedVersion);

      setIsEditing(false);
      resetDirty();
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setSaving(false);
    }
  }, [numero, readOnly, isEditing, form, selectedVersion, loadVersions, loadSnapshot, resetDirty]);

  // ✅ Create first version ONLY when user clicks "Ajouter une fiche" or "+ Nouvelle version"
  const handleCreateFirstOrNewVersion = useCallback(async () => {
    if (busy) return;

    const isFirst = versions.length === 0;
    const ok = await confirmAction({
      title: isFirst ? "Créer une fiche antécédents" : "Nouvelle version",
      text: isFirst
        ? "Aucune fiche n'existe pour ce patient. Créer maintenant ?"
        : "Créer une nouvelle version ? L’actuelle sera archivée.",
      confirmButtonText: "Créer",
    });
    if (!ok) return;

    setLoading(true);
    try {
      const created = await antecedentsService.postNewAntecedentVersion(numero);

      await loadVersions();
      const newV = created?.antecedent?.version_number;
      if (newV) setSelectedVersion(newV);

      setIsEditing(true);
      toast.success(isFirst ? "Fiche créée" : "Nouvelle version créée");
    } catch (e) {
      // Better message for the 500
      toast.error(
        `Impossible de créer la fiche. ${getErrorMessage(e)} (vérifiez le backend / logs)`,
      );
    } finally {
      setLoading(false);
    }
  }, [busy, versions.length, numero, loadVersions]);

  const onChangeTab = useCallback(
    (nextId) => startTransition(() => setActive(nextId)),
    [],
  );

  const title = useMemo(() => {
    if (versions.length === 0) return "Antécédents";
    return readOnly ? "Fiche antécédents (archivée)" : "Fiche antécédents";
  }, [versions.length, readOnly]);

  const subtitle = useMemo(() => {
    if (versions.length === 0) return "Aucune fiche n’a encore été créée pour ce patient.";
    return null;
  }, [versions.length]);

  const sectionAnimationKey = useMemo(() => `section-${active}`, [active]);

  return (
    <div className="antecedents-wrapper">
      <div className="antecedents-header">
        <div className="header-content">
          <div className="header-left">
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {/* ✅ Title like Social */}
              <div style={{ fontSize: 22, fontWeight: 800, color: "#1a7a5e" }}>
                {title}
              </div>
              {subtitle ? (
                <div style={{ fontSize: 13, color: "#6b7280" }}>{subtitle}</div>
              ) : null}

              {/* Version controls only if versions exist */}
              {versions.length > 0 ? (
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
                    onClick={handleCreateFirstOrNewVersion}
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
              ) : null}
            </div>
          </div>

          {/* Right actions: show edit/save only if a fiche exists */}
          <div className="header-right">
            {versions.length === 0 ? (
              <button
                onClick={handleCreateFirstOrNewVersion}
                className="btn-primary"
                disabled={busy}
              >
                {loading ? "Création..." : "Ajouter une fiche"}
              </button>
            ) : !isEditing ? (
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
        {/* If no versions => show empty card (no tabs) */}
        {versions.length === 0 ? (
          <div className="antecedents-content">
            <div className="section-shell">
              <div style={{ fontSize: 14, color: "#374151", fontWeight: 700 }}>
                Aucune fiche antécédents
              </div>
              <div style={{ marginTop: 6, fontSize: 13, color: "#6b7280" }}>
                Cliquez sur <b>Ajouter une fiche</b> pour commencer.
              </div>
            </div>
          </div>
        ) : (
          <>
            <TabNavigation sections={SECTIONS} active={active} onChange={onChangeTab} />

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
          </>
        )}
      </div>
    </div>
  );
}