import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  confirmAction,
  alertError,
} from "../../../../../shared/utils/uiAlerts";
import {
  openFormForCreate,
  showDetailMode,
} from "../../../../../shared/utils/logiqueTableHistory";
import {
  createRendezvous,
  getRendezvousByNumeroDossier,
  updateRendezvous,
} from "../../../services/rendezvousService";
import { getSuiviByNumeroDossier } from "../../../../../shared/services/suiviTherapeutiqueservice";
import {
  toInputDate,
  toInputTime,
} from "../../../../../shared/utils/dateHelpers";
import { INITIAL_FORM } from "./rendezVousConstants";
import { getStatusStyle, pickProchainePriseReference } from "./rendezVousHelpers";

export function useRendezVousLogic(numero) {
  const [searchDate, setSearchDate] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const [isModifying, setIsModifying] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [detailRdv, setDetailRdv] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [rendezVous, setRendezVous] = useState([]);
  const [prochainePriseReference, setProchainePriseReference] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!numero) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const [rdvRes, suiviRes] = await Promise.all([
          getRendezvousByNumeroDossier(numero),
          getSuiviByNumeroDossier(numero).catch(() => null),
        ]);

        setRendezVous(rdvRes.rendezvous || []);
        setProchainePriseReference(
          pickProchainePriseReference(suiviRes?.suivis || []),
        );
      } catch (err) {
        toast.error(
          err?.message || "Erreur lors du chargement des rendez-vous",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [numero]);

  const filtered = useMemo(() => {
    if (!searchDate) return rendezVous;
    return rendezVous.filter((r) => toInputDate(r.date) === searchDate);
  }, [rendezVous, searchDate]);

  const resetForm = () => {
    setFormData(INITIAL_FORM);
    setIsModifying(false);
    setEditingId(null);
  };

  const openCreate = () =>
    openFormForCreate(setDetailRdv, resetForm, setShowForm);

  const closeForm = () => {
    resetForm();
    setShowForm(false);
  };

  const openEdit = async (item) => {
    const ok = await confirmAction(
      "Modifier ce rendez-vous ?",
      `Date : ${new Date(item.date).toLocaleDateString("fr-FR")} - Heure : ${item.heure}`,
    );
    if (!ok) return;

    setDetailRdv(null);
    setFormData({
      date: toInputDate(item.date),
      heure: toInputTime(item.heure),
      type: item.type || "",
      statut: item.statut || "",
      commentaire: item.commentaire || "",
    });
    setIsModifying(true);
    setEditingId(item.id);
    setShowForm(true);
    toast.info("Mode modification activé");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.date ) {
      toast.error("Date est obligatoire");
      return;
    }

    const ok = await confirmAction(
      isModifying ?
        "Enregistrer les modifications ?"
      : "Créer ce rendez-vous ?",
      "Les données seront enregistrées dans le dossier patient.",
    );
    if (!ok) return;

    try {

        // Nettoyer les données AVANT envoi
  const payload = {
    ...formData,
    heure: formData.heure?.trim() || null, // ✅ "" devient null
    commentaire: formData.commentaire?.trim() || null,
  };
      if (isModifying && editingId) {
        const res = await updateRendezvous(editingId, payload);
        setRendezVous((prev) =>
          prev.map((r) => (r.id === editingId ? res.rendezvous : r)),
        );
        toast.success("Rendez-vous mis à jour");
      } else {
        const res = await createRendezvous({
          ...payload,
          numero_dossier: numero,
        });
        setRendezVous((prev) => [res.rendezvous, ...prev]);
        toast.success("Rendez-vous enregistré");
      }
      closeForm(false);
    } catch (err) {
      await alertError(err?.message || "Erreur lors de l'enregistrement");
    }
  };

  const handleShowDetails = (item) => {
    showDetailMode(setShowForm, setDetailRdv, item);
    toast.info("Mode détails actif");
  };

  return {
    searchDate,
    setSearchDate,
    showForm,
    showHistory,
    setShowHistory,
    isModifying,
    editingId,
    detailRdv,
    setDetailRdv,
    formData,
    setFormData,
    rendezVous,
    filtered,
    prochainePriseReference,
    loading,
    openCreate,
    closeForm,
    openEdit,
    handleSubmit,
    handleShowDetails,
    statusStyle: getStatusStyle,
  };
}
