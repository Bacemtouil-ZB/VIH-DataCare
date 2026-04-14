import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { confirmEdit } from "../../../../../shared/utils/uiAlerts";
import {
  createVih,
  updateVih,
  getPatientByNumero,
  getVihByNumero,
} from "../../../services/vihService";
import {
  buildFormFromVihData,
  serializeModesContamination,
} from "./vihHelpers";
import { FORM_INIT, REQUIRED_FIELDS } from "./vihConstants";
import { clearFieldError } from "../../../../../shared/components/Forms/FieldLabel/clearFieldError";

export function useVihLogic(numero) {
  const [patientId, setPatientId] = useState(null);
  const [vihData, setVihData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState(FORM_INIT);
  const [isModesOpen, setIsModesOpen] = useState(false);

  // ====== Chargement initial patient + VIH ======
  useEffect(() => {
    if (!numero) return;
    (async () => {
      setIsLoadingPage(true);
      try {
        const patientRes = await getPatientByNumero(numero);
        const patient = patientRes?.patient?.patient || patientRes?.patient;

        if (!patient?.id) {
          toast.error("Patient non trouvé");
          setIsLoadingPage(false);
          return;
        }

        const vihRes = await getVihByNumero(numero);
        setPatientId(patient.id);
        setVihData(vihRes?.vih || null);
        setIsEditMode(!vihRes?.vih);
      } catch (error) {
        console.error("Erreur chargement:", error);
        toast.error("Impossible de récupérer les informations du patient");
      } finally {
        setIsLoadingPage(false);
      }
    })();
  }, [numero]);

  // ====== Initialiser le formulaire à partir des données VIH ======
  useEffect(() => {
    setFormData(buildFormFromVihData(vihData));
  }, [vihData]);

  // ====== Soumission des données VIH ======
  const submitVihData = async (payload) => {

    // ── Validation frontend des champs requis ──────────────────────────────
    // Chaque champ manquant → FieldError sous le champ (pas de toast global)
    const fieldErrors = {};
    for (const field of REQUIRED_FIELDS) {
      const value = payload[field.key];
      if (!value || (Array.isArray(value) && value.length === 0)) {
        fieldErrors[field.key] = `${field.label} est obligatoire`;
      }
    }
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      if (vihData) {
        await updateVih(vihData.id, payload);
        toast.success("Fiche VIH mise à jour avec succès");
      } else {
        await createVih({ ...payload, patient_id: patientId });
        toast.success("Fiche VIH créée avec succès");
      }

      const vihRes = await getVihByNumero(numero);
      setVihData(vihRes?.vih || null);
      setFormData(vihRes?.vih || {});
      setIsEditMode(false);
      window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (error) {
      console.error("Erreur soumission:", error);

      // Cas 1 — errors[] avec field (express-validator via handleValidation)
      // → FieldError affiché sous chaque champ concerné
      if (error?.errors && Array.isArray(error.errors)) {
        const errorObj = {};
        error.errors.forEach((e) => {
          errorObj[e.field] = e.message;
        });
        setErrors(errorObj);
        return;
      }

      // Cas 2 — message simple (validateDateLogic — cohérence entre les deux dates)
      // → FieldError sous date_derniere_negative (c'est ce champ qui doit être antérieur)
      if (error?.message) {
        setErrors({ date_derniere_negative: error.message });
        return;
      }

      // Cas 3 — fallback inattendu
      toast.error("Une erreur s'est produite lors de l'enregistrement");
    } finally {
      setIsLoading(false);
    }
  };

  // ====== Mise à jour des champs du formulaire ======
  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const nextValue = type === "checkbox" ? checked : value;
      return { ...prev, [name]: nextValue };
    });

    // Supprime automatiquement l'erreur du champ modifié
    clearFieldError(name, setErrors);
  };

  // ====== Gestion modes contamination ======
  const handleModesChange = (values) => {
    setFormData((prev) => ({ ...prev, mode_contamination: values }));
  };

  const handleToggleMode = (option) => {
    setFormData((prev) => {
      const selected =
        Array.isArray(prev.mode_contamination) ? prev.mode_contamination : [];
      const nextModes =
        selected.includes(option)
          ? selected.filter((v) => v !== option)
          : [...selected, option];
      return { ...prev, mode_contamination: nextModes };
    });

    // Efface l'erreur dès que l'utilisateur sélectionne ou désélectionne un mode
    clearFieldError("mode_contamination", setErrors);
  };

  const handleRemoveMode = (opt) => {
    setFormData((prev) => ({
      ...prev,
      mode_contamination: prev.mode_contamination.filter((v) => v !== opt),
    }));

    // Efface l'erreur si le champ avait été validé et qu'on retire un mode
    clearFieldError("mode_contamination", setErrors);
  };

  // ====== Formulaire submit ======
  const handleFormSubmit = (e) => {
    e.preventDefault();
    submitVihData({
      ...formData,
      mode_contamination: serializeModesContamination(
        formData.mode_contamination,
      ),
    });
  };

  // ====== Edition / cancel ======
  const handleEdit = async () => {
    const confirmed = await confirmEdit(
      "Modifier la fiche VIH ?",
      "Les champs vont être activés pour modification.",
    );
    if (confirmed) {
      setIsEditMode(true);
    }
  };

  const handleCancel = () => {
    setFormData(buildFormFromVihData(vihData)); // restaure les données sauvegardées
    setIsEditMode(false);
    setErrors({});
  };

  return {
    vihData,
    isLoading,
    isLoadingPage,
    errors,
    isEditMode,
    isCreateMode: !vihData,
    formData,
    selectedModes:
      Array.isArray(formData.mode_contamination)
        ? formData.mode_contamination
        : formData.mode_contamination
          ? [formData.mode_contamination]
          : [],
    isDisabled: !isEditMode && !!vihData,
    handleFieldChange,
    handleModesChange,
    handleToggleMode,
    handleRemoveMode,
    handleFormSubmit,
    isModesOpen,
    toggleModesOpen: () => setIsModesOpen((v) => !v),
    closeModesOpen: () => setIsModesOpen(false),
    handleEdit,
    handleCancel,
  };
}