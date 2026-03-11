import { useOutletContext, useParams } from "react-router-dom";
import { PageHeader, Spinner } from "../index";
import SignesCliniquesUI from "./SignesCliniquesUI";
import { PAGE_CONTAINER_CLASS } from "./signesCliniquesConstants";
import { useSignesCliniquesLogic } from "./useSignesCliniquesLogic";

export default function SignesCliniques() {
  const { numero } = useParams();
  const { examenId } = useOutletContext();
  const logic = useSignesCliniquesLogic(numero, examenId);

  if (logic.loading) return <Spinner />;

  return (
    <div className={PAGE_CONTAINER_CLASS}>
      <PageHeader
        showForm={logic.showForm}
        onOpen={logic.openCreate}
        onCancel={logic.handleCancel}
      />

      <SignesCliniquesUI
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
        taille={logic.taille}
        setTaille={logic.setTaille}
        poids={logic.poids}
        setPoids={logic.setPoids}
        imc={logic.imc}
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
