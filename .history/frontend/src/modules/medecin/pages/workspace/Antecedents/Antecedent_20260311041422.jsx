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

// const MESSAGES = {
//   READ_ONLY: "Version archivée : lecture seule",
//   NEED_EDIT: "Cliquez sur “Modifier” avant d’enregistrer",
//   NOTHING_TO_SAVE: "Aucune modification à enregistrer",
//   CANCELLED: "Modifications annulées",
//   SAVED: "Enregistré",
//   NEW_VERSION_CREATED: "Nouvelle version créée",
//   FIRST_CREATED: "Fiche créée",
// };

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

//   const savedRef = useRef(initialState);
//   const dirtyRef = useRef(new Set());
//   const [, force] = useState(0);

//   const dirtyCount = dirtyRef.current.size;
//   const hasDirty = dirtyCount > 0;
//   const isBusy = loading || saving;
//   const canEdit = !readOnly && isEditing;
//   const hasAnyVersion = versions.length > 0;

//   const notifyError = (e) => toast.error(getErrorMessage(e));

//   const guardReadOnly = () => {
//     if (readOnly) {
//       toast.info(MESSAGES.READ_ONLY);
//       return true;
//     }
//     return false;
//   };

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

//   const loadVersions = useCallback(async () => {
//     const data = await antecedentsService.getAntecedentVersions(numero);
//     const list = Array.isArray(data?.versions) ? data.versions : [];
//     setVersions(list);

//     const activeHeader = list.find((v) => v.status === "active");
//     const defaultVersion =
//       activeHeader?.version_number ?? list[0]?.version_number ?? null;

//     setSelectedVersion((prev) => prev ?? defaultVersion);
//   }, [numero]);

//   const loadSnapshot = useCallback(
//     async (versionNumber, options = {}) => {
//       const { keepEditing = false } = options;
//       if (!numero || !versionNumber) return;

//       setLoading(true);
//       try {
//         const snap = await antecedentsService.getAntecedentVersionSnapshot(
//           numero,
//           versionNumber
//         );

//         const next = buildFormFromSnapshot(snap);
//         setForm(next);
//         savedRef.current = next;

//         resetDirty();
//         setReadOnly(snap?.antecedent?.status === "archived");
//         setIsEditing(keepEditing);
//       } catch (e) {
//         notifyError(e);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [numero]
//   );

//   useEffect(() => {
//     if (!numero) return;

//     (async () => {
//       try {
//         await loadVersions();
//       } catch (e) {
//         notifyError(e);
//       }
//     })();
//   }, [numero, loadVersions]);

//   useEffect(() => {
//     if (!selectedVersion) return;
//     loadSnapshot(selectedVersion);
//   }, [selectedVersion, loadSnapshot]);

//   const patchSection = (sectionId, producer) => {
//     if (!canEdit) return;
//     setForm((currentForm) => {
//       const nextSection = producer(currentForm[sectionId]);
//       markDirty(sectionId);
//       return { ...currentForm, [sectionId]: nextSection };
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
//       Array.isArray(cur) ? cur.filter((_, i) => i !== index) : []
//     );

//   const handleCreateFirst = async () => {
//     if (!numero || isBusy) return;

//     const ok = await confirmAction({
//       title: "Créer la première fiche ?",
//       text: "Une nouvelle fiche d’antécédents sera créée.",
//       confirmButtonText: "Créer",
//     });
//     if (!ok) return;

//     setLoading(true);
//     try {
//       const created = await antecedentsService.postNewAntecedentVersion(numero);
//       const newVersion = created?.antecedent?.version_number ?? null;

//       await loadVersions();

//       if (newVersion) {
//         setSelectedVersion(newVersion);
//         await loadSnapshot(newVersion, { keepEditing: true });
//       }

//       toast.success(MESSAGES.FIRST_CREATED);
//     } catch (e) {
//       notifyError(e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = async () => {
//     if (guardReadOnly()) return;

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
//     toast.info(MESSAGES.CANCELLED);
//   };

//   const handleSaveAll = async () => {
//     if (!numero) return;
//     if (guardReadOnly()) return;
//     if (!isEditing) return toast.info(MESSAGES.NEED_EDIT);
//     if (!hasDirty) return toast.info(MESSAGES.NOTHING_TO_SAVE);

//     const ok = await confirmAction({
//       title: "Enregistrer toutes les sections ?",
//       text: `Vous allez enregistrer ${dirtyCount} section(s).`,
//       confirmButtonText: "Enregistrer",
//     });
//     if (!ok) return;

//     setSaving(true);
//     try {
//       let versionToUse = selectedVersion;

//       if (!versionToUse) {
//         const created = await antecedentsService.postNewAntecedentVersion(numero);
//         versionToUse = created?.antecedent?.version_number ?? null;
//         if (!versionToUse) throw new Error("Création de version impossible");
//         setSelectedVersion(versionToUse);
//       }

//       for (const sectionId of dirtyRef.current) {
//         const api = apiBySection[sectionId];
//         if (!api?.put) continue;
//         await api.put(numero, sanitizeForApi(sectionId, form[sectionId]));
//       }

//       toast.success(MESSAGES.SAVED);
//       await loadVersions();
//       await loadSnapshot(versionToUse);

//       setIsEditing(false);
//       resetDirty();
//     } catch (e) {
//       notifyError(e);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleNewVersion = async () => {
//     if (isBusy) return;

//     const ok = await confirmAction({
//       title: "Nouvelle version",
//       text: "Créer une nouvelle version ? L’actuelle sera archivée.",
//       confirmButtonText: "Créer",
//     });
//     if (!ok) return;

//     setLoading(true);
//     try {
//       const created = await antecedentsService.postNewAntecedentVersion(numero);
//       toast.success(MESSAGES.NEW_VERSION_CREATED);
//       await loadVersions();

//       const newVersion = created?.antecedent?.version_number;
//       if (newVersion) setSelectedVersion(newVersion);
//     } catch (e) {
//       notifyError(e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const statusPill = readOnly ? (
//     <span className="pill pill-readonly">Lecture seule</span>
//   ) : hasDirty ? (
//     <span className="pill pill-dirty">{dirtyCount} modifiée(s)</span>
//   ) : null;

//   return (
//     <div className="antecedents-wrapper">
//       <div className="antecedents-header">
//         <div className="header-content">
//           <div className="header-left header-row">
//             {hasAnyVersion ? (
//               <div className="version-bar">
//                 <span className="version-label">Version</span>
//                 <select
//                   className="version-select"
//                   value={selectedVersion ?? ""}
//                   onChange={(e) => setSelectedVersion(Number(e.target.value))}
//                   disabled={isBusy}
//                 >
//                   {versions.map((v) => (
//                     <option key={v.id} value={v.version_number}>
//                       {`v${v.version_number} — ${
//                         v.status === "active" ? "active" : "archivée"
//                       } — ${formatDate(v.created_at)}`}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             ) : null}

//             {hasAnyVersion && (
//               <button
//                 onClick={handleNewVersion}
//                 className="btn-secondary"
//                 disabled={isBusy}
//               >
//                 + Nouvelle version
//               </button>
//             )}

//             {statusPill}
//           </div>

//           <div className="header-right">
//             {isEditing ? (
//               <>
//                 <button
//                   onClick={handleSaveAll}
//                   className="btn-primary"
//                   disabled={isBusy || readOnly}
//                 >
//                   {saving ? "Enregistrement..." : "Enregistrer"}
//                 </button>
//                 <button onClick={handleCancel} className="btn-secondary" disabled={isBusy}>
//                   Annuler
//                 </button>
//               </>
//             ) : hasAnyVersion ? (
//               <button
//                 onClick={handleEdit}
//                 className="btn-secondary"
//                 disabled={isBusy || readOnly}
//               >
//                 Modifier
//               </button>
//             ) : null}
//           </div>
//         </div>
//       </div>

//       {!hasAnyVersion && (
//         <div className="empty-state-card">
//           <h3 className="empty-state-title">Aucune fiche d’antécédents</h3>
//           <p className="empty-state-text">
//             Créez la première fiche pour commencer la saisie des antécédents.
//           </p>
//           <button
//             onClick={handleCreateFirst}
//             className="btn-primary"
//             disabled={isBusy}
//           >
//             {loading ? "Création..." : "Créer la fiche"}
//           </button>
//         </div>
//       )}

//       <div className="antecedents-container">
//         {hasAnyVersion ? (
//           <>
//             <TabNavigation sections={SECTIONS} active={active} onChange={setActive} />

//             {loading ? (
//               <div className="loading">Chargement...</div>
//             ) : (
//               <SectionRenderer
//                 active={active}
//                 form={form}
//                 BOOL_FIELDS={BOOL_FIELDS}
//                 updateSection={updateSection}
//                 updateList={updateList}
//                 addRow={addRow}
//                 removeRow={removeRow}
//                 readOnly={!canEdit}
//               />
//             )}
//           </>
//         ) : null}
//       </div>
//     </div>
//   );
// }

import { useAntecedentsLogic } from "./useAntecedentsLogic";

import "./antecedents_style.css";

import { SECTIONS, BOOL_FIELDS } from "./antecedentsConfig.jsx";
import TabNavigation from "../../../components/UI/TabNavigation";
import SectionRenderer from "../../../components/UI/SectionRenderer";

const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export default function AntecedentsForm() {
  const {
    // state
    active, setActive,
    form,
    versions,
    selectedVersion, setSelectedVersion,
    readOnly,
    loading,
    saving,
    isEditing,
    // derived
    dirtyCount,
    hasDirty,
    isBusy,
    canEdit,
    hasAnyVersion,
    // form mutations
    updateSection,
    updateList,
    addRow,
    removeRow,
    // action handlers
    handleCreateFirst,
    handleEdit,
    handleCancel,
    handleSaveAll,
    handleNewVersion,
  } = useAntecedentsLogic();

  const statusPill = readOnly ? (
    <span className="pill pill-readonly">Lecture seule</span>
  ) : hasDirty ? (
    <span className="pill pill-dirty">{dirtyCount} modifiée(s)</span>
  ) : null;

  return (
    <div className="antecedents-wrapper">
      <div className="antecedents-header">
        <div className="header-content">
          <div className="header-left header-row">
            {hasAnyVersion ? (
              <div className="version-bar">
                <span className="version-label">Version</span>
                <select
                  className="version-select"
                  value={selectedVersion ?? ""}
                  onChange={(e) => setSelectedVersion(Number(e.target.value))}
                  disabled={isBusy}
                >
                  {versions.map((v) => (
                    <option key={v.id} value={v.version_number}>
                      {`v${v.version_number} — ${
                        v.status === "active" ? "active" : "archivée"
                      } — ${formatDate(v.created_at)}`}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            {hasAnyVersion && (
              <button
                onClick={handleNewVersion}
                className="btn-secondary"
                disabled={isBusy}
              >
                + Nouvelle version
              </button>
            )}

            {statusPill}
          </div>

          <div className="header-right">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveAll}
                  className="btn-primary"
                  disabled={isBusy || readOnly}
                >
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
                <button onClick={handleCancel} className="btn-secondary" disabled={isBusy}>
                  Annuler
                </button>
              </>
            ) : hasAnyVersion ? (
              <button
                onClick={handleEdit}
                className="btn-secondary"
                disabled={isBusy || readOnly}
              >
                Modifier
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {!hasAnyVersion && (
        <div className="empty-state-card">
          <h3 className="empty-state-title">Aucune fiche d'antécédents</h3>
          <p className="empty-state-text">
            Créez la première fiche pour commencer la saisie des antécédents.
          </p>
          <button
            onClick={handleCreateFirst}
            className="btn-primary"
            disabled={isBusy}
          >
            {loading ? "Création..." : "Créer la fiche"}
          </button>
        </div>
      )}

      <div className="antecedents-container">
        {hasAnyVersion ? (
          <>
            <TabNavigation sections={SECTIONS} active={active} onChange={setActive} />

            {loading ? (
              <div className="loading">Chargement...</div>
            ) : (
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
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}