//cheked 15/04/2026
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { confirmAction, alertError } from "../../../../../../shared/utils/uiAlerts";
import {
  createSigneClinique,
  updateSigneClinique,
  getSigneCliniqueByNumeroDossier,
} from "../../../../services/examenCliniqueServices/signeCliniqueService";
import { getAppareils } from "../../../../services/examenCliniqueServices/signesFonctionService";
import { calcIMC, FORM_SC_INIT } from "./signesCliniquesConstants";
import {
  mapAutresSignesFromApi,
  buildAutreSigneItem,
  removeAutreSigneById,
  updateAutreSigneDescription,
  handleCancelForm,
  openFormForCreate,
  showDetailMode,
} from "../../../../../../shared/utils/logiqueTableHistory";
import { clearFieldError } from "../../../../../../shared/components/Forms/FieldLabel/clearFieldError";

const DIRECT_FIELD_ERRORS = new Set(["taille", "poids"]);

const formatValidationErrors = (error) => {
  if (!error?.errors || !Array.isArray(error.errors)) return null;

  const formatted = {};
  const formMessages = [];

  error.errors.forEach((item) => {
    if (DIRECT_FIELD_ERRORS.has(item.field)) {
      formatted[item.field] = item.message;
      return;
    }

    if (!formMessages.includes(item.message)) {
      formMessages.push(item.message);
    }
  });

  if (formMessages.length > 0) {
    formatted._form = formMessages.join(" ");
  }

  return formatted;
};

export function useSignesCliniquesLogic(numero, examenId) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const [errors, setErrors] = useState({});

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

  const imc = useMemo(
    () =>
      taille && poids && +taille > 0 && +poids > 0
        ? calcIMC(+taille, +poids)
        : null,
    [taille, poids],
  );

  const resetForm = () => {
    setSigneId(FORM_SC_INIT.signeId);
    setIsModifying(FORM_SC_INIT.isModifying);
    setTaille(FORM_SC_INIT.taille);
    setPoids(FORM_SC_INIT.poids);
    setAutresSignes(FORM_SC_INIT.autresSignes);
    setAppareilSel(FORM_SC_INIT.appareilSel);
    setDescription(FORM_SC_INIT.description);
    setErrors({});
  };

  useEffect(() => {
    if (!numero) return;

    (async () => {
      setLoading(true);
      try {
        const [ar, hr] = await Promise.all([
          getAppareils(),
          getSigneCliniqueByNumeroDossier(numero),
        ]);
        setAppareils(ar?.appareils || []);
        setHistorique(hr?.signes || []);
      } catch {
        setHistorique([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [numero]);

  const handleTailleChange = (e) => {
    setTaille(e.target.value);
    clearFieldError("taille", setErrors);
    clearFieldError("_form", setErrors);
  };

  const handlePoidsChange = (e) => {
    setPoids(e.target.value);
    clearFieldError("poids", setErrors);
    clearFieldError("_form", setErrors);
  };

  const handleAppareilChange = (value) => {
    setAppareilSel(value);
    clearFieldError("_form", setErrors);
  };

  const handleDescriptionChange = (value) => {
    setDescription(value);
    clearFieldError("_form", setErrors);
  };

  const handleCancel = () => {
    handleCancelForm(setShowForm, resetForm, toast);
  };

  const openCreate = () => {
    openFormForCreate(setDetailSigne, resetForm, setShowForm);
  };

  const handleEdit = async (s) => {
    setDetailSigne(null);
    setSigneId(s.id);
    setIsModifying(true);
    setTaille(s.taille || "");
    setPoids(s.poids || "");
    setAutresSignes(mapAutresSignesFromApi(s.autres_signes));
    setAppareilSel("");
    setDescription("");
    setShowForm(true);
    setErrors({});
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
    setErrors((prev) => ({ ...prev, _form: null }));
  };

  const supprimerAutreSigne = async (id) => {
    const ok = await confirmAction("Supprimer ce signe ?", "Cette action est irreversible.");
    if (!ok) return;
    setAutresSignes((prev) => removeAutreSigneById(prev, id));
    toast.success("Signe supprime");
  };

  const modifierDescription = (id, nouvelleDesc) => {
    setAutresSignes((prev) => updateAutreSigneDescription(prev, id, nouvelleDesc));
    toast.success("Description mise a jour");
  };

  const handleSave = async () => {
    const fieldErrors = {};

    if (taille !== "" && taille !== null) {
      const t = +taille;
      if (isNaN(t) || t < 1 || t > 250) {
        fieldErrors.taille = "Taille invalide (1-250 cm)";
      }
    }

    if (poids !== "" && poids !== null) {
      const p = +poids;
      if (isNaN(p) || p < 1 || p > 300) {
        fieldErrors.poids = "Poids invalide (1-300 kg)";
      }
    }

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setSaving(true);
    setErrors({});

    try {
      const payload = {
        examen_clinique_id: examenId,
        ...(taille !== "" && taille !== null && { taille: +taille }),
        ...(poids !== "" && poids !== null && { poids: +poids }),
        autres_signes: autresSignes.map(({ appareil_id, description: currentDescription }) => ({
          appareil_id,
          description: currentDescription,
        })),
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
      const formattedErrors = formatValidationErrors(e);
      if (formattedErrors) {
        setErrors(formattedErrors);
        return;
      }

      if (e?.message) {
        setErrors({ _form: e.message });
        return;
      }

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
    taille,
    setTaille,
    handleTailleChange,
    poids,
    setPoids,
    handlePoidsChange,
    autresSignes,
    setAutresSignes,
    appareilSel,
    setAppareilSel,
    handleAppareilChange,
    description,
    setDescription,
    handleDescriptionChange,
    appareils,
    historique,
    detailSigne,
    setDetailSigne,
    imc,
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
