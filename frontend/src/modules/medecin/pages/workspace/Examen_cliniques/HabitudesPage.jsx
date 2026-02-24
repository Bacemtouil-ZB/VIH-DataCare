import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Swal from "sweetalert2";
import {
  createHabitudeDeVie,
  getHabitudeDeVieByNumeroDossier,
  updateHabitudeDeVie,
} from "../../../services/habitudeDeVieService";

// ─── ToggleSwitch ─────────────────────────────────────────────────────────────
// Interrupteur iOS-style : OFF (rouge) ←→ ON (vert)

const ToggleSwitch = ({ value, onChange }) => {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        display:       "inline-flex",
        alignItems:    "center",
        gap:           10,
        cursor:        "pointer",
        userSelect:    "none",
      }}
    >
      {/* Track */}
      <div
        style={{
          position:      "relative",
          width:         52,
          height:        28,
          borderRadius:  999,
          background:    value ? "#10b981" : "#d1d5db",
          transition:    "background 0.25s ease",
          flexShrink:    0,
        }}
      >
        {/* Thumb */}
        <div
          style={{
            position:     "absolute",
            top:          3,
            left:         value ? 27 : 3,
            width:        22,
            height:       22,
            borderRadius: "50%",
            background:   "#fff",
            boxShadow:    "0 1px 4px rgba(0,0,0,0.25)",
            transition:   "left 0.25s ease",
          }}
        />
      </div>

      {/* Label */}
      <span
        style={{
          fontSize:   14,
          fontWeight: 600,
          color:      value ? "#10b981" : "#6b7280",
          minWidth:   28,
          transition: "color 0.2s",
        }}
      >
        {value ? "Oui" : "Non"}
      </span>
    </div>
  );
};

// ─── Constantes ───────────────────────────────────────────────────────────────

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

// ─── Composant ────────────────────────────────────────────────────────────────

export default function HabitudesPage() {
  const { examenId, patientNumero } = useOutletContext();

  const [loading,     setLoading]     = useState(true);
  const [saving,      setSaving]      = useState(false);
  const [habitudeId,  setHabitudeId]  = useState(null);
  const [form,        setForm]        = useState({ ...FORM_INITIALE });
  const [historique,  setHistorique]  = useState([]);
  const [showHistory, setShowHistory] = useState(true);

  // ── Chargement ──────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!patientNumero) return;
    loadAll();
  }, [examenId, patientNumero]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const response  = await getHabitudeDeVieByNumeroDossier(patientNumero);
      const habitudes = response?.habitudes ?? [];
      setHistorique(habitudes);

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
    } finally {
      setLoading(false);
    }
  };

  // ── Édition depuis l'historique ─────────────────────────────────────────────

  const handleEdit = async (habitude) => {
    const result = await Swal.fire({
      title:             "Modifier cette habitude ?",
      text:              `Date : ${new Date(habitude.date_examen).toLocaleDateString("fr-FR")}`,
      icon:              "question",
      showCancelButton:  true,
      confirmButtonColor:"#2e7d52",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Oui, modifier",
      cancelButtonText:  "Annuler",
    });

    if (!result.isConfirmed) return;

    setForm({
      tabagisme:         habitude.tabagisme         ?? false,
      alcoolemie:        habitude.alcoolemie        ?? false,
      toxicomanie:       habitude.toxicomanie       ?? false,
      activite_physique: habitude.activite_physique ?? false,
    });
    setHabitudeId(habitude.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
    Swal.fire({ icon: "info", title: "Modification en cours", timer: 1500, showConfirmButton: false });
  };

  // ── Enregistrement ──────────────────────────────────────────────────────────

  const handleSave = async () => {
    setSaving(true);
    try {
      if (habitudeId) {
        await updateHabitudeDeVie(habitudeId, form);
        await Swal.fire({ icon: "success", title: "Mise à jour réussie", confirmButtonColor: "#2e7d52" });
      } else {
        const response = await createHabitudeDeVie({ ...form, examen_clinique_id: examenId });
        setHabitudeId(response?.habitude?.id ?? null);
        await Swal.fire({ icon: "success", title: "Enregistrement réussi", confirmButtonColor: "#2e7d52" });
      }
      await loadAll();
    } catch (err) {
      console.error("Erreur enregistrement:", err);
      Swal.fire({ icon: "error", title: "Erreur", text: "Erreur lors de l'enregistrement" });
    } finally {
      setSaving(false);
    }
  };

  // ── Rendu ───────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 300 }}>
        <div className="spinner-border text-primary">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">

      {/* Historique */}
      {historique.length > 0 && (
        <div className="card mb-4">
          <div
            className="card-header d-flex justify-content-between align-items-center"
            style={{ background: "#1e40af", color: "white", cursor: "pointer" }}
            onClick={() => setShowHistory((v) => !v)}
          >
            <span className="fw-bold">
              <i className="bi bi-clock-history me-2"></i>
              Historique des habitudes de vie ({historique.length})
            </span>
            <i className={`bi bi-chevron-${showHistory ? "up" : "down"}`}></i>
          </div>

          {showHistory && (
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover table-sm mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Date</th>
                      {CHAMPS.map((c) => <th key={c.key}>{c.label}</th>)}
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historique.map((h) => (
                      <tr key={h.id}>
                        <td style={{ minWidth: 100 }}>
                          {h.date_examen
                            ? new Date(h.date_examen).toLocaleDateString("fr-FR")
                            : "N/A"}
                        </td>
                        {CHAMPS.map((c) => (
                          <td key={c.key}>
                            <span className={`badge ${
                              c.key === "activite_physique"
                                ? h[c.key] ? "bg-success"  : "bg-secondary"
                                : c.key === "toxicomanie"
                                ? h[c.key] ? "bg-danger"   : "bg-secondary"
                                : h[c.key] ? "bg-warning"  : "bg-secondary"
                            }`}>
                              {h[c.key] ? "Oui" : "Non"}
                            </span>
                          </td>
                        ))}
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEdit(h)}
                          >
                            <i className="bi bi-pencil me-1"></i>Modifier
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Formulaire */}
      <div className="card mb-4">
        <div className="card-header" style={{ backgroundColor: "rgb(46, 125, 82", color: "white" }}>
          <h5 className="mb-0">Habitudes de vie</h5>
        </div>
        <div className="card-body">
          <div className="row g-4">
            {CHAMPS.map((champ) => (
              <div key={champ.key} className="col-md-6">
                <div
                  className="border rounded p-3 d-flex align-items-center justify-content-between"
                  style={{ background: "#fafafa" }}
                >
                  <span className="fw-semibold" style={{ fontSize: 15 }}>
                    {champ.label}
                  </span>
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

      {/* Bouton Enregistrer */}
      <div className="text-end">
        <button
          className="btn btn-lg px-5 rounded-pill"
          style={{ backgroundColor: "rgb(46, 125, 82", color: "white" }}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <><span className="spinner-border spinner-border-sm me-2" />Enregistrement...</>
          ) : (
            <><i className="bi bi-check-circle me-2" />Enregistrer</>
          )}
        </button>
      </div>

    </div>
  );
}