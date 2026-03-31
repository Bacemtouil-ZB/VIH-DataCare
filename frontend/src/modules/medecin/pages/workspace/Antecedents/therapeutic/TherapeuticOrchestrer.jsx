import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAction, alertError } from "../../../../../../shared/utils/uiAlerts";
import { Spinner } from "../../../../../../shared/components/UI/Loading/Spinner.jsx";
import useTherapeutic from "./useTherapeutic";
import TherapeuticUI from "./TherapeuticUI";

export default function TherapeuticOrchestrer() {
  const { numero } = useParams();

  const {
    form, isExisting, isEditing, loading, saving, error,
    handleChange, startEditing, cancelEditing, save,
  } = useTherapeutic(numero);

  if (loading) return <Spinner />;
  if (error) {
    alertError("Erreur lors du chargement des données thérapeutiques.");
    return null;
  }

  const handleEdit = async () => {
    const confirmed = await confirmAction("Voulez-vous modifier l'antécédent thérapeutique ?");
    if (confirmed) startEditing();
  };

  const handleSave = async () => {
    const confirmed = await confirmAction(
      isExisting
        ? "Confirmer la mise à jour de l'antécédent thérapeutique ?"
        : "Confirmer l'enregistrement de l'antécédent thérapeutique ?"
    );
    if (!confirmed) return;
    try {
      await save();
      toast.success(
        isExisting
          ? "Antécédent thérapeutique mis à jour avec succès."
          : "Antécédent thérapeutique créé avec succès."
      );
    } catch (err) {
      toast.error(err || "Erreur lors de l'enregistrement.");
    }
  };

  return (
    <TherapeuticUI
      form={form}
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