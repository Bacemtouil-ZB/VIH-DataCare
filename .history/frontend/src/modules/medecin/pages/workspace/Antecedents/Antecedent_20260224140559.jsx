import { useState } from "react";
import "./Antecedent.css";

import { SECTIONS, BOOL_FIELDS , initialState } from "./antecedentsConfig.jsx";

import TabNavigation from "../../../components/UI/TabNavigation";
import SectionRenderer from "../../../components/UI/SectionRenderer";

export default function AntecedentsForm() {
  const [active, setActive] = useState("medical");
  const [form, setForm] = useState(initialState);
  const [submitted, setSubmitted] = useState(false);

  const updateSection = (section, key, value) => {
    setForm((f) => ({ ...f, [section]: { ...f[section], [key]: value } }));
  };

  const updateList = (section, index, key, value) => {
    setForm((f) => {
      const arr = [...f[section]];
      arr[index] = { ...arr[index], [key]: value };
      return { ...f, [section]: arr };
    });
  };

  const addRow = (section, template) => {
    setForm((f) => ({ ...f, [section]: [...f[section], { ...template }] }));
  };

  const removeRow = (section, index) => {
    setForm((f) => ({ ...f, [section]: f[section].filter((_, i) => i !== index) }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const goPrev = () => {
    const i = SECTIONS.findIndex((s) => s.id === active);
    if (i > 0) setActive(SECTIONS[i - 1].id);
  };

  const goNext = () => {
    const i = SECTIONS.findIndex((s) => s.id === active);
    if (i < SECTIONS.length - 1) setActive(SECTIONS[i + 1].id);
  };

  const stepIndex = SECTIONS.findIndex((s) => s.id === active);

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');*{box-sizing:border-box;}input,textarea{font-family:inherit;}`}</style>

      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 28px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1a7a5e" }} />
            <span style={{ fontWeight: 700, fontSize: 15, color: "#111827", letterSpacing: "-.01em" }}>
              Dossier Antécédents Patient
            </span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {submitted && <span style={{ fontSize: 12.5, color: "#1a7a5e", fontWeight: 600 }}>✓ Enregistré</span>}
            <button
              onClick={handleSubmit}
              style={{
                background: "#1a7a5e",
                color: "#fff",
                border: "none",
                borderRadius: 7,
                padding: "8px 20px",
                fontWeight: 600,
                fontSize: 13.5,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "24px 28px" }}>
        <TabNavigation sections={SECTIONS} active={active} onChange={setActive} />

        <SectionRenderer
          active={active}
          form={form}
          BOOL_FIELDS={BOOL_FIELDS}
          updateSection={updateSection}
          updateList={updateList}
          addRow={addRow}
          removeRow={removeRow}
        />

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
          <button
            onClick={goPrev}
            disabled={active === SECTIONS[0].id}
            style={{
              background: "none",
              border: "1px solid #e5e7eb",
              borderRadius: 7,
              padding: "8px 18px",
              fontFamily: "inherit",
              fontSize: 13,
              color: "#6b7280",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            ← Précédent
          </button>

          <span style={{ fontSize: 12, color: "#9ca3af", alignSelf: "center" }}>
            {stepIndex + 1} / {SECTIONS.length}
          </span>

          <button
            onClick={goNext}
            disabled={active === SECTIONS[SECTIONS.length - 1].id}
            style={{
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: 7,
              padding: "8px 18px",
              fontFamily: "inherit",
              fontSize: 13,
              color: "#374151",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Suivant →
          </button>
        </div>
      </div>
    </div>
  );
}