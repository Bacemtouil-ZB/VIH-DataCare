import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import {
  createHabitudeDeVie,
  getHabitudeDeVieByNumeroDossier,
  updateHabitudeDeVie,
} from "../../../services/habitudeDeVieService";
import ToggleSwitch from "../../../components/buttons/Toggleswitch";
import { PAGE_BG, Spinner } from "./ExamenComponents";

const CHAMPS = [
  { key: "tabagisme",         label: "Tabagisme"         },
  { key: "alcoolemie",        label: "Alcoolémie"        },
  { key: "toxicomanie",       label: "Toxicomanie"       },
  { key: "activite_physique", label: "Activité physique" },
];

const FORM_INITIALE = {
  tabagisme:         false,
  alcoolemie:        false,
  toxicomanie:       false,
  activite_physique: false,
};

export default function HabitudesPage() {
  const { examenId, patientNumero } = useOutletContext();

  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [habitudeId, setHabitudeId] = useState(null);
  const [form,       setForm]       = useState({ ...FORM_INITIALE });

  useEffect(() => {
    if (!patientNumero) return;
    loadHabitude();
  }, [examenId, patientNumero]);

  const loadHabitude = async () => {
    setLoading(true);
    try {
      const response  = await getHabitudeDeVieByNumeroDossier(patientNumero);
      const habitudes = response?.habitudes ?? [];
      if (habitudes.length > 0) {
        const derniere = habitudes[0];
        setHabitudeId(derniere.id);
        setForm({
          tabagisme:         derniere.tabagisme         ?? false,
          alcoolemie:        derniere.alcoolemie        ?? false,
          toxicomanie:       derniere.toxicomanie       ?? false,
          activite_physique: derniere.activite_physique ?? false,
        });
      }
    } catch (err) {
      console.error("Erreur chargement habitudes:", err);
      toast.error("Erreur lors du chargement des habitudes");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (habitudeId) {
        await updateHabitudeDeVie(habitudeId, form);
        toast.success("Habitudes de vie mises à jour avec succès");
      } else {
        const response = await createHabitudeDeVie({ ...form, examen_clinique_id: examenId });
        setHabitudeId(response?.habitude?.id ?? null);
        toast.success("Habitudes de vie enregistrées avec succès");
      }
      await loadHabitude();
    } catch (err) {
      console.error("Erreur enregistrement:", err);
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div style={PAGE_BG}>

      {/* ✅ Même structure que PageHeader dans ExamenComponents */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h6 className="mb-0 fw-bold text-dark" style={{ fontSize: "1rem" }}>
          <i className="bi bi-activity me-2" style={{ color: "#2e7d52" }}></i>
          Habitudes de vie
        </h6>
        <button
          className="btn btn-sm fw-semibold text-white d-flex align-items-center gap-2"
          style={{ background: "#2e7d52", borderRadius: 9, boxShadow: "0 2px 8px rgba(46,125,82,0.25)" }}
          onClick={handleSave}
          disabled={saving}
        >
          {saving
            ? <><span className="spinner-border spinner-border-sm"></span><span>Enregistrement...</span></>
            : <><i className="bi bi-check-lg"></i>{habitudeId ? "Modifier" : "Enregistrer"}</>}
        </button>
      </div>

      {/* Formulaire */}
      <div className="card mb-4">
        <div className="card-header" style={{ backgroundColor: "#1e40af", color: "white" }}>
          <h5 className="mb-0">Habitudes de vie</h5>
        </div>
        <div className="card-body">
          <div className="row g-4">
            {CHAMPS.map((champ) => (
              <div key={champ.key} className="col-md-6">
                <div className="border rounded p-3 d-flex align-items-center justify-content-between"
                  style={{ background: "#fafafa" }}>
                  <span className="fw-semibold" style={{ fontSize: 15 }}>{champ.label}</span>
                  <ToggleSwitch
                    value={form[champ.key]}
                    onChange={(val) => setForm((prev) => ({ ...prev, [champ.key]: val }))}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}