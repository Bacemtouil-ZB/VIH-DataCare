import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAction } from "../../../../../shared/utils/uiAlerts";
import {
  getAppareils, getSignesByPatient,
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
  const [rasChecked,          setRasChecked]          = useState(false);
  // ✅ signesId = sf.id (id de la ligne signes_fonctionnels), pas l'examenId
  const [signesId,            setSignesId]            = useState(null);
  const [appareils,           setAppareils]           = useState([]);
  const [signes,              setSignes]              = useState(SIGNES_INIT);
  const [autresSignes,        setAutresSignes]        = useState([]);
  const [appareilSelectionne, setAppareilSelectionne] = useState("");
  const [descriptionSigne,    setDescriptionSigne]    = useState("");
  const [historique,          setHistorique]          = useState([]);
  const [showHistory,         setShowHistory]         = useState(true);

  useEffect(() => { if (examenId)      loadAppareils();  }, [examenId]);
  useEffect(() => { if (patientNumero) loadHistorique(); }, [patientNumero]);

  const loadAppareils = async () => {
    try {
      setLoading(true);
      const ar = await getAppareils();
      if (ar?.success) setAppareils(ar.appareils || []);
    } catch { }
    finally { setLoading(false); }
  };

  const loadHistorique = async () => {
    try {
      const res = await getSignesByPatient(patientNumero);
      setHistorique(Array.isArray(res?.signes) ? res.signes : []);
    } catch {
      setHistorique([]);
    }
  };

  const resetForm = () => {
    setSignes(SIGNES_INIT); setRasChecked(false); setSignesId(null);
    setAutresSignes([]); setAppareilSelectionne(""); setDescriptionSigne("");
    setIsModifying(false);
  };

  const handleOpenForm = () => { resetForm(); setShowForm(true); };
  const handleCancel   = () => { setShowForm(false); resetForm(); toast.info("Opération annulée"); };

  // ── Modifier depuis l'historique ──────────────────────────────────────────
  const handleEdit = async (signe) => {
    const pos = getSignesPositifs(signe);
    const ok  = await confirmAction(
      "Modifier ce signe fonctionnel ?",
      `Date : ${new Date(signe.date_examen).toLocaleDateString("fr-FR")}${pos.length ? " — " + pos.slice(0, 4).join(", ") : ""}`
    );
    if (!ok) return;

    setSignes(Object.fromEntries(SIGNES_KEYS.map((k) => [k, signe[k] || false])));
    setRasChecked(signe.ras || false);
    // ✅ FIX : stocker l'id de la ligne signes_fonctionnels (signe.id = sf.id)
    setSignesId(signe.id);
    setIsModifying(true);
    // ✅ Pré-charger les autres signes de cette ligne
    setAutresSignes(
      (signe.autres_signes || []).map((as) => ({
        id:          as.id,
        appareil_id: as.appareil_id,
        // ✅ alias du model est "appareil" (pas "appareil_libelle")
        appareil:    as.appareil,
        description: as.description,
      }))
    );
    setShowForm(true);
    toast.info("Mode modification — modifiez puis enregistrez");
  };

  const handleRAS = (checked) => { setRasChecked(checked); if (checked) setSignes(SIGNES_INIT); };

  const handleSigneChange = (signe, val) => {
    if (rasChecked) { toast.warning("Désactivez RAS pour modifier les signes"); return; }
    setSignes((prev) => ({ ...prev, [signe]: val }));
  };

  const ajouterAutreSigne = () => {
    if (!appareilSelectionne)     { toast.error("Veuillez sélectionner un appareil"); return; }
    if (!descriptionSigne.trim()) { toast.error("Veuillez saisir une description"); return; }
    // ✅ FIX NaN : parseInt pour garantir un integer
    const app = appareils.find((a) => a.id === parseInt(appareilSelectionne, 10));
    if (!app) { toast.error("Appareil non trouvé"); return; }
    setAutresSignes((p) => [...p, {
      id:          Date.now(),
      appareil_id: parseInt(app.id, 10),
      appareil:    app.libelle,
      description: descriptionSigne.trim(),
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

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        signes:        { ...signes, ras: rasChecked },
        autres_signes: autresSignes.map(({ appareil_id, description }) => ({
          // ✅ FIX NaN : parseInt pour garantir integer avant envoi
          appareil_id: parseInt(appareil_id, 10),
          description,
        })),
      };

      if (isModifying && signesId) {
        // ✅ FIX PUT /undefined : on passe signesId (sf.id) et non modifyingExamenId
        await updateSignesFonctionnels(signesId, payload);
        toast.success("Signes fonctionnels mis à jour");
      } else {
        await createSignesFonctionnels({ ...payload, examen_clinique_id: examenId });
        toast.success("Signes fonctionnels enregistrés");
      }

      setIsModifying(false); setShowForm(false);
      await loadHistorique();

    } catch (e) {
      const msg = typeof e === "string" ? e : (e?.message || "Erreur lors de l'enregistrement");
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div style={PAGE_BG}>

      <PageHeader 
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
                  {["Date", "Signes positifs", "Autres signes", "Action"].map((h) => (
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

                      {/* Signes booléens positifs */}
                      <td>
                        {s.ras
                          ? <Badge bg="#dcfce7" color="#166534">RAS</Badge>
                          : pos.length > 0
                            ? <div className="d-flex flex-wrap gap-1">
                                {pos.map((n, i) => <Badge key={i} bg="#fef3c7" color="#92400e">{n}</Badge>)}
                              </div>
                            : <small className="text-secondary">Aucun</small>}
                      </td>

                      {/* ✅ Autres signes avec badge appareil + description */}
                      <td>
                        {s.autres_signes?.length > 0
                          ? <div className="d-flex flex-column gap-1">
                              {s.autres_signes.map((as, i) => (
                                <div key={i} className="d-flex align-items-center gap-1 flex-wrap">
                                  {/* ✅ alias "appareil" correspond au model signeFonctionModel */}
                                  <Badge bg="#dbeafe" color="#1d4ed8">{as.appareil}</Badge>
                                  <small className="text-secondary">{as.description}</small>
                                </div>
                              ))}
                            </div>
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