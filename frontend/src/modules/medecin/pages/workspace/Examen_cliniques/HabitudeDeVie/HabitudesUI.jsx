import ActionButton from "../../../../../../shared/components/layouts/ui/ActionButton";
import ToggleSwitch from "../../../../components/buttons/ToggleSwitch";
import { PageHeader } from "../index";
import { HABITUDES_CHAMPS } from "../examenConfig";
import { HABITUDES_TITLE } from "./habitudesConstants";

export default function HabitudesUI({
  habitudeId,
  saving,
  handleSave,
  tabagisme,
  alcoolemie,
  toxicomanie,
  activitePhysique,
  setTabagisme,
  setAlcoolemie,
  setToxicomanie,
  setActivitePhysique,
}) {
  const handleToggle = (key, val) => {
    if (key === "tabagisme") setTabagisme(val);
    else if (key === "alcoolemie") setAlcoolemie(val);
    else if (key === "toxicomanie") setToxicomanie(val);
    else setActivitePhysique(val);
  };

  return (
    <>
      <PageHeader
        actionButton={
          <ActionButton
            action={habitudeId ? "edit" : "save"}
            loading={saving}
            onClick={handleSave}
          />
        }
      />

      <div className="bg-white border rounded p-3 mb-4">
        <h6 className="mb-3 ec-habitudes-title">{HABITUDES_TITLE}</h6>
        <div className="row g-3">
          {HABITUDES_CHAMPS.map(({ key, label }) => (
            <div key={key} className="col-md-4">
              <div className="ec-habitude-toggle">
                <ToggleSwitch
                  id={`habitude-${key}`}
                  label={label}
                  checked={
                    key === "tabagisme"
                      ? tabagisme
                      : key === "alcoolemie"
                      ? alcoolemie
                      : key === "toxicomanie"
                      ? toxicomanie
                      : activitePhysique
                  }
                  onChange={(val) => handleToggle(key, val)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
