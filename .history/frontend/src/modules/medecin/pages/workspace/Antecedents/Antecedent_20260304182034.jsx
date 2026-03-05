// import { useCallback, useEffect, useRef, useState } from "react";
// import { useParams } from "react-router-dom";
// import { toast } from "react-toastify";

// import "./antecedents_style.css";

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

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import "./antecedents_style.css";

import { SECTIONS, BOOL_FIELDS, initialState } from "./antecedentsConfig.jsx";
import SectionRenderer from "../../../components/UI/SectionRenderer";

import antecedentsService from "../../../services/antecedentsService.jsx";
import { sanitizeForApi, getErrorMessage } from "./helpers.js";
import { apiBySection } from "./antecedents.api.js";
import { buildFormFromSnapshot } from "./antecedents.utils.js";

export default function AntecedentsPage() {
  const { numero } = useParams();

  const [mode, setMode] = useState("empty"); // "empty" | "editing" | "view"
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(initialState);
  const [versionNumber, setVersionNumber] = useState(null);

  const dirtyRef = useRef(new Set());
  const savedRef = useRef(initialState);

  const canEdit = mode === "editing";
  const busy = loading || saving;

  const markDirty = (sectionId) => dirtyRef.current.add(sectionId);
  const resetDirty = () => (dirtyRef.current = new Set());

  // OPTIONAL: if you want to verify if a fiche already exists, you can load versions here.
  // But your requirement says: "clean, empty page with no historical data"
  useEffect(() => {
    setMode("empty");
    setForm(initialState);
    setVersionNumber(null);
    resetDirty();
  }, [numero]);

  const patchSection = useCallback(
    (sectionId, producer) => {
      if (!canEdit) return;
      setForm((f) => {
        const nextSection = producer(f[sectionId]);
        markDirty(sectionId);
        return { ...f, [sectionId]: nextSection };
      });
    },
    [canEdit],
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

  const handleCreate = useCallback(async () => {
    if (!numero || busy) return;

    setLoading(true);
    try {
      const created = await antecedentsService.postNewAntecedentVersion(numero);
      const v = created?.antecedent?.version_number;
      if (!v) throw new Error("version_number missing from create response");

      // load a clean snapshot for that new version (optional but best to align with backend defaults)
      const snap = await antecedentsService.getAntecedentVersionSnapshot(numero, v);
      const next = buildFormFromSnapshot(snap);

      setVersionNumber(v);
      setForm(next);
      savedRef.current = next;
      resetDirty();

      setMode("editing");
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [numero, busy]);

  const handleCancel = useCallback(() => {
    setForm(savedRef.current);
    resetDirty();
    setMode("view");
    toast.info("Modifications annulées");
  }, []);

  const handleSave = useCallback(async () => {
    if (!numero || !versionNumber) return;
    if (!canEdit) return;

    if (dirtyRef.current.size === 0) {
      toast.info("Aucune modification à enregistrer");
      return;
    }

    setSaving(true);
    try {
      for (const sectionId of dirtyRef.current) {
        const put = apiBySection[sectionId]?.put;
        if (!put) continue;
        await put(numero, sanitizeForApi(sectionId, form[sectionId]));
      }
      toast.success("Enregistré");
      savedRef.current = form;
      resetDirty();
      setMode("view");
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setSaving(false);
    }
  }, [numero, versionNumber, canEdit, form]);

  return (
    <div className="aPage">
      <div className="aContainer">
        <header className="aHeader">
          <div>
            <div className="aTitle">Antécédents</div>
            <div className="aSubtitle">
              Créez une nouvelle fiche d’antécédents et complétez les sections.
            </div>
          </div>

          <div className="aActions">
            {mode === "empty" ? (
              <button
                className="aBtn aBtnPrimary"
                onClick={handleCreate}
                disabled={busy}
              >
                {loading ? "Création..." : "Create New Antecedent"}
              </button>
            ) : mode === "view" ? (
              <button
                className="aBtn"
                onClick={() => setMode("editing")}
                disabled={busy}
              >
                Edit
              </button>
            ) : (
              <>
                <button
                  className="aBtn aBtnPrimary"
                  onClick={handleSave}
                  disabled={busy}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button className="aBtn" onClick={handleCancel} disabled={busy}>
                  Cancel
                </button>
              </>
            )}
          </div>
        </header>

        <main className="aCard" aria-busy={busy}>
          {mode === "empty" ? (
            <div className="aEmpty">
              <div className="aEmptyTitle">No antecedent yet</div>
              <div className="aEmptyText">
                Click <b>Create New Antecedent</b> to start.
              </div>
            </div>
          ) : (
            <>
              <div className="aToolbar">
                <div className="aHint">
                  {mode === "editing"
                    ? "Editing mode enabled"
                    : "Read-only view"}
                </div>
                {/* keep your TabNavigation if you want; or show all sections vertically for a SaaS-like form */}
              </div>

              <SectionRenderer
                active={"medical"} /* if SectionRenderer requires tab-based navigation, we need its code */
                form={form}
                BOOL_FIELDS={BOOL_FIELDS}
                updateSection={updateSection}
                updateList={updateList}
                addRow={addRow}
                removeRow={removeRow}
                readOnly={!canEdit}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
}