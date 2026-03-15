import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { confirmAction } from "../../../../../../shared/utils/uiAlerts";
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
  formatDateFr,
} from "../../../../../../shared/utils/logiqueTableHistory";

export function useSignesCliniquesLogic(numero, examenId) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showHistory, setShowHistory] = useState(true);

  const [signeId, setSigneId] = useState(FORM_SC_INIT.signeId);
  const [isModifying, setIsModifying] = useState(FORM_SC_INIT.isModifying);
  const [taille, setTaille] = useState(FORM_SC_INIT.taille);
  const [poids, setPoids] = useState(FORM_SC_INIT.poids);
  const [autresSignes, setAutresSignes] = useState(FORM_SC_INIT.autresSignes);
  const [appareilSel, setAppareilSel] = useState(FORM_SC_INIT.appareilSel);
  const [description, setDescription] = useState(FORM_SC_INIT.description);
  const [errors, setErrors] = useState({}); // ← ajouté

  const [appareils, setAppareils] = useState([]);
  const [historique, setHistorique] = useState([]);
  const [detailSigne, setDetailSigne] = useState(null);

  const imc = useMemo(
    () =>
      taille && poids && +taille > 0 && +poids > 0 ?
        calcIMC(+taille, +poids)
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
    setErrors({}); // ← ajouté
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

  const handleCancel = () => {
    handleCancelForm(setShowForm, resetForm, toast);
  };

  const openCreate = () =>
    openFormForCreate(setDetailSigne, resetForm, setShowForm);

  const handleEdit = async (s) => {
    const ok = await confirmAction(
      "Modifier ce signe clinique ?",
      `Date : ${formatDateFr(s.date_examen)} - Taille : ${s.taille} cm - Poids : ${s.poids} kg`,
    );
    if (!ok) return;

    setDetailSigne(null);
    setSigneId(s.id);
    setIsModifying(true);
    setTaille(s.taille || "");
    setPoids(s.poids || "");
    setAutresSignes(mapAutresSignesFromApi(s.autres_signes));
    setAppareilSel("");
    setDescription("");
    setShowForm(true);
    setErrors({}); // ← ajouté
    toast.info("Mode modification activé");
  };

  const handleShowDetails = (s) => {
    showDetailMode(setShowForm, setDetailSigne, s);
  };

  const ajouterAutreSigne = () => {
    const { error, item } = buildAutreSigneItem(
      appareils,
      appareilSel,
      description,
    );
    if (error) return toast.error(error);
    setAutresSignes((prev) => [...prev, item]);
    setAppareilSel("");
    setDescription("");
  };

  const supprimerAutreSigne = async (id) => {
    const ok = await confirmAction(
      "Supprimer ce signe ?",
      "Cette action est irréversible.",
    );
    if (!ok) return;
    setAutresSignes((prev) => removeAutreSigneById(prev, id));
    toast.success("Signe supprimé");
  };

  const modifierDescription = (id, nouvelleDesc) => {
    setAutresSignes((prev) =>
      updateAutreSigneDescription(prev, id, nouvelleDesc),
    );
    toast.success("Description mise à jour");
  };

  const handleSave = async () => {
    if (!taille || !poids)
      return toast.error("Veuillez renseigner la taille et le poids");
    if (+taille <= 0 || +taille > 250)
      return toast.error("Taille invalide (1-250 cm)");
    if (+poids <= 0 || +poids > 300)
      return toast.error("Poids invalide (1-300 kg)");

    setSaving(true);
    try {
      const payload = {
        examen_clinique_id: examenId,
        taille: +taille,
        poids: +poids,
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
    } catch (error) {
      // ── Cas 1 — errors[] avec field (express-validator) ───
      const data = error?.response?.data;
      if (data?.errors && Array.isArray(data.errors)) {
        const errorObj = {};
        data.errors.forEach((e) => {
          errorObj[e.field] = e.message;
          toast.error(e.message);
        });
        setErrors(errorObj);
        return;
      }
      // ── Cas 2 — message simple ────────────────────────────
      if (data?.message) {
        toast.error(data.message);
        return;
      }
      // ── Cas 3 — fallback ──────────────────────────────────
      toast.error("Une erreur s'est produite lors de l'enregistrement");
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
    poids,
    setPoids,
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
    errors, // ← ajouté
    setErrors, // ← ajouté
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
