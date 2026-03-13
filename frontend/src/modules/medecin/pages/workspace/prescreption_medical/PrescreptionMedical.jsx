import { useParams } from "react-router-dom";
import {
  ActionButton,
  PageTitle,
  SearchBar,
} from "../../../../../shared/components";
import { usePrescreptionMedicalLogic } from "./usePrescreptionMedicalLogic";
import PrescreptionMedicalUI from "./PrescreptionMedicalUI";
import "./PrescreptionMedical.css";

export default function PrescriptionMedical() {
  const { numero } = useParams();
  const logic = usePrescreptionMedicalLogic(numero);

  return (
    <div className="ec-page-bg pe-page">
      <PageTitle title="Prescription médicale" />

      <div className="pe-toolbar">
        <SearchBar
          value={logic.searchTerm}
          onChange={(e) => logic.setSearchTerm(e.target.value)}
          placeholder="Rechercher un médicament, .."
          wrapperClassName="pe-search"
        />
        {!logic.showForm ? (
          <ActionButton action="add" label="Ajouter" size="sm" onClick={logic.openCreate} />
        ) : (
          <ActionButton action="annuler" label="Annuler" size="sm" onClick={logic.closeForm} />
        )}
      </div>

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
      />
    </div>
  );
}
