import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmEdit } from "../../../../../shared/utils/uiAlerts";
import VihForm from "../../../components/forms/vihForm";
import { createVih, updateVih, getVihByNumeroDossier } from "../../../services/vihService";
import API from "../../../../../shared/utils/api";

const validateForm = (formData) => {
  const { mode_contamination, type_depistage, circonstance_decouverte, date_vih_positif, stade_cdc, typage_hla_b5701, date_derniere_negative, date_contamination, debut_stade_c } = formData;

  if (!mode_contamination)      { toast.error("Le mode de contamination est obligatoire");        return false; }
  if (!type_depistage)          { toast.error("Le type de dépistage est obligatoire");             return false; }
  if (!circonstance_decouverte) { toast.error("La circonstance de découverte est obligatoire");   return false; }
  if (!date_vih_positif)        { toast.error("La date du test VIH positif est obligatoire");     return false; }
  if (!stade_cdc)               { toast.error("Le stade CDC est obligatoire");                    return false; }
  if (!typage_hla_b5701)        { toast.error("Le typage HLA-B5701 est obligatoire");             return false; }

  const today       = new Date(); today.setHours(0, 0, 0, 0);
  const datePositif = new Date(date_vih_positif);

  if (datePositif > today) {
    toast.error("La date du test VIH positif ne peut pas être dans le futur");
    return false;
  }
  if (date_derniere_negative) {
    const dateNeg = new Date(date_derniere_negative);
    if (dateNeg > today)        { toast.error("La date du dernier test négatif ne peut pas être dans le futur"); return false; }
    if (dateNeg >= datePositif) { toast.error("La date du dernier test négatif doit être antérieure à la date du test VIH positif"); return false; }
  }
  if (date_contamination) {
    const dateCont = new Date(date_contamination);
    if (dateCont > today)       { toast.error("La date de contamination ne peut pas être dans le futur"); return false; }
    if (dateCont > datePositif) { toast.error("La date de contamination ne peut pas être postérieure à la date du test VIH positif"); return false; }
  }
  if (debut_stade_c) {
    const dateStadeC = new Date(debut_stade_c);
    if (dateStadeC > today)       { toast.error("La date de début du stade C ne peut pas être dans le futur"); return false; }
    if (dateStadeC < datePositif) { toast.error("La date de début du stade C doit être postérieure ou égale à la date du test VIH positif"); return false; }
  }

  return true;
};

export default function VihPage() {
  const { numero } = useParams();
  const navigate   = useNavigate();

  const [patientId,     setPatientId]     = useState(null);
  const [vihData,       setVihData]       = useState(null);
  const [isLoading,     setIsLoading]     = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [errors,        setErrors]        = useState({});
  const [isEditMode,    setIsEditMode]    = useState(false);

  const init = useCallback(async () => {
    try {
      setIsLoadingPage(true);
      const patientRes = await API.get(`/patients/numero/${numero}`);
      const patient    = patientRes.data?.patient?.patient || patientRes.data?.patient;
      if (!patient?.id) { toast.error("Patient non trouvé"); return; }
      setPatientId(patient.id);
      await fetchVihData();
    } catch {
      toast.error("Impossible de récupérer les informations du patient");
    } finally {
      setIsLoadingPage(false);
    }
  }, [numero]);

  useEffect(() => {
    if (!numero) return;
    init();
  }, [numero, init]);

  const fetchVihData = async () => {
    try {
      const res = await getVihByNumeroDossier(numero);
      const vih = res?.vih;
      if (vih) {
        setVihData(vih);
        setIsEditMode(false);
      } else {
        setVihData(null);
        setIsEditMode(true);
      }
    } catch {
      setVihData(null);
      setIsEditMode(true);
    }
  };

  const handleSubmit = async (formData) => {
    if (!validateForm(formData)) return;
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
      await fetchVihData();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      if (error?.errors) {
        const errorObj = {};
        error.errors.forEach(e => { errorObj[e.field] = e.message; toast.error(e.message); });
        setErrors(errorObj);
      } else {
        toast.error(error?.message || "Une erreur s'est produite lors de l'enregistrement");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async () => {
    const confirmed = await confirmEdit("Modifier la fiche VIH ?", "Les champs vont être activés pour modification.");
    if (confirmed) { setIsEditMode(true); toast.info("Mode édition activé"); }
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setErrors({});
    toast.info("Modifications annulées");
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

  if (!patientId) {
    return (
      <div className="medical-page">
        <div className="alert alert-error">Patient non trouvé (Numéro : {numero})</div>
        <button onClick={() => navigate(-1)} className="btn-secondary">← Retour</button>
      </div>
    );
  }

  return (
    <div className="medical-page">

      <div className="page-header">
        <div>
          <h2>Fiche VIH du patient</h2>
        </div>
        <div className="header-actions">
          {vihData && !isEditMode && (
            <button onClick={handleEdit} className="btn-primary"> Modifier</button>
          )}
          {vihData && isEditMode && (
            <button onClick={handleCancel} className="btn-secondary" disabled={isLoading}>✖️ Annuler</button>
          )}
        </div>
      </div>

      {!vihData && (
        <div className="alert alert-info">
          Aucune fiche VIH trouvée pour ce patient. Créez-en une nouvelle ci-dessous.
        </div>
      )}

      <VihForm
        initialData={vihData}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        errors={errors}
        isEditMode={isEditMode}
        isCreateMode={!vihData}
      />

    </div>
  );
}