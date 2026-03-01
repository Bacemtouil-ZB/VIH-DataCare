import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import "./Antecedent.css";

import { SECTIONS, BOOL_FIELDS, initialState } from "./antecedentsConfig.jsx";
import TabNavigation from "../../../components/UI/TabNavigation";
import SectionRenderer from "../../../components/UI/SectionRenderer";

import antecedentsService from "../../../services/antecedentsService.jsx";
import { confirmAction } from "../../../../../shared/utils/uiAlerts.js";

import { normalizeFromApi, sanitizeForApi, getErrorMessage } from "./helpers.js";

export default function AntecedentsForm() {
  const { numero } = useParams();

  const [active, setActive] = useState("medical");
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const apiBySection = useMemo(
    () => ({
      medical: {
        get: antecedentsService.getMedical,
        put: antecedentsService.updateMedical,
      },
      infectious: {
        get: antecedentsService.getInfectious,
        put: antecedentsService.updateInfectious,
      },
      therapeutic: {
        get: antecedentsService.getTherapeutic,
        put: antecedentsService.updateTherapeutic,
      },
      family: {
        get: antecedentsService.getFamily,
        put: antecedentsService.updateFamily,
      },
      gyneco: {
        get: antecedentsService.getGyneco,
        put: antecedentsService.updateGyneco,
      },
      surgical: {
        get: antecedentsService.getSurgical,
        put: antecedentsService.replaceSurgical,
      },
      transfusion: {
        get: antecedentsService.getTransfusion,
        put: antecedentsService.replaceTransfusion,
      },
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
      [section]: [
        ...(Array.isArray(f[section]) ? f[section] : []),
        { ...template },
      ],
    }));
  };

  const removeRow = (section, index) => {
    setForm((f) => ({
      ...f,
      [section]: (Array.isArray(f[section]) ? f[section] : []).filter(
        (_, i) => i !== index,
      ),
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
      toast.error(getErrorMessage(e));
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
      toast.error(getErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const stepIndex = SECTIONS.findIndex((s) => s.id === active);

  const goPrev = () => {
    if (stepIndex > 0) setActive(SECTIONS[stepIndex - 1].id);
  };

  const goNext = () => {
    if (stepIndex < SECTIONS.length - 1) setActive(SECTIONS[stepIndex + 1].id);
  };

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