import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function Editor() {
  const [value, setValue] = useState("");

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      [{ font: [] }],
      [{ size: ["small", false, "large", "huge"] }],

      ["bold", "italic", "underline", "strike"],

      [{ color: [] }, { background: [] }],

      [{ script: "sub" }, { script: "super" }],

      [{ list: "ordered" }, { list: "bullet" }],

      [{ indent: "-1" }, { indent: "+1" }],

      [{ align: [] }],

      ["link", "image"],

      ["clean"]
    ]
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "list",
    "bullet",
    "indent",
    "align",
    "link",
    "image"
  ];

  return (
    <div style={{ width: "90%", margin: "40px auto" }}>
      <h2>Conclusion médicale</h2>

      <ReactQuill
        theme="snow"
        value={value}
        onChange={setValue}
        modules={modules}
        formats={formats}
        style={{ height: "300px", marginBottom: "50px" }}
      />

      <h3>Contenu HTML sauvegardé :</h3>

      <div
        style={{
          border: "1px solid #ddd",
          padding: "10px",
          background: "#fafafa"
        }}
      >
        {value}
      </div>
    </div>
  );
}