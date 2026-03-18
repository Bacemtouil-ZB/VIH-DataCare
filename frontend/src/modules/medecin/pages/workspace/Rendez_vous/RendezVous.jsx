import { useParams } from "react-router-dom";
import { useRendezVousLogic } from "./useRendezVousLogic";
import RendezVousUI from "./RendezVousUI";
import "./RendezVous.css";

export default function RendezVous() {
  const { numero } = useParams();
  const logic = useRendezVousLogic(numero);

  return (
    <div className="ec-page-bg rdv-page">
      <RendezVousUI
        filtered={logic.filtered}
        loading={logic.loading}
        showHistory={logic.showHistory}
        setShowHistory={logic.setShowHistory}
        handleShowDetails={logic.handleShowDetails}
        openEdit={logic.openEdit}
        detailRdv={logic.detailRdv}
        setDetailRdv={logic.setDetailRdv}
        statusStyle={logic.statusStyle}
        searchDate={logic.searchDate}
        setSearchDate={logic.setSearchDate}
        showForm={logic.showForm}
        openCreate={logic.openCreate}
        closeForm={logic.closeForm}
        formData={logic.formData}
        setFormData={logic.setFormData}
        isModifying={logic.isModifying}
        handleSubmit={logic.handleSubmit}
      />
    </div>
  );
}
