//cheked 15/04/2026
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAction, alertError } from "../../../../../../shared/utils/uiAlerts";
import { Spinner } from "../../../../../../shared/components/UI/Loading/Spinner.jsx";
import useTransfusion from "./useTransfusion";
import TransfusionUI from "./TransfusionUI";
 
export default function TransfusionOrchestrer() {
  const { numero } = useParams();
 
  const {
    items, form, errors, editingItem, showForm, loading, saving, deleting, error,
    accordeonOpen, setAccordeonOpen,
    handleChange, openAddForm, openEdit, cancelForm, save, update, remove,
  } = useTransfusion(numero);
 
  if (loading) return <Spinner />;
  if (error) {
    alertError("Erreur lors du chargement des antécédents de transfusion.");
    return null;
  }
 
  const handleSave = async () => {
    const confirmed = await confirmAction("Confirmer l'ajout de cet antécédent de transfusion ?");
    if (!confirmed) return;
    await save();
  };
 
  const handleUpdate = async () => {
    const confirmed = await confirmAction("Confirmer la mise à jour de cet antécédent de transfusion ?");
    if (!confirmed) return;
    await update();
  };
 
  const handleDelete = async (id) => {
    const confirmed = await confirmAction(
      "Supprimer cet antécédent de transfusion ? Cette action est irréversible."
    );
    if (!confirmed) return;
    try {
      await remove(id);
      toast.success("Antécédent de transfusion supprimé.");
    } catch {
      toast.error("Erreur lors de la suppression.");
    }
  };
 
  return (
    <TransfusionUI
      items={items}
      form={form}
      errors={errors}          // ← transmission des erreurs au composant UI
      editingItem={editingItem}
      showForm={showForm}
      saving={saving}
      deleting={deleting}
      accordeonOpen={accordeonOpen}
      onAccordeonToggle={() => setAccordeonOpen((o) => !o)}
      onChange={handleChange}
      onOpenAdd={openAddForm}
      onOpenEdit={openEdit}
      onCancel={cancelForm}
      onSave={handleSave}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
    />
  );
}
 