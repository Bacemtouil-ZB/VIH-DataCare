import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAction } from "../../../../../shared/utils/uiAlerts";
import { createHabitudeDeVie, getHabitudeDeVieByNumeroDossier, updateHabitudeDeVie } from "../../../services/examenCliniqueServices/habitudeDeVieService";
import ToggleSwitch from "../../../components/buttons/Toggleswitch";
import { HABITUDES_CHAMPS, HABITUDES_INIT } from "./examenConfig";
import { PAGE_BG, STYLES, PageHeader, SectionHeader, BoutonSauvegarder, Spinner } from "./ExamenComponents";

export default function HabitudesPage() {
  const { examenId, patientNumero } = useOutletContext();
  const [ui,   setUi]   = useState({ loading: true, saving: false });
  const [form, setForm] = useState({ habitudeId: null, ...HABITUDES_INIT });

  const patchUi   = (p) => setUi  ((s) => ({ ...s, ...p }));
  const patchForm = (p) => setForm((s) => ({ ...s, ...p }));

  useEffect(() => {
    if (!patientNumero) return;
    (async () => {
      patchUi({ loading: true });
      try {
        const res = await getHabitudeDeVieByNumeroDossier(patientNumero);
        const h   = res?.habitudes?.[0];
        if (h?.id) patchForm({
          habitudeId:        h.id,
          tabagisme:         h.tabagisme         ?? false,
          alcoolemie:        h.alcoolemie        ?? false,
          toxicomanie:       h.toxicomanie       ?? false,
          activite_physique: h.activite_physique ?? false,
        });
      } catch { toast.error("Erreur lors du chargement"); }
      finally  { patchUi({ loading: false }); }
    })();
  }, [patientNumero]);

  const handleSave = async () => {
    const action = form.habitudeId ? "Modifier les habitudes de vie ?" : "Enregistrer les habitudes de vie ?";
    const detail = form.habitudeId ? "Les modifications seront appliquées au dossier patient." : "Les habitudes seront enregistrées dans le dossier patient.";
    const ok = await confirmAction(action, detail);
    if (!ok) { toast.info("Opération annulée"); return; }
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
        toast.success("Habitudes mises à jour");
      } else {
        const res = await createHabitudeDeVie({ ...payload, examen_clinique_id: examenId });
        patchForm({ habitudeId: res?.habitude?.id ?? null });
        toast.success("Habitudes enregistrées");
      }
    } catch { toast.error("Erreur lors de l'enregistrement"); }
    finally { patchUi({ saving: false }); }
  };

  if (ui.loading) return <Spinner />;

  return (
    <div style={PAGE_BG}>
      <PageHeader
        actionButton={
          <BoutonSauvegarder saving={ui.saving} isModifying={!!form.habitudeId} onClick={handleSave} />
        }
      />
 <SectionHeader title="Habitudes de vie" />
      {/* Contenu */}
      <div className="bg-white border border-top-0 rounded-bottom p-3 mb-4">
        <div className="row g-4">
          {HABITUDES_CHAMPS.map(({ key, label }) => (
            <div key={key} className="col-md-6">
              <div className="border rounded p-3 d-flex align-items-center justify-content-between"
                style={STYLES.habCard}>
                <span className="fw-semibold" style={STYLES.habLabel}>{label}</span>
                <ToggleSwitch value={form[key]} onChange={(val) => patchForm({ [key]: val })} />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}