import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { confirmAction } from "../../../../../../shared/utils/uiAlerts";
import {
  getAppareils,
  getSignesByPatient,
  createSignesFonctionnels,
  updateSignesFonctionnels,
} from "../../../../services/examenCliniqueServices/signesFonctionService";
import { SIGNES_KEYS, SIGNES_INIT, FORM_SF_INIT, getSignesPositifs } from "../examenConfig";
import {
  formatDateFr,
  mapAutresSignesFromApi,
  buildAutreSigneItem,
  removeAutreSigneById,
  updateAutreSigneDescription,
  handleCancelForm,
  openFormForCreate,
  showDetailMode,
} from "../logiqueTableHistory";
import { parseApiError } from "../index";

export function useSignesFonctionnelsLogic(patientNumero, examenId) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showHistory, setShowHistory] = useState(true);

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
        const [ar, hr] = await Promise.all([
          getAppareils(),
          getSignesByPatient(patientNumero),
        ]);
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

  const openCreate = () => openFormForCreate(setDetailSigne, resetForm, setShowForm);

  const handleEdit = async (signeRow) => {
    const pos = getSignesPositifs(signeRow);
    const ok = await confirmAction(
      "Modifier ce signe fonctionnel ?",
      `Date : ${formatDateFr(signeRow.date_examen)}${pos.length ? " - " + pos.slice(0, 4).join(", ") : ""}`
    );
    if (!ok) {
      toast.info("Opération annulée");
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
    toast.info("Mode modification activé");
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
    toast.success("Signe ajouté");
  };

  const supprimerAutreSigne = async (id) => {
    const ok = await confirmAction("Supprimer ce signe ?", "Cette action est irréversible.");
    if (!ok) {
      toast.info("Opération annulée");
      return;
    }
    setAutresSignes((prev) => removeAutreSigneById(prev, id));
    toast.success("Signe supprimé");
  };

  const modifierDescription = (id, nouvelleDesc) => {
    setAutresSignes((prev) => updateAutreSigneDescription(prev, id, nouvelleDesc));
    toast.success("Description mise à jour");
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
        toast.success("Signes fonctionnels mis à jour");
      } else {
        await createSignesFonctionnels({ ...payload, examen_clinique_id: examenId });
        toast.success("Signes fonctionnels enregistrés");
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

  return {
    loading,
    saving,
    showForm,
    showHistory,
    setShowHistory,
    isModifying,
    rasChecked,
    setRasChecked,
    signes,
    setSignes,
    autresSignes,
    setAutresSignes,
    appareilSel,
    setAppareilSel,
    description,
    setDescription,
    appareils,
    historique,
    detailSigne,
    setDetailSigne,
    openCreate,
    handleCancel,
    handleEdit,
    handleShowDetails,
    ajouterAutreSigne,
    supprimerAutreSigne,
    modifierDescription,
    handleSave,
  };
}
