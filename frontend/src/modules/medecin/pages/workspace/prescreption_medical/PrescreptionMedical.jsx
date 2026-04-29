import { useParams } from "react-router-dom";
import { usePrescreptionMedicalLogic } from "./usePrescreptionMedicalLogic";
import PrescreptionMedicalUI from "./PrescreptionMedicalUI";
import { useAuth } from "../../../../../shared/hooks/useAuth";
import "./PrescreptionMedical.css";

export default function PrescriptionMedical() {
  const { numero } = useParams();
  const { user }   = useAuth();
  const logic      = usePrescreptionMedicalLogic(numero, user);

  return (
    <PrescreptionMedicalUI
      filtered={logic.filtered}
      loading={logic.loading}
      showHistory={logic.showHistory}
      setShowHistory={logic.setShowHistory}
      handleShowDetails={logic.handleShowDetails}
      detailItem={logic.detailItem}
      setDetailItem={logic.setDetailItem}
      showForm={logic.showForm}
      formData={logic.formData}
      field={logic.field}
      stockItems={logic.stockItems}
      setMedicamentIds={logic.setMedicamentIds}
      isModifying={logic.isModifying}
      saving={logic.saving}
      closeForm={logic.closeForm}
      handleSubmit={logic.handleSubmit}
      searchTerm={logic.searchTerm}
      setSearchTerm={logic.setSearchTerm}
      searchDate={logic.searchDate}
      setSearchDate={logic.setSearchDate}
      openCreate={logic.openCreate}
      confirmationModal={logic.confirmationModal}
      closeConfirmationModal={logic.closeConfirmationModal}
      confirmPrescription={logic.confirmPrescription}
      medecinDisplayName={logic.medecinDisplayName}
    />
  );
}