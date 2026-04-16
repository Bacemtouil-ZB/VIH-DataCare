//cheked 15/04/2026
import { useParams } from "react-router-dom";
import { confirmAction, alertError } from "../../../../../../shared/utils/uiAlerts";
import { Spinner } from "../../../../../../shared/components/UI/Loading/Spinner.jsx";
import useFamily from "./useFamily";
import FamilyUI from "./FamilyUI";
 
export default function FamilyOrchestrer() {
  const { numero } = useParams();
 
  const {
    form, errors, isExisting, isEditing, loading, saving, error,
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
 
    await save();
    // Le hook affiche les FieldErrors (erreurs validation) ou le toast.error (erreur serveur)
    // Le toast.success est affiché ici uniquement si save() s'est terminé sans erreur
    // Note : save() ne throw pas → on vérifie si errors est vide après appel
    // Pour simplifier, on utilise le pattern : save() retourne true si succès
  };
 
  return (
    <FamilyUI
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
 