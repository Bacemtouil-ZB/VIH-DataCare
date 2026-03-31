import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAction, alertError } from "../../../../../../shared/utils/uiAlerts";
import { Spinner } from "../../../../../../shared/components/UI/Loading/Spinner.jsx";
import useSurgical from "./useSurgical";
import SurgicalUI from "./SurgicalUI";

export default function SurgicalOrchestreur() {
  const { numero } = useParams();

  const {
    items,
    form,
    editingItem,
    showForm,
    loading,
    saving,
    deleting,
    error,
    accordeonOpen,
    setAccordeonOpen,
    handleChange,
    openAddForm,
    openEdit,
    cancelForm,
    save,
    update,
    remove,
  } = useSurgical(numero);

  if (loading) return <Spinner />;
  if (error) {
    alertError("Erreur lors du chargement des antécédents chirurgicaux.");
    return null;
  }

  const handleSave = async () => {
    const confirmed = await confirmAction("Confirmer l'ajout de cet antécédent chirurgical ?");
    if (!confirmed) return;
    try {
      await save();
      toast.success("Antécédent chirurgical ajouté avec succès.");
    } catch (err) {
      toast.error(err || "Erreur lors de l'enregistrement.");
    }
  };

  const handleUpdate = async () => {
    const confirmed = await confirmAction("Confirmer la mise à jour de cet antécédent chirurgical ?");
    if (!confirmed) return;
    try {
      await update();
      toast.success("Antécédent chirurgical mis à jour avec succès.");
    } catch (err) {
      toast.error(err || "Erreur lors de la mise à jour.");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmAction(
      "Supprimer cet antécédent chirurgical ? Cette action est irréversible."
    );
    if (!confirmed) return;
    try {
      await remove(id);
      toast.success("Antécédent chirurgical supprimé.");
    } catch (err) {
      toast.error(err || "Erreur lors de la suppression.");
    }
  };

  return (
    <SurgicalUI
      items={items}
      form={form}
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