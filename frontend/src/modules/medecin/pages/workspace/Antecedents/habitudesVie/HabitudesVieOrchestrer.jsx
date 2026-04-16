//cheked 15/04/2026
import { useParams } from "react-router-dom";
import { confirmAction, alertError } from "../../../../../../shared/utils/uiAlerts";
import { Spinner } from "../../../../../../shared/components/UI/Loading/Spinner.jsx";
import useHabitudesVie from "./useHabitudesVie";
import HabitudesVieUI from "./HabitudesVieUI";
 
export default function HabitudesVieOrchestrer() {
  const { numero } = useParams();
 
  const {
    form, errors, isExisting, isEditing, loading, saving, error,
    handleToggle, handleChange, startEditing, cancelEditing, save,
  } = useHabitudesVie(numero);
 
  if (loading) return <Spinner />;
  if (error) {
    alertError("Erreur lors du chargement des habitudes de vie.");
    return null;
  }
 
  const handleEdit = async () => {
    const confirmed = await confirmAction("Voulez-vous modifier les habitudes de vie ?");
    if (confirmed) startEditing();
  };
 
  const handleSave = async () => {
    const confirmed = await confirmAction(
      isExisting
        ? "Confirmer la mise à jour des habitudes de vie ?"
        : "Confirmer l'enregistrement des habitudes de vie ?"
    );
    if (!confirmed) return;
    await save();
  };
 
  return (
    <HabitudesVieUI
      form={form}
      errors={errors}         
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
 