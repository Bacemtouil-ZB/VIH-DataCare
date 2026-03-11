import { useOutletContext } from "react-router-dom";
import { Spinner } from "../index";
import HabitudesUI from "./HabitudesUI";
import { PAGE_CONTAINER_CLASS } from "./habitudesConstants";
import { useHabitudesLogic } from "./useHabitudesLogic";

export default function HabitudesPage() {
  const { examenId, patientNumero } = useOutletContext();
  const logic = useHabitudesLogic(patientNumero, examenId);

  if (logic.loading) return <Spinner />;

  return (
    <div className={PAGE_CONTAINER_CLASS}>
      <HabitudesUI
        habitudeId={logic.habitudeId}
        saving={logic.saving}
        handleSave={logic.handleSave}
        tabagisme={logic.tabagisme}
        alcoolemie={logic.alcoolemie}
        toxicomanie={logic.toxicomanie}
        activitePhysique={logic.activitePhysique}
        setTabagisme={logic.setTabagisme}
        setAlcoolemie={logic.setAlcoolemie}
        setToxicomanie={logic.setToxicomanie}
        setActivitePhysique={logic.setActivitePhysique}
      />
    </div>
  );
}
