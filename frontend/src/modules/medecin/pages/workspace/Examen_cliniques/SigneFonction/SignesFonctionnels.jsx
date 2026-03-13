import { useOutletContext } from "react-router-dom";
import { ActionButton } from "../../../../../../shared/components";
import { Spinner } from "../index";
import SignesFonctionnelsUI from "./SignesFonctionnelsUI";
import { PAGE_CONTAINER_CLASS } from "./signesFonctionnelsConstants";
import { useSignesFonctionnelsLogic } from "./useSignesFonctionnelsLogic";

export default function SignesFonctionnels() {
  const { examenId, patientNumero } = useOutletContext();
  const logic = useSignesFonctionnelsLogic(patientNumero, examenId);

  if (logic.loading) return <Spinner />;

  return (
    <div className={PAGE_CONTAINER_CLASS}>
      <div className="d-flex justify-content-end mb-3">
        {!logic.showForm ? (
          <ActionButton
            action="add"
            label="Ajouter"
            onClick={logic.openCreate}
          />
        ) : (
          <ActionButton
            action="annuler"
            label="Annuler"
            onClick={logic.handleCancel}
          />
        )}
      </div>

      <SignesFonctionnelsUI
        historique={logic.historique}
        showHistory={logic.showHistory}
        setShowHistory={logic.setShowHistory}
        handleShowDetails={logic.handleShowDetails}
        handleEdit={logic.handleEdit}
        detailSigne={logic.detailSigne}
        setDetailSigne={logic.setDetailSigne}
        showForm={logic.showForm}
        isModifying={logic.isModifying}
        saving={logic.saving}
        rasChecked={logic.rasChecked}
        setRasChecked={logic.setRasChecked}
        signes={logic.signes}
        setSignes={logic.setSignes}
        appareils={logic.appareils}
        autresSignes={logic.autresSignes}
        appareilSel={logic.appareilSel}
        description={logic.description}
        setAppareilSel={logic.setAppareilSel}
        setDescription={logic.setDescription}
        ajouterAutreSigne={logic.ajouterAutreSigne}
        supprimerAutreSigne={logic.supprimerAutreSigne}
        modifierDescription={logic.modifierDescription}
        handleSave={logic.handleSave}
      />
    </div>
  );
}
