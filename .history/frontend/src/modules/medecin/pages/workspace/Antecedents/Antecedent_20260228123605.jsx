import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import "./Antecedent.css";

import { SECTIONS, BOOL_FIELDS, initialState } from "./antecedentsConfig.jsx";
import TabNavigation from "../../../components/UI/TabNavigation";
import SectionRenderer from "../../../components/UI/SectionRenderer";

import antecedentsService from "../../../services/antecedentsService.jsx";
import { confirmAction } from "../../../../../shared/utils/uiAlerts.js";

// ---------- helpers ----------
const toDateInputValue = (v) => {
  if (!v) return "";
  if (typeof v !== "string") return "";
  return v.length >= 10 ? v.slice(0, 10) : v;
};

// Backend returns DB rows (with id, antecedent_id, updated_by...). For option 2, keep form state "pure".
const stripSystemKeys = (obj) => {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return obj;

  const SYSTEM_KEYS = new Set([
    "id",
    "antecedent_id",
    "created_by",
    "updated_by",
    "created_at",
    "updated_at",
    "archived_by",
    "archived_at",
    // joins/envelopes (just in case)
    "patient",
    "antecedent",
  ]);

  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (SYSTEM_KEYS.has(k)) continue;
    out[k] = v;
  }
  return out;
};

const normalizeFromApi = (sectionId, sectionData) => {
  if (sectionData == null) return null;

  // 1-N lists
  if (sectionId === "surgical") {
    return (Array.isArray(sectionData) ? sectionData : []).map((row) => ({
      description: row?.description ?? null,
      date_intervention: toDateInputValue(row?.date_intervention),
    }));
  }
  if (sectionId === "transfusion") {
    return (Array.isArray(sectionData) ? sectionData : []).map((row) => ({
      date_transfusion: toDateInputValue(row?.date_transfusion),
    }));
  }
  if (sectionId === "aes") {
    return (Array.isArray(sectionData) ? sectionData : []).map((row) => ({
      date_aes: toDateInputValue(row?.date_aes),
    }));
  }

  // 1-1 objects
  return stripSystemKeys(sectionData);
};

const sanitizeForApi = (sectionId, payload) => {
  // Backend prefers null over "" for nullable columns
  const cleanValue = (v) => (v === "" ? null : v);

  // 1-N must be array
  if (sectionId === "surgical") {
    const arr = Array.isArray(payload) ? payload : [];
    return arr.map((r) => ({
      description: cleanValue(r?.description ?? null),
      date_intervention: cleanValue(r?.date_intervention ?? null),
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

const getErrorMessage = (e) => {
  if (!e) return "Erreur inconnue";
  if (typeof e === "string") return e;

  // Our services may throw html string sometimes, keep it readable
  const raw = e?.message || e?.error || e?.response?.data?.message || e?.response?.data || null;
  if (typeof raw === "string") return raw.replace(/<[^>]*>/g, "").trim();
  return "Erreur inconnue";
};

export default function AntecedentsForm() {
  const { numero } = useParams();

  const [active, setActive] = useState("medical");
  const [form, setForm] = useState(initialState);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

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
      arr[index] = { ...(arr[index] || {}), [key]: value };
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

  const loadSection = async (sectionId) => {
    const api = apiBySection[sectionId];
    if (!api?.get || !numero) return;

    setLoading(true);
    try {
      await ensureActiveExists();

      const data = await api.get(numero);
      const rawSection = data?.[sectionId];

      const normalized = normalizeFromApi(sectionId, rawSection);

      setForm((f) => ({
        ...f,
        [sectionId]:
          normalized ??
          (Array.isArray(f[sectionId]) ? [] : { ...initialState[sectionId] }),
      }));
    } catch (e) {
      const msg = getErrorMessage(e);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSection(active);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numero, active]);

  const handleSubmit = async () => {
    if (!numero) return;

    const api = apiBySection[active];
    if (!api?.put) return;

    const ok = await confirmAction({
      title: "Confirmer l’enregistrement",
      text: "Voulez-vous enregistrer cette section ?",
      confirmButtonText: "Enregistrer",
    });

    if (!ok) return;

    setSaving(true);
    try {
      await ensureActiveExists();

      const payload = sanitizeForApi(active, form[active]);
      await api.put(numero, payload);

      toast.success("Section enregistrée");
      await loadSection(active);
    } catch (e) {
      const msg = getErrorMessage(e);
      toast.error(msg);
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
          <div className="header-left" />

          <div className="header-right">
            <button
              onClick={handleSubmit}
              className="btn-primary"
              disabled={saving || loading}
            >
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </div>
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