// import { useCallback, useEffect, useRef, useState } from "react";
// import { useParams } from "react-router-dom";
// import { toast } from "react-toastify";

// import "./Antecedent.css";

// import { SECTIONS, BOOL_FIELDS, initialState } from "./antecedentsConfig.jsx";
// import TabNavigation from "../../../components/UI/TabNavigation";
// import SectionRenderer from "../../../components/UI/SectionRenderer";

// import antecedentsService from "../../../services/antecedentsService.jsx";
// import { confirmAction } from "../../../../../shared/utils/uiAlerts.js";
// import { normalizeFromApi, sanitizeForApi, getErrorMessage } from "./helpers.js";

// const formatDate = (iso) => {
//   if (!iso) return "";
//   const d = new Date(iso);
//   if (Number.isNaN(d.getTime())) return "";
//   return d.toLocaleDateString("fr-FR", {
//     year: "numeric",
//     month: "2-digit",
//     day: "2-digit",
//   });
// };

// const apiBySection = {
//   medical: { put: antecedentsService.updateMedical },
//   infectious: { put: antecedentsService.updateInfectious },
//   therapeutic: { put: antecedentsService.updateTherapeutic },
//   family: { put: antecedentsService.updateFamily },
//   gyneco: { put: antecedentsService.updateGyneco },
//   surgical: { put: antecedentsService.replaceSurgical },
//   transfusion: { put: antecedentsService.replaceTransfusion },
//   aes: { put: antecedentsService.replaceAes },
// };

// const buildFormFromSnapshot = (snapshot) => {
//   const next = { ...initialState };
//   for (const { id } of SECTIONS) {
//     const normalized = normalizeFromApi(id, snapshot?.[id]);
//     next[id] =
//       normalized ??
//       (Array.isArray(initialState[id]) ? [] : { ...initialState[id] });
//   }
//   return next;
// };

// export default function AntecedentsForm() {
//   const { numero } = useParams();

//   const [active, setActive] = useState("medical");
//   const [form, setForm] = useState(initialState);

//   const [versions, setVersions] = useState([]);
//   const [selectedVersion, setSelectedVersion] = useState(null);
//   const [readOnly, setReadOnly] = useState(false);

//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);

//   // ✅ snapshot for Annuler
//   const savedRef = useRef(initialState);

//   // ✅ fast dirty tracking (no JSON.stringify => no lag)
//   const dirtyRef = useRef(new Set());
//   const [, force] = useState(0);
//   const dirtyCount = dirtyRef.current.size;

//   const canEdit = !readOnly && isEditing;

//   const resetDirty = () => {
//     dirtyRef.current = new Set();
//     force((x) => x + 1);
//   };

//   const markDirty = (sectionId) => {
//     if (!dirtyRef.current.has(sectionId)) {
//       dirtyRef.current.add(sectionId);
//       force((x) => x + 1);
//     }
//   };

//   const ensureActiveExists = useCallback(async () => {
//     const header = await antecedentsService.getActiveAntecedent(numero);
//     if (!header?.antecedent) {
//       await antecedentsService.postNewAntecedentVersion(numero);
//     }
//   }, [numero]);

//   const loadVersions = useCallback(async () => {
//     const data = await antecedentsService.getAntecedentVersions(numero);
//     const list = Array.isArray(data?.versions) ? data.versions : [];
//     setVersions(list);

//     const activeHeader = list.find((v) => v.status === "active");
//     const def =
//       activeHeader?.version_number ?? list[0]?.version_number ?? null;
//     setSelectedVersion((prev) => prev ?? def);
//   }, [numero]);

//   const loadSnapshot = useCallback(
//     async (versionNumber) => {
//       if (!numero || !versionNumber) return;

//       setLoading(true);
//       try {
//         const snap = await antecedentsService.getAntecedentVersionSnapshot(
//           numero,
//           versionNumber,
//         );

//         const next = buildFormFromSnapshot(snap);
//         setForm(next);
//         savedRef.current = next;

//         resetDirty();
//         setReadOnly(snap?.antecedent?.status === "archived");
//         setIsEditing(false);
//       } catch (e) {
//         toast.error(getErrorMessage(e));
//       } finally {
//         setLoading(false);
//       }
//     },
//     [numero],
//   );

//   useEffect(() => {
//     if (!numero) return;
//     (async () => {
//       try {
//         await ensureActiveExists();
//         await loadVersions();
//       } catch (e) {
//         toast.error(getErrorMessage(e));
//       }
//     })();
//   }, [numero, ensureActiveExists, loadVersions]);

//   useEffect(() => {
//     if (!selectedVersion) return;
//     loadSnapshot(selectedVersion);
//   }, [selectedVersion, loadSnapshot]);

//   // ✅ one helper for all updates
//   const patchSection = (sectionId, producer) => {
//     if (!canEdit) return;
//     setForm((f) => {
//       const nextSection = producer(f[sectionId]);
//       markDirty(sectionId);
//       return { ...f, [sectionId]: nextSection };
//     });
//   };

//   const updateSection = (sectionId, key, value) =>
//     patchSection(sectionId, (cur) => ({ ...(cur || {}), [key]: value }));

//   const updateList = (sectionId, index, key, value) =>
//     patchSection(sectionId, (cur) => {
//       const arr = Array.isArray(cur) ? [...cur] : [];
//       arr[index] = { ...(arr[index] || {}), [key]: value };
//       return arr;
//     });

//   const addRow = (sectionId, template) =>
//     patchSection(sectionId, (cur) => [
//       ...(Array.isArray(cur) ? cur : []),
//       { ...template },
//     ]);

//   const removeRow = (sectionId, index) =>
//     patchSection(sectionId, (cur) =>
//       Array.isArray(cur) ? cur.filter((_, i) => i !== index) : [],
//     );

//   const handleEdit = async () => {
//     if (readOnly) return toast.info("Version archivée : lecture seule");

//     const ok = await confirmAction({
//       title: "Activer le mode modification ?",
//       text: "Vous pourrez modifier plusieurs sections puis enregistrer en une seule fois.",
//       confirmButtonText: "Modifier",
//     });
//     if (ok) setIsEditing(true);
//   };

//   const handleCancel = () => {
//     setForm(savedRef.current);
//     resetDirty();
//     setIsEditing(false);
//     toast.info("Modifications annulées");
//   };

//   const handleSaveAll = async () => {
//     if (!numero) return;
//     if (readOnly) return toast.info("Version archivée : lecture seule");
//     if (!isEditing) return toast.info("Cliquez sur “Modifier” avant d’enregistrer");
//     if (dirtyRef.current.size === 0) return toast.info("Aucune modification à enregistrer");

//     const ok = await confirmAction({
//       title: "Enregistrer toutes les sections ?",
//       text: `Vous allez enregistrer ${dirtyRef.current.size} section(s).`,
//       confirmButtonText: "Enregistrer",
//     });
//     if (!ok) return;

//     setSaving(true);
//     try {
//       await ensureActiveExists();

//       for (const sectionId of dirtyRef.current) {
//         const api = apiBySection[sectionId];
//         if (!api?.put) continue;
//         await api.put(numero, sanitizeForApi(sectionId, form[sectionId]));
//       }

//       toast.success("Enregistré");
//       await loadVersions();
//       await loadSnapshot(selectedVersion);

//       setIsEditing(false);
//       resetDirty();
//     } catch (e) {
//       toast.error(getErrorMessage(e));
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleNewVersion = async () => {
//     if (saving || loading) return;

//     const ok = await confirmAction({
//       title: "Nouvelle version",
//       text: "Créer une nouvelle version ? L’actuelle sera archivée.",
//       confirmButtonText: "Créer",
//     });
//     if (!ok) return;

//     setLoading(true);
//     try {
//       const created = await antecedentsService.postNewAntecedentVersion(numero);
//       toast.success("Nouvelle version créée");
//       await loadVersions();
//       const newV = created?.antecedent?.version_number;
//       if (newV) setSelectedVersion(newV);
//     } catch (e) {
//       toast.error(getErrorMessage(e));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="antecedents-wrapper">
//       <div className="antecedents-header">
//         <div className="header-content">
//           <div
//             className="header-left"
//             style={{ display: "flex", gap: 10, alignItems: "center" }}
//           >
//             <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
//               <span style={{ fontSize: 13, color: "#6b7280" }}>Version</span>
//               <select
//                 value={selectedVersion ?? ""}
//                 onChange={(e) => setSelectedVersion(Number(e.target.value))}
//                 disabled={loading || saving}
//                 style={{
//                   padding: "6px 8px",
//                   borderRadius: 6,
//                   border: "1px solid #e5e7eb",
//                   background: "#fff",
//                 }}
//               >
//                 {versions.map((v) => (
//                   <option key={v.id} value={v.version_number}>
//                     {`v${v.version_number} — ${
//                       v.status === "active" ? "active" : "archivée"
//                     } — ${formatDate(v.created_at)}`}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <button
//               onClick={handleNewVersion}
//               className="btn-secondary"
//               disabled={loading || saving}
//             >
//               + Nouvelle version
//             </button>

//             {readOnly ? (
//               <span
//                 style={{
//                   fontSize: 12.5,
//                   color: "#92400e",
//                   background: "#fffbeb",
//                   border: "1px solid #f59e0b",
//                   padding: "4px 8px",
//                   borderRadius: 999,
//                 }}
//               >
//                 Lecture seule
//               </span>
//             ) : dirtyCount > 0 ? (
//               <span
//                 style={{
//                   fontSize: 12.5,
//                   color: "#1f2937",
//                   background: "#eef2ff",
//                   border: "1px solid #c7d2fe",
//                   padding: "4px 8px",
//                   borderRadius: 999,
//                 }}
//               >
//                 {dirtyCount} modifiée(s)
//               </span>
//             ) : null}
//           </div>

//           <div className="header-right" style={{ display: "flex", gap: 10 }}>
//             {!isEditing ? (
//               <button
//                 onClick={handleEdit}
//                 className="btn-secondary"
//                 disabled={loading || saving || readOnly}
//               >
//                 Modifier
//               </button>
//             ) : (
//               <>
//                 <button
//                   onClick={handleSaveAll}
//                   className="btn-primary"
//                   disabled={saving || loading || readOnly}
//                 >
//                   {saving ? "Enregistrement..." : "Enregistrer"}
//                 </button>
//                 <button
//                   onClick={handleCancel}
//                   className="btn-secondary"
//                   disabled={saving || loading}
//                 >
//                   Annuler
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="antecedents-container">
//         <TabNavigation sections={SECTIONS} active={active} onChange={setActive} />

//         {loading ? (
//           <div className="loading">Chargement...</div>
//         ) : (
//           <SectionRenderer
//             active={active}
//             form={form}
//             BOOL_FIELDS={BOOL_FIELDS}
//             updateSection={updateSection}
//             updateList={updateList}
//             addRow={addRow}
//             removeRow={removeRow}
//             readOnly={!canEdit}
//           />
//         )}
//       </div>
//     </div>
//   );
// }
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import "./Antecedent.css"; // IMPORTANT: match the real CSS filename

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
   * Returns: { created: boolean }
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
    const def =
      activeHeader?.version_number ?? list[0]?.version_number ?? null;

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

  // Initial boot
  useEffect(() => {
    if (!numero) return;

    let mounted = true;

    (async () => {
      try {
        setLoading(true);

        // If there is no fiche, create one and enable edit mode directly
        const { created } = await ensureActiveExists();
        await loadVersions();

        // Smooth UX: open edit mode if we just created the first active version
        if (mounted && created) {
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

  // When version changes
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

      // good UX: allow edit immediately on the newly created active version
      setIsEditing(true);
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [saving, loading, numero, loadVersions]);

  // animation key: changes when tab changes (forces small animation only)
  const sectionAnimationKey = useMemo(() => `section-${active}`, [active]);

  return (
    
    
    <div className="antecedents-wrapper">
      <div className="antecedents-header">
        <div className="header-content">
          <h1>Antécédents</h1>
          <div className="header-left">
            <div className="version-bar">
              <span className="version-label">Version</span>

              <select
                className="version-select"
                value={selectedVersion ?? ""}
                onChange={(e) => setSelectedVersion(Number(e.target.value))}
                disabled={loading || saving}
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
                disabled={loading || saving}
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
                disabled={loading || saving || readOnly}
              >
                Modifier
              </button>
            ) : (
              <>
                <button
                  onClick={handleSaveAll}
                  className="btn-primary"
                  disabled={saving || loading || readOnly}
                >
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
                <button
                  onClick={handleCancel}
                  className="btn-secondary"
                  disabled={saving || loading}
                >
                  Annuler
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="antecedents-container">
        <TabNavigation sections={SECTIONS} active={active} onChange={setActive} />

        {/* Keep UI visible while loading, but soften it */}
        <div className={`antecedents-content ${loading ? "soft-loading" : ""}`}>
          <div key={sectionAnimationKey} className="section-shell section-animate">
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
        </div>

        {/* Optional: small loading hint instead of replacing everything */}
        {loading ? (
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>
            Chargement…
          </div>
        ) : null}
      </div>
    </div>
  );
}