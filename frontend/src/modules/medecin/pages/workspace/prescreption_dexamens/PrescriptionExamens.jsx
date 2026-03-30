
import { useParams } from "react-router-dom";
import { useBilanExamenLogic } from "./useBilanExamenLogic";
import BilanExamenUI            from "./BilanExamenUI";
import "./PrescriptionExamens.css";

export default function PrescriptionExamens() {
  const { numero } = useParams();
  const logic = useBilanExamenLogic(numero);

  return (
    <BilanExamenUI
      // données
      bilans={logic.bilans}
      loading={logic.loading}
      saving={logic.saving}
      showForm={logic.showForm}
      showHistory={logic.showHistory}
      setShowHistory={logic.setShowHistory}
      isModifying={logic.isModifying}
      detailItem={logic.detailItem}
      formData={logic.formData}
      setFormData={logic.setFormData}
      // actions
      openCreate={logic.openCreate}
      closeForm={logic.closeForm}
      openEdit={logic.openEdit}
      handleShowDetails={logic.handleShowDetails}
      closeDetail={logic.closeDetail}
      handleToggle={logic.handleToggle}
      handleSubmit={logic.handleSubmit}
    />
  );
}