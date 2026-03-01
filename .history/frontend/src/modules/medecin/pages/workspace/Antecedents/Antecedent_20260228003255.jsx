import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import "./Antecedent.css";

import { SECTIONS, BOOL_FIELDS, initialState } from "./antecedentsConfig.jsx";
import TabNavigation from "../../../components/UI/TabNavigation";
import SectionRenderer from "../../../components/UI/SectionRenderer";

import antecedentsService from "../../../services/antecedentsService.jsx";

// ---------- helpers (minimal + stable) ----------
const toDateInputValue = (v) => {
  // API can return: null, "", "2026-02-27", "2026-02-27T00:00:00.000Z"
  if (!v) return "";
  if (typeof v !== "string") return "";
  return v.length >= 10 ? v.slice(0, 10) : v; // keep YYYY-MM-DD
};

const normalizeDatesFromApi = (sectionId, data) => {
  if (!data) return data;

  // 1-N lists
  if (sectionId === "surgical") {
    return (Array.isArray(data) ? data : []).map((row) => ({
      ...row,
      date_intervention: toDateInputValue(row?.date_intervention),
    }));
  }
  if (sectionId === "transfusion") {
    return (Array.isArray(data) ? data : []).map((row) => ({
      ...row,
      date_transfusion: toDateInputValue(row?.date_transfusion),
    }));
  }
  if (sectionId === "aes") {
    return (Array.isArray(data) ? data : []).map((row) => ({
      ...row,
      date_aes: toDateInputValue(row?.date_aes),
    }));
  }

  // 1-1 objects: no dates here in your schema, keep as is
  return data;
};

const sanitizePayloadForApi = (sectionId, payload) => {
  // Convert "" -> null for DB, keep booleans, keep strings
  const cleanValue = (v) => (v === "" ? null : v);

  // 1-N must be array
  if (sectionId === "surgical") {
    const arr = Array.isArray(payload) ? payload : [];
    return arr.map((r) => ({
      description: cleanValue(r?.description ?? null),
      date_intervention: cleanValue(r?.date_intervention ?? null), // must be YYYY-MM-DD or null
    }));
  }
  if (sectionId === "transfusion") {
    const arr = Array.isArray(payload) ? payload : [];
    return arr.map((r) => ({
      date_transfusion: cleanValue(r?.date_transfusion ?? null),
    }));
  }
  if (sectionId === "aes") {
    const arr = Array.isArray(payload) ? payload : [];
    return arr.map((r) => ({
      date_aes: cleanValue(r?.date_aes ?? null),
    }));
  }

  // 1-1 objects
  const obj = payload && typeof payload === "object" ? payload : {};
  const out = {};
  for (const [k, v] of Object.entries(obj)) out[k] = cleanValue(v);
  return out;
};

export default function AntecedentsForm() {
  const { numero } = useParams();

  const [active, setActive] = useState("medical");
  const [form, setForm] = useState(initialState);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const apiBySection = useMemo(
    () => ({
      medical: { get: antecedentsService.getMedical, put: antecedentsService.updateMedical },
      infectious: { get: antecedentsService.getInfectious, put: antecedentsService.updateInfectious },
      therapeutic: { get: antecedentsService.getTherapeutic, put: antecedentsService.updateTherapeutic },
      family: { get: antecedentsService.getFamily, put: antecedentsService.updateFamily },
      gyneco: { get: antecedentsService.getGyneco, put: antecedentsService.updateGyneco },

      surgical: { get: antecedentsService.getSurgical, put: antecedentsService.replaceSurgical },
      transfusion: { get: antecedentsService.getTransfusion, put: antecedentsService.replaceTransfusion },
      aes: { get: antecedentsService.getAes, put: antecedentsService.replaceAes },
    }),
    [],
  );

  const ensureActiveExists = async () => {
    const header = await antecedentsService.getActiveAntecedent(numero);
    if (!header?.antecedent) {
      await antecedentsService.createAntecedentVersion(numero);
    }
  };

  const updateSection = (section, key, value) => {
    setForm((f) => ({ ...f, [section]: { ...f[section], [key]: value } }));
  };

  const updateList = (section, index, key, value) => {
    setForm((f) => {
      const arr = Array.isArray(f[section]) ? [...f[section]] : [];
      arr[index] = { ...arr[index], [key]: value };
      return { ...f, [section]: arr };
    });
  };

  const addRow = (section, template) => {
    setForm((f) => ({
      ...f,
      [section]: [...(Array.isArray(f[section]) ? f[section] : []), { ...template }],
    }));
  };

  const removeRow = (section, index) => {
    setForm((f) => ({
      ...f,
      [section]: (Array.isArray(f[section]) ? f[section] : []).filter((_, i) => i !== index),
    }));
  };

  const loadActiveSection = async (sectionId) => {
    const api = apiBySection[sectionId];
    if (!api?.get) return;

    setError("");
    setLoading(true);

    try {
      await ensureActiveExists();

      const data = await api.get(numero);
      const rawSectionData = data?.[sectionId];

      const normalized = normalizeDatesFromApi(sectionId, rawSectionData);

      setForm((f) => ({
        ...f,
        [sectionId]:
          normalized ??
          (Array.isArray(f[sectionId]) ? [] : { ...initialState[sectionId] }),
      }));
    } catch (e) {
      setError(e?.message || "Erreur chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!numero) return;
    loadActiveSection(active);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numero, active]);

  const handleSubmit = async () => {
    if (!numero) return;

    const api = apiBySection[active];
    if (!api?.put) return;

    setError("");
    setSaving(true);

    try {
      await ensureActiveExists();

      const payload = sanitizePayloadForApi(active, form[active]);
      await api.put(numero, payload);

      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 2000);

      // Reload section after save to show exact DB state (stable UX)
      await loadActiveSection(active);
    } catch (e) {
      setError(e?.message || "Erreur enregistrement");
    } finally {
      setSaving(false);
    }
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
            <span className="header-title">Dossier Antécédents Patient</span>
            <span className="patient-numero">({numero})</span>
          </div>

          <div className="header-right">
            {submitted && <span className="saved-message">✓ Enregistré</span>}

            <button onClick={handleSubmit} className="btn-primary" disabled={saving || loading}>
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </div>

        {error ? <div className="error-banner">{String(error?.message || error)}</div> : null}
      </div>

      <div className="antecedents-container">
        <TabNavigation sections={SECTIONS} active={active} onChange={setActive} />

        {loading ? (
          <div className="loading">Chargement...</div>
        ) : (
          <SectionRenderer
            active={active}
            form={form}
            BOOL_FIELDS={BOOL_FIELDS}
            updateSection={updateSection}
            updateList={updateList}
            addRow={addRow}
            removeRow={removeRow}
          />
        )}

        <div className="navigation-footer">
          <button
            onClick={goPrev}
            disabled={active === SECTIONS[0].id || loading || saving}
            className="btn-secondary"
          >
            ← Précédent
          </button>

          <span className="step-indicator">
            {stepIndex + 1} / {SECTIONS.length}
          </span>

          <button
            onClick={goNext}
            disabled={active === SECTIONS[SECTIONS.length - 1].id || loading || saving}
            className="btn-next"
          >
            Suivant →
          </button>
        </div>
      </div>
    </div>
  );
}