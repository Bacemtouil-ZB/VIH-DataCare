import { useState } from "react";



function Toggle({ checked, onChange, label }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", userSelect: "none", padding: "6px 0" }}>
      <div
        onClick={onChange}
        style={{
          width: 36, height: 20, borderRadius: 10, background: checked ? "#1a7a5e" : "#d1d5db",
          position: "relative", transition: "background 0.2s", flexShrink: 0,
        }}
      >
        <div style={{
          width: 14, height: 14, borderRadius: "50%", background: "#fff",
          position: "absolute", top: 3, left: checked ? 19 : 3, transition: "left 0.2s",
          boxShadow: "0 1px 3px rgba(0,0,0,.2)"
        }} />
      </div>
      <span style={{ fontSize: 13.5, color: "#374151" }}>{label}</span>
    </label>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 4, textTransform: "uppercase", letterSpacing: ".04em" }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "8px 10px", borderRadius: 6,
  border: "1px solid #e5e7eb", fontSize: 13.5, color: "#111827",
  background: "#fafafa", outline: "none", boxSizing: "border-box",
  transition: "border-color .15s",
};

function Input({ value, onChange, type = "text", placeholder }) {
  return (
    <input
      type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={inputStyle}
      onFocus={e => e.target.style.borderColor = "#1a7a5e"}
      onBlur={e => e.target.style.borderColor = "#e5e7eb"}
    />
  );
}

function Textarea({ value, onChange, placeholder }) {
  return (
    <textarea
      value={value} onChange={onChange} placeholder={placeholder} rows={3}
      style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
      onFocus={e => e.target.style.borderColor = "#1a7a5e"}
      onBlur={e => e.target.style.borderColor = "#e5e7eb"}
    />
  );
}

function SectionCard({ title, children }) {
  return (
    <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e5e7eb", overflow: "hidden" }}>
      <div style={{ padding: "12px 18px", borderBottom: "1px solid #f3f4f6", background: "#f9fafb" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#1a7a5e", textTransform: "uppercase", letterSpacing: ".06em" }}>{title}</span>
      </div>
      <div style={{ padding: 18 }}>{children}</div>
    </div>
  );
}

function BoolGrid({ fields, data, onChange }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "2px 16px" }}>
      {fields.map(f => (
        <Toggle key={f.key} label={f.label} checked={data[f.key]} onChange={() => onChange(f.key, !data[f.key])} />
      ))}
    </div>
  );
}

function ListSection({ items, onAdd, onRemove, renderItem, addLabel }) {
  return (
    <div>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
          <div style={{ flex: 1 }}>{renderItem(item, i)}</div>
          {items.length > 1 && (
            <button onClick={() => onRemove(i)} style={{ background: "none", border: "1px solid #fca5a5", color: "#ef4444", borderRadius: 6, padding: "6px 10px", cursor: "pointer", fontSize: 13, marginTop: 0 }}>✕</button>
          )}
        </div>
      ))}
      <button
        onClick={onAdd}
        style={{ fontSize: 12.5, color: "#1a7a5e", background: "none", border: "1px dashed #1a7a5e", borderRadius: 6, padding: "6px 14px", cursor: "pointer", fontWeight: 600 }}
      >+ {addLabel}</button>
    </div>
  );
}

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
    setForm(f => ({ ...f, [section]: [...f[section], { ...template }] }));
  };

  const removeRow = (section, index) => {
    setForm(f => ({ ...f, [section]: f[section].filter((_, i) => i !== index) }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const renderSection = () => {
    switch (active) {
      case "medical":
        return (
          <SectionCard title="Antécédents Médicaux">
            <BoolGrid fields={BOOL_FIELDS.medical} data={form.medical} onChange={(k, v) => updateSection("medical", k, v)} />
            <div style={{ marginTop: 14 }}>
              <Field label="Autres">
                <Textarea value={form.medical.autres} onChange={e => updateSection("medical", "autres", e.target.value)} placeholder="Précisez d'autres antécédents médicaux…" />
              </Field>
            </div>
          </SectionCard>
        );
      case "infectious":
        return (
          <SectionCard title="Antécédents Infectieux">
            <BoolGrid fields={BOOL_FIELDS.infectious} data={form.infectious} onChange={(k, v) => updateSection("infectious", k, v)} />
          </SectionCard>
        );
      case "therapeutic":
        return (
          <SectionCard title="Antécédents Thérapeutiques">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="Médicaments chroniques"><Textarea value={form.therapeutic.medicaments_chroniques} onChange={e => updateSection("therapeutic", "medicaments_chroniques", e.target.value)} placeholder="Listez les médicaments…" /></Field>
              <Field label="Automédication"><Textarea value={form.therapeutic.automedication} onChange={e => updateSection("therapeutic", "automedication", e.target.value)} placeholder="Précisez…" /></Field>
              <Field label="Médecines traditionnelles"><Textarea value={form.therapeutic.medecines_traditionnelles} onChange={e => updateSection("therapeutic", "medecines_traditionnelles", e.target.value)} placeholder="Précisez…" /></Field>
              <Field label="Allergies médicamenteuses"><Textarea value={form.therapeutic.allergies_medicaments} onChange={e => updateSection("therapeutic", "allergies_medicaments", e.target.value)} placeholder="Précisez les allergies…" /></Field>
            </div>
          </SectionCard>
        );
      case "surgical":
        return (
          <SectionCard title="Antécédents Chirurgicaux">
            <ListSection
              items={form.surgical}
              onAdd={() => addRow("surgical", { description: "", date_intervention: "" })}
              onRemove={i => removeRow("surgical", i)}
              onChange={updateList}
              addLabel="Ajouter une intervention"
              renderItem={(item, i) => (
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10 }}>
                  <Field label="Description"><Input value={item.description} onChange={e => updateList("surgical", i, "description", e.target.value)} placeholder="Type d'intervention…" /></Field>
                  <Field label="Date"><Input type="date" value={item.date_intervention} onChange={e => updateList("surgical", i, "date_intervention", e.target.value)} /></Field>
                </div>
              )}
            />
          </SectionCard>
        );
      case "transfusion":
        return (
          <SectionCard title="Antécédents de Transfusion">
            <ListSection
              items={form.transfusion}
              onAdd={() => addRow("transfusion", { date_transfusion: "" })}
              onRemove={i => removeRow("transfusion", i)}
              onChange={updateList}
              addLabel="Ajouter une transfusion"
              renderItem={(item, i) => (
                <Field label="Date de transfusion"><Input type="date" value={item.date_transfusion} onChange={e => updateList("transfusion", i, "date_transfusion", e.target.value)} /></Field>
              )}
            />
          </SectionCard>
        );
      case "aes":
        return (
          <SectionCard title="Accidents d'Exposition au Sang (AES)">
            <ListSection
              items={form.aes}
              onAdd={() => addRow("aes", { date_aes: "" })}
              onRemove={i => removeRow("aes", i)}
              onChange={updateList}
              addLabel="Ajouter un AES"
              renderItem={(item, i) => (
                <Field label="Date de l'AES"><Input type="date" value={item.date_aes} onChange={e => updateList("aes", i, "date_aes", e.target.value)} /></Field>
              )}
            />
          </SectionCard>
        );
      case "gyneco":
        return (
          <SectionCard title="Antécédents Gynéco-Obstétricaux">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 14 }}>
              <Field label="Gestité"><Input type="number" value={form.gyneco.gestite} onChange={e => updateSection("gyneco", "gestite", e.target.value)} placeholder="0" /></Field>
              <Field label="Parité"><Input type="number" value={form.gyneco.parite} onChange={e => updateSection("gyneco", "parite", e.target.value)} placeholder="0" /></Field>
              <Field label="Avortements"><Input type="number" value={form.gyneco.avortement} onChange={e => updateSection("gyneco", "avortement", e.target.value)} placeholder="0" /></Field>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="Complications"><Textarea value={form.gyneco.complications} onChange={e => updateSection("gyneco", "complications", e.target.value)} placeholder="Décrivez les complications…" /></Field>
              <Field label="Suivi gynécologique"><Textarea value={form.gyneco.suivi_gynecologique} onChange={e => updateSection("gyneco", "suivi_gynecologique", e.target.value)} placeholder="Précisez le suivi…" /></Field>
              <Field label="Dépistage cancer du col"><Textarea value={form.gyneco.depistage_cancer_col} onChange={e => updateSection("gyneco", "depistage_cancer_col", e.target.value)} placeholder="Résultats, dates…" /></Field>
            </div>
          </SectionCard>
        );
      case "family":
        return (
          <SectionCard title="Antécédents Familiaux">
            <BoolGrid fields={BOOL_FIELDS.family} data={form.family} onChange={(k, v) => updateSection("family", k, v)} />
            <div style={{ marginTop: 14 }}>
              <Field label="Autres">
                <Textarea value={form.family.autres} onChange={e => updateSection("family", "autres", e.target.value)} placeholder="Autres antécédents familiaux…" />
              </Field>
            </div>
          </SectionCard>
        );
      default: return null;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');*{box-sizing:border-box;}input,textarea{font-family:inherit;}`}</style>

      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 28px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1a7a5e" }} />
            <span style={{ fontWeight: 700, fontSize: 15, color: "#111827", letterSpacing: "-.01em" }}>Dossier Antécédents Patient</span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {submitted && <span style={{ fontSize: 12.5, color: "#1a7a5e", fontWeight: 600 }}>✓ Enregistré</span>}
            <button
              onClick={handleSubmit}
              style={{ background: "#1a7a5e", color: "#fff", border: "none", borderRadius: 7, padding: "8px 20px", fontWeight: 600, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit" }}
            >Enregistrer</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "24px 28px" }}>
        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "#fff", padding: 4, borderRadius: 9, border: "1px solid #e5e7eb", flexWrap: "wrap" }}>
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              style={{
                flex: "1 1 auto", padding: "7px 12px", borderRadius: 7, border: "none", cursor: "pointer",
                fontFamily: "inherit", fontSize: 12.5, fontWeight: active === s.id ? 700 : 500,
                background: active === s.id ? "#1a7a5e" : "transparent",
                color: active === s.id ? "#fff" : "#6b7280",
                transition: "all .15s",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Active Section */}
        {renderSection()}

        {/* Footer Nav */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
          <button
            onClick={() => { const i = SECTIONS.findIndex(s => s.id === active); if (i > 0) setActive(SECTIONS[i-1].id); }}
            disabled={active === SECTIONS[0].id}
            style={{ background: "none", border: "1px solid #e5e7eb", borderRadius: 7, padding: "8px 18px", fontFamily: "inherit", fontSize: 13, color: "#6b7280", cursor: "pointer", fontWeight: 500 }}
          >← Précédent</button>
          <span style={{ fontSize: 12, color: "#9ca3af", alignSelf: "center" }}>
            {SECTIONS.findIndex(s => s.id === active) + 1} / {SECTIONS.length}
          </span>
          <button
            onClick={() => { const i = SECTIONS.findIndex(s => s.id === active); if (i < SECTIONS.length - 1) setActive(SECTIONS[i+1].id); }}
            disabled={active === SECTIONS[SECTIONS.length-1].id}
            style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 7, padding: "8px 18px", fontFamily: "inherit", fontSize: 13, color: "#374151", cursor: "pointer", fontWeight: 600 }}
          >Suivant →</button>
        </div>
      </div>
    </div>
  );
}