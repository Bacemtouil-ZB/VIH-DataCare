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

const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export default function AntecedentsForm() {
  const { numero } = useParams();

  const [active, setActive] = useState("medical");
  const [form, setForm] = useState(initialState);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // version UI
  const [versions, setVersions] = useState([]); // headers list
  const [selectedVersion, setSelectedVersion] = useState(null); // number
  const [readOnly, setReadOnly] = useState(false);

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
      // your new service name should be postNewAntecedentVersion
      await antecedentsService.postNewAntecedentVersion(numero);
    }
  };

  const updateSection = (section, key, value) => {
    if (readOnly) return;
    setForm((f) => ({ ...f, [section]: { ...f[section], [key]: value } }));
  };

  const updateList = (section, index, key, value) => {
    if (readOnly) return;
    setForm((f) => {
      const arr = Array.isArray(f[section]) ? [...f[section]] : [];
      arr[index] = { ...(arr[index] || {}), [key]: value };
      return { ...f, [section]: arr };
    });
  };

  const addRow = (section, template) => {
    if (readOnly) return;
    setForm((f) => ({
      ...f,
      [section]: [
        ...(Array.isArray(f[section]) ? f[section] : []),
        { ...template },
      ],
    }));
  };

  const removeRow = (section, index) => {
    if (readOnly) return;
    setForm((f) => ({
      ...f,
      [section]: (Array.isArray(f[section]) ? f[section] : []).filter(
        (_, i) => i !== index,
      ),
    }));
  };

  const loadVersions = async () => {
    if (!numero) return;
    try {
      const data = await antecedentsService.getAntecedentVersions(numero);
      const list = Array.isArray(data?.versions) ? data.versions : [];
      setVersions(list);

      // pick active by default
      const activeHeader = list.find((v) => v.status === "active");
      const defaultVersion = activeHeader?.version_number ?? list[0]?.version_number ?? null;
      setSelectedVersion((prev) => prev ?? defaultVersion);
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  const applySnapshotToForm = (snapshot) => {
    // snapshot contains sections directly (medical, infectious...)
    const next = { ...initialState };

    for (const section of SECTIONS) {
      const id = section.id;
      const normalized = normalizeFromApi(id, snapshot?.[id]);
      next[id] =
        normalized ?? (Array.isArray(next[id]) ? [] : { ...initialState[id] });
    }

    setForm(next);
  };

  const loadSnapshot = async (versionNumber) => {
    if (!numero || !versionNumber) return;

    setLoading(true);
    try {
      // if you select active version, you can load snapshot too (consistent)
      const snap = await antecedentsService.getAntecedentVersionSnapshot(
        numero,
        versionNumber,
      );

      applySnapshotToForm(snap);

      const status = snap?.antecedent?.status;
      setReadOnly(status === "archived");
    } catch (e) {
    e.error(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  // initial load: ensure active exists, then versions list
  useEffect(() => {
    if (!numero) return;
    (async () => {
      try {
        await ensureActiveExists();
        await loadVersions();
      } catch (e) {
        toast.error(getErrorMessage(e));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numero]);

  // load snapshot when selected version changes
  useEffect(() => {
    if (!selectedVersion) return;
    loadSnapshot(selectedVersion);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVersion]);

  // saving is ONLY for active version
  const handleSubmit = async () => {
    if (!numero) return;
    if (readOnly) {
      toast.info("Version archivée : lecture seule");
      return;
    }

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

      // refresh versions list (updated_at changes)
      await loadVersions();

      // reload snapshot of current selected version
      await loadSnapshot(selectedVersion);
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const handleNewVersion = async () => {
    if (!numero) return;
    if (saving || loading) return;

    const ok = await confirmAction({
      title: "Nouvelle version",
      text: "Créer une nouvelle version ? L’actuelle sera archivée.",
      confirmButtonText: "Créer",
    });
    if (!ok) return;

    setLoading(true);
    try {
      const created = await antecedentsService.postNewAntecedentVersion(numero);
      toast.success("Nouvelle version créée");

      // refresh list and jump to the new active version
      await loadVersions();
      const newV = created?.antecedent?.version_number;
      if (newV) setSelectedVersion(newV);
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setLoading(false);
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
          <div className="header-left" style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "#6b7280" }}>Version</span>
              <select
                value={selectedVersion ?? ""}
                onChange={(e) => setSelectedVersion(Number(e.target.value))}
                disabled={loading || saving}
                style={{
                  padding: "6px 8px",
                  borderRadius: 6,
                  border: "1px solid #e5e7eb",
                  background: "#fff",
                }}
              >
                {/* {versions.map((v) => (
                  <option key={v.id} value={v.version_number}>
                    v{v.version_number} — {v.status === "active" ? "active" : "archivée"}
                  </option>
                ))} */}
                {versions.map((v) => (
                  <option key={v.id} value={v.version_number}>
                    {`v${v.version_number} — ${
                      v.status === "active" ? "active" : "archivée"
                    } — ${formatDate(v.created_at)}`}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleNewVersion}
              className="btn-secondary"
              disabled={loading || saving}
              title="Créer une nouvelle version (archive l’actuelle)"
            >
              + Nouvelle version
            </button>

            {readOnly ? (
              <span
                style={{
                  fontSize: 12.5,
                  color: "#92400e",
                  background: "#fffbeb",
                  border: "1px solid #f59e0b",
                  padding: "4px 8px",
                  borderRadius: 999,
                }}
              >
                Lecture seule (archivée)
              </span>
            ) : null}
          </div>

          <div className="header-right">
            <button
              onClick={handleSubmit}
              className="btn-primary"
              disabled={saving || loading || readOnly}
              title={readOnly ? "Version archivée: lecture seule" : undefined}
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
            readOnly={readOnly}
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