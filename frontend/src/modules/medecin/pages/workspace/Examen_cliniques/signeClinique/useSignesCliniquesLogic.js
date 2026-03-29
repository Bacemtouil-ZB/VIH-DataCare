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
import { parseApiError } from "../index";

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
      `Date : ${formatDateFr(s.date_examen)} - Taille : ${s.taille || 0} cm - Poids : ${s.poids || 0} kg`,
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
    
    if (+taille > 250)
      return toast.error("Taille invalide (1-250 cm)");
    if ( +poids > 300)
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
