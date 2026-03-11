import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAction } from "../../../../../shared/utils/uiAlerts";
import { createHabitudeDeVie, getHabitudeDeVieByNumeroDossier, updateHabitudeDeVie } from "../../../services/examenCliniqueServices/habitudeDeVieService";
import ActionButton from "../../../../../shared/components/layouts/ui/ActionButton";
import ToggleSwitch from "../../../components/buttons/ToggleSwitch";
import { HABITUDES_CHAMPS, HABITUDES_INIT } from "./examenConfig";
import { PageHeader, Spinner } from "./index";

const PAGE_CONTAINER_CLASS = "ec-page-bg";

export default function HabitudesPage() {
  const { examenId, patientNumero } = useOutletContext();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [habitudeId, setHabitudeId] = useState(null);
  const [tabagisme, setTabagisme] = useState(HABITUDES_INIT.tabagisme);
  const [alcoolemie, setAlcoolemie] = useState(HABITUDES_INIT.alcoolemie);
  const [toxicomanie, setToxicomanie] = useState(HABITUDES_INIT.toxicomanie);
  const [activitePhysique, setActivitePhysique] = useState(HABITUDES_INIT.activite_physique);

  const [lastSavedHabitudeId, setLastSavedHabitudeId] = useState(null);
  const [lastSavedTabagisme, setLastSavedTabagisme] = useState(HABITUDES_INIT.tabagisme);
  const [lastSavedAlcoolemie, setLastSavedAlcoolemie] = useState(HABITUDES_INIT.alcoolemie);
  const [lastSavedToxicomanie, setLastSavedToxicomanie] = useState(HABITUDES_INIT.toxicomanie);
  const [lastSavedActivitePhysique, setLastSavedActivitePhysique] = useState(HABITUDES_INIT.activite_physique);

  useEffect(() => {
    if (!patientNumero) return;
    (async () => {
      setLoading(true);
      try {
        const res = await getHabitudeDeVieByNumeroDossier(patientNumero);
        const h = res?.habitudes?.[0];

        if (h?.id) {
          const loadedHabitudeId = h.id;
          const loadedTabagisme = h.tabagisme ?? false;
          const loadedAlcoolemie = h.alcoolemie ?? false;
          const loadedToxicomanie = h.toxicomanie ?? false;
          const loadedActivitePhysique = h.activite_physique ?? false;

          setHabitudeId(loadedHabitudeId);
          setTabagisme(loadedTabagisme);
          setAlcoolemie(loadedAlcoolemie);
          setToxicomanie(loadedToxicomanie);
          setActivitePhysique(loadedActivitePhysique);

          setLastSavedHabitudeId(loadedHabitudeId);
          setLastSavedTabagisme(loadedTabagisme);
          setLastSavedAlcoolemie(loadedAlcoolemie);
          setLastSavedToxicomanie(loadedToxicomanie);
          setLastSavedActivitePhysique(loadedActivitePhysique);
        } else {
          setHabitudeId(null);
          setTabagisme(HABITUDES_INIT.tabagisme);
          setAlcoolemie(HABITUDES_INIT.alcoolemie);
          setToxicomanie(HABITUDES_INIT.toxicomanie);
          setActivitePhysique(HABITUDES_INIT.activite_physique);

          setLastSavedHabitudeId(null);
          setLastSavedTabagisme(HABITUDES_INIT.tabagisme);
          setLastSavedAlcoolemie(HABITUDES_INIT.alcoolemie);
          setLastSavedToxicomanie(HABITUDES_INIT.toxicomanie);
          setLastSavedActivitePhysique(HABITUDES_INIT.activite_physique);
        }
      } catch {
        toast.error("Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    })();
  }, [patientNumero]);

  const handleSave = async () => {
    const action = habitudeId ? "Modifier les habitudes de vie ?" : "Enregistrer les habitudes de vie ?";
    const detail = habitudeId
      ? "Les modifications seront appliquees au dossier patient."
      : "Les habitudes seront enregistrees dans le dossier patient.";

    const ok = await confirmAction(action, detail);
    if (!ok) {
      setHabitudeId(lastSavedHabitudeId);
      setTabagisme(lastSavedTabagisme);
      setAlcoolemie(lastSavedAlcoolemie);
      setToxicomanie(lastSavedToxicomanie);
      setActivitePhysique(lastSavedActivitePhysique);
      toast.info("Operation annulee");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        tabagisme,
        alcoolemie,
        toxicomanie,
        activite_physique: activitePhysique,
      };

      if (habitudeId) {
        await updateHabitudeDeVie(habitudeId, payload);
        setLastSavedHabitudeId(habitudeId);
        setLastSavedTabagisme(tabagisme);
        setLastSavedAlcoolemie(alcoolemie);
        setLastSavedToxicomanie(toxicomanie);
        setLastSavedActivitePhysique(activitePhysique);
        toast.success("Habitudes mises a jour");
      } else {
        const res = await createHabitudeDeVie({ ...payload, examen_clinique_id: examenId });
        const createdId = res?.habitude?.id ?? null;

        setHabitudeId(createdId);
        setLastSavedHabitudeId(createdId);
        setLastSavedTabagisme(tabagisme);
        setLastSavedAlcoolemie(alcoolemie);
        setLastSavedToxicomanie(toxicomanie);
        setLastSavedActivitePhysique(activitePhysique);
        toast.success("Habitudes enregistrees");
      }
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className={PAGE_CONTAINER_CLASS}>
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
        <h6 className="mb-3 ec-habitudes-title">Habitudes de vie</h6>

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
                  onChange={(val) => {
                    if (key === "tabagisme") setTabagisme(val);
                    else if (key === "alcoolemie") setAlcoolemie(val);
                    else if (key === "toxicomanie") setToxicomanie(val);
                    else setActivitePhysique(val);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
