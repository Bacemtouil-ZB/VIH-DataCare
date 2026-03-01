import { useState } from "react";
import { SECTIONS, BOOL_FIELDS, initialState } from "./antecedentsConfig.jsx";
import TabNavigation from "../../../components/UI/TabNavigation";
import SectionRenderer from "../../../components/UI/SectionRenderer.jsx";
import "./Antecedent.css";

export default function AntecedentsForm() {
  const [active, setActive] = useState("medical");
  const [form, setForm] = useState(initialState);
  const [submitted, setSubmitted] = useState(false);

  const updateSection = (section, key, value) => {
    setForm(f => ({ ...f, [section]: { ...f[section], [key]: value } }));
  };

  const updateList = (section, index, key, value) => {
    setForm(f => {
      const arr = [...f[section]];
      arr[index] = { ...arr[index], [key]: value };
      return { ...f, [section]: arr };
    });
  };

  const addRow = (section, template) => {
    setForm(f => ({
      ...f,
      [section]: [...f[section], { ...template }]
    }));
  };

  const removeRow = (section, index) => {
    setForm(f => ({
      ...f,
      [section]: f[section].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="antecedents-container">

      <div className="antecedents-header">
        <div className="header-left">
          <div className="dot" />
          <span>Dossier Antécédents Patient</span>
        </div>

        <div className="header-right">
          {submitted && <span className="saved">✓ Enregistré</span>}
          <button onClick={handleSubmit} className="btn-primary">
            Enregistrer
          </button>
        </div>
      </div>

      <div className="antecedents-content">
        <TabNavigation
          sections={SECTIONS}
          active={active}
          setActive={setActive}
        />

        <SectionRenderer
          active={active}
          form={form}
          updateSection={updateSection}
          updateList={updateList}
          addRow={addRow}
          removeRow={removeRow}
          BOOL_FIELDS={BOOL_FIELDS}
        />
      </div>
    </div>
  );
}