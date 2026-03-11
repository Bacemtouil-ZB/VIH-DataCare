import { useOutletContext } from "react-router-dom";
import { PageHeader, Spinner } from "../index";
import ObservationUI from "./ObservationUI";
import { PAGE_CONTAINER_CLASS } from "./observationConstants";
import { useObservationLogic } from "./useObservationLogic";

export default function ObservationPage() {
  const { examenId, patientNumero } = useOutletContext();
  const logic = useObservationLogic(patientNumero, examenId);

  if (logic.loading) return <Spinner />;

  return (
    <div className={PAGE_CONTAINER_CLASS}>
      <PageHeader
        showForm={logic.showForm}
        onOpen={logic.openCreate}
        onCancel={logic.handleCancel}
      />

      <ObservationUI
        historique={logic.historique}
        showHistory={logic.showHistory}
        setShowHistory={logic.setShowHistory}
        handleShowDetails={logic.handleShowDetails}
        handleEdit={logic.handleEdit}
        detailObservation={logic.detailObservation}
        setDetailObservation={logic.setDetailObservation}
        showForm={logic.showForm}
        remarque={logic.remarque}
        setRemarque={logic.setRemarque}
        isModifying={logic.isModifying}
        saving={logic.saving}
        handleSave={logic.handleSave}
      />
    </div>
  );
}
