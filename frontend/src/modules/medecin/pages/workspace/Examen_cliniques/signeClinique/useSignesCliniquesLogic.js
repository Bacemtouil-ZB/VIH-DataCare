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

  // ====== Reset formulaire ======
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

  // ====== Chargement initial ======
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

  // ====== Wrappers avec clearFieldError ======
  const handleTailleChange = (e) => {
    setTaille(e.target.value);
    clearFieldError("taille", setErrors);
  };

  const handlePoidsChange = (e) => {
    setPoids(e.target.value);
    clearFieldError("poids", setErrors);
  };

  // ====== Cancel ======
  const handleCancel = () => {
    handleCancelForm(setShowForm, resetForm, toast);
  };

  // ====== Ouvrir en mode création ======
  const openCreate = () => {
    openFormForCreate(setDetailSigne, resetForm, setShowForm);
  };

  // ====== Ouvrir en mode modification ======
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
    toast.info("Mode modification activé");
  };

  const handleShowDetails = (s) => {
    showDetailMode(setShowForm, setDetailSigne, s);
  };

  // ====== Autres signes ======
  const ajouterAutreSigne = () => {
    const { error, item } = buildAutreSigneItem(appareils, appareilSel, description);
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

    // ── Validation frontend (miroir exact du backend) ────────────────────────
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

        // ← Omis si vide — évite d'envoyer null qui bypasse le validator backend
        ...(taille !== "" && taille !== null && { taille: +taille }),
        ...(poids  !== "" && poids  !== null && { poids:  +poids  }),

        autres_signes: autresSignes.map(({ appareil_id, description: d }) => ({
          appareil_id,
          description: d,
        })),
      };

      if (isModifying && signeId) {
        await updateSigneClinique(signeId, payload);
        toast.success("Signes cliniques mis à jour");
      } else {
        const res = await createSigneClinique(payload);
        setSigneId(res?.signe?.id || null);
        toast.success("Signes cliniques enregistrés");
      }

      setShowForm(false);
      resetForm();
      const hr = await getSigneCliniqueByNumeroDossier(numero);
      setHistorique(hr?.signes || []);

    } catch (e) {


      if (e?.errors && Array.isArray(e.errors)) {
        const errorObj = {};
        e.errors.forEach((err) => {
          errorObj[err.field] = err.message;
        });
        setErrors(errorObj);
        return;
      }

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
    description,
    setDescription,
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