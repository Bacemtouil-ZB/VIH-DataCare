import { useParams } from "react-router-dom";
import {
  ActionButton,
  PageTitle,
  SearchBar,
} from "../../../../../shared/components";
import { useRendezVousLogic } from "./useRendezVousLogic";
import RendezVousUI from "./RendezVousUI";
import "./RendezVous.css";

export default function RendezVous() {
  const { numero } = useParams();
  const logic = useRendezVousLogic(numero);

  return (
    <div className="ec-page-bg rdv-page">
      <PageTitle title="Gestion des rendez-vous" />

      <div className="rdv-toolbar">
        <SearchBar
          type="date"
          value={logic.searchDate}
          onChange={(e) => logic.setSearchDate(e.target.value)}
          wrapperClassName="rdv-search"
        />
        {!logic.showForm ? (
          <ActionButton action="add" label="Ajouter" size="sm" onClick={logic.openCreate} />
        ) : (
          <ActionButton action="annuler" label="Annuler" size="sm" onClick={() => logic.closeForm()} />
        )}
      </div>

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
        showForm={logic.showForm}
        formData={logic.formData}
        setFormData={logic.setFormData}
        isModifying={logic.isModifying}
        handleSubmit={logic.handleSubmit}
      />
    </div>
  );
}
