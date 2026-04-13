import { useParams } from "react-router-dom";
import { ActionButton, PageTitle } from "../../../../../shared/components";
import { useConclusionLogic } from "./useConclusionLogic";
import ConclusionUI from "./ConclusionUI";
import ConclusionEditor from "./ConclusionEditor";
import "./conclusion.css";

export default function PatientConclusionPage() {
  const { numero } = useParams();
  const logic = useConclusionLogic(numero);

  return (
    <div className="pcPage pcPage--no-fill">

      <div className="page-header">
        <PageTitle title="Conclusions médicales" />
      </div>

      <div className="pcTopBar">
        {!logic.showEditor ? (
          <ActionButton action="add" label="Ajouter" onClick={logic.openEditor} />
        ) : (
          <ActionButton action="annuler" label="Annuler" onClick={logic.cancelEditor} />
        )}
      </div>

      {logic.showEditor && (
        <ConclusionEditor
          editorRef={logic.editorRef}
          editorValue={logic.editorValue}
    onChange={logic.handleEditorChange}          // ← utilise handleEditorChange
          isEditing={!!logic.editingId}
          saving={logic.saving}
          onSave={logic.onSave}
          onCancel={logic.cancelEditor}
              error={logic.errors.content}                 // ← passe l'erreur content

        />
      )}

      <ConclusionUI
        {...logic}
        onDetails={(c) => logic.setPreviewItem(c)}
      />

    </div>
  );
}



