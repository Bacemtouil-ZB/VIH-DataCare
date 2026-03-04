import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAction } from "../../../../../shared/utils/uiAlerts";
import { createHabitudeDeVie, getHabitudeDeVieByNumeroDossier, updateHabitudeDeVie } from "../../../services/examenCliniqueServices/habitudeDeVieService";
import ToggleSwitch from "../../../components/forms/ToggleSwitch";
import { HABITUDES_CHAMPS, HABITUDES_INIT } from "./examenConfig";
import { PAGE_BG, STYLES, PageHeader, BoutonSauvegarder, Spinner } from "./ExamenComponents";

export default function HabitudesPage() {
  const { examenId, patientNumero } = useOutletContext(); // ??
  const [ui,   setUi]   = useState({ loading: true, saving: false });
  const [form, setForm] = useState({ habitudeId: null, ...HABITUDES_INIT });
  const [lastSaved, setLastSaved] = useState({ habitudeId: null, ...HABITUDES_INIT });

  const patchUi   = (p) => setUi  ((s) => ({ ...s, ...p }));
  const patchForm = (p) => setForm((s) => ({ ...s, ...p }));

  useEffect(() => {
    if (!patientNumero) return;
    (async () => {
      patchUi({ loading: true });
      try {
        const res = await getHabitudeDeVieByNumeroDossier(patientNumero);
        const h   = res?.habitudes?.[0];
        if (h?.id) {
          const loadedState = {
            habitudeId:        h.id,
            tabagisme:         h.tabagisme         ?? false,
            alcoolemie:        h.alcoolemie        ?? false,
            toxicomanie:       h.toxicomanie       ?? false,
            activite_physique: h.activite_physique ?? false,
          };
          setForm(loadedState);
          setLastSaved(loadedState);
        } else {
          const emptyState = { habitudeId: null, ...HABITUDES_INIT };
          setForm(emptyState);
          setLastSaved(emptyState);
        }
      } catch { toast.error("Erreur lors du chargement"); }
      finally  { patchUi({ loading: false }); }
    })();
  }, [patientNumero]);

  const handleSave = async () => {
    const action = form.habitudeId ? "Modifier les habitudes de vie ?" : "Enregistrer les habitudes de vie ?";
    const detail = form.habitudeId ? "Les modifications seront appliquees au dossier patient." : "Les habitudes seront enregistrees dans le dossier patient.";
    const ok = await confirmAction(action, detail);
    if (!ok) {
      setForm(lastSaved);
      toast.info("Operation annulee");
      return;
    }

    patchUi({ saving: true });
    try {
      const payload = {
        tabagisme:         form.tabagisme,
        alcoolemie:        form.alcoolemie,
        toxicomanie:       form.toxicomanie,
        activite_physique: form.activite_physique,
      };

      if (form.habitudeId) {
        await updateHabitudeDeVie(form.habitudeId, payload);
        setLastSaved({ habitudeId: form.habitudeId, ...payload });
        toast.success("Habitudes mises a jour");
      } else {
        const res = await createHabitudeDeVie({ ...payload, examen_clinique_id: examenId });
        const createdId = res?.habitude?.id ?? null;
        patchForm({ habitudeId: createdId });
        setLastSaved({ habitudeId: createdId, ...payload });
        toast.success("Habitudes enregistrees");
      }
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      patchUi({ saving: false });
    }
  };

  if (ui.loading) return <Spinner />;

  return (
    <div style={PAGE_BG}>
      <PageHeader
        actionButton={
          <BoutonSauvegarder saving={ui.saving} isModifying={!!form.habitudeId} onClick={handleSave} />
        }
      />

      {/* Bloc blanc avec titre à l'intérieur */}
      <div className="bg-white border rounded p-3 mb-4">
        {/* Titre Habitudes de vie - SANS BORDURE */}
        <h6 className="mb-3" style={{ 
          color: "#6e6d6d", 
          fontWeight: 700, 
          fontSize: "0.95rem", 
          paddingBottom: 10,
        }}>
          Habitudes de vie
        </h6>

        {/* Contenu avec 3 TOGGLES PAR LIGNE */}
        <div className="row g-3">
          {HABITUDES_CHAMPS.map(({ key, label }) => (
            <div key={key} className="col-md-4">
                <div className="ec-habitude-toggle" style={STYLES.habCard}>

                <ToggleSwitch
                  id={`habitude-${key}`}
                  label={label}
                  checked={form[key]}
                  onChange={(val) => patchForm({ [key]: val })}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

