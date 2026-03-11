import { useOutletContext } from "react-router-dom";
import { PageHeader, Spinner } from "../index";
import SignesFonctionnelsUI from "./SignesFonctionnelsUI";
import { PAGE_CONTAINER_CLASS } from "./signesFonctionnelsConstants";
import { useSignesFonctionnelsLogic } from "./useSignesFonctionnelsLogic";

export default function SignesFonctionnels() {
  const { examenId, patientNumero } = useOutletContext();
  const logic = useSignesFonctionnelsLogic(patientNumero, examenId);

  if (logic.loading) return <Spinner />;

  return (
    <div className={PAGE_CONTAINER_CLASS}>
      <PageHeader
        showForm={logic.showForm}
        onOpen={logic.openCreate}
        onCancel={logic.handleCancel}
      />

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
