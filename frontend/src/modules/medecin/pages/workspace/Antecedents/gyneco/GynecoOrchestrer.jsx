//cheked 15/04/2026
import { useParams } from "react-router-dom";
import { confirmAction, alertError } from "../../../../../../shared/utils/uiAlerts";
import { Spinner } from "../../../../../../shared/components/UI/Loading/Spinner.jsx";
import useGyneco from "./useGyneco";
import GynecoUI from "./GynecoUI";
 
export default function GynecoOrchestrer() {
  const { numero } = useParams();
 
  const {
    form, errors, isExisting, isEditing, loading, saving, error,
    handleChange, startEditing, cancelEditing, save,
  } = useGyneco(numero);
 
  if (loading) return <Spinner />;
  if (error) {
    alertError("Erreur lors du chargement des données gynécologiques.");
    return null;
  }
 
  const handleEdit = async () => {
    const confirmed = await confirmAction("Voulez-vous modifier l'antécédent gynécologique ?");
    if (confirmed) startEditing();
  };
 
  const handleSave = async () => {
    const confirmed = await confirmAction(
      isExisting
        ? "Confirmer la mise à jour de l'antécédent gynécologique ?"
        : "Confirmer l'enregistrement de l'antécédent gynécologique ?"
    );
    if (!confirmed) return;
    await save();
  };
 
  return (
    <GynecoUI
      form={form}
      errors={errors}          // ← transmission des erreurs au composant UI
      isExisting={isExisting}
      isEditing={isEditing}
      saving={saving}
      onChange={handleChange}
      onEdit={handleEdit}
      onCancel={cancelEditing}
      onSave={handleSave}
    />
  );
}