import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAction, alertError } from "../../../../../shared/utils/uiAlerts";
import { clearFieldError } from "../../../shared/utils/clearFieldError.js";
import {
  getResultatsByNumeroDossier,
  getDernierBilanPrescrit,
  createResultat,
  updateResultat,
} from "../../../services/resultatBiologiqueService";
import { buildInitialForm, getChampActifs } from "../../../shared/utils/bilanResultatsMap";
import { MESSAGES } from "./ResultatsbiologiquesConstants";

const getApiErrorMessage = (error, fallbackMessage) =>
  (typeof error === "string" ? error : error?.message) || fallbackMessage;

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const normalizeToggleValue = (field, value) => {
  if (field !== "idr_tuberculine" && field !== "radio_resultat") {
    return value;
  }

  const normalized = String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

  return normalized === "positif" ? "Positif" : "Negatif";
};

export function useResultatsBiologiquesLogic() {
  const { numero } = useParams();
  const genotypageViewPath = `/medecin/patient/${numero}/workspace/biologie/genotypage`;

  const [resultats, setResultats] = useState([]);
  const [bilanPrescrit, setBilanPrescrit] = useState(null);
  const [champsActifs, setChampsActifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const [isModifying, setIsModifying] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [detailItem, setDetailItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!numero) return;

    const fetchAll = async () => {
      try {
        setLoading(true);

        const [resResultats, resBilan] = await Promise.all([
          getResultatsByNumeroDossier(numero),
          getDernierBilanPrescrit(numero),
        ]);

        const bilan = resBilan?.bilan || null;
        const resultatsList = resResultats?.resultats || [];

        setResultats(resultatsList);
        setBilanPrescrit(bilan);
        setChampsActifs(getChampActifs(bilan));
      } catch (error) {
        toast.error(getApiErrorMessage(error, MESSAGES.erreurChargement));
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [numero]);

  const resetForm = () => {
    setFormData(buildInitialForm(bilanPrescrit));
    setIsModifying(false);
    setEditingId(null);
    setErrors({});
  };

  const closeForm = () => {
    resetForm();
    setShowForm(false);
  };

  const field = (key) => (e) => {
    setFormData((prev) => ({ ...prev, [key]: e.target.value }));
    clearFieldError(key, setErrors);
  };

  const handleFileChange = async (key, file) => {
    if (!file || key !== "genotypage_file_url") return;

    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf";
    if (!isImage && !isPdf) {
      toast.error("Le fichier de genotypage doit etre une image ou un PDF");
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      const today = new Date().toISOString().slice(0, 10);

      setFormData((prev) => ({
        ...prev,
        genotypage_file_url: base64,
        date_test_genotypage: prev.date_test_genotypage || today,
      }));

      clearFieldError("genotypage_file_url", setErrors);
      clearFieldError("date_test_genotypage", setErrors);
      toast.success("Fichier de genotypage importe");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Impossible d'importer le fichier"));
    }
  };

  const openCreate = () => {
    setDetailItem(null);
    resetForm();
    setShowForm(true);
  };

  const openEdit = async (item) => {
    const ok = await confirmAction(
      MESSAGES.confirmerEdit,
      `Date : ${new Date(item.date_resultat || item.created_at).toLocaleDateString("fr-FR")}`,
    );

    if (!ok) return;

    setDetailItem(null);
    setIsModifying(true);
    setEditingId(item.id);
    setErrors({});

    const prefilled = {};
    champsActifs.forEach(({ _key, champs }) => {
      champs.forEach(({ key }) => {
        prefilled[key] = normalizeToggleValue(key, item[key] ?? "");
      });

      const dateKey = `date_${_key}`;
      prefilled[dateKey] = item[dateKey] ? item[dateKey].slice(0, 10) : "";
    });

    prefilled.observations = item.observations ?? "";
    prefilled.date_resultat = item.date_resultat
      ? item.date_resultat.slice(0, 10)
      : new Date().toISOString().slice(0, 10);

    setFormData(prefilled);
    setShowForm(true);
    toast.info(MESSAGES.modeModif);
  };

  const handleShowDetails = (item) => {
    setShowForm(false);
    resetForm();
    setDetailItem(item);
    toast.info(MESSAGES.modeDetails);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ok = await confirmAction(
      isModifying ? MESSAGES.confirmerModif : MESSAGES.confirmerCreation,
      MESSAGES.confirmerModifSub,
    );

    if (!ok) return;

    try {
      setSaving(true);
      setErrors({});

      if (isModifying && editingId) {
        const res = await updateResultat(editingId, formData);
        setResultats((prev) => prev.map((row) => (row.id === editingId ? res.resultat : row)));
        toast.success(MESSAGES.successModif);
      } else {
        const res = await createResultat({
          ...formData,
          numero_dossier: numero,
          bilan_id: bilanPrescrit?.id || null,
        });

        setResultats((prev) => [res.resultat, ...prev]);
        toast.success(MESSAGES.successCreation);
      }

      closeForm();
    } catch (error) {
      if (error?.errors && Array.isArray(error.errors)) {
        const formattedErrors = {};

        error.errors.forEach((item) => {
          formattedErrors[item.field] = item.message;
        });

        setErrors(formattedErrors);
        return;
      }

      await alertError(getApiErrorMessage(error, MESSAGES.erreurEnregistrement));
    } finally {
      setSaving(false);
    }
  };

  return {
    numero,
    resultats,
    bilanPrescrit,
    champsActifs,
    loading,
    saving,
    showForm,
    showHistory,
    setShowHistory,
    isModifying,
    detailItem,
    setDetailItem,
    formData,
    errors,
    field,
    handleFileChange,
    genotypageViewPath,
    openCreate,
    openEdit,
    closeForm,
    handleShowDetails,
    handleSubmit,
  };
}
