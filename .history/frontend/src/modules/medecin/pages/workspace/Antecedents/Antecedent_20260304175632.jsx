import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import "./antecedents_style.css";

import { SECTIONS, BOOL_FIELDS, initialState } from "./antecedentsConfig.jsx";
import TabNavigation from "../../../components/UI/TabNavigation";
import SectionRenderer from "../../../components/UI/SectionRenderer";

import antecedentsService from "../../../services/antecedentsService.jsx";
import { sanitizeForApi, getErrorMessage } from "./helpers.js";
import { apiBySection } from "./antecedents.api.js";
import { buildFormFromSnapshot, formatDate } from "./antecedents.utils.js";

/**
 * Compact version:
 * - No confirm popups
 * - Empty state (no auto-create)
 * - "Ajouter une fiche" creates + opens edit mode directly
 * - Tab switch smooth via startTransition
 */
export default function AntecedentsForm() {
  const { numero } = useParams();
  const [active, setActive] = useState("medical");
  const [form, setForm] = useState(initialState);

  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [readOnly, setReadOnly] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const savedRef = useRef(initialState);
  const dirtyRef = useRef(new Set());
  const [, force] = useState(0);
  const keepEditingOnNextSnapshotRef = useRef(false);

  const [isPending, startTransition] = useTransition();

  const dirtyCount = dirtyRef.current.size;
  const busy = loading || saving || isPending;
  const canEdit = isEditing && !readOnly;

  const resetDirty = useCallback(() => {
    dirtyRef.current = new Set();
    force((x) => x + 1);
  }, []);

  const markDirty = useCallback((id) => {
    if (!dirtyRef.current.has(id)) {
      dirtyRef.current.add(id);
      force((x) => x + 1);
    }
  }, []);

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

  const loadVersions = useCallback(async () => {
    const data = await antecedentsService.getAntecedentVersions(numero);
    const list = Array.isArray(data?.versions) ? data.versions : [];
    setVersions(list);

    if (list.length === 0) {
      setSelectedVersion(null);
      return;
    }
    const activeV = list.find((v) => v.status === "active")?.version_number;
    setSelectedVersion((prev) => prev ?? activeV ?? list[0].version_number);
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

        if (keepEditingOnNextSnapshotRef.current) {
          keepEditingOnNextSnapshotRef.current = false;
          setIsEditing(!archived);
        } else {
          setIsEditing(false);
        }
      } catch (e) {
        toast.error(getErrorMessage(e));
      } finally {
        setLoading(false);
      }
    },
    [numero, resetDirty],
  );

  useEffect(() => {
    if (!numero) return;
    (async () => {
      setLoading(true);
      try {
        await loadVersions(); // ✅ no auto-create
      } catch (e) {
        toast.error(getErrorMessage(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [numero, loadVersions]);

  useEffect(() => {
    if (!selectedVersion) return;
    loadSnapshot(selectedVersion);
  }, [selectedVersion, loadSnapshot]);

  const createFirst = useCallback(async () => {
    if (busy || !numero) return;
    setLoading(true);
    try {
      const created = await antecedentsService.postNewAntecedentVersion(numero);
      const newV = created?.antecedent?.version_number;
      if (!newV) throw new Error("version_number manquant");

      keepEditingOnNextSnapshotRef.current = true;
      setReadOnly(false);
      setIsEditing(true);
      setActive("medical");

      await loadVersions();
      setSelectedVersion(newV);

      toast.success("Fiche antécédents créée");
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [busy, numero, loadVersions]);

  const saveAll = useCallback(async () => {
    if (!numero) return;
    if (readOnly) return toast.info("Lecture seule");
    if (!isEditing) return toast.info("Cliquez sur “Modifier”");
    if (dirtyRef.current.size === 0) return toast.info("Aucune modification");

    setSaving(true);
    try {
      for (const sectionId of dirtyRef.current) {
        const put = apiBySection[sectionId]?.put;
        if (put) await put(numero, sanitizeForApi(sectionId, form[sectionId]));
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

  const cancel = useCallback(() => {
    setForm(savedRef.current);
    resetDirty();
    setIsEditing(false);
    toast.info("Modifications annulées");
  }, [resetDirty]);

  const onChangeTab = useCallback((id) => startTransition(() => setActive(id)), []);

  return (
    <div className="antecedents-wrapper">
      <div className="antecedents-header">
        <div className="header-content">
          <div className="header-left">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#1a7a5e" }}>
                Antécédents
              </div>

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
                    onClick={createFirst}
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

          <div className="header-right">
            {versions.length === 0 ? (
              <button className="btn-primary" onClick={createFirst} disabled={busy}>
                {loading ? "Création..." : "Ajouter une fiche"}
              </button>
            ) : !isEditing ? (
              <button
                className="btn-secondary"
                onClick={() => !readOnly && setIsEditing(true)}
                disabled={busy || readOnly}
              >
                Modifier
              </button>
            ) : (
              <>
                <button className="btn-primary" onClick={saveAll} disabled={busy || readOnly}>
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
                <button className="btn-secondary" onClick={cancel} disabled={busy}>
                  Annuler
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="antecedents-container">
        {versions.length === 0 ? (
          <div className="antecedents-content">
            <div className="section-shell">
              <div style={{ fontWeight: 800, color: "#374151" }}>
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
              <div className="section-shell">
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