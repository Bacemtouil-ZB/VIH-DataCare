import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["link"],
    ["clean"],
  ],
};

const QUILL_FORMATS = [
  "header",
  "bold",
  "italic",
  "underline",
  "list",
  "bullet",
  "align",
  "link",
];

export default function ConclusionEditor({
  value,
  onChange,
  onSave,
  onCancel,
  saving,
  isEditing,
}) {
  return (
    <div className="pcCard">
      <div className="pcCardHeader">
        <div className="pcLabel">
          {isEditing ? "Modifier la conclusion" : "Nouvelle conclusion"}
        </div>

        <button className="pcBtnCancel" onClick={onCancel}>
          Annuler
        </button>
      </div>

      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={QUILL_MODULES}
        formats={QUILL_FORMATS}
        className="pcQuillLarge"
      />

      <div className="pcActions">
        <button
          className="pcBtnSave"
          onClick={onSave}
          disabled={saving}
        >
          {saving
            ? "Enregistrement..."
            : isEditing
            ? "Mettre à jour"
            : "Enregistrer"}
        </button>
      </div>
    </div>
  );
}