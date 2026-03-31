import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAction, alertError } from "../../../../../../shared/utils/uiAlerts";
import { Spinner } from "../../../../../../shared/components/UI/Loading/Spinner.jsx";
import useFamily from "./useFamily";
import FamilyUI from "./FamilyUI";

export default function FamilyOrchestrer() {
  const { numero } = useParams();

  const {
    form, isExisting, isEditing, loading, saving, error,
    handleToggle, handleChange, startEditing, cancelEditing, save,
  } = useFamily(numero);

  if (loading) return <Spinner />;
  if (error) {
    alertError("Erreur lors du chargement des données familiales.");
    return null;
  }

  const handleEdit = async () => {
    const confirmed = await confirmAction("Voulez-vous modifier l'antécédent familial ?");
    if (confirmed) startEditing();
  };

  const handleSave = async () => {
    const confirmed = await confirmAction(
      isExisting
        ? "Confirmer la mise à jour de l'antécédent familial ?"
        : "Confirmer l'enregistrement de l'antécédent familial ?"
    );
    if (!confirmed) return;
    try {
      await save();
      toast.success(
        isExisting
          ? "Antécédent familial mis à jour avec succès."
          : "Antécédent familial créé avec succès."
      );
    } catch (err) {
      toast.error(err || "Erreur lors de l'enregistrement.");
    }
  };

  return (
    <FamilyUI
      form={form}
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