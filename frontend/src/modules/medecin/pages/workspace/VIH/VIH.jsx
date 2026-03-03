import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmEdit } from "../../../../../shared/utils/uiAlerts";
import VihForm from "./vihForm";
import { createVih, updateVih, getVihByNumeroDossier } from "../../../services/vihService";
import { STATE_INIT, REQUIRED_FIELDS } from "./vihConfig";
import API from "../../../../../shared/utils/api";

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
  const navigate = useNavigate();

  const [state, setState] = useState({ ...STATE_INIT });
  const patchState = (updates) => setState((prev) => ({ ...prev, ...updates }));

  useEffect(() => {
    if (!numero) return;
    (async () => {
      patchState({ isLoadingPage: true });
      try {
        const patientRes = await API.get(`/patients/numero/${numero}`);
        const patient = patientRes.data?.patient?.patient || patientRes.data?.patient;
        if (!patient?.id) {
          toast.error("Patient non trouvé");
          patchState({ isLoadingPage: false });
          return;
        }
        patchState({ patientId: patient.id });
        try {
          const vihRes = await getVihByNumeroDossier(numero);
          const vih = vihRes?.vih;
          patchState({ vihData: vih || null, isEditMode: !vih });
        } catch {
          patchState({ vihData: null, isEditMode: true });
        }
      } catch (error) {
        console.error("Erreur chargement:", error);
        toast.error("Impossible de récupérer les informations du patient");
      } finally {
        patchState({ isLoadingPage: false });
      }
    })();
  }, [numero]);

  const handleSubmit = async (formData) => {
    if (!validateForm(formData)) return;
    patchState({ isLoading: true, errors: {} });
    try {
      if (state.vihData) {
        await updateVih(state.vihData.id, formData);
        toast.success("Fiche VIH mise à jour avec succès");
      } else {
        await createVih({ ...formData, patient_id: state.patientId });
        toast.success("Fiche VIH créée avec succès");
      }
      const vihRes = await getVihByNumeroDossier(numero);
      patchState({ vihData: vihRes?.vih || null, isEditMode: false });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Erreur soumission:", error);
      if (error?.errors && Array.isArray(error.errors)) {
        const errorObj = {};
        error.errors.forEach((e) => { errorObj[e.field] = e.message; toast.error(e.message); });
        patchState({ errors: errorObj });
      } else if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error("Une erreur s'est produite lors de l'enregistrement");
      }
    } finally {
      patchState({ isLoading: false });
    }
  };

  const handleEdit = async () => {
    const confirmed = await confirmEdit("Modifier la fiche VIH ?", "Les champs vont être activés pour modification.");
    if (confirmed) {
      patchState({ isEditMode: true });
      toast.info("Mode édition activé");
    } else {
      toast.info("Opération annulée — aucune modification enregistrée");
    }
  };

  const handleCancel = () => {
    patchState({ isEditMode: false, errors: {} });
    toast.info("Opération annulée — aucune modification enregistrée");
  };

  if (state.isLoadingPage) {
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
      <div className="page-header">
        <h2>Fiche VIH du patient</h2>
      </div>

      <VihForm
        initialData={state.vihData}
        onSubmit={handleSubmit}
        onEdit={handleEdit}
        onCancel={handleCancel}
        isLoading={state.isLoading}
        errors={state.errors}
        isEditMode={state.isEditMode}
        isCreateMode={!state.vihData}
      />
    </div>
  );
}
