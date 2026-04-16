//cheked 15/04/2026
import { useParams } from "react-router-dom";
import { confirmAction, alertError } from "../../../../../../shared/utils/uiAlerts";
import { Spinner } from "../../../../../../shared/components/UI/Loading/Spinner.jsx";
import useMedical from "./useMedical";
import MedicalUI from "./MedicalUI";
 
export default function MedicalOrchestrer() {
  const { numero } = useParams();
 
  const {
    form, errors, isExisting, isEditing, loading, saving, error,
    handleToggle, handleChange, startEditing, cancelEditing, save,
  } = useMedical(numero);
 
  if (loading) return <Spinner />;
  if (error) {
    alertError("Erreur lors du chargement des données médicales.");
    return null;
  }
 
  const handleEdit = async () => {
    const confirmed = await confirmAction("Voulez-vous modifier l'antécédent médical ?");
    if (confirmed) startEditing();
  };
 
  const handleSave = async () => {
    const confirmed = await confirmAction(
      isExisting
        ? "Confirmer la mise à jour de l'antécédent médical ?"
        : "Confirmer l'enregistrement de l'antécédent médical ?"
    );
    if (!confirmed) return;
    await save();
  };
 
  return (
    <MedicalUI
      form={form}
      errors={errors}          // ← transmission des erreurs au composant UI
      isExisting={isExisting}
      isEditing={isEditing}
      saving={saving}
      onToggle={handleToggle}
      onChange={handleChange}
      onEdit={handleEdit}
      onCancel={cancelEditing}
      onSave={handleSave}
    />
  );
}