import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAction, alertError } from "../../../../../shared/utils/uiAlerts";
import { createObservation, getObservationsByPatient, updateObservation } from "../../../services/examenCliniqueServices/observationService";
import { UI_INIT, FORM_OBS_INIT } from "./examenConfig";
import {
  PAGE_BG,
  LABEL_CLS,
  STYLES,
  PageHeader,
  HistoriqueAccordeon,
  HistoriqueTable,
  HistoriqueActions,
  FormulaireWrapper,
  BoutonEnregistrer,
  Spinner,
  parseApiError,
} from "./Examencomponents";

export default function ObservationPage() {
  const { examenId, patientNumero } = useOutletContext();
  const [ui, setUi] = useState({ ...UI_INIT, showHistory: false });
  const [form, setForm] = useState({ ...FORM_OBS_INIT });
  const [data, setData] = useState({ historique: [] });
  const [detailObservation, setDetailObservation] = useState(null);

  const patchUi = (p) => setUi((s) => ({ ...s, ...p }));
  const patchForm = (p) => setForm((s) => ({ ...s, ...p }));

  useEffect(() => {
    if (!patientNumero) return;
    (async () => {
      patchUi({ loading: true });
      try {
        const res = await getObservationsByPatient(patientNumero);
        setData({ historique: res?.observations || [] });
      } catch {
        setData({ historique: [] });
      } finally {
        patchUi({ loading: false });
      }
    })();
  }, [patientNumero]);

  const resetForm = () => setForm({ ...FORM_OBS_INIT });
  const handleCancel = () => {
    patchUi({ showForm: false });
    resetForm();
    toast.info("Operation annulee");
  };

  const handleEdit = async (obs) => {
    const ok = await confirmAction(
      "Modifier cette observation ?",
      `Date : ${new Date(obs.date_examen).toLocaleDateString("fr-FR")} - ${obs.remarque?.slice(0, 60)}${obs.remarque?.length > 60 ? "..." : ""}`
    );
    if (!ok) {
      toast.info("Operation annulee");
      return;
    }
    setDetailObservation(null);
    setForm({ observationId: obs.id, isModifying: true, remarque: obs.remarque || "" });
    patchUi({ showForm: true });
    toast.info("Mode modification actif");
  };
  const handleShowDetails = (obs) => {
    patchUi({ showForm: false });
    setDetailObservation(obs);
  };

  const handleSave = async () => {
    if (!form.remarque.trim()) {
      toast.error("Veuillez saisir une remarque");
      return;
    }
    if (!await confirmAction(
      form.isModifying ? "Enregistrer les modifications ?" : "Creer cette observation ?",
      "Les donnees seront enregistrees dans le dossier patient."
    )) {
      return;
    }

    patchUi({ saving: true });
    try {
      if (form.isModifying && form.observationId) {
        await updateObservation(form.observationId, { remarque: form.remarque.trim() });
        setData({
          historique: data.historique.map((o) => (
            o.id === form.observationId ? { ...o, remarque: form.remarque.trim() } : o
          )),
        });
        toast.success("Observation mise a jour");
      } else {
        await createObservation({ examen_clinique_id: examenId, remarque: form.remarque.trim() });
        const res = await getObservationsByPatient(patientNumero);
        setData({ historique: res?.observations || [] });
        toast.success("Observation enregistree");
      }
      patchUi({ showForm: false });
      resetForm();
    } catch (e) {
      await alertError(parseApiError(e));
    } finally {
      patchUi({ saving: false });
    }
  };

  if (ui.loading) return <Spinner />;

  return (
    <div style={PAGE_BG}>
      <PageHeader
        showForm={ui.showForm}
        onOpen={() => {
          setDetailObservation(null);
          resetForm();
          patchUi({ showForm: true });
        }}
        onCancel={handleCancel}
      />

      <HistoriqueAccordeon
        title="Historique des observations"
        count={data.historique.length}
        open={ui.showHistory}
        onToggle={() => patchUi({ showHistory: !ui.showHistory })}
      >
        <HistoriqueTable
          headers={["Date de l'examen", "Remarque", "Action"]}
          items={data.historique}
          emptyMessage="Aucune observation enregistree"
          renderRow={(obs) => (
            <tr key={obs.id}>
              <td style={STYLES.tdDate}>
                {obs.date_examen ? new Date(obs.date_examen).toLocaleDateString("fr-FR") : "N/A"}
              </td>
              <td style={STYLES.tdMax}>
                {obs.remarque?.length > 120
                  ? <>{obs.remarque.slice(0, 120)}<span className="text-secondary">...</span></>
                  : obs.remarque}
              </td>
              <td><HistoriqueActions onDetails={() => handleShowDetails(obs)} onEdit={() => handleEdit(obs)} /></td>
            </tr>
          )}
        />
      </HistoriqueAccordeon>

      {detailObservation && (
        <FormulaireWrapper
          isModifying={false}
          labelCreate="Details de l'observation"
          labelModify="Details de l'observation"
        >
          <div className="ec-readonly-block">
            <div className="mb-4">
              <label className={LABEL_CLS} style={STYLES.thSm}>Remarques observees</label>
              <textarea
                className="form-control"
                rows={6}
                value={detailObservation.remarque || ""}
                disabled
                readOnly
                style={{ borderRadius: 8, resize: "vertical", fontSize: "0.9rem", lineHeight: 1.6 }}
              />
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <button className="btn btn-sm btn-outline-secondary" onClick={() => setDetailObservation(null)}>
              Fermer details
            </button>
          </div>
        </FormulaireWrapper>
      )}

      {ui.showForm && (
        <FormulaireWrapper
          isModifying={form.isModifying}
          labelCreate="Nouvelle observation"
          labelModify="Modifier l'observation"
        >
          <div className="mb-4">
            <label className={LABEL_CLS} style={STYLES.thSm}>Remarques observees</label>
            <textarea
              className="form-control"
              rows={6}
              placeholder="Decrivez les observations medicales..."
              value={form.remarque}
              onChange={(e) => patchForm({ remarque: e.target.value })}
              style={{ borderRadius: 8, resize: "vertical", fontSize: "0.9rem", lineHeight: 1.6 }}
            />
            <div className="d-flex justify-content-end mt-1">
              <small className="text-secondary">{form.remarque.length} caractere{form.remarque.length !== 1 ? "s" : ""}</small>
            </div>
          </div>
          <BoutonEnregistrer isModifying={form.isModifying} loading={ui.saving} onClick={handleSave} />
        </FormulaireWrapper>
      )}
    </div>
  );
}
