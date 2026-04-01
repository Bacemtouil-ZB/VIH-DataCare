
import { useEffect, useState } from "react";
import { useParams }           from "react-router-dom";
import { toast }               from "react-toastify";
import { confirmAction, alertError } from "../../../../../shared/utils/uiAlerts";
import {
  getResultatsByNumeroDossier,
  getDernierBilanPrescrit,
  createResultat,
  updateResultat,
} from "../../../services/resultatBiologiqueService";
import { buildInitialForm, getChampActifs } from "../../../shared/utils/bilanResultatsMap";
import { MESSAGES } from "./ResultatsbiologiquesConstants";

export function useResultatsBiologiquesLogic() {
  const { numero } = useParams();

  const [resultats,     setResultats]     = useState([]);
  const [bilanPrescrit, setBilanPrescrit] = useState(null);
  const [champsActifs,  setChampsActifs]  = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [saving,        setSaving]        = useState(false);
  const [showForm,      setShowForm]      = useState(false);
  const [showHistory,   setShowHistory]   = useState(true);
  const [isModifying,   setIsModifying]   = useState(false);
  const [editingId,     setEditingId]     = useState(null);
  const [detailItem,    setDetailItem]    = useState(null);
  const [formData,      setFormData]      = useState({});

  // ── Chargement initial ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!numero) return;
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [resResultats, resBilan] = await Promise.all([
          getResultatsByNumeroDossier(numero),
          getDernierBilanPrescrit(numero),
        ]);
        setResultats(resResultats.resultats || []);

        const bilan = resBilan.bilan || null;
        setBilanPrescrit(bilan);

        // Calcule les champs actifs depuis le mapping (inclut _key)
        const actifs = getChampActifs(bilan);
        setChampsActifs(actifs);
      } catch (err) {
        toast.error(err?.message || MESSAGES.erreurChargement);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [numero]);

  // ── Helpers form ────────────────────────────────────────────────────────────
  const resetForm = () => {
    setFormData(buildInitialForm(bilanPrescrit));
    setIsModifying(false);
    setEditingId(null);
  };

  // Suppression du paramètre notify inutilisé : closeForm ne notifie plus,
  // c'est à l'appelant de décider quoi afficher après fermeture.
  const closeForm = () => {
    resetForm();
    setShowForm(false);
  };

  const field = (key) => (e) =>
    setFormData((prev) => ({ ...prev, [key]: e.target.value }));

  // ── Ouvrir création ─────────────────────────────────────────────────────────
  const openCreate = () => {
    setDetailItem(null);
    resetForm();
    setShowForm(true);
  };

  // ── Ouvrir modification ─────────────────────────────────────────────────────
  const openEdit = async (item) => {
    const ok = await confirmAction(
      MESSAGES.confirmerEdit,
      `Date : ${new Date(item.date_resultat || item.created_at).toLocaleDateString("fr-FR")}`,
    );
    // Correction : garde manquante — l'action s'exécutait même si l'utilisateur annulait
    if (!ok) return;

    setDetailItem(null);
    setIsModifying(true);
    setEditingId(item.id);

    // Pré-remplir avec les valeurs existantes (champs résultats + dates par section)
    const prefilled = {};
    champsActifs.forEach(({ _key, champs }) => {
      champs.forEach(({ key }) => { prefilled[key] = item[key] ?? ""; });
      const dateKey = `date_${_key}`;
      prefilled[dateKey] = item[dateKey] ? item[dateKey].slice(0, 10) : "";
    });
    prefilled.observations  = item.observations ?? "";
    prefilled.date_resultat = item.date_resultat
      ? item.date_resultat.slice(0, 10)
      : new Date().toISOString().slice(0, 10);

    setFormData(prefilled);
    setShowForm(true);
    toast.info(MESSAGES.modeModif);
  };

  // ── Détail ──────────────────────────────────────────────────────────────────
  const handleShowDetails = (item) => {
    setShowForm(false);
    resetForm();
    setDetailItem(item);
    toast.info(MESSAGES.modeDetails);
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    const ok = await confirmAction(
      isModifying ? MESSAGES.confirmerModif : MESSAGES.confirmerCreation,
      MESSAGES.confirmerModifSub,
    );
    // Correction : garde manquante — l'enregistrement s'exécutait même si annulé
    if (!ok) return;

    try {
      setSaving(true);
      if (isModifying && editingId) {
        const res = await updateResultat(editingId, formData);
        setResultats((prev) =>
          prev.map((r) => (r.id === editingId ? res.resultat : r))
        );
        toast.success(MESSAGES.successModif);
      } else {
        const res = await createResultat({
          ...formData,
          numero_dossier: numero,
          bilan_id:       bilanPrescrit?.id || null,
        });
        setResultats((prev) => [res.resultat, ...prev]);
        toast.success(MESSAGES.successCreation);
      }
      closeForm();
    } catch (err) {
      await alertError(err?.response?.data?.message || MESSAGES.erreurEnregistrement);
    } finally {
      setSaving(false);
    }
  };

  return {
    numero,
    resultats, bilanPrescrit, champsActifs,
    loading, saving,
    showForm, showHistory, setShowHistory,
    isModifying,
    detailItem, setDetailItem,
    formData, field,
    openCreate, openEdit, closeForm, handleShowDetails, handleSubmit,
  };
}