// import React, { useEffect, useMemo, useState, useRef } from "react";
// import { toast } from "react-toastify";
// import { useParams } from "react-router-dom";
// import { useAuth } from "../../../../../shared/hooks/useAuth";

// import ConclusionUI from "./ConclusionUI";
// import ConclusionEditor from "./ConclusionEditor";
// import {
//   createPatientConclusion,
//   listPatientConclusions,
//   updateConclusion,
// } from "../../../services/conclusionsService";
// import { DEFAULT_LIMIT } from "./conclusionHelpers";
// import "./conclusion.css";

// export default function PatientConclusionPage() {
//   const { numero } = useParams();
//   const { user } = useAuth();

//   const [editorValue, setEditorValue] = useState("");
//   const [editingId, setEditingId] = useState(null);
//   const [saving, setSaving] = useState(false);
//   const [showEditor, setShowEditor] = useState(false);
//   const [previewItem, setPreviewItem] = useState(null);

//   const [histOpen, setHistOpen] = useState(true);
//   const [histLoading, setHistLoading] = useState(false);
//   const [conclusions, setConclusions] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [limit] = useState(DEFAULT_LIMIT);
//   const [offset, setOffset] = useState(0);

//   const editorRef = useRef(null);

//   const page = useMemo(() => Math.floor(offset / limit) + 1, [offset, limit]);
//   const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

//   const loadHistory = async () => {
//     setHistLoading(true);
//     try {
//       const data = await listPatientConclusions(numero, { limit, offset });
//       setConclusions(data.conclusions || []);
//       setTotal(data.total ?? 0);
//     } catch (e) {
//       toast.error(e?.message || "Erreur chargement historique");
//     } finally {
//       setHistLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (numero) loadHistory();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [numero, offset]);

//   const resetEditor = () => {
//     setEditorValue("");
//     setEditingId(null);
//     setShowEditor(false);
//   };

//   const onSave = async () => {
//     const text = editorValue.replace(/<[^>]*>/g, "").trim();
//     if (text.length < 5) {
//       toast.info("Veuillez saisir une conclusion (min 5 caractères).");
//       return;
//     }
//     setSaving(true);
//     try {
//       if (editingId) {
//         await updateConclusion(editingId, { content: editorValue });
//         toast.success("Conclusion mise à jour");
//       } else {
//         await createPatientConclusion(numero, { content: editorValue });
//         toast.success("Conclusion enregistrée");
//       }
//       resetEditor();
//       setOffset(0);
//       await loadHistory();
//       setHistOpen(true);
//     } catch (e) {
//       toast.error(e?.message || "Erreur enregistrement");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const onEdit = (c) => {
//     setEditorValue(c.content || "");
//     setEditingId(c.id);
//     setShowEditor(true);
//     setTimeout(() => {
//       editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
//     }, 100);
//   };

//   const openEditor = () => {
//     setEditingId(null);
//     setEditorValue("");
//     setShowEditor(true);
//     setTimeout(() => {
//       editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
//     }, 100);
//   };

//   return (
//     <div className="pcPage">

//       <div className="page-header">
//         <h2>Conclusions médicales</h2>
//       </div>

//       <div className="pcTopBar">
//         <button className="pcBtnAdd" type="button" onClick={openEditor}>
//           <i className="bi bi-plus-lg me-2" />
//           Ajouter
//         </button>
//       </div>

//       <ConclusionUI
//         user={user}
//         total={total}
//         histOpen={histOpen}
//         histLoading={histLoading}
//         conclusions={conclusions}
//         page={page}
//         totalPages={totalPages}
//         limit={limit}
//         offset={offset}
//         setOffset={setOffset}
//         onToggleHist={() => setHistOpen((v) => !v)}
//         onDetails={(c) => setPreviewItem(c)}
//         onEdit={onEdit}
//         previewItem={previewItem}
//         setPreviewItem={setPreviewItem}
//       />

//       {showEditor && (
//         <ConclusionEditor
//           editorRef={editorRef}
//           editorValue={editorValue}
//           onChange={setEditorValue}
//           isEditing={!!editingId}
//           saving={saving}
//           onSave={onSave}
//           onCancel={resetEditor}
//         />
//       )}

//     </div>
//   );
// }


// conclusions/PatientConclusionPage.jsx

import React from "react";
import { useParams } from "react-router-dom";
import { useConclusionLogic } from "./useConclusionLogic";
import ConclusionUI from "./ConclusionUI";
import ConclusionEditor from "./ConclusionEditor";
import "./conclusion.css";

export default function PatientConclusionPage() {
  const { numero } = useParams();
  const logic = useConclusionLogic(numero);

  return (
    <div className="pcPage">

      <div className="page-header">
        <h2>Conclusions médicales</h2>
      </div>

      <div className="pcTopBar">
        <button className="pcBtnAdd" type="button" onClick={logic.openEditor}>
          <i className="bi bi-plus-lg me-2" />
          Ajouter
        </button>
      </div>

      <ConclusionUI {...logic} />

      {logic.showEditor && (
        <ConclusionEditor
          editorRef={logic.editorRef}
          editorValue={logic.editorValue}
          onChange={logic.setEditorValue}
          isEditing={!!logic.editingId}
          saving={logic.saving}
          onSave={logic.onSave}
          onCancel={logic.resetEditor}
        />
      )}

    </div>
  );
}
