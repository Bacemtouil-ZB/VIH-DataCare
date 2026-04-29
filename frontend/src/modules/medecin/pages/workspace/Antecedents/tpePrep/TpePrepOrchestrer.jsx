//cheked 15/04/2026
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAction, alertError } from "../../../../../../shared/utils/uiAlerts";
import { Spinner } from "../../../../../../shared/components/UI/Loading/Spinner.jsx";
import useTpePrep from "./useTpePrep";
import TpePrepUI from "./TpePrepUI";
 
export default function TpePrepOrchestrer() {
  const { numero } = useParams();
 
  const {
    items, form, errors, editingItem, showForm, loading, saving, deleting, error,
    accordeonOpen, setAccordeonOpen,
    handleChange, openAddForm, openEdit, cancelForm, save, update, remove,
  } = useTpePrep(numero);
 
  if (loading) return <Spinner />;
  if (error) {
    alertError("Erreur lors du chargement des antécédents TPE/PrEP.");
    return null;
  }
 
  const handleSave = async () => {
    const confirmed = await confirmAction("Confirmer l'ajout de cet antécédent TPE/PrEP ?");
    if (!confirmed) return;
    await save();
  };
 
  const handleUpdate = async () => {
    const confirmed = await confirmAction("Confirmer la mise à jour de cet antécédent TPE/PrEP ?");
    if (!confirmed) return;
    await update();
  };
 
  const handleDelete = async (id) => {
    const confirmed = await confirmAction(
      "Supprimer cet antécédent TPE/PrEP ? Cette action est irréversible."
    );
    if (!confirmed) return;
    try {
      await remove(id);
      toast.success("Antécédent TPE/PrEP supprimé.");
    } catch {
      toast.error("Erreur lors de la suppression.");
    }
  };
 
  return (
    <TpePrepUI
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