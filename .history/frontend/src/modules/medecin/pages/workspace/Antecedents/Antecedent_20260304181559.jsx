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
import TabNavigation from "../../../components/UI/TabNavigation";
import SectionRenderer from "../../../components/UI/SectionRenderer";

import antecedentsService from "../../../services/antecedentsService.jsx";
import { confirmAction } from "../../../../../shared/utils/uiAlerts.js";
import { normalizeFromApi, sanitizeForApi, getErrorMessage } from "./helpers.js";

/* ── Helpers ─────────────────────────────────────────────── */

const DATE_FMT = new Intl.DateTimeFormat("fr-FR", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : DATE_FMT.format(d);
};

const API_BY_SECTION = Object.freeze({
  medical:     { put: antecedentsService.updateMedical },
  infectious:  { put: antecedentsService.updateInfectious },
  therapeutic: { put: antecedentsService.updateTherapeutic },
  family:      { put: antecedentsService.updateFamily },
  gyneco:      { put: antecedentsService.updateGyneco },
  surgical:    { put: antecedentsService.replaceSurgical },
  transfusion: { put: antecedentsService.replaceTransfusion },
  aes:         { put: antecedentsService.replaceAes },
});

const buildFormFromSnapshot = (snapshot) => {
  const next = { ...initialState };
  for (const { id } of SECTIONS) {
    const normalized = normalizeFromApi(id, snapshot?.[id]);
    next[id] =
      normalized ??
      (Array.isArray(initialState[id]) ? [] : { ...initialState[id] });
  }
  return next;
};

/* ── Empty State ─────────────────────────────────────────── */

function EmptyState({ onCreateFirst, disabled }) {
  return (
    <div className="empty-state" role="status">
      <div className="empty-state-icon" aria-hidden="true">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125
               1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m
               3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0
               .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504
               1.125-1.125V11.25a9 9 0 0 0-9-9Z"
          />
        </svg>
      </div>
      <h2>Aucun antécédent enregistré</h2>
      <p>
        Commencez par créer un premier dossier d'antécédents pour ce patient.
        Vous pourrez ensuite le modifier ou créer de nouvelles versions.
      </p>
      <button
        type="button"
        className="btn btn-primary"
        onClick={onCreateFirst}
        disabled={disabled}
      >
        Créer un nouvel antécédent
      </button>
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────── */

export default function AntecedentsForm() {
  const { numero } = useParams();

  /* UI state */
  const [activeTab, setActiveTab] = useState("medical");
  const [form, setForm] = useState(initialState);

  /* Version management */
  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [readOnly, setReadOnly] = useState(false);
  const [hasAntecedent, setHasAntecedent] = useState(null); // null = loading

  /* Async flags */
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  /* Snapshot for cancel / revert */
  const savedRef = useRef(initialState);

  /* Fast dirty-tracking without JSON.stringify */
  const dirtyRef = useRef(new Set());
  const [, forceRender] = useState(0);
  const dirtyCount = dirtyRef.current.size;

  const canEdit = !readOnly && isEditing;

  const resetDirty = useCallback(() => {
    dirtyRef.current = new Set();
    forceRender((n) => n + 1);
  }, []);

  const markDirty = useCallback((sectionId) => {
    if (!dirtyRef.current.has(sectionId)) {
      dirtyRef.current.add(sectionId);
      forceRender((n) => n + 1);
    }
  }, []);

  /* ── Data Loading ────────────────────────────────────── */

  const loadVersions = useCallback(async () => {
    const data = await antecedentsService.getAntecedentVersions(numero);
    const list = Array.isArray(data?.versions) ? data.versions : [];
    setVersions(list);

    if (list.length === 0) {
      setHasAntecedent(false);
      return;
    }

    setHasAntecedent(true);
    const activeHeader = list.find((v) => v.status === "active");
    const defaultVersion =
      activeHeader?.version_number ?? list[0]?.version_number ?? null;
    setSelectedVersion((prev) => prev ?? defaultVersion);
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
        setReadOnly(snap?.antecedent?.status === "archived");
        setIsEditing(false);
      } catch (e) {
        toast.error(getErrorMessage(e));
      } finally {
        setLoading(false);
      }
    },
    [numero, resetDirty],
  );

  /* Initial load: check if antecedent exists */
  useEffect(() => {
    if (!numero) return;

    let cancelled = false;

    (async () => {
      try {
        await loadVersions();
      } catch (e) {
        if (!cancelled) toast.error(getErrorMessage(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [numero, loadVersions]);

  /* Load snapshot when version changes */
  useEffect(() => {
    if (selectedVersion) loadSnapshot(selectedVersion);
  }, [selectedVersion, loadSnapshot]);

  /* ── Section Mutations ───────────────────────────────── */

  const patchSection = useCallback(
    (sectionId, producer) => {
      if (!canEdit) return;
      setForm((prev) => {
        markDirty(sectionId);
        return { ...prev, [sectionId]: producer(prev[sectionId]) };
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

  /* ── Actions ─────────────────────────────────────────── */

  const handleCreateFirst = async () => {
    setLoading(true);
    try {
      const created = await antecedentsService.postNewAntecedentVersion(numero);
      toast.success("Antécédent créé avec succès");
      await loadVersions();

      const newV = created?.antecedent?.version_number;
      if (newV) setSelectedVersion(newV);

      setHasAntecedent(true);
      setIsEditing(true); // open directly in edit mode
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (readOnly) {
      toast.info("Version archivée : lecture seule");
      return;
    }

    const ok = await confirmAction({
      title: "Activer le mode modification ?",
      text: "Vous pourrez modifier plusieurs sections puis enregistrer en une seule fois.",
      confirmButtonText: "Modifier",
    });
    if (ok) setIsEditing(true);
  };

  const handleCancel = () => {
    setForm(savedRef.current);
    resetDirty();
    setIsEditing(false);
    toast.info("Modifications annulées");
  };

  const handleSaveAll = async () => {
    if (!numero) return;
    if (readOnly) return toast.info("Version archivée : lecture seule");
    if (!isEditing)
      return toast.info("Cliquez sur « Modifier » avant d\u2019enregistrer");
    if (dirtyRef.current.size === 0)
      return toast.info("Aucune modification à enregistrer");

    const ok = await confirmAction({
      title: "Enregistrer toutes les sections ?",
      text: `Vous allez enregistrer ${dirtyRef.current.size} section(s).`,
      confirmButtonText: "Enregistrer",
    });
    if (!ok) return;

    setSaving(true);
    try {
      for (const sectionId of dirtyRef.current) {
        const api = API_BY_SECTION[sectionId];
        if (!api?.put) continue;
        await api.put(numero, sanitizeForApi(sectionId, form[sectionId]));
      }

      toast.success("Enregistré avec succès");
      await loadVersions();
      await loadSnapshot(selectedVersion);
      setIsEditing(false);
      resetDirty();
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const handleNewVersion = async () => {
    if (saving || loading) return;

    const ok = await confirmAction({
      title: "Nouvelle version",
      text: "Créer une nouvelle version ? L\u2019actuelle sera archivée.",
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
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  /* ── Render ──────────────────────────────────────────── */

  // Initial loading state — we don't know yet if antecedent exists
  if (hasAntecedent === null && loading) {
    return (
      <div className="antecedents-wrapper">
        <div className="antecedents-page-title">
          <h1>Antécédents du patient</h1>
          <p>Historique médical, chirurgical, familial et thérapeutique</p>
        </div>
        <div className="antecedents-container">
          <div className="antecedents-card">
            <div className="loading-state" role="status" aria-label="Chargement">
              <div className="spinner" aria-hidden="true" />
              Chargement…
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state — no antecedent yet
  if (hasAntecedent === false) {
    return (
      <div className="antecedents-wrapper">
        <div className="antecedents-page-title">
          <h1>Antécédents du patient</h1>
          <p>Historique médical, chirurgical, familial et thérapeutique</p>
        </div>
        <div className="antecedents-container">
          <div className="antecedents-card">
            <EmptyState
              onCreateFirst={handleCreateFirst}
              disabled={loading || saving}
            />
          </div>
        </div>
      </div>
    );
  }

  // Full form view
  return (
    <div className="antecedents-wrapper">
      {/* Page Title */}
      <div className="antecedents-page-title">
        <h1>Antécédents du patient</h1>
        <p>Historique médical, chirurgical, familial et thérapeutique</p>
      </div>

      {/* Toolbar */}
      <div className="antecedents-toolbar" role="toolbar" aria-label="Gestion des versions">
        <div className="toolbar-left">
          <label htmlFor="version-select" className="sr-only">
            Sélectionner une version
          </label>
          <select
            id="version-select"
            className="version-select"
            value={selectedVersion ?? ""}
            onChange={(e) => setSelectedVersion(Number(e.target.value))}
            disabled={loading || saving}
          >
            {versions.map((v) => (
              <option key={v.id} value={v.version_number}>
                v{v.version_number} — {v.status === "active" ? "active" : "archivée"} — {formatDate(v.created_at)}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleNewVersion}
            disabled={loading || saving}
          >
            + Nouvelle version
          </button>

          {readOnly && (
            <span className="badge badge--readonly" role="status">
              Lecture seule
            </span>
          )}

          {!readOnly && dirtyCount > 0 && (
            <span className="badge badge--dirty" role="status">
              {dirtyCount} section{dirtyCount > 1 ? "s" : ""} modifiée{dirtyCount > 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div className="toolbar-right">
          {!isEditing ? (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleEdit}
              disabled={loading || saving || readOnly}
            >
              Modifier
            </button>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveAll}
                disabled={saving || loading || readOnly}
                aria-busy={saving}
              >
                {saving ? "Enregistrement…" : "Enregistrer"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
                disabled={saving || loading}
              >
                Annuler
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="antecedents-container">
        <div className="antecedents-card">
          <TabNavigation
            sections={SECTIONS}
            active={activeTab}
            onChange={setActiveTab}
          />

          {loading ? (
            <div className="loading-state" role="status" aria-label="Chargement">
              <div className="spinner" aria-hidden="true" />
              Chargement…
            </div>
          ) : (
            <SectionRenderer
              active={activeTab}
              form={form}
              BOOL_FIELDS={BOOL_FIELDS}
              updateSection={updateSection}
              updateList={updateList}
              addRow={addRow}
              removeRow={removeRow}
              readOnly={!canEdit}
            />
          )}
        </div>
      </div>
    </div>
  );
}