import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ActionButton } from "../../../../../shared/components";
import { QUILL_MODULES, QUILL_FORMATS } from "./conclusionConstants.js";

export default function ConclusionEditor({ editorRef, editorValue, onChange, isEditing, saving, onSave }) {
  return (
    <div className="pcCard" ref={editorRef}>
      <div className="pcCardHeader">
        <div className="pcLabel">
          <i className={`bi ${isEditing ? "bi-pencil-square" : "bi-plus-circle"} me-2`} />
          {isEditing ? "Modifier la conclusion" : "Nouvelle conclusion"}
        </div>
      </div>

      <ReactQuill
        theme="snow"
        value={editorValue}
        onChange={onChange}
        modules={QUILL_MODULES}
        formats={QUILL_FORMATS}
        placeholder="Rédigez la conclusion médicale ici..."
        className="pcQuillLarge"
      />

      <div className="pcActions">
        <ActionButton
          action="save"
          label={isEditing ? "Mettre é jour" : "Enregistrer"}
          loading={saving}
          loadingLabel="Enregistrement..."
          onClick={onSave}
          className="ms-2"
        />
      </div>
    </div>
  );
}

