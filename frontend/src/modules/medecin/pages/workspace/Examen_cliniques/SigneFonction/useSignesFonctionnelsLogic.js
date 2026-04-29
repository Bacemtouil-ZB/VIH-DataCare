//cheked 15/04/2026
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { confirmAction, alertError } from "../../../../../../shared/utils/uiAlerts";
import {
  getAppareils,
  getSignesByPatient,
  createSignesFonctionnels,
  updateSignesFonctionnels,
} from "../../../../services/examenCliniqueServices/signesFonctionService";
import { SIGNES_KEYS, FORM_SF_INIT } from "./signesFonctionnelsConstants";
import {
  mapAutresSignesFromApi,
  buildAutreSigneItem,
  removeAutreSigneById,
  updateAutreSigneDescription,
  handleCancelForm,
  openFormForCreate,
  showDetailMode,
} from "../../../../../../shared/utils/logiqueTableHistory";

export function useSignesFonctionnelsLogic(patientNumero, examenId) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const [errors, setErrors] = useState({});                

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

  // ====== Reset formulaire ======
  const resetForm = () => {
    setSignesId(FORM_SF_INIT.signesId);
    setIsModifying(FORM_SF_INIT.isModifying);
    setRasChecked(FORM_SF_INIT.rasChecked);
    setSignes(FORM_SF_INIT.signes);
    setAutresSignes(FORM_SF_INIT.autresSignes);
    setAppareilSel(FORM_SF_INIT.appareilSel);
    setDescription(FORM_SF_INIT.description);
    setErrors({});                                         
  };

  // ====== Chargement initial ======
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

  // ====== Cancel ======
  const handleCancel = () => {
    handleCancelForm(setShowForm, resetForm, toast);
    // resetForm inclut setErrors({})
  };

  // ====== Ouvrir en mode création ======
  const openCreate = () => {
    openFormForCreate(setDetailSigne, resetForm, setShowForm);
    // resetForm inclut setErrors({})
  };

  // ====== Ouvrir en mode modification ======
  const handleEdit = async (signeRow) => {
    setDetailSigne(null);
    setSignesId(signeRow.id);
    setIsModifying(true);
    setRasChecked(signeRow.ras || false);
    setSignes(Object.fromEntries(SIGNES_KEYS.map((k) => [k, signeRow[k] || false])));
    setAutresSignes(mapAutresSignesFromApi(signeRow.autres_signes));
    setAppareilSel("");
    setDescription("");
    setShowForm(true);
    setErrors({});                                        
    toast.info("Mode modification activé");
  };

  const handleShowDetails = (signeRow) => {
    showDetailMode(setShowForm, setDetailSigne, signeRow);
  };

  // ====== Autres signes ======
  const ajouterAutreSigne = () => {
    const { error, item } = buildAutreSigneItem(appareils, appareilSel, description, true);
    if (error) return toast.error(error);
    setAutresSignes((prev) => [...prev, item]);
    setAppareilSel("");
    setDescription("");
  };

  const supprimerAutreSigne = async (id) => {
    const ok = await confirmAction("Supprimer ce signe ?", "Cette action est irréversible.");
    if (!ok) return;
    setAutresSignes((prev) => removeAutreSigneById(prev, id));
    toast.success("Signe supprimé");
  };

  const modifierDescription = (id, nouvelleDesc) => {
    setAutresSignes((prev) => updateAutreSigneDescription(prev, id, nouvelleDesc));
    toast.success("Description mise à jour");
  };

  // ====== Soumission ======
  const handleSave = async () => {
    setSaving(true);
    setErrors({});

    try {
      const payload = {
        signes: { ...signes, ras: rasChecked },
        autres_signes: autresSignes.map(({ appareil_id, description: d }) => ({
          appareil_id: parseInt(appareil_id, 10),
          description: d,
        })),
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

      // Cas 1 — errors[] avec field (express-validator via handleValidation)
      // → FieldError général car les champs (signes.*, autres_signes.*) ne sont pas des inputs texte visibles
      if (e?.errors && Array.isArray(e.errors)) {
        const errorObj = {};
        e.errors.forEach((err) => {
          errorObj[err.field] = err.message;
        });
        // Expose aussi le premier message sous _form pour affichage général
        const firstError = e.errors[0];
        errorObj._form = firstError?.message || "Erreur de validation";
        setErrors(errorObj);
        return;
      }

      // Cas 2 — message simple (erreur métier serveur)
      // → FieldError général sous le formulaire
      if (e?.message) {
        setErrors({ _form: e.message });
        return;
      }

      // Cas 3 — fallback inattendu (réseau, serveur indisponible)
      alertError("Erreur lors de l'enregistrement");

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
    errors,                                                
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