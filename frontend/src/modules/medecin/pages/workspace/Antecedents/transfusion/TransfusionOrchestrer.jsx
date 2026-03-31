import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAction, alertError } from "../../../../../../shared/utils/uiAlerts";
import { Spinner } from "../../../../../../shared/components/UI/Loading/Spinner.jsx";
import useTransfusion from "./useTransfusion";
import TransfusionUI from "./TransfusionUI";

export default function TransfusionOrchestreur() {
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
  } = useTransfusion(numero);

  if (loading) return <Spinner />;
  if (error) {
    alertError("Erreur lors du chargement des antécédents de transfusion.");
    return null;
  }

  const handleSave = async () => {
    const confirmed = await confirmAction("Confirmer l'ajout de cet antécédent de transfusion ?");
    if (!confirmed) return;
    try {
      await save();
      toast.success("Antécédent de transfusion ajouté avec succès.");
    } catch (err) {
      toast.error(err || "Erreur lors de l'enregistrement.");
    }
  };

  const handleUpdate = async () => {
    const confirmed = await confirmAction("Confirmer la mise à jour de cet antécédent de transfusion ?");
    if (!confirmed) return;
    try {
      await update();
      toast.success("Antécédent de transfusion mis à jour avec succès.");
    } catch (err) {
      toast.error(err || "Erreur lors de la mise à jour.");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmAction(
      "Supprimer cet antécédent de transfusion ? Cette action est irréversible."
    );
    if (!confirmed) return;
    try {
      await remove(id);
      toast.success("Antécédent de transfusion supprimé.");
    } catch (err) {
      toast.error(err || "Erreur lors de la suppression.");
    }
  };

  return (
    <TransfusionUI
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