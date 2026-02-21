import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Swal from "sweetalert2";
import {
  createSigneClinique,
  updateSigneClinique,
  getSigneCliniqueByExamenId,
  getSigneCliniqueByNumeroDossier,
} from "../../../services/signeCliniqueService";
import { getAppareils } from "../../../services/signesFonctionService";

/**
 * ==========================================
 * SIGNES CLINIQUES - COMPLET ET FONCTIONNEL
 * ✅ Historique avec toutes les données
 * ✅ Modification fonctionnelle
 * ✅ SweetAlert2
 * ==========================================
 */

const GreenHeader = ({ title }) => (
  <div className="px-3 py-2 fw-bold text-white" style={{ background: "#2e7d52" }}>
    {title}
  </div>
);

function calcIMC(t, p) {
  const v = p / Math.pow(t / 100, 2);
  if (v < 18.5) return { val: v.toFixed(1), label: "Insuffisance pondérale", cls: "text-info" };
  if (v < 25)   return { val: v.toFixed(1), label: "Poids normal", cls: "text-success" };
  if (v < 30)   return { val: v.toFixed(1), label: "Surpoids", cls: "text-warning" };
  return { val: v.toFixed(1), label: "Obésité", cls: "text-danger" };
}

export default function SignesCliniques() {
  const { examenId, dateExamen, patientNumero } = useOutletContext();

  // États formulaire
  const [signeId, setSigneId] = useState(null);
  const [taille, setTaille] = useState("");
  const [poids, setPoids] = useState("");
  const [appareils, setAppareils] = useState([]);
  const [autresSignes, setAutresSignes] = useState([]);
  const [appareilSelectionne, setAppareilSelectionne] = useState("");
  const [descriptionSigne, setDescriptionSigne] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModifying, setIsModifying] = useState(false);
  const [modifyingExamenId, setModifyingExamenId] = useState(null);

  // États historique
  const [historique, setHistorique] = useState([]);
  const [showHistory, setShowHistory] = useState(true);

  const imc = taille && poids ? calcIMC(+taille, +poids) : null;

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
      // Charger appareils
      const appareilsResp = await getAppareils();
      if (appareilsResp.success) {
        setAppareils(appareilsResp.appareils || []);
      }

      // Charger signes cliniques pour CET examen
      const response = await getSigneCliniqueByExamenId(examenId);
      if (response.success && response.signe) {
        const sc = response.signe;
        setSigneId(sc.id);
        setTaille(sc.taille ?? "");
        setPoids(sc.poids ?? "");
        setModifyingExamenId(examenId);
      }
    } catch (e) {
      console.error("Erreur chargement:", e);
    }
  };

  const loadHistorique = async () => {
    try {
      const response = await getSigneCliniqueByNumeroDossier(patientNumero);
      if (response.success && response.signes) {
        setHistorique(response.signes);
      }
    } catch (e) {
      console.log("Pas d'historique");
    }
  };

  // ==========================================
  // ÉDITION DEPUIS HISTORIQUE
  // ==========================================

  const handleEdit = async (signe) => {
    const result = await Swal.fire({
      title: 'Modifier ce signe clinique ?',
      html: `
        <div style="text-align: left; padding: 10px;">
          <p><strong>Date:</strong> ${new Date(signe.date_examen).toLocaleDateString('fr-FR')}</p>
          <p><strong>Taille:</strong> ${signe.taille} cm</p>
          <p><strong>Poids:</strong> ${signe.poids} kg</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2e7d52',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Oui, modifier',
      cancelButtonText: 'Annuler'
    });

    if (result.isConfirmed) {
      // Charger les données dans le formulaire
      setTaille(signe.taille || "");
      setPoids(signe.poids || "");
      setSigneId(signe.id);
      setIsModifying(true);
      setModifyingExamenId(signe.examen_clinique_id);
      
      // Scroll vers le formulaire
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      await Swal.fire({
        icon: 'info',
        title: 'Mode modification',
        text: 'Les données ont été chargées. Modifiez-les puis cliquez sur "Enregistrer".',
        timer: 2500,
        showConfirmButton: false
      });
    }
  };

  // ==========================================
  // ANNULER MODIFICATION
  // ==========================================

  const handleCancelEdit = () => {
    setIsModifying(false);
    setModifyingExamenId(null);
    setSigneId(null);
    setTaille("");
    setPoids("");
    loadData(); // Recharger les données de l'examen courant
  };

  // ==========================================
  // AUTRES SIGNES
  // ==========================================

  const ajouterAutreSigne = () => {
    if (!appareilSelectionne) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez sélectionner un appareil'
      });
      return;
    }
    if (!descriptionSigne.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez saisir une description'
      });
      return;
    }

    const appareilObj = appareils.find(a => a.id === parseInt(appareilSelectionne));
    if (!appareilObj) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Appareil non trouvé'
      });
      return;
    }

    setAutresSignes([
      ...autresSignes,
      {
        id: Date.now(),
        appareil_id: appareilObj.id,
        appareil: appareilObj.libelle,
        description: descriptionSigne,
      }
    ]);
    
    setAppareilSelectionne("");
    setDescriptionSigne("");
    
    Swal.fire({
      icon: 'success',
      title: 'Ajouté',
      text: 'Signe ajouté avec succès',
      timer: 1500,
      showConfirmButton: false
    });
  };

  const supprimerAutreSigne = async (id) => {
    const result = await Swal.fire({
      title: 'Supprimer ce signe ?',
      text: "Cette action est irréversible",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    });

    if (result.isConfirmed) {
      setAutresSignes(autresSignes.filter(s => s.id !== id));
      Swal.fire({
        icon: 'success',
        title: 'Supprimé',
        text: 'Signe supprimé',
        timer: 1500,
        showConfirmButton: false
      });
    }
  };

  // ==========================================
  // ENREGISTREMENT
  // ==========================================

  const handleEnregistrer = async () => {
    if (!taille || !poids) {
      Swal.fire({
        icon: 'error',
        title: 'Champs manquants',
        text: 'Veuillez renseigner la taille et le poids'
      });
      return;
    }
    
    setLoading(true);

    try {
      const targetExamenId = isModifying ? modifyingExamenId : examenId;
      
      const payload = {
        examen_clinique_id: targetExamenId,
        taille: +taille,
        poids: +poids,
        imc: imc?.val,
      };

      if (signeId) {
        // UPDATE
        await updateSigneClinique(signeId, payload);
        await Swal.fire({
          icon: 'success',
          title: 'Mise à jour réussie',
          text: 'Signes cliniques mis à jour avec succès',
          confirmButtonColor: '#2e7d52'
        });
      } else {
        // CREATE
        const response = await createSigneClinique(payload);
        setSigneId(response.signe?.id);
        await Swal.fire({
          icon: 'success',
          title: 'Enregistrement réussi',
          text: 'Signes cliniques enregistrés avec succès',
          confirmButtonColor: '#2e7d52'
        });
      }

      // Réinitialiser le mode modification
      setIsModifying(false);
      setModifyingExamenId(null);

      // Recharger historique et données
      await loadHistorique();
      await loadData();
    } catch (e) {
      console.error("Erreur:", e);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: e?.message || 'Erreur lors de l\'enregistrement'
      });
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // RENDU
  // ==========================================

  return (
    <div className="p-4" style={{ background: "#f5f6fa" }}>

      {/* Info examen */}
      <div className={`alert ${isModifying ? 'alert-warning' : 'alert-info'} mb-4`}>
        <i className="bi bi-info-circle me-2"></i>
        {isModifying ? (
          <>
            <strong>MODE MODIFICATION</strong> - Vous modifiez un signe clinique existant
            <button 
              className="btn btn-sm btn-outline-danger ms-3"
              onClick={handleCancelEdit}
            >
              <i className="bi bi-x-circle me-1"></i>
              Annuler
            </button>
          </>
        ) : (
          <>
            <strong>Examen ID:</strong> {examenId} • 
            <strong> Date:</strong> {new Date(dateExamen).toLocaleDateString('fr-FR')} •
            <strong> Patient:</strong> {patientNumero}
          </>
        )}
      </div>

      {/* HISTORIQUE COMPLET */}
      {historique.length > 0 && (
        <div className="bg-white border rounded mb-4">
          <div 
            className="px-3 py-2 d-flex justify-content-between align-items-center"
            style={{ background: "#1e40af", color: "white", cursor: "pointer" }}
            onClick={() => setShowHistory(!showHistory)}
          >
            <span className="fw-bold">
              <i className="bi bi-clock-history me-2"></i>
              Historique des signes cliniques ({historique.length})
            </span>
            <i className={`bi bi-chevron-${showHistory ? 'up' : 'down'}`}></i>
          </div>

          {showHistory && (
            <div className="p-3">
              <div className="table-responsive">
                <table className="table table-hover table-sm">
                  <thead className="table-light">
                    <tr>
                      <th>Date</th>
                      <th>Taille (cm)</th>
                      <th>Poids (kg)</th>
                      <th>IMC</th>
                      <th>Appareils / Signes</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historique.map((signe) => {
                      const signeIMC = signe.taille && signe.poids ? 
                        calcIMC(signe.taille, signe.poids) : null;
                      
                      return (
                        <tr key={signe.id}>
                          <td style={{ minWidth: '100px' }}>
                            {signe.date_examen ? 
                              new Date(signe.date_examen).toLocaleDateString('fr-FR') : 
                              'N/A'}
                          </td>
                          <td>
                            <span className="badge bg-primary">{signe.taille || 'N/A'}</span>
                          </td>
                          <td>
                            <span className="badge bg-success">{signe.poids || 'N/A'}</span>
                          </td>
                          <td>
                            {signeIMC ? (
                              <div>
                                <span className={`fw-bold ${signeIMC.cls}`}>
                                  {signeIMC.val}
                                </span>
                                <br/>
                                <small className={signeIMC.cls}>{signeIMC.label}</small>
                              </div>
                            ) : 'N/A'}
                          </td>
                          <td style={{ maxWidth: '300px' }}>
                            {signe.autres_signes && signe.autres_signes.length > 0 ? (
                              <div>
                                {signe.autres_signes.map((as, idx) => (
                                  <div key={idx} className="mb-1">
                                    <span className="badge bg-info me-1">{as.appareil}</span>
                                    <small>{as.description}</small>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-muted">Aucun</span>
                            )}
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleEdit(signe)}
                              title="Modifier"
                            >
                              <i className="bi bi-pencil me-1"></i>
                              Modifier
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Signes cliniques */}
      <div className="bg-white border rounded mb-4">
        <GreenHeader title="Signes cliniques" />
        <div className="p-3 row g-3">
          <div className="col-md-4">
            <label className="form-label fw-bold">
              Taille (cm) <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              className="form-control"
              placeholder="ex: 175"
              value={taille}
              onChange={e => setTaille(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-bold">
              Poids (kg) <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              className="form-control"
              placeholder="ex: 70"
              value={poids}
              onChange={e => setPoids(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-bold">IMC (kg/m²)</label>
            <div
              className="form-control d-flex align-items-center gap-2"
              style={{ background: "#f8faf9" }}
            >
              {imc ? (
                <>
                  <span className={`fw-bold ${imc.cls}`}>{imc.val}</span>
                  <small className={imc.cls}>{imc.label}</small>
                </>
              ) : (
                <small className="text-muted">Saisissez taille et poids</small>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Autres signes */}
      <div className="bg-white border rounded mb-4">
        <div className="px-3 py-2 fw-bold text-white" style={{ background: "#4a90e2" }}>
          Autres signes cliniques
        </div>
        <div className="p-3">
          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <label className="form-label fw-bold">Appareil</label>
              <select
                className="form-select"
                value={appareilSelectionne}
                onChange={e => setAppareilSelectionne(e.target.value)}
              >
                <option value="">Sélectionnez un appareil</option>
                {appareils.map(app => (
                  <option key={app.id} value={app.id}>
                    {app.libelle}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Description</label>
              <input
                type="text"
                className="form-control"
                placeholder="Décrivez les détails..."
                value={descriptionSigne}
                onChange={e => setDescriptionSigne(e.target.value)}
              />
            </div>
            <div className="col-md-2 d-flex align-items-end">
              <button
                className="btn w-100"
                style={{ backgroundColor: "rgb(59 130 246 / 0.5)", color: "white" }}
                onClick={ajouterAutreSigne}
              >
                <i className="bi bi-plus-lg me-1"></i>
                Ajouter
              </button>
            </div>
          </div>

          {autresSignes.length > 0 && (
            <div className="table-responsive">
              <table className="table table-sm table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Appareil</th>
                    <th>Description</th>
                    <th width="80">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {autresSignes.map(signe => (
                    <tr key={signe.id}>
                      <td>
                        <span className="badge bg-info">{signe.appareil}</span>
                      </td>
                      <td>{signe.description}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => supprimerAutreSigne(signe.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Bouton Enregistrer */}
      <button
        className="btn w-100 text-white fw-bold py-2"
        style={{ background: isModifying ? "#f59e0b" : "#2e7d52" }}
        onClick={handleEnregistrer}
        disabled={loading}
      >
        {loading ? "Enregistrement..." : isModifying ? "✓ Enregistrer les modifications" : "✓ Enregistrer la fiche"}
      </button>

    </div>
  );
}