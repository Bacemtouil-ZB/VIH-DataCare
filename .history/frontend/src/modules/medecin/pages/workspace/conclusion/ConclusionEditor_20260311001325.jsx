import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { QUILL_MODULES, QUILL_FORMATS } from "./conclusionHelpers";

export default function ConclusionEditor({ editorRef, editorValue, onChange, isEditing, saving, onSave, onCancel }) {
  return (
    <div className="pcCard" ref={editorRef}>
      <div className="pcCardHeader">
        <div className="pcLabel">
          <i className={`bi ${isEditing ? "bi-pencil-square" : "bi-plus-circle"} me-2`} />
          {isEditing ? "Modifier la conclusion" : "Nouvelle conclusion"}
        </div>
        <button className="pcBtnCancel" type="button" onClick={onCancel}>
          <i className="bi bi-x-lg me-1" /> Annuler
        </button>
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
        <button
          className={`pcBtnSave ${isEditing ? "pcBtnSaveEdit" : ""}`}
          type="button"
          onClick={onSave}
          disabled={saving}
        >
          {saving ? (
            <><span className="spinner-border spinner-border-sm me-2" />Enregistrement…</>
          ) : (
            <>
              <i className={`bi ${isEditing ? "bi-arrow-repeat" : "bi-check2-circle"} me-2`} />
              {isEditing ? "Mettre à jour" : "Enregistrer"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}