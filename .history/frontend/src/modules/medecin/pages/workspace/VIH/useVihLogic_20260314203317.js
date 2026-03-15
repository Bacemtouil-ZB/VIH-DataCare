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
  getVihValidationError,
  serializeModesContamination,
} from "./vihHelpers";
import { FORM_INIT, REQUIRED_FIELDS } from "./vihConstants";
import { clearFieldError } from "../../../shared/utils/clearFieldError.js";

export function useVihLogic(numero) {
  const [patientId, setPatientId] = useState(null);
  const [vihData, setVihData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState(FORM_INIT);
  const [isModesOpen, setIsModesOpen] = useState(false);

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
        const vih = vihRes?.vih;
        setPatientId(patient.id);
        setVihData(vih || null);
        setIsEditMode(!vih);
      } catch (error) {
        console.error("Erreur chargement:", error);
        toast.error("Impossible de récupérer les informations du patient");
      } finally {
        setIsLoadingPage(false);
      }
    })();
  }, [numero]);

  useEffect(() => {
    setFormData(buildFormFromVihData(vihData));
  }, [vihData]);

  const submitVihData = async (payload) => {
    const errorMessage = getVihValidationError(payload, REQUIRED_FIELDS);
    if (errorMessage) {
      toast.error(errorMessage);
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
        console.log("vih data", payload);
        toast.success("Fiche VIH créée avec succès");
      }

      const vihRes = await getVihByNumero(numero);
      setVihData(vihRes?.vih || null);
      setIsEditMode(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Erreur soumission:", error);
      if (error?.errors && Array.isArray(error.errors)) {
        const errorObj = {};
        error.errors.forEach((e) => {
          errorObj[e.field] = e.message;
          toast.error(e.message);
        });
        setErrors(errorObj);
      } else if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error("Une erreur s'est produite lors de l'enregistrement");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      let nextValue = type === "checkbox" ? checked : value;
      if (name === "profil_seroconversion") {
        nextValue = value === "true" || value === true;
      }
      const next = { ...prev, [name]: nextValue };
      if (name === "stade_cdc" && !String(nextValue).startsWith("C")) {
        next.debut_stade_c = "";
      }
      return next;
    });
    clearFieldError(name, setErrors);
  };

  const handleModesChange = (values) => {
    setFormData((prev) => ({ ...prev, mode_contamination: values }));
  };

  const handleToggleMode = (option) => {
    setFormData((prev) => {
      const selected =
        Array.isArray(prev.mode_contamination) ? prev.mode_contamination : [];
      const nextModes =
        selected.includes(option) ?
          selected.filter((v) => v !== option)
        : [...selected, option];
      return { ...prev, mode_contamination: nextModes };
    });
  };

  const handleRemoveMode = (opt) => {
    setFormData((prev) => ({
      ...prev,
      mode_contamination: prev.mode_contamination.filter((v) => v !== opt),
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    submitVihData({
      ...formData,
      mode_contamination: serializeModesContamination(
        formData.mode_contamination,
      ),
    });
  };

  const handleEdit = async () => {
    const confirmed = await confirmEdit(
      "Modifier la fiche VIH ?",
      "Les champs vont être activés pour modification.",
    );
    if (confirmed) {
      setIsEditMode(true);
      toast.info("Mode édition activé");
    }
  };

  const handleCancel = () => {
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
      Array.isArray(formData.mode_contamination) ? formData.mode_contamination
      : formData.mode_contamination ? [formData.mode_contamination]
      : [],
    isDisabled: !isEditMode && !!vihData,
    isStadeC: (formData.stade_cdc || "").startsWith("C"),
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
