//cheked 15/04/2026
import { useParams } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { useEffect } from "react";
import { confirmAction, alertError, alertInfo } from "../../../../../../shared/utils/uiAlerts";
import { Spinner } from "../../../../../../shared/components/UI/Loading/Spinner.jsx";
import useGyneco from "./useGyneco";
import GynecoUI from "./GynecoUI";

export default function GynecoOrchestrer() {
  const { numero } = useParams();
  const { isFemme, gender } = useOutletContext() || {};

  const {
    form, errors, isExisting, isEditing, loading, saving, error,
    handleChange, startEditing, cancelEditing, save,
  } = useGyneco(numero);

  // ── Alerte si patient non féminin ────────────────────────────────────────
  useEffect(() => {
    if (gender !== null && gender !== undefined && !isFemme) {
      alertInfo(
        "Les antécédents gynécologiques ne sont pas applicables pour ce patient.",
        "Section non applicable"
      );
    }
  }, [gender, isFemme]);

  // ── Blocage si non féminin ───────────────────────────────────────────────
  if (gender !== null && gender !== undefined && !isFemme) return null;

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
      errors={errors}
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