import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Swal from "sweetalert2";
import {
  createHabitudeDeVie,
  getHabitudeDeVieByNumeroDossier,
  updateHabitudeDeVie,
} from "../../../services/habitudeDeVieService";

/**
 * ==========================================
 * HABITUDES DE VIE - THEME UNIFIÉ
 * Même style que Signes Cliniques/Fonctionnels
 * ==========================================
 */

const CHAMPS = [
  { key: "tabagisme", label: "Tabagisme" },
  { key: "alcoolemie", label: "Alcoolémie" },
  { key: "toxicomanie", label: "Toxicomanie" },
  { key: "activite_physique", label: "Activité physique" },
];

export default function HabitudesPage() {
  const { examenId, dateExamen, patientNumero } = useOutletContext();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [habitudeId, setHabitudeId] = useState(null);

  const [form, setForm] = useState({
    tabagisme: false,
    alcoolemie: false,
    toxicomanie: false,
    activite_physique: false,
  });

  // Historique
  const [historique, setHistorique] = useState([]);
  const [showHistory, setShowHistory] = useState(true);

  // ==========================================
  // CHARGEMENT
  // ==========================================

  useEffect(() => {
    if (!examenId) return;
    loadData();
    loadHistorique();
  }, [examenId, patientNumero]);

  const loadData = async () => {
    try {
      setLoading(true);

      const response = await getHabitudeDeVieByNumeroDossier(patientNumero);
      const habitudes = response?.habitudes ?? [];

      if (habitudes.length > 0) {
        const derniere = habitudes[0];
        setHabitudeId(derniere.id);
        setForm({
          tabagisme: derniere.tabagisme ?? false,
          alcoolemie: derniere.alcoolemie ?? false,
          toxicomanie: derniere.toxicomanie ?? false,
          activite_physique: derniere.activite_physique ?? false,
        });
      }
    } catch (error) {
      console.error("Erreur chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadHistorique = async () => {
    try {
      const response = await getHabitudeDeVieByNumeroDossier(patientNumero);
      if (response?.habitudes) {
        setHistorique(response.habitudes);
      }
    } catch (e) {
      console.log("Pas d'historique");
    }
  };

  // ==========================================
  // ÉDITION
  // ==========================================

  const handleEdit = async (habitude) => {
    const result = await Swal.fire({
      title: 'Modifier cette habitude ?',
      text: `Date: ${new Date(habitude.date_examen).toLocaleDateString('fr-FR')}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2e7d52',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Oui, modifier',
      cancelButtonText: 'Annuler'
    });

    if (result.isConfirmed) {
      setForm({
        tabagisme: habitude.tabagisme ?? false,
        alcoolemie: habitude.alcoolemie ?? false,
        toxicomanie: habitude.toxicomanie ?? false,
        activite_physique: habitude.activite_physique ?? false,
      });
      setHabitudeId(habitude.id);

      window.scrollTo({ top: 0, behavior: 'smooth' });

      Swal.fire({
        icon: 'info',
        title: 'Modification en cours',
        text: 'Les données ont été chargées',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  // ==========================================
  // TOGGLE
  // ==========================================

  const toggle = (key) => {
    setForm(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // ==========================================
  // ENREGISTREMENT
  // ==========================================

  const handleSave = async () => {
    setSaving(true);

    try {
      if (habitudeId) {
        await updateHabitudeDeVie(habitudeId, form);
        await Swal.fire({
          icon: 'success',
          title: 'Mise à jour réussie',
          text: 'Habitudes de vie mises à jour',
          confirmButtonColor: '#2e7d52'
        });
      } else {
        const response = await createHabitudeDeVie({
          ...form,
          examen_clinique_id: examenId,
        });
        setHabitudeId(response?.habitude?.id ?? null);
        await Swal.fire({
          icon: 'success',
          title: 'Enregistrement réussi',
          text: 'Habitudes de vie enregistrées',
          confirmButtonColor: '#2e7d52'
        });
      }

      await loadHistorique();
    } catch (error) {
      console.error("Erreur:", error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Erreur lors de l\'enregistrement'
      });
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // RENDU
  // ==========================================

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <div className="spinner-border text-primary">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">

      {/* Info examen */}
      <div className="alert alert-info mb-4">
        <i className="bi bi-info-circle me-2"></i>
        <strong>Examen ID:</strong> {examenId} • 
        <strong> Date:</strong> {new Date(dateExamen).toLocaleDateString('fr-FR')} •
        <strong> Patient:</strong> {patientNumero}
      </div>

      {/* HISTORIQUE */}
      {historique.length > 0 && (
        <div className="card mb-4">
          <div 
            className="card-header d-flex justify-content-between align-items-center"
            style={{ background: "#1e40af", color: "white", cursor: "pointer" }}
            onClick={() => setShowHistory(!showHistory)}
          >
            <span className="fw-bold">
              <i className="bi bi-clock-history me-2"></i>
              Historique des habitudes de vie ({historique.length})
            </span>
            <i className={`bi bi-chevron-${showHistory ? 'up' : 'down'}`}></i>
          </div>

          {showHistory && (
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover table-sm">
                  <thead className="table-light">
                    <tr>
                      <th>Date</th>
                      <th>Tabagisme</th>
                      <th>Alcoolémie</th>
                      <th>Toxicomanie</th>
                      <th>Activité physique</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historique.map((habitude) => (
                      <tr key={habitude.id}>
                        <td style={{ minWidth: '100px' }}>
                          {habitude.date_examen ? 
                            new Date(habitude.date_examen).toLocaleDateString('fr-FR') : 
                            'N/A'}
                        </td>
                        <td>
                          <span className={`badge ${habitude.tabagisme ? 'bg-warning' : 'bg-secondary'}`}>
                            {habitude.tabagisme ? 'Oui' : 'Non'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${habitude.alcoolemie ? 'bg-warning' : 'bg-secondary'}`}>
                            {habitude.alcoolemie ? 'Oui' : 'Non'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${habitude.toxicomanie ? 'bg-danger' : 'bg-secondary'}`}>
                            {habitude.toxicomanie ? 'Oui' : 'Non'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${habitude.activite_physique ? 'bg-success' : 'bg-secondary'}`}>
                            {habitude.activite_physique ? 'Oui' : 'Non'}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEdit(habitude)}
                          >
                            <i className="bi bi-pencil me-1"></i>
                            Modifier
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
        <div className="card-header" style={{ backgroundColor: '#8b5cf6', color: 'white' }}>
          <h5 className="mb-0">Habitudes de vie</h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            {CHAMPS.map((champ) => (
              <div key={champ.key} className="col-md-6">
                <div className="border rounded p-3">
                  <label className="form-label fw-bold mb-2">
                    {champ.label}
                  </label>
                  <div className="d-flex gap-2">
                    <button
                      className={`btn btn-sm flex-fill ${form[champ.key] === true ? 'btn-success' : 'btn-outline-success'}`}
                      onClick={() => toggle(champ.key)}
                    >
                      Oui
                    </button>
                    <button
                      className={`btn btn-sm flex-fill ${form[champ.key] === false ? 'btn-danger' : 'btn-outline-danger'}`}
                      onClick={() => toggle(champ.key)}
                    >
                      Non
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Résumé */}
      <div className="card mb-4">
        <div className="card-header bg-light">
          <h6 className="mb-0">Résumé</h6>
        </div>
        <div className="card-body">
          <div className="row g-2">
            {CHAMPS.map((champ) => (
              <div key={champ.key} className="col-md-6">
                <div className="d-flex align-items-center">
                  <span className={`badge ${form[champ.key] ? 'bg-success' : 'bg-secondary'} me-2`}>
                    {form[champ.key] ? '✓' : '✗'}
                  </span>
                  <span className="text-sm">{champ.label}</span>
                  <span className="ms-auto fw-bold">
                    {form[champ.key] ? 'Oui' : 'Non'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bouton Enregistrer */}
      <div className="text-end">
        <button
          className="btn btn-lg px-5"
          style={{ backgroundColor: '#8b5cf6', color: 'white' }}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Enregistrement...
            </>
          ) : (
            <>
              <i className="bi bi-check-circle me-2"></i>
              Enregistrer
            </>
          )}
        </button>
      </div>
    </div>
  );
}