import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import {
  confirmAction,
  alertSuccess,
  alertError,
} from "../../../../../shared/utils/uiAlerts";
import {
  getAppareils, getSignesByExamen, getSignesByPatient,
  createSignesFonctionnels, updateSignesFonctionnels,
} from "../../../services/signesFonctionService";
import {
  PAGE_BG, LABEL_CLS, PageHeader, HistoriqueAccordeon, EmptyState,
  FormulaireWrapper, AutresSignesSection, BoutonEnregistrer, BtnModifier, Badge, Spinner,
} from "./ExamenComponents";

const SIGNES_KEYS = [
  "fievre","toux","dyspnee","sueurs_nocturnes","cephalee","rhinorrhee",
  "troubles_visuels","diarrhee","douleurs_abdomen","anorexie","nausees",
  "insomnie","dysphagie","prurit","paresthesie","myalgie","arthralgie",
  "crampes","troubles_humeur","troubles_libido","asthenie",
];
const LABELS = {
  fievre:"Fièvre", toux:"Toux", dyspnee:"Dyspnée", sueurs_nocturnes:"Sueurs nocturnes",
  cephalee:"Céphalée", rhinorrhee:"Rhinorrhée", troubles_visuels:"Troubles visuels",
  diarrhee:"Diarrhée", douleurs_abdomen:"Douleurs abdomen", anorexie:"Anorexie",
  nausees:"Nausées", insomnie:"Insomnie", dysphagie:"Dysphagie", prurit:"Prurit",
  paresthesie:"Paresthésie", myalgie:"Myalgie", arthralgie:"Arthralgie",
  crampes:"Crampes", troubles_humeur:"Troubles humeur", troubles_libido:"Troubles libido",
  asthenie:"Asthénie",
};
const SIGNES_INIT = Object.fromEntries(SIGNES_KEYS.map((k) => [k, false]));
const getSignesPositifs = (sd) => SIGNES_KEYS.filter((k) => sd?.[k] === true).map((k) => LABELS[k]);

export default function SignesFonctionnels() {
  const { examenId, patientNumero } = useOutletContext();

  const [loading,             setLoading]             = useState(true);
  const [saving,              setSaving]              = useState(false);
  const [showForm,            setShowForm]            = useState(false);
  const [isModifying,         setIsModifying]         = useState(false);
  const [modifyingExamenId,   setModifyingExamenId]   = useState(null);
  const [rasChecked,          setRasChecked]          = useState(false);
  const [signesId,            setSignesId]            = useState(null);
  const [appareils,           setAppareils]           = useState([]);
  const [signes,              setSignes]              = useState(SIGNES_INIT);
  const [autresSignes,        setAutresSignes]        = useState([]);
  const [appareilSelectionne, setAppareilSelectionne] = useState("");
  const [descriptionSigne,    setDescriptionSigne]    = useState("");
  const [historique,          setHistorique]          = useState([]);
  const [showHistory,         setShowHistory]         = useState(true);

  useEffect(() => { if (examenId)      loadData();      }, [examenId]);
  useEffect(() => { if (patientNumero) loadHistorique(); }, [patientNumero]);

  // ── Chargement examen courant ─────────────────────────────────────────────
  const loadData = async () => {
    try {
      setLoading(true);
      const [ar, sr] = await Promise.all([getAppareils(), getSignesByExamen(examenId)]);
      if (ar?.success) setAppareils(ar.appareils || []);
      const sd = sr?.signes;
      if (sd?.id) {
        setSignesId(sd.id);
        setSignes(Object.fromEntries(SIGNES_KEYS.map((k) => [k, sd[k] || false])));
        setRasChecked(sd.ras || false);
        setModifyingExamenId(examenId);
        if (sd.autres_signes) {
          setAutresSignes(sd.autres_signes.map((as) => ({
            id:          as.id,
            appareil_id: as.appareil_id,
            appareil:    as.appareil_libelle,
            description: as.description,
          })));
        }
      }
    } catch { /* silencieux */ }
    finally { setLoading(false); }
  };

  // ── Historique patient ────────────────────────────────────────────────────
  // ✅ FIX : le backend retourne maintenant seulement les examens AVEC signes (INNER JOIN)
  const loadHistorique = async () => {
    try {
      const res = await getSignesByPatient(patientNumero);
      setHistorique(Array.isArray(res?.signes) ? res.signes : []);
    } catch {
      setHistorique([]);
    }
  };

  // ── Reset formulaire ──────────────────────────────────────────────────────
  const resetForm = () => {
    setSignes(SIGNES_INIT); setRasChecked(false); setSignesId(null);
    setAutresSignes([]); setAppareilSelectionne(""); setDescriptionSigne("");
    setIsModifying(false); setModifyingExamenId(null);
  };

  const handleOpenForm = () => { resetForm(); setShowForm(true); };
  const handleCancel   = () => { setShowForm(false); resetForm(); toast.info("Opération annulée"); };

  // ── Modifier depuis historique ────────────────────────────────────────────
  const handleEdit = async (signe) => {
    const pos = getSignesPositifs(signe);
    const ok  = await confirmAction(
      "Modifier ce signe fonctionnel ?",
      `Date : ${new Date(signe.date_examen).toLocaleDateString("fr-FR")}${pos.length ? " — " + pos.slice(0, 4).join(", ") : ""}`
    );
    if (!ok) return;
    setSignes(Object.fromEntries(SIGNES_KEYS.map((k) => [k, signe[k] || false])));
    setRasChecked(signe.ras || false);
    setSignesId(signe.id);
    setIsModifying(true);
    setModifyingExamenId(signe.examen_id || signe.examen_clinique_id);
    // ✅ Pré-charger les autres signes existants
    setAutresSignes(
      (signe.autres_signes || []).map((as) => ({
        id:          as.id,
        appareil_id: as.appareil_id,
        appareil:    as.appareil_libelle,
        description: as.description,
      }))
    );
    setShowForm(true);
    toast.info("Mode modification — modifiez puis enregistrez");
  };

  const handleRAS = (checked) => {
    setRasChecked(checked);
    if (checked) setSignes(SIGNES_INIT);
  };

  const handleSigneChange = (signe, val) => {
    if (rasChecked) { toast.warning("Désactivez RAS pour modifier les signes"); return; }
    setSignes((prev) => ({ ...prev, [signe]: val }));
  };

  const ajouterAutreSigne = () => {
    if (!appareilSelectionne)     { toast.error("Veuillez sélectionner un appareil"); return; }
    if (!descriptionSigne.trim()) { toast.error("Veuillez saisir une description"); return; }
    const app = appareils.find((a) => a.id === parseInt(appareilSelectionne));
    if (!app) { toast.error("Appareil non trouvé"); return; }
    setAutresSignes((p) => [...p, {
      id: Date.now(), appareil_id: app.id, appareil: app.libelle, description: descriptionSigne.trim(),
    }]);
    setAppareilSelectionne(""); setDescriptionSigne("");
    toast.success("Signe ajouté");
  };

  const supprimerAutreSigne = async (id) => {
    if (await confirmAction("Supprimer ce signe ?", "Cette action est irréversible.")) {
      setAutresSignes((p) => p.filter((s) => s.id !== id));
      toast.success("Signe supprimé");
    }
  };

  // ── Enregistrer ───────────────────────────────────────────────────────────
  const handleSave = async () => {
    // ✅ Confirmation avant création ou modification avec alertService
    const actionLabel = signesId ? "Enregistrer les modifications ?" : "Créer les signes fonctionnels ?";
    const ok = await confirmAction(actionLabel, "Les données seront enregistrées dans le dossier patient.");
    if (!ok) return;

    setSaving(true);
    try {
      const targetId = isModifying ? modifyingExamenId : examenId;
      const payload  = {
        examen_clinique_id: targetId,
        signes:        { ...signes, ras: rasChecked },
        autres_signes: autresSignes.map(({ appareil_id, description }) => ({ appareil_id, description })),
      };

      if (signesId) {
        await updateSignesFonctionnels(targetId, payload);
        // ✅ alertSuccess pour modification
        await alertSuccess("Signes fonctionnels mis à jour avec succès");
      } else {
        await createSignesFonctionnels(payload);
        // ✅ alertSuccess pour création
        await alertSuccess("Signes fonctionnels enregistrés avec succès");
      }

      setIsModifying(false); setShowForm(false);
      await loadHistorique();
      await loadData();

    } catch (e) {
      // ✅ alertError pour les erreurs
      const msg = typeof e === "string" ? e : (e?.message || "Erreur lors de l'enregistrement");
      await alertError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div style={PAGE_BG}>

      <PageHeader title="Signes Fonctionnels" icon="bi-heart-pulse"
        showForm={showForm} onOpen={handleOpenForm} onCancel={handleCancel} />

      {/* HISTORIQUE */}
      <HistoriqueAccordeon title="Historique des signes fonctionnels"
        count={historique.length} open={showHistory} onToggle={() => setShowHistory((v) => !v)}>
        {historique.length === 0 ? (
          <EmptyState message="Aucun signe fonctionnel enregistré" />
        ) : (
          <div className="table-responsive">
            <table className="table table-hover table-sm mb-0">
              <thead className="table-light">
                <tr>
                  {["Date","Signes positifs","Autres signes","Action"].map((h) => (
                    <th key={h} style={{ fontSize: "0.78rem" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {historique.map((s) => {
                  const pos = getSignesPositifs(s);
                  return (
                    <tr key={s.id}>
                      <td style={{ whiteSpace: "nowrap", fontSize: "0.875rem" }}>
                        {s.date_examen ? new Date(s.date_examen).toLocaleDateString("fr-FR") : "N/A"}
                      </td>

                      {/* Signes positifs booléens */}
                      <td>
                        {s.ras
                          ? <Badge bg="#dcfce7" color="#166534">RAS</Badge>
                          : pos.length > 0
                            ? <div className="d-flex flex-wrap gap-1">
                                {pos.map((n, i) => <Badge key={i} bg="#fef3c7" color="#92400e">{n}</Badge>)}
                              </div>
                            : <small className="text-secondary">Aucun</small>}
                      </td>

                      {/* ✅ Autres signes fonctionnels dans l'historique */}
                      <td style={{ maxWidth: 220 }}>
                        {s.autres_signes?.length > 0
                          ? s.autres_signes.map((as, i) => (
                              <div key={i} className="mb-1">
                                <Badge bg="#e0f2fe" color="#0369a1">{as.appareil_libelle}</Badge>
                                <small className="ms-1 text-secondary">{as.description}</small>
                              </div>
                            ))
                          : <small className="text-secondary">Aucun</small>}
                      </td>

                      <td><BtnModifier onClick={() => handleEdit(s)} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </HistoriqueAccordeon>

      {/* FORMULAIRE */}
      {showForm && (
        <FormulaireWrapper isModifying={isModifying}
          labelCreate="Nouveau signe fonctionnel" labelModify="Modifier le signe fonctionnel">

          {/* Toggle RAS */}
          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="d-flex align-items-center gap-2 px-3 py-2 rounded"
              style={{
                background: rasChecked ? "#f0fdf4" : "#f8fafc",
                border: `1px solid ${rasChecked ? "#86efac" : "#e2e8f0"}`,
                cursor: "pointer", userSelect: "none",
              }}
              onClick={() => handleRAS(!rasChecked)}>
              <div style={{ width: 40, height: 22, borderRadius: 11, position: "relative",
                background: rasChecked ? "#16a34a" : "#cbd5e1", transition: "background 0.2s" }}>
                <div style={{ width: 16, height: 16, borderRadius: "50%", background: "white",
                  position: "absolute", top: 3, transition: "left 0.2s",
                  left: rasChecked ? 21 : 3, boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
              </div>
              <span style={{ fontWeight: 700, fontSize: "0.9rem", color: rasChecked ? "#166534" : "#475569" }}>
                RAS — Rien à signaler
              </span>
            </div>
            {rasChecked && (
              <small className="text-success">
                <i className="bi bi-check-circle me-1"></i>Tous les signes sont à Non
              </small>
            )}
          </div>

          {/* Grille signes */}
          <p className={LABEL_CLS} style={{ fontSize: "0.78rem", marginBottom: 14 }}>Signes fonctionnels</p>
          <div className="row g-2 mb-4 pb-4 border-bottom">
            {SIGNES_KEYS.map((signe) => (
              <div key={signe} className="col-6 col-md-4 col-lg-3">
                <div className="rounded p-2" style={{
                  border: `1px solid ${signes[signe] ? "#86efac" : "#e2e8f0"}`,
                  background: signes[signe] ? "#f0fdf4" : "white", transition: "all 0.15s",
                }}>
                  <div className="text-uppercase fw-bold text-secondary mb-2" style={{ fontSize: "0.72rem" }}>
                    {LABELS[signe]}
                  </div>
                  <div className="d-flex gap-1">
                    {[true, false].map((val) => (
                      <button key={String(val)} className="btn btn-sm flex-fill py-0"
                        disabled={rasChecked}
                        style={{
                          borderRadius: 6, border: "none", fontSize: "0.78rem", fontWeight: 600,
                          background: signes[signe] === val ? (val ? "#16a34a" : "#ef4444") : "#f1f5f9",
                          color:      signes[signe] === val ? "white" : "#64748b",
                          cursor: rasChecked ? "not-allowed" : "pointer",
                        }}
                        onClick={() => handleSigneChange(signe, val)}>
                        {val ? "Oui" : "Non"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <AutresSignesSection
            title="Autres signes fonctionnels"
            appareils={appareils}
            autresSignes={autresSignes}
            appareilSelectionne={appareilSelectionne}
            descriptionSigne={descriptionSigne}
            onAppareilChange={setAppareilSelectionne}
            onDescriptionChange={setDescriptionSigne}
            onAjouter={ajouterAutreSigne}
            onSupprimer={supprimerAutreSigne}
          />

          <BoutonEnregistrer isModifying={isModifying} loading={saving} onClick={handleSave} />
        </FormulaireWrapper>
      )}
    </div>
  );
}