// import { useState } from "react";
// import "./Antecedent.css";

// import { SECTIONS, BOOL_FIELDS, initialState } from "./antecedentsConfig.jsx";

// import TabNavigation from "../../../components/UI/TabNavigation";
// import SectionRenderer from "../../../components/UI/SectionRenderer";

// export default function AntecedentsForm() {
//   const [active, setActive] = useState("medical");
//   const [form, setForm] = useState(initialState);
//   const [submitted, setSubmitted] = useState(false);

//   const updateSection = (section, key, value) => {
//     setForm((f) => ({ ...f, [section]: { ...f[section], [key]: value } }));
//   };

//   const updateList = (section, index, key, value) => {
//     setForm((f) => {
//       const arr = [...f[section]];
//       arr[index] = { ...arr[index], [key]: value };
//       return { ...f, [section]: arr };
//     });
//   };

//   const addRow = (section, template) => {
//     setForm((f) => ({ ...f, [section]: [...f[section], { ...template }] }));
//   };

//   const removeRow = (section, index) => {
//     setForm((f) => ({
//       ...f,
//       [section]: f[section].filter((_, i) => i !== index),
//     }));
//   };

//   const handleSubmit = () => {
//     setSubmitted(true);
//     setTimeout(() => setSubmitted(false), 3000);
//   };

//   const goPrev = () => {
//     const i = SECTIONS.findIndex((s) => s.id === active);
//     if (i > 0) setActive(SECTIONS[i - 1].id);
//   };

//   const goNext = () => {
//     const i = SECTIONS.findIndex((s) => s.id === active);
//     if (i < SECTIONS.length - 1) setActive(SECTIONS[i + 1].id);
//   };

//   const stepIndex = SECTIONS.findIndex((s) => s.id === active);

//   return (
//     <div className="antecedents-wrapper">
//       <div className="antecedents-header">
//         <div className="header-content">
//           <div className="header-left">
//             <div className="status-dot" />
//             <span className="header-title">
//               Dossier Antécédents Patient
//             </span>
//           </div>

//           <div className="header-right">
//             {submitted && (
//               <span className="saved-message">✓ Enregistré</span>
//             )}

//             <button onClick={handleSubmit} className="btn-primary">
//               Enregistrer
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="antecedents-container">
//         <TabNavigation
//           sections={SECTIONS}
//           active={active}
//           onChange={setActive}
//         />

//         <SectionRenderer
//           active={active}
//           form={form}
//           BOOL_FIELDS={BOOL_FIELDS}
//           updateSection={updateSection}
//           updateList={updateList}
//           addRow={addRow}
//           removeRow={removeRow}
//         />

//         <div className="navigation-footer">
//           <button
//             onClick={goPrev}
//             disabled={active === SECTIONS[0].id}
//             className="btn-secondary"
//           >
//             ← Précédent
//           </button>

//           <span className="step-indicator">
//             {stepIndex + 1} / {SECTIONS.length}
//           </span>

//           <button
//             onClick={goNext}
//             disabled={active === SECTIONS[SECTIONS.length - 1].id}
//             className="btn-next"
//           >
//             Suivant →
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import "./Antecedent.css";

import { SECTIONS, BOOL_FIELDS, initialState } from "./antecedentsConfig.jsx";
import TabNavigation from "../../../components/UI/TabNavigation";
import SectionRenderer from "../../../components/UI/SectionRenderer";

// Service API (doit appeler /api/antecedents/...)
import antecedentsService from "../../../services/antecedentsService.jsx";

export default function AntecedentsForm() {
  const { numero } = useParams();

  const [active, setActive] = useState("medical");
  const [form, setForm] = useState(initialState);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Map section -> api functions
  const apiBySection = useMemo(
    () => ({
      medical: { get: antecedentsService.getMedical, put: antecedentsService.updateMedical },
      infectious: { get: antecedentsService.getInfectious, put: antecedentsService.updateInfectious },
      therapeutic: { get: antecedentsService.getTherapeutic, put: antecedentsService.updateTherapeutic },
      family: { get: antecedentsService.getFamily, put: antecedentsService.updateFamily },
      gyneco: { get: antecedentsService.getGyneco, put: antecedentsService.updateGyneco },

      // 1-N replace list
      surgical: { get: antecedentsService.getSurgical, put: antecedentsService.replaceSurgical },
      transfusion: { get: antecedentsService.getTransfusion, put: antecedentsService.replaceTransfusion },
      aes: { get: antecedentsService.getAes, put: antecedentsService.replaceAes },
    }),
    [],
  );

  // UI state updates
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

  // Load active section from backend (with ensureActiveExists)
  useEffect(() => {
    let cancelled = false;

    // Ensure active antecedent exists (otherwise create version)
    const ensureActiveExists = async () => {
      const header = await antecedentsService.getActiveAntecedent(numero);
      if (!header?.antecedent) {
        await antecedentsService.createAntecedentVersion(numero);
      }
    };

    const run = async () => {
      if (!numero) return;

      const api = apiBySection[active];
      if (!api?.get) return;

      setError("");
      setLoading(true);

      try {
        // IMPORTANT: avoid 404 "No active antecedent"
        await ensureActiveExists();

        const data = await api.get(numero);
        const sectionData = data?.[active];

        if (!cancelled) {
          setForm((f) => ({
            ...f,
            [active]:
              sectionData ??
              (Array.isArray(f[active]) ? [] : { ...initialState[active] }),
          }));
        }
      } catch (e) {
        if (!cancelled) {
          setError(e?.message || "Erreur chargement");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [numero, active, apiBySection]);

  // Save only active section
  const handleSubmit = async () => {
    if (!numero) return;

    const api = apiBySection[active];
    if (!api?.put) return;

    setError("");
    setSaving(true);

    try {
      const header = await antecedentsService.getActiveAntecedent(numero);
      if (!header?.antecedent) {
        await antecedentsService.createAntecedentVersion(numero);
      }
      await api.put(numero, form[active]); // 1-1 => object, 1-N => array

      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 2000);
    } catch (e) {
      setError(e?.message || "Erreur enregistrement");
    } finally {
      setSaving(false);
    }
  };

  // Navigation
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