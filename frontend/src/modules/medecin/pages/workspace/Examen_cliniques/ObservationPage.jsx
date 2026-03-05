import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAction, alertError } from "../../../../../shared/utils/uiAlerts";
import { createObservation, getObservationsByPatient, updateObservation } from "../../../services/examenCliniqueServices/observationService";
import { ActionButton } from "../../../components/buttons/ActionButton";
import {
PageHeader,HistoriqueAccordeon,HistoriqueTable,
HistoriqueActions,FormulaireWrapper,Spinner,parseApiError,
} from "./index";
import { formatDateFr, handleCancelForm, openFormForCreate, showDetailMode } from "./examenSharedLogique";

const PAGE_CONTAINER_CLASS = "ec-page-bg";
const LABEL_CLS = "text-uppercase fw-semibold text-secondary d-block mb-1 ec-label";

export default function ObservationPage() {
  const { examenId, patientNumero } = useOutletContext();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const [observationId, setObservationId] = useState(null);
  const [isModifying, setIsModifying] = useState(false);
  const [remarque, setRemarque] = useState("");

  const [historique, setHistorique] = useState([]);
  const [detailObservation, setDetailObservation] = useState(null);

  const resetForm = () => {
    setObservationId(null);
    setIsModifying(false);
    setRemarque("");
  };

  useEffect(() => {
    if (!patientNumero) return;
    (async () => {
      setLoading(true);
      try {
        const res = await getObservationsByPatient(patientNumero);
        setHistorique(res?.observations || []);
      } catch {
        setHistorique([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [patientNumero]);

  const handleCancel = () => {
    handleCancelForm(setShowForm, resetForm, toast);
  };

  const handleEdit = async (obs) => {
    const ok = await confirmAction(
      "Modifier cette observation ?",
      `Date : ${formatDateFr(obs.date_examen)} - ${obs.remarque?.slice(0, 60)}${obs.remarque?.length > 60 ? "..." : ""}`
    );
    if (!ok) {
      toast.info("Operation annulee");
      return;
    }
    setDetailObservation(null);
    setObservationId(obs.id);
    setIsModifying(true);
    setRemarque(obs.remarque || "");
    setShowForm(true);
    toast.info("Mode modification actif");
  };

  const handleShowDetails = (obs) => {
    showDetailMode(setShowForm, setDetailObservation, obs);
  };

  const handleSave = async () => {
    if (!remarque.trim()) return toast.error("Veuillez saisir une remarque");
    if (!await confirmAction(
      isModifying ? "Enregistrer les modifications ?" : "Creer cette observation ?",
      "Les donnees seront enregistrees dans le dossier patient."
    )) return;

    setSaving(true);
    try {
      if (isModifying && observationId) {
        await updateObservation(observationId, { remarque: remarque.trim() });
        setHistorique((prev) => prev.map((o) => (o.id === observationId ? { ...o, remarque: remarque.trim() } : o)));
        toast.success("Observation mise a jour");
      } else {
        await createObservation({ examen_clinique_id: examenId, remarque: remarque.trim() });
        const res = await getObservationsByPatient(patientNumero);
        setHistorique(res?.observations || []);
        toast.success("Observation enregistree");
      }
      setShowForm(false);
      resetForm();
    } catch (e) {
      await alertError(parseApiError(e));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className={PAGE_CONTAINER_CLASS}>
      <PageHeader
        showForm={showForm}
        onOpen={() => openFormForCreate(setDetailObservation, resetForm, setShowForm)}
        onCancel={handleCancel}
      />

      <HistoriqueAccordeon
        title="Historique des observations"
        count={historique.length}
        open={showHistory}
        onToggle={() => setShowHistory((v) => !v)}
      >
        <HistoriqueTable
          headers={["Date de l'examen", "Remarque", "Action"]}
          items={historique}
          emptyMessage="Aucune observation enregistree"
          renderRow={(obs) => (
            <tr key={obs.id}>
              <td className="ec-td-date">{formatDateFr(obs.date_examen)}</td>
              <td className="ec-td-max">
                {obs.remarque?.length > 120 ? <>{obs.remarque.slice(0, 120)}<span className="text-secondary">...</span></> : obs.remarque}
              </td>
              <td><HistoriqueActions onDetails={() => handleShowDetails(obs)} onEdit={() => handleEdit(obs)} /></td>
            </tr>
          )}
        />
      </HistoriqueAccordeon>

      {detailObservation && (
        <FormulaireWrapper isModifying={false} labelCreate="Details de l'observation" labelModify="Details de l'observation">
          <div className="ec-readonly-block">
            <div className="mb-4">
              <label className={`${LABEL_CLS} ec-th-sm`}>Remarques observees</label>
              <textarea className="form-control ec-observation-textarea" rows={6} value={detailObservation.remarque || ""} disabled readOnly />
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <button className="btn btn-sm btn-outline-secondary" onClick={() => setDetailObservation(null)}>Fermer details</button>
          </div>
        </FormulaireWrapper>
      )}

      {showForm && (
        <FormulaireWrapper isModifying={isModifying} labelCreate="Nouvelle observation" labelModify="Modifier l'observation">
          <div className="mb-4">
            <label className={`${LABEL_CLS} ec-th-sm`}>Remarques observees</label>
            <textarea
              className="form-control ec-observation-textarea"
              rows={6}
              placeholder="Decrivez les observations medicales..."
              value={remarque}
              onChange={(e) => setRemarque(e.target.value)}
            />
            <div className="d-flex justify-content-end mt-1">
              <small className="text-secondary">{remarque.length} caractere{remarque.length !== 1 ? "s" : ""}</small>
            </div>
          </div>
          <ActionButton
            action="save"
            block={true}
            loading={saving}
            label={isModifying ? "Enregistrer les modifications" : "Enregistrer la fiche"}
            onClick={handleSave}
            showIcon={false}
          />
        </FormulaireWrapper>
      )}
    </div>
  );
}
