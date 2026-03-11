import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { confirmEdit } from "../../../../../shared/utils/uiAlerts";
import {
  createVih,
  updateVih,
  getPatientByNumero,
  getVihByNumero,
} from "../../../services/vihService";
import { getVihValidationError } from "./vihHelpers";
import { REQUIRED_FIELDS } from "./vihConfig";

export function useVihLogic(numero) {
  const [patientId, setPatientId] = useState(null);
  const [vihData, setVihData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);

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

  const handleSubmit = async (formData) => {
    const errorMessage = getVihValidationError(formData, REQUIRED_FIELDS);
    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      if (vihData) {
        await updateVih(vihData.id, formData);
        toast.success("Fiche VIH mise à jour avec succès");
      } else {
        await createVih({ ...formData, patient_id: patientId });
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

  const handleEdit = async () => {
    const confirmed = await confirmEdit(
      "Modifier la fiche VIH ?",
      "Les champs vont être activés pour modification."
    );
    if (confirmed) {
      setIsEditMode(true);
      toast.info("Mode édition activé");
    } else {
      toast.info("Opération annulée - aucune modification enregistrée");
    }
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setErrors({});
    toast.info("Opération annulée - aucune modification enregistrée");
  };

  return {
    vihData,
    isLoading,
    isLoadingPage,
    errors,
    isEditMode,
    isCreateMode: !vihData,
    handleSubmit,
    handleEdit,
    handleCancel,
  };
}
