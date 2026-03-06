import { useState, useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAction } from "../../../../../shared/utils/uiAlerts";
import { createSigneClinique, updateSigneClinique, getSigneCliniqueByNumeroDossier } from "../../../services/examenCliniqueServices/signeCliniqueService";
import { getAppareils } from "../../../services/examenCliniqueServices/signesFonctionService";
import { ActionButton } from "../../../components/buttons/ActionButton";
import FieldLabel from "../../../components/UI/FieldLabel";
import { calcIMC, FORM_SC_INIT } from "./examenConfig";
import {
  formatDateFr,
  mapAutresSignesFromApi,
  buildAutreSigneItem,
  removeAutreSigneById,
  updateAutreSigneDescription,
  handleCancelForm,
  openFormForCreate,
  showDetailMode,
} from "./examenSharedLogique";
import {
  PageHeader,HistoriqueAccordeon,HistoriqueTable,HistoriqueActions,EmptyState,
  FormulaireWrapper,AutresSignesSection,Badge,ImcField,Spinner,parseApiError,
} from "./index";

const PAGE_CONTAINER_CLASS = "ec-page-bg";

function Field({ label, value }) {
  return (
    <div className="ec-flex-input">
      <FieldLabel>{label}</FieldLabel>
      <input type="number" className="form-control form-control-sm" value={value ?? ""} disabled readOnly />
    </div>
  );
}

export default function SignesCliniques() {
  const { numero } = useParams();
  const { examenId } = useOutletContext();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  useEffect(() => {
    setShowHistory(true);
  }, []);

  const [signeId, setSigneId] = useState(FORM_SC_INIT.signeId);
  const [isModifying, setIsModifying] = useState(FORM_SC_INIT.isModifying);
  const [taille, setTaille] = useState(FORM_SC_INIT.taille);
  const [poids, setPoids] = useState(FORM_SC_INIT.poids);
  const [autresSignes, setAutresSignes] = useState(FORM_SC_INIT.autresSignes);
  const [appareilSel, setAppareilSel] = useState(FORM_SC_INIT.appareilSel);
  const [description, setDescription] = useState(FORM_SC_INIT.description);

  const [appareils, setAppareils] = useState([]);
  const [historique, setHistorique] = useState([]);
  const [detailSigne, setDetailSigne] = useState(null);

  const imc = taille && poids && +taille > 0 && +poids > 0 ? calcIMC(+taille, +poids) : null;

  const resetForm = () => {
    setSigneId(FORM_SC_INIT.signeId);
    setIsModifying(FORM_SC_INIT.isModifying);
    setTaille(FORM_SC_INIT.taille);
    setPoids(FORM_SC_INIT.poids);
    setAutresSignes(FORM_SC_INIT.autresSignes);
    setAppareilSel(FORM_SC_INIT.appareilSel);
    setDescription(FORM_SC_INIT.description);
  };

  useEffect(() => {
    if (!numero) return;
    (async () => {
      setLoading(true);
      try {
        const [ar, hr] = await Promise.all([getAppareils(), getSigneCliniqueByNumeroDossier(numero)]);
        setAppareils(ar?.appareils || []);
        setHistorique(hr?.signes || []);
      } catch {
        setHistorique([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [numero]);

  const handleCancel = () => {
    handleCancelForm(setShowForm, resetForm, toast);
  };

  const handleEdit = async (s) => {
    const ok = await confirmAction(
      "Modifier ce signe clinique ?",
      `Date : ${formatDateFr(s.date_examen)} - Taille : ${s.taille} cm - Poids : ${s.poids} kg`
    );
    if (!ok) {
      toast.info("Operation annulee");
      return;
    }

    setDetailSigne(null);
    setSigneId(s.id);
    setIsModifying(true);
    setTaille(s.taille || "");
    setPoids(s.poids || "");
    setAutresSignes(mapAutresSignesFromApi(s.autres_signes));
    setAppareilSel("");
    setDescription("");
    setShowForm(true);
    toast.info("Mode modification active");
  };

  const handleShowDetails = (s) => {
    showDetailMode(setShowForm, setDetailSigne, s);
  };

  const ajouterAutreSigne = () => {
    const { error, item } = buildAutreSigneItem(appareils, appareilSel, description);
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

  const handleEnregistrer = async () => {
    if (!taille || !poids) return toast.error("Veuillez renseigner la taille et le poids");
    if (+taille <= 0 || +taille > 250) return toast.error("Taille invalide (1-250 cm)");
    if (+poids <= 0 || +poids > 300) return toast.error("Poids invalide (1-300 kg)");

    setSaving(true);
    try {
      const payload = {
        examen_clinique_id: examenId,
        taille: +taille,
        poids: +poids,
        autres_signes: autresSignes.map(({ appareil_id, description: d }) => ({ appareil_id, description: d })),
      };

      if (isModifying && signeId) {
        await updateSigneClinique(signeId, payload);
        toast.success("Signes cliniques mis a jour");
      } else {
        const res = await createSigneClinique(payload);
        setSigneId(res?.signe?.id || null);
        toast.success("Signes cliniques enregistres");
      }

      setShowForm(false);
      resetForm();
      const hr = await getSigneCliniqueByNumeroDossier(numero);
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
        title="Historique des signes cliniques"
        count={historique.length}
        open={showHistory}
        onToggle={() => setShowHistory((v) => !v)}
      >
        <HistoriqueTable
          headers={["Date", "Taille (cm)", "Poids (kg)", "IMC", "Action"]}
          items={historique}
          emptyMessage="Aucun signe clinique enregistre"
          renderRow={(s) => {
            const si = s.taille && s.poids ? calcIMC(+s.taille, +s.poids) : null;
            return (
              <tr key={s.id}>
                <td className="ec-td-date">{formatDateFr(s.date_examen)}</td>
                <td><Badge bg="#dbeafe" color="#1d4ed8">{s.taille ?? "N/A"}</Badge></td>
                <td><Badge bg="#dcfce7" color="#166534">{s.poids ?? "N/A"}</Badge></td>
                <td>{si ? <span className="fw-bold">{si.val} <small className="fw-normal">{si.label}</small></span> : "N/A"}</td>
                <td><HistoriqueActions onDetails={() => handleShowDetails(s)} onEdit={() => handleEdit(s)} /></td>
              </tr>
            );
          }}
        />
      </HistoriqueAccordeon>

      {detailSigne && (
        <FormulaireWrapper isModifying={false} labelCreate="Details du signe clinique" labelModify="Details du signe clinique">
          <div className="ec-readonly-block">
            <p className="text-uppercase fw-bold text-secondary mb-3 ec-th-sm">Mesures anthropometriques</p>
            <div className="d-flex gap-4 flex-wrap mb-4 pb-4 border-bottom">
              <Field label="Taille (cm)" value={detailSigne.taille} />
              <Field label="Poids (kg)" value={detailSigne.poids} />
              <div className="ec-flex-input-l">
                <FieldLabel>IMC (kg/m2)</FieldLabel>
                <ImcField imc={detailSigne.taille && detailSigne.poids ? calcIMC(+detailSigne.taille, +detailSigne.poids) : null} />
              </div>
            </div>

            <p className="text-uppercase fw-bold text-secondary mb-3 ec-th-sm">Autres signes cliniques</p>
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
                      <td className="ec-td-vmiddle"><Badge bg="#e0f2fe" color="#0369a1">{as.appareil || "-"}</Badge></td>
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
        <FormulaireWrapper isModifying={isModifying} labelCreate="Nouveau signe clinique" labelModify="Modifier le signe clinique">
          <p className="text-uppercase fw-bold text-secondary mb-3 ec-th-sm">Mesures anthropometriques</p>
          <div className="d-flex gap-4 flex-wrap mb-4 pb-4 border-bottom">
            <div className="ec-flex-input">
              <FieldLabel required>Taille (cm)</FieldLabel>
              <input type="number" className="form-control form-control-sm" placeholder="ex: 175" min={1} max={250} value={taille} onChange={(e) => setTaille(e.target.value)} />
            </div>
            <div className="ec-flex-input">
              <FieldLabel required>Poids (kg)</FieldLabel>
              <input type="number" className="form-control form-control-sm" placeholder="ex: 70" min={1} max={300} value={poids} onChange={(e) => setPoids(e.target.value)} />
            </div>
            <div className="ec-flex-input-l">
              <FieldLabel>IMC (kg/m2)</FieldLabel>
              <ImcField imc={imc} />
            </div>
          </div>

          <AutresSignesSection
            title="Autres signes cliniques"
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
          <ActionButton
            action="save"
            block={true}
            loading={saving}
            label={isModifying ? "Enregistrer les modifications" : "Enregistrer la fiche"}
            onClick={handleEnregistrer}
            showIcon={false}
          />
        </FormulaireWrapper>
      )}
    </div>
  );
}
