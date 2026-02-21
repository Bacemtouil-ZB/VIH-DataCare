import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  getAppareils,
  getSignesByExamen,
  getSignesByPatient,
  createSignesFonctionnels,
  updateSignesFonctionnels,
} from '../../../services/signesFonctionService';

/**
 * ==========================================
 * SIGNES FONCTIONNELS - COMPLET ET FONCTIONNEL
 * ✅ Historique avec noms des signes positifs
 * ✅ Modification fonctionnelle
 * ✅ SweetAlert2
 * ==========================================
 */

const SignesFonctionnels = () => {
  const { examenId, dateExamen, patientNumero } = useOutletContext();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rasChecked, setRasChecked] = useState(false);
  const [signesId, setSignesId] = useState(null);
  const [isModifying, setIsModifying] = useState(false);
  const [modifyingExamenId, setModifyingExamenId] = useState(null);
  
  const [appareils, setAppareils] = useState([]);
  
  const [signes, setSignes] = useState({
    fievre: false,
    toux: false,
    dyspnee: false,
    sueurs_nocturnes: false,
    cephalee: false,
    rhinorrhee: false,
    troubles_visuels: false,
    diarrhee: false,
    douleurs_abdomen: false,
    anorexie: false,
    nausees: false,
    insomnie: false,
    dysphagie: false,
    prurit: false,
    paresthesie: false,
    myalgie: false,
    arthralgie: false,
    crampes: false,
    troubles_humeur: false,
    troubles_libido: false,
    asthenie: false,
  });

  const labelSignes = {
    fievre: 'Fièvre',
    toux: 'Toux',
    dyspnee: 'Dyspnée',
    sueurs_nocturnes: 'Sueurs nocturnes',
    cephalee: 'Céphalée',
    rhinorrhee: 'Rhinorrhée',
    troubles_visuels: 'Troubles visuels',
    diarrhee: 'Diarrhée',
    douleurs_abdomen: 'Douleurs abdomen',
    anorexie: 'Anorexie',
    nausees: 'Nausées',
    insomnie: 'Insomnie',
    dysphagie: 'Dysphagie',
    prurit: 'Prurit',
    paresthesie: 'Paresthésie',
    myalgie: 'Myalgie',
    arthralgie: 'Arthralgie',
    crampes: 'Crampes',
    troubles_humeur: 'Troubles humeur',
    troubles_libido: 'Troubles libido',
    asthenie: 'Asthénie',
  };

  const labelSignesUpper = {
    fievre: 'FIÈVRE',
    toux: 'TOUX',
    dyspnee: 'DYSPNÉE',
    sueurs_nocturnes: 'SUEURS NOCTURNES',
    cephalee: 'CÉPHALÉE',
    rhinorrhee: 'RHINORRHÉE',
    troubles_visuels: 'TROUBLES VISUELS',
    diarrhee: 'DIARRHÉE',
    douleurs_abdomen: 'DOULEURS ABDOMEN',
    anorexie: 'ANOREXIE',
    nausees: 'NAUSÉES',
    insomnie: 'INSOMNIE',
    dysphagie: 'DYSPHAGIE',
    prurit: 'PRURIT',
    paresthesie: 'PARESTHÉSIE',
    myalgie: 'MYALGIE',
    arthralgie: 'ARTHRALGIE',
    crampes: 'CRAMPES',
    troubles_humeur: 'TROUBLES HUMEUR',
    troubles_libido: 'TROUBLES LIBIDO',
    asthenie: 'ASTHÉNIE',
  };

  const [autresSignes, setAutresSignes] = useState([]);
  const [appareilSelectionne, setAppareilSelectionne] = useState('');
  const [descriptionSigne, setDescriptionSigne] = useState('');

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

      const appareilsResp = await getAppareils();
      if (appareilsResp.success) {
        setAppareils(appareilsResp.appareils || []);
      }

      const signesResp = await getSignesByExamen(examenId);
      if (signesResp.success && signesResp.signes && signesResp.signes.id) {
        const signesData = signesResp.signes;
        
        setSignesId(signesData.id);
        setSignes({
          fievre: signesData.fievre || false,
          toux: signesData.toux || false,
          dyspnee: signesData.dyspnee || false,
          sueurs_nocturnes: signesData.sueurs_nocturnes || false,
          cephalee: signesData.cephalee || false,
          rhinorrhee: signesData.rhinorrhee || false,
          troubles_visuels: signesData.troubles_visuels || false,
          diarrhee: signesData.diarrhee || false,
          douleurs_abdomen: signesData.douleurs_abdomen || false,
          anorexie: signesData.anorexie || false,
          nausees: signesData.nausees || false,
          insomnie: signesData.insomnie || false,
          dysphagie: signesData.dysphagie || false,
          prurit: signesData.prurit || false,
          paresthesie: signesData.paresthesie || false,
          myalgie: signesData.myalgie || false,
          arthralgie: signesData.arthralgie || false,
          crampes: signesData.crampes || false,
          troubles_humeur: signesData.troubles_humeur || false,
          troubles_libido: signesData.troubles_libido || false,
          asthenie: signesData.asthenie || false,
        });
        setRasChecked(signesData.ras || false);
        setModifyingExamenId(examenId);

        if (signesData.autres_signes) {
          setAutresSignes(signesData.autres_signes.map(as => ({
            id: as.id,
            appareil_id: as.appareil_id,
            appareil: as.appareil_libelle,
            description: as.description,
          })));
        }
      }
    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadHistorique = async () => {
    try {
      const response = await getSignesByPatient(patientNumero);
      if (response.success && response.signes) {
        setHistorique(response.signes);
      }
    } catch (e) {
      console.log("Pas d'historique");
    }
  };

  // ==========================================
  // RÉCUPÉRER NOMS DES SIGNES POSITIFS
  // ==========================================

  const getSignesPositifs = (signesData) => {
    if (!signesData) return [];
    
    const positifs = [];
    Object.keys(signesData).forEach(key => {
      if (key !== 'ras' && key !== 'id' && key !== 'examen_id' && 
          key !== 'examen_clinique_id' && key !== 'date_examen' && 
          key !== 'created_at' && key !== 'updated_at' &&
          signesData[key] === true) {
        positifs.push(labelSignes[key] || key);
      }
    });
    
    return positifs;
  };

  // ==========================================
  // ÉDITION
  // ==========================================

  const handleEdit = async (signe) => {
    const signesPositifs = getSignesPositifs(signe);
    
    const result = await Swal.fire({
      title: 'Modifier ce signe fonctionnel ?',
      html: `
        <div style="text-align: left; padding: 10px;">
          <p><strong>Date:</strong> ${new Date(signe.date_examen).toLocaleDateString('fr-FR')}</p>
          <p><strong>RAS:</strong> ${signe.ras ? 'Oui' : 'Non'}</p>
          ${signesPositifs.length > 0 ? `<p><strong>Signes positifs:</strong> ${signesPositifs.join(', ')}</p>` : ''}
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
      setSignes({
        fievre: signe.fievre || false,
        toux: signe.toux || false,
        dyspnee: signe.dyspnee || false,
        sueurs_nocturnes: signe.sueurs_nocturnes || false,
        cephalee: signe.cephalee || false,
        rhinorrhee: signe.rhinorrhee || false,
        troubles_visuels: signe.troubles_visuels || false,
        diarrhee: signe.diarrhee || false,
        douleurs_abdomen: signe.douleurs_abdomen || false,
        anorexie: signe.anorexie || false,
        nausees: signe.nausees || false,
        insomnie: signe.insomnie || false,
        dysphagie: signe.dysphagie || false,
        prurit: signe.prurit || false,
        paresthesie: signe.paresthesie || false,
        myalgie: signe.myalgie || false,
        arthralgie: signe.arthralgie || false,
        crampes: signe.crampes || false,
        troubles_humeur: signe.troubles_humeur || false,
        troubles_libido: signe.troubles_libido || false,
        asthenie: signe.asthenie || false,
      });
      setRasChecked(signe.ras || false);
      setSignesId(signe.id);
      setIsModifying(true);
      setModifyingExamenId(signe.examen_id || signe.examen_clinique_id);

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
    loadData();
  };

  // ==========================================
  // GESTION RAS
  // ==========================================

  const handleRAS = (checked) => {
    setRasChecked(checked);
    if (checked) {
      const nouveauxSignes = {};
      Object.keys(signes).forEach(key => {
        nouveauxSignes[key] = false;
      });
      setSignes(nouveauxSignes);
    }
  };

  const handleSigneChange = (signe, valeur) => {
    if (rasChecked) {
      Swal.fire({
        icon: 'warning',
        title: 'RAS activé',
        text: 'Désactivez RAS pour modifier les signes',
        timer: 2000
      });
      return;
    }
    setSignes({ ...signes, [signe]: valeur });
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

    setAutresSignes([...autresSignes, {
      id: Date.now(),
      appareil_id: appareilObj.id,
      appareil: appareilObj.libelle,
      description: descriptionSigne,
    }]);
    
    setAppareilSelectionne('');
    setDescriptionSigne('');
    
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

  const handleSave = async () => {
    setSaving(true);

    try {
      const targetExamenId = isModifying ? modifyingExamenId : examenId;
      
      const payload = {
        examen_clinique_id: targetExamenId,
        signes: {
          ...signes,
          ras: rasChecked,
        },
        autres_signes: autresSignes.map(as => ({
          appareil_id: as.appareil_id,
          description: as.description,
        })),
      };

      let response;
      if (signesId) {
        response = await updateSignesFonctionnels(targetExamenId, payload);
      } else {
        response = await createSignesFonctionnels(payload);
      }

      if (response.success) {
        await Swal.fire({
          icon: 'success',
          title: 'Enregistrement réussi',
          text: 'Signes fonctionnels enregistrés avec succès',
          confirmButtonColor: '#10b981'
        });
        
        setIsModifying(false);
        setModifyingExamenId(null);
        
        await loadData();
        await loadHistorique();
      }
    } catch (error) {
      console.error('Erreur:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.message || 'Erreur lors de l\'enregistrement'
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
      <div className={`alert ${isModifying ? 'alert-warning' : 'alert-info'} mb-4`}>
        <i className="bi bi-info-circle me-2"></i>
        {isModifying ? (
          <>
            <strong>MODE MODIFICATION</strong> - Vous modifiez un signe fonctionnel existant
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

      {/* HISTORIQUE AVEC NOMS */}
      {historique.length > 0 && (
        <div className="card mb-4">
          <div 
            className="card-header d-flex justify-content-between align-items-center"
            style={{ background: "#1e40af", color: "white", cursor: "pointer" }}
            onClick={() => setShowHistory(!showHistory)}
          >
            <span className="fw-bold">
              <i className="bi bi-clock-history me-2"></i>
              Historique des signes fonctionnels ({historique.length})
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
                      <th>Signes Positifs</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historique.map((signe) => {
                      const signesPositifs = getSignesPositifs(signe);
                      
                      return (
                        <tr key={signe.id}>
                          <td style={{ minWidth: '100px' }}>
                            {signe.date_examen ? 
                              new Date(signe.date_examen).toLocaleDateString('fr-FR') : 
                              'N/A'}
                          </td>
                          <td style={{ maxWidth: '500px' }}>
                            {signe.ras ? (
                              <span className="badge bg-success">RAS (Rien à signaler)</span>
                            ) : signesPositifs.length > 0 ? (
                              <div className="d-flex flex-wrap gap-1">
                                {signesPositifs.map((nom, idx) => (
                                  <span key={idx} className="badge bg-warning text-dark">
                                    {nom}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-muted">Aucun signe positif</span>
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

      {/* RAS */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="rasSwitch"
              checked={rasChecked}
              onChange={(e) => handleRAS(e.target.checked)}
              style={{ width: '3em', height: '1.5em' }}
            />
            <label className="form-check-label fw-bold fs-5" htmlFor="rasSwitch">
              RAS (Rien à Signaler)
            </label>
          </div>
        </div>
      </div>

      {/* Signes */}
      <div className="card mb-4">
        <div className="card-header" style={{ backgroundColor: '#e0f2fe' }}>
          <h5 className="mb-0">Signes fonctionnels</h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            {Object.keys(signes).map((signe) => (
              <div key={signe} className="col-md-4 col-lg-3">
                <div className="border rounded p-3">
                  <label className="form-label fw-bold mb-2 text-uppercase" style={{ fontSize: '0.85rem' }}>
                    {labelSignesUpper[signe]}
                  </label>
                  <div className="d-flex gap-2">
                    <button
                      className={`btn btn-sm flex-fill ${signes[signe] === true ? 'btn-success' : 'btn-outline-success'}`}
                      onClick={() => handleSigneChange(signe, true)}
                      disabled={rasChecked}
                    >
                      Oui
                    </button>
                    <button
                      className={`btn btn-sm flex-fill ${signes[signe] === false ? 'btn-danger' : 'btn-outline-danger'}`}
                      onClick={() => handleSigneChange(signe, false)}
                      disabled={rasChecked}
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

      {/* Autres signes */}
      <div className="card mb-4">
        <div className="card-header" style={{ backgroundColor: '#d1fae5' }}>
          <h5 className="mb-0">Autres signes fonctionnels</h5>
        </div>
        <div className="card-body">
          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <label className="form-label fw-bold">Appareil</label>
              <select
                className="form-select"
                value={appareilSelectionne}
                onChange={(e) => setAppareilSelectionne(e.target.value)}
              >
                <option value="">Sélectionnez un appareil</option>
                {appareils.map((app) => (
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
                onChange={(e) => setDescriptionSigne(e.target.value)}
              />
            </div>
            <div className="col-md-2 d-flex align-items-end">
              <button
                className="btn w-100"
                style={{ backgroundColor: 'rgb(59 130 246 / 0.5)', color: 'white' }}
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
                  {autresSignes.map((signe) => (
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
      <div className="text-end">
        <button
          className="btn btn-lg px-5"
          style={{ backgroundColor: isModifying ? '#f59e0b' : '#10b981', color: 'white' }}
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
              {isModifying ? 'Enregistrer les modifications' : 'Enregistrer'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SignesFonctionnels;