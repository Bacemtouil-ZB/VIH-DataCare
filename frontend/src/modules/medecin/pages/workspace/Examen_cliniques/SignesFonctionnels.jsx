import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAction } from "../../../../../shared/utils/uiAlerts";
import { getAppareils, getSignesByPatient, createSignesFonctionnels, updateSignesFonctionnels } from "../../../services/examenCliniqueServices/signesFonctionService";
import { SIGNES_KEYS, SIGNES_LABELS, SIGNES_INIT, FORM_SF_INIT, getSignesPositifs } from "./examenConfig";
import {
formatDateFr,mapAutresSignesFromApi,buildAutreSigneItem,removeAutreSigneById,
updateAutreSigneDescription,handleCancelForm,openFormForCreate,showDetailMode,
} from "./examenSharedLogique";
import {
PAGE_CONTAINER_CLASS,PageHeader,HistoriqueAccordeon,HistoriqueTable,HistoriqueActions,EmptyState,
FormulaireWrapper,AutresSignesSection,BoutonEnregistrer,Badge,Spinner,RasToggle,parseApiError,
} from "./examenComponents";
import ToggleSwitch from "../../../components/buttons/ToggleSwitch";

export default function SignesFonctionnels() {
  const { examenId, patientNumero } = useOutletContext();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const [signesId, setSignesId] = useState(FORM_SF_INIT.signesId);
  const [isModifying, setIsModifying] = useState(FORM_SF_INIT.isModifying);
  const [rasChecked, setRasChecked] = useState(FORM_SF_INIT.rasChecked);
  const [signes, setSignes] = useState(FORM_SF_INIT.signes);
  const [autresSignes, setAutresSignes] = useState(FORM_SF_INIT.autresSignes);
  const [appareilSel, setAppareilSel] = useState(FORM_SF_INIT.appareilSel);
  const [description, setDescription] = useState(FORM_SF_INIT.description);

  const [appareils, setAppareils] = useState([]);
  const [historique, setHistorique] = useState([]);
  const [detailSigne, setDetailSigne] = useState(null);

  const resetForm = () => {
    setSignesId(FORM_SF_INIT.signesId);
    setIsModifying(FORM_SF_INIT.isModifying);
    setRasChecked(FORM_SF_INIT.rasChecked);
    setSignes(FORM_SF_INIT.signes);
    setAutresSignes(FORM_SF_INIT.autresSignes);
    setAppareilSel(FORM_SF_INIT.appareilSel);
    setDescription(FORM_SF_INIT.description);
  };

  useEffect(() => {
    if (!patientNumero) return;
    (async () => {
      setLoading(true);
      try {
        const [ar, hr] = await Promise.all([getAppareils(), getSignesByPatient(patientNumero)]);
        setAppareils(ar?.appareils || []);
        setHistorique(hr?.signes || []);
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

  const handleEdit = async (signeRow) => {
    const pos = getSignesPositifs(signeRow);
    const ok = await confirmAction(
      "Modifier ce signe fonctionnel ?",
      `Date : ${formatDateFr(signeRow.date_examen)}${pos.length ? " - " + pos.slice(0, 4).join(", ") : ""}`
    );
    if (!ok) {
      toast.info("Operation annulee");
      return;
    }

    setDetailSigne(null);
    setSignesId(signeRow.id);
    setIsModifying(true);
    setRasChecked(signeRow.ras || false);
    setSignes(Object.fromEntries(SIGNES_KEYS.map((k) => [k, signeRow[k] || false])));
    setAutresSignes(mapAutresSignesFromApi(signeRow.autres_signes));
    setAppareilSel("");
    setDescription("");
    setShowForm(true);
    toast.info("Mode modification active");
  };

  const handleShowDetails = (signeRow) => {
    showDetailMode(setShowForm, setDetailSigne, signeRow);
  };

  const ajouterAutreSigne = () => {
    const { error, item } = buildAutreSigneItem(appareils, appareilSel, description, true);
    if (error) return toast.error(error);
    setAutresSignes((prev) => [...prev, item]);
    setAppareilSel("");
    setDescription("");
    toast.success("Signe ajoute");
  };

  const supprimerAutreSigne = async (id) => {
    const ok = await confirmAction("Supprimer ce signe ?", "Cette action est irreversible.");
    if (!ok) {
      toast.info("Operation annulee");
      return;
    }
    setAutresSignes((prev) => removeAutreSigneById(prev, id));
    toast.success("Signe supprime");
  };

  const modifierDescription = (id, nouvelleDesc) => {
    setAutresSignes((prev) => updateAutreSigneDescription(prev, id, nouvelleDesc));
    toast.success("Description mise a jour");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        signes: { ...signes, ras: rasChecked },
        autres_signes: autresSignes.map(({ appareil_id, description: d }) => ({ appareil_id: parseInt(appareil_id, 10), description: d })),
      };
      if (isModifying && signesId) {
        await updateSignesFonctionnels(signesId, payload);
        toast.success("Signes fonctionnels mis a jour");
      } else {
        await createSignesFonctionnels({ ...payload, examen_clinique_id: examenId });
        toast.success("Signes fonctionnels enregistres");
      }
      setShowForm(false);
      resetForm();
      const hr = await getSignesByPatient(patientNumero);
      setHistorique(hr?.signes || []);
    } catch (e) {
      toast.error(parseApiError(e));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className={PAGE_CONTAINER_CLASS}>
      <PageHeader
        showForm={showForm}
        onOpen={() => openFormForCreate(setDetailSigne, resetForm, setShowForm)}
        onCancel={handleCancel}
      />

      <HistoriqueAccordeon
        title="Historique des signes fonctionnels"
        count={historique.length}
        open={showHistory}
        onToggle={() => setShowHistory((v) => !v)}
      >
        <HistoriqueTable
          headers={["Date", "Signes positifs", "Action"]}
          items={historique}
          emptyMessage="Aucun signe fonctionnel enregistre"
          renderRow={(s) => {
            const pos = getSignesPositifs(s);
            return (
              <tr key={s.id}>
                <td className="ec-td-date">{formatDateFr(s.date_examen)}</td>
                <td>
                  {s.ras ? (
                    <Badge bg="#dcfce7" color="#166534">RAS</Badge>
                  ) : pos.length > 0 ? (
                    <div className="d-flex flex-wrap gap-1">{pos.map((n, i) => <Badge key={i} bg="#fef3c7" color="#92400e">{n}</Badge>)}</div>
                  ) : (
                    <small className="text-secondary">Aucun</small>
                  )}
                </td>
                <td><HistoriqueActions onDetails={() => handleShowDetails(s)} onEdit={() => handleEdit(s)} /></td>
              </tr>
            );
          }}
        />
      </HistoriqueAccordeon>

      {detailSigne && (
        <FormulaireWrapper isModifying={false} labelCreate="Details du signe fonctionnel" labelModify="Details du signe fonctionnel">
          <div className="ec-readonly-block">
            <p className="text-uppercase fw-bold text-secondary mb-3 ec-section-title-mini">Signes fonctionnels</p>
            <div className="row g-2 mb-4 pb-4 border-bottom">
              {SIGNES_KEYS.map((signeKey) => (
                <div key={signeKey} className="col-6 col-md-4 col-lg-3">
                  <div className="ec-sf-detail-toggle">
                    <ToggleSwitch id={`detail-sf-${detailSigne.id || "row"}-${signeKey}`} label={SIGNES_LABELS[signeKey]} checked={!!detailSigne[signeKey]} disabled={true} />
                  </div>
                </div>
              ))}
            </div>

            <p className="text-uppercase fw-bold text-secondary mb-3 ec-th-sm">Autres signes fonctionnels</p>
            {detailSigne.autres_signes?.length > 0 ? (
              <table className="table table-sm table-hover mb-4">
                <thead className="table-light">
                  <tr>
                    <th className="ec-th-appareil">Appareil</th>
                    <th className="ec-th-desc">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {detailSigne.autres_signes.map((as, i) => (
                    <tr key={`${as.appareil || "app"}-${i}`}>
                      <td className="ec-td-vmiddle"><Badge bg="#dbeafe" color="#1d4ed8">{as.appareil || "-"}</Badge></td>
                      <td className="ec-td-vmiddle"><span className="ec-desc-text">{as.description || "-"}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState message="Aucun autre signe" />
            )}
          </div>

          <div className="d-flex justify-content-end">
            <button className="btn btn-sm btn-outline-secondary" onClick={() => setDetailSigne(null)}>Fermer details</button>
          </div>
        </FormulaireWrapper>
      )}

      {showForm && (
        <FormulaireWrapper isModifying={isModifying} labelCreate="Nouveau signe fonctionnel" labelModify="Modifier le signe fonctionnel">
          <RasToggle
            checked={rasChecked}
            onChange={(v) => {
              setRasChecked(v);
              if (v) setSignes({ ...SIGNES_INIT });
            }}
          />
          <p className="text-uppercase fw-bold text-secondary mb-3 ec-section-title-mini">Signes fonctionnels</p>
          <div className="row g-2 mb-4 pb-4 border-bottom">
            {SIGNES_KEYS.map((signeKey) => (
              <div key={signeKey} className="col-6 col-md-4 col-lg-3">
                <div className="ec-sf-form-toggle">
                  <ToggleSwitch
                    id={`form-sf-${signeKey}`}
                    label={SIGNES_LABELS[signeKey]}
                    checked={!!signes[signeKey]}
                    disabled={rasChecked}
                    onChange={(val) => setSignes((prev) => ({ ...prev, [signeKey]: val }))}
                  />
                </div>
              </div>
            ))}
          </div>

          <AutresSignesSection
            title="Autres signes fonctionnels"
            appareils={appareils}
            autresSignes={autresSignes}
            appareilSelectionne={appareilSel}
            descriptionSigne={description}
            onAppareilChange={setAppareilSel}
            onDescriptionChange={setDescription}
            onAjouter={ajouterAutreSigne}
            onSupprimer={supprimerAutreSigne}
            onModifierDescription={modifierDescription}
          />
          <BoutonEnregistrer isModifying={isModifying} loading={saving} onClick={handleSave} />
        </FormulaireWrapper>
      )}
    </div>
  );
}
