import { useState } from "react";
import "./Antecedent.css";

import { SECTIONS, BOOL_FIELDS, initialState } from "./antecedentsConfig.jsx";

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
    setForm((f) => ({
      ...f,
      [section]: f[section].filter((_, i) => i !== index),
    }));
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
    <div className="antecedents-wrapper">
      <div className="antecedents-header">
        <div className="header-content">
          <div className="header-left">
            <div className="status-dot" />
            <span className="header-title">
              Dossier Antécédents Patient
            </span>
          </div>

          <div className="header-right">
            {submitted && (
              <span className="saved-message">✓ Enregistré</span>
            )}

            <button onClick={handleSubmit} className="btn-primary">
              Enregistrer
            </button>
          </div>
        </div>
      </div>

      <div className="antecedents-container">
        <TabNavigation
          sections={SECTIONS}
          active={active}
          onChange={setActive}
        />

        <SectionRenderer
          active={active}
          form={form}
          BOOL_FIELDS={BOOL_FIELDS}
          updateSection={updateSection}
          updateList={updateList}
          addRow={addRow}
          removeRow={removeRow}
        />

        <div className="navigation-footer">
          <button
            onClick={goPrev}
            disabled={active === SECTIONS[0].id}
            className="btn-secondary"
          >
            ← Précédent
          </button>

          <span className="step-indicator">
            {stepIndex + 1} / {SECTIONS.length}
          </span>

          <button
            onClick={goNext}
            disabled={active === SECTIONS[SECTIONS.length - 1].id}
            className="btn-next"
          >
            Suivant →
          </button>
        </div>
      </div>
    </div>
  );
}