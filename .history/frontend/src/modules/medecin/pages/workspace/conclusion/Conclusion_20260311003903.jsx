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
