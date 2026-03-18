import { useParams } from "react-router-dom";
import { usePrescreptionMedicalLogic } from "./usePrescreptionMedicalLogic";
import PrescreptionMedicalUI from "./PrescreptionMedicalUI";
import "./PrescreptionMedical.css";

export default function PrescriptionMedical() {
  const { numero } = useParams();
  const logic = usePrescreptionMedicalLogic(numero);

  return (
    <PrescreptionMedicalUI
      filtered={logic.filtered}
      loading={logic.loading}
      showHistory={logic.showHistory}
      setShowHistory={logic.setShowHistory}
      handleShowDetails={logic.handleShowDetails}
      openEdit={logic.openEdit}
      detailItem={logic.detailItem}
      setDetailItem={logic.setDetailItem}
      showForm={logic.showForm}
      formData={logic.formData}
      field={logic.field}
      handleMedSelect={logic.handleMedSelect}
      stockItems={logic.stockItems}
      selectedMed={logic.selectedMed}
      isModifying={logic.isModifying}
      saving={logic.saving}
      closeForm={logic.closeForm}
      handleSubmit={logic.handleSubmit}
      searchTerm={logic.searchTerm}
      setSearchTerm={logic.setSearchTerm}
      searchDate={logic.searchDate}
      setSearchDate={logic.setSearchDate}
      openCreate={logic.openCreate}
    />
  );
}
