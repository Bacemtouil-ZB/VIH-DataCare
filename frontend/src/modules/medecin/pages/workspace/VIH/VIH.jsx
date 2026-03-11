import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmEdit } from "../../../../../shared/utils/uiAlerts";
import { PageTitle } from "../../../../../shared/components/layouts";
import VihForm from "./vihForm";
import {
  createVih,
  updateVih,
  getPatientByNumero,
  getVihByNumero,
} from "../../../services/vihService";
import { REQUIRED_FIELDS } from "./vihConfig";

const validateForm = (formData) => {
  for (const field of REQUIRED_FIELDS) {
    const value = formData[field.key];
    if (!value || (Array.isArray(value) && value.length === 0)) {
      toast.error(`${field.label} est obligatoire`);
      return false;
    }
  }
  return true;
};

export default function VihPage() {
  const { numero } = useParams();

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
          toast.error("Patient non trouve");
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
        toast.error("Impossible de recuperer les informations du patient");
      } finally {
        setIsLoadingPage(false);
      }
    })();
  }, [numero]);

  const handleSubmit = async (formData) => {
    if (!validateForm(formData)) return;
    setIsLoading(true);
    setErrors({});

    try {
      if (vihData) {
        await updateVih(vihData.id, formData);
        toast.success("Fiche VIH mise a jour avec succes");
      } else {
        await createVih({ ...formData, patient_id: patientId });
        toast.success("Fiche VIH creee avec succes");
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
      "Les champs vont etre actives pour modification."
    );
    if (confirmed) {
      setIsEditMode(true);
      toast.info("Mode edition active");
    } else {
      toast.info("Operation annulee - aucune modification enregistree");
    }
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setErrors({});
    toast.info("Operation annulee - aucune modification enregistree");
  };

  if (isLoadingPage) {
    return (
      <div className="medical-page">
        <div className="loading-container">
          <div className="spinner-large"></div>
          <p>Chargement du patient...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="medical-page">
      <PageTitle title="Fiche VIH du patient" />

      <VihForm
        initialData={vihData}
        onSubmit={handleSubmit}
        onEdit={handleEdit}
        onCancel={handleCancel}
        isLoading={isLoading}
        errors={errors}
        isEditMode={isEditMode}
        isCreateMode={!vihData}
      />
    </div>
  );
}
