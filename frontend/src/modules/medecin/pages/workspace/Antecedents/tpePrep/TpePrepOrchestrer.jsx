import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAction, alertError } from "../../../../../../shared/utils/uiAlerts";
import { Spinner } from "../../../../../../shared/components/UI/Loading/Spinner.jsx";
import useTpePrep from "./useTpePrep";
import TpePrepUI from "./TpePrepUI";

export default function TpePrepOrchestreur() {
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
  } = useTpePrep(numero);

  if (loading) return <Spinner />;
  if (error) {
    alertError("Erreur lors du chargement des antécédents TPE/PrEP.");
    return null;
  }

  const handleSave = async () => {
    const confirmed = await confirmAction("Confirmer l'ajout de cet antécédent TPE/PrEP ?");
    if (!confirmed) return;
    try {
      await save();
      toast.success("Antécédent TPE/PrEP ajouté avec succès.");
    } catch (err) {
      toast.error(err || "Erreur lors de l'enregistrement.");
    }
  };

  const handleUpdate = async () => {
    const confirmed = await confirmAction("Confirmer la mise à jour de cet antécédent TPE/PrEP ?");
    if (!confirmed) return;
    try {
      await update();
      toast.success("Antécédent TPE/PrEP mis à jour avec succès.");
    } catch (err) {
      toast.error(err || "Erreur lors de la mise à jour.");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmAction(
      "Supprimer cet antécédent TPE/PrEP ? Cette action est irréversible."
    );
    if (!confirmed) return;
    try {
      await remove(id);
      toast.success("Antécédent TPE/PrEP supprimé.");
    } catch (err) {
      toast.error(err || "Erreur lors de la suppression.");
    }
  };

  return (
    <TpePrepUI
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