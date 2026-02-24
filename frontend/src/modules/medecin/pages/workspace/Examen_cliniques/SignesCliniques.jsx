import { useState, useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAction } from "../../../../../shared/utils/uiAlerts";
import {
  createSigneClinique,
  updateSigneClinique,
  getSigneCliniqueByNumeroDossier,
} from "../../../services/signeCliniqueService";
import { getAppareils } from "../../../services/signesFonctionService";
import {
  PAGE_BG, LABEL_CLS,
  PageHeader, HistoriqueAccordeon, EmptyState,
  FormulaireWrapper, AutresSignesSection,
  BoutonEnregistrer, BtnModifier, Badge,
} from "./ExamenComponents";

function calcIMC(t, p) {
  const v = p / Math.pow(t / 100, 2);
  if (v < 18.5) return { val: v.toFixed(1), label: "Insuffisance pondérale", color: "#0891b2" };
  if (v < 25)   return { val: v.toFixed(1), label: "Poids normal",           color: "#16a34a" };
  if (v < 30)   return { val: v.toFixed(1), label: "Surpoids",               color: "#d97706" };
  return           { val: v.toFixed(1), label: "Obésité",                    color: "#dc2626" };
}

export default function SignesCliniques() {
const { numero } = useParams();
  const { examenId }      = useOutletContext();

  const [signeId,      setSigneId]      = useState(null);
  const [taille,       setTaille]       = useState("");
  const [poids,        setPoids]        = useState("");   
  const [appareils,    setAppareils]    = useState([]);
  const [autresSignes, setAutresSignes] = useState([]);
  const [appareilSel,  setAppareilSel]  = useState("");
  const [description,  setDescription]  = useState("");
  const [loading,      setLoading]      = useState(false);
  const [showForm,     setShowForm]     = useState(false);
  const [isModifying,  setIsModifying]  = useState(false);
  const [modifyingId,  setModifyingId]  = useState(null);
  const [historique,   setHistorique]   = useState([]);
  const [showHistory,  setShowHistory]  = useState(true);

  const imc = taille && poids && +taille > 0 && +poids > 0
    ? calcIMC(+taille, +poids) : null;

  useEffect(() => {
    getAppareils()
      .then((r) => { if (r?.success) setAppareils(r.appareils || []); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (numero) chargerHistorique();
  }, [numero]);

  const chargerHistorique = async () => {
    try {
      const res = await getSigneCliniqueByNumeroDossier(numero);
      // ✅ Le backend retourne { success, signes } → res.signes
      setHistorique(Array.isArray(res?.signes) ? res.signes : []);
    } catch {
      setHistorique([]);
    }
  };

  const resetForm = () => {
    setSigneId(null); setTaille(""); setPoids("");
    setAutresSignes([]); setAppareilSel(""); setDescription("");
    setIsModifying(false); setModifyingId(null);
  };

const handleOpenForm = () => {
  if (signesId) {
    // Des signes existent déjà → on passe en modification
    setIsModifying(true);
    setModifyingExamenId(examenId);
    setShowForm(true);
    toast.info("Modification du signe fonctionnel existant");
  } else {
    // Aucune donnée → création
    resetForm();
    setShowForm(true);
  }
};  const handleCancel   = () => { setShowForm(false); resetForm(); toast.info("Opération annulée"); };

  const handleEdit = async (s) => {
    const ok = await confirmAction(
      "Modifier ce signe clinique ?",
      `Date : ${new Date(s.date_examen).toLocaleDateString("fr-FR")} — Taille : ${s.taille} cm — Poids : ${s.poids} kg`
    );
    if (!ok) return;
    setTaille(s.taille || "");
    setPoids(s.poids || "");
    setSigneId(s.id);
    setIsModifying(true);
    setModifyingId(s.id);

    setAutresSignes(
      (s.autres_signes || []).map((as) => ({
        id:          as.id,
        appareil_id: as.appareil_id,
        appareil:    as.appareil,   
        description: as.description,
      }))
    );
    setShowForm(true);
    toast.info("Mode modification activé");
  };

  const ajouterAutreSigne = () => {
    if (!appareilSel)        { toast.error("Veuillez sélectionner un appareil"); return; }
    if (!description.trim()) { toast.error("Veuillez saisir une description");  return; }
    const app = appareils.find((a) => a.id === parseInt(appareilSel));
    if (!app) { toast.error("Appareil non trouvé"); return; }
    setAutresSignes((p) => [...p, {
      id: Date.now(), appareil_id: app.id, appareil: app.libelle, description: description.trim(),
    }]);
    setAppareilSel(""); setDescription("");
    toast.success("Signe ajouté");
  };

  const supprimerAutreSigne = async (id) => {
    if (await confirmAction("Supprimer ce signe ?", "Cette action est irréversible.")) {
      setAutresSignes((p) => p.filter((s) => s.id !== id));
      toast.success("Signe supprimé");
    }
  };

  const handleEnregistrer = async () => {
    if (!taille || !poids)             { toast.error("Veuillez renseigner la taille et le poids"); return; }
    if (+taille <= 0 || +taille > 250) { toast.error("Taille invalide (1–250 cm)"); return; }
    if (+poids  <= 0 || +poids  > 300) { toast.error("Poids invalide (1–300 kg)");  return; }

    setLoading(true);
    try {
      const payload = {
        examen_clinique_id: examenId,
        taille: +taille,
        poids:  +poids,
        autres_signes: autresSignes.map(({ appareil_id, description: d }) => ({ appareil_id, description: d })),
      };

      if (isModifying && modifyingId) {
        await updateSigneClinique(modifyingId, payload);
        toast.success("Signes cliniques mis à jour");
      } else {
        await createSigneClinique(payload);
        toast.success("Signes cliniques enregistrés");
      }

      setShowForm(false); resetForm();
      await chargerHistorique();
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={PAGE_BG}>

      <PageHeader
        showForm={showForm} onOpen={handleOpenForm} onCancel={handleCancel} />

      {/* HISTORIQUE */}
      <HistoriqueAccordeon
        title="Historique des signes cliniques"
        count={historique.length}
        open={showHistory}
        onToggle={() => setShowHistory((v) => !v)}
      >
        {historique.length === 0 ? (
          <EmptyState message="Aucun signe clinique enregistré pour ce patient" />
        ) : (
          <div className="table-responsive">
            <table className="table table-hover table-sm mb-0">
              <thead className="table-light">
                <tr>
                  {["Date","Taille (cm)","Poids (kg)","IMC","Appareils / Signes","Action"].map((h) => (
                    <th key={h} style={{ fontSize: "0.78rem" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {historique.map((s) => {
                  const si = s.taille && s.poids ? calcIMC(+s.taille, +s.poids) : null;
                  return (
                    <tr key={s.id}>
                      <td style={{ whiteSpace: "nowrap", fontSize: "0.875rem" }}>
                        {s.date_examen ? new Date(s.date_examen).toLocaleDateString("fr-FR") : "N/A"}
                      </td>
                      <td><Badge bg="#dbeafe" color="#1d4ed8">{s.taille ?? "N/A"}</Badge></td>
                      <td><Badge bg="#dcfce7" color="#166534">{s.poids ?? "N/A"}</Badge></td>
                      <td>
                        {si
                          ? <span style={{ color: si.color, fontWeight: 700 }}>
                              {si.val} <small style={{ fontWeight: 400 }}>{si.label}</small>
                            </span>
                          : "N/A"}
                      </td>
                      <td style={{ maxWidth: 240 }}>
                        {s.autres_signes?.length > 0
                          ? s.autres_signes.map((as, i) => (
                              <div key={i} className="mb-1">
                                <Badge bg="#e0f2fe" color="#0369a1">{as.appareil}</Badge>
                                <small className="ms-1 text-secondary">{as.description}</small>
                              </div>
                            ))
                          : <span className="text-secondary small">Aucun</span>}
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
          labelCreate="Nouveau signe clinique"
          labelModify="Modifier le signe clinique">

          <p className="text-uppercase fw-bold text-secondary mb-3" style={{ fontSize: "0.78rem", letterSpacing: "0.5px" }}>
            Mesures anthropométriques
          </p>
          <div className="d-flex gap-4 flex-wrap mb-4 pb-4 border-bottom">
            <div style={{ flex: "1 1 140px" }}>
              <label className={LABEL_CLS} style={{ fontSize: "0.78rem" }}>
                Taille (cm) <span className="text-danger">*</span>
              </label>
              <input type="number" className="form-control form-control-sm"
                placeholder="ex: 175" min={1} max={250}
                value={taille} onChange={(e) => setTaille(e.target.value)} />
            </div>
            <div style={{ flex: "1 1 140px" }}>
              <label className={LABEL_CLS} style={{ fontSize: "0.78rem" }}>
                Poids (kg) <span className="text-danger">*</span>
              </label>
              <input type="number" className="form-control form-control-sm"
                placeholder="ex: 70" min={1} max={300}
                value={poids} onChange={(e) => setPoids(e.target.value)} />
            </div>
            <div style={{ flex: "1 1 200px" }}>
              <label className={LABEL_CLS} style={{ fontSize: "0.78rem" }}>IMC (kg/m²)</label>
              <div className="form-control form-control-sm d-flex align-items-center gap-2"
                style={{ background: "#f8faf9", cursor: "default" }}>
                {imc
                  ? <><span style={{ fontWeight: 700, color: imc.color }}>{imc.val}</span>
                      <small style={{ color: imc.color }}>{imc.label}</small></>
                  : <small className="text-secondary">Saisissez taille et poids</small>}
              </div>
            </div>
          </div>

          <AutresSignesSection
            title="Autres signes cliniques"
            appareils={appareils}
            autresSignes={autresSignes}
            appareilSelectionne={appareilSel}
            descriptionSigne={description}
            onAppareilChange={setAppareilSel}
            onDescriptionChange={setDescription}
            onAjouter={ajouterAutreSigne}
            onSupprimer={supprimerAutreSigne}
          />

          <BoutonEnregistrer isModifying={isModifying} loading={loading} onClick={handleEnregistrer} />
        </FormulaireWrapper>
      )}
    </div>
  );
}