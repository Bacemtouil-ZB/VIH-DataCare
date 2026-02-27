import { useState, useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAction } from "../../../../../shared/utils/uiAlerts";
import { createSigneClinique, updateSigneClinique, getSigneCliniqueByNumeroDossier } from "../../../services/examenCliniqueServices/signeCliniqueService";
import { getAppareils } from "../../../services/examenCliniqueServices/signesFonctionService";
import { calcIMC, UI_INIT, FORM_SC_INIT } from "./examenConfig";
import { PAGE_BG, LABEL_CLS, STYLES, PageHeader, HistoriqueAccordeon, EmptyState, FormulaireWrapper, AutresSignesSection, BoutonEnregistrer, BtnModifier, Badge, ImcField } from "./ExamenComponents";

export default function SignesCliniques() {
  const { numero }   = useParams();
  const { examenId } = useOutletContext();
  const [ui,   setUi]   = useState({ ...UI_INIT });
  const [form, setForm] = useState({ ...FORM_SC_INIT });
  const [data, setData] = useState({ appareils: [], historique: [] });

  const patchUi   = (p) => setUi  ((s) => ({ ...s, ...p }));
  const patchForm = (p) => setForm((s) => ({ ...s, ...p }));
  const patchData = (p) => setData((s) => ({ ...s, ...p }));

  const imc = form.taille && form.poids && +form.taille > 0 && +form.poids > 0 ? calcIMC(+form.taille, +form.poids) : null;

  useEffect(() => {
    if (!numero) return;
    (async () => {
      patchUi({ loading: true });
      try {
        const [ar, hr] = await Promise.all([getAppareils(), getSigneCliniqueByNumeroDossier(numero)]);
        patchData({ appareils: ar?.appareils || [], historique: hr?.signes || [] });
      } catch { patchData({ historique: [] }); }
      finally  { patchUi({ loading: false }); }
    })();
  }, [numero]);

  const resetForm = () => setForm({ ...FORM_SC_INIT });
  const handleCancel = () => { patchUi({ showForm: false }); resetForm(); toast.info("Opération annulée"); };

  const handleEdit = async (s) => {
    const ok = await confirmAction("Modifier ce signe clinique ?",
      `Date : ${new Date(s.date_examen).toLocaleDateString("fr-FR")} — Taille : ${s.taille} cm — Poids : ${s.poids} kg`);
    if (!ok) { toast.info("Opération annulée"); return; }
    setForm({
      signeId: s.id, isModifying: true, taille: s.taille || "", poids: s.poids || "",
      autresSignes: (s.autres_signes || []).map(({ id, appareil_id, appareil, description }) => ({ id, appareil_id, appareil, description })),
      appareilSel: "", description: "",
    });
    patchUi({ showForm: true });
    toast.info("Mode modification activé");
  };

  const ajouterAutreSigne = () => {
    if (!form.appareilSel)        { toast.error("Veuillez sélectionner un appareil"); return; }
    if (!form.description.trim()) { toast.error("Veuillez saisir une description");   return; }
    const app = data.appareils.find((a) => a.id === parseInt(form.appareilSel));
    if (!app) { toast.error("Appareil non trouvé"); return; }
    patchForm({
      autresSignes: [...form.autresSignes, { id: Date.now(), appareil_id: app.id, appareil: app.libelle, description: form.description.trim() }],
      appareilSel: "", description: "",
    });
    toast.success("Signe ajouté");
  };

  const supprimerAutreSigne = async (id) => {
    const ok = await confirmAction("Supprimer ce signe ?", "Cette action est irréversible.");
    if (!ok) { toast.info("Opération annulée"); return; }
    patchForm({ autresSignes: form.autresSignes.filter((s) => s.id !== id) });
    toast.success("Signe supprimé");
  };

  const modifierDescription = (id, nouvelleDesc) => {
    patchForm({ autresSignes: form.autresSignes.map((s) => s.id === id ? { ...s, description: nouvelleDesc } : s) });
    toast.success("Description mise à jour");
  };

  const handleEnregistrer = async () => {
    if (!form.taille || !form.poids)             { toast.error("Veuillez renseigner la taille et le poids"); return; }
    if (+form.taille <= 0 || +form.taille > 250) { toast.error("Taille invalide (1–250 cm)"); return; }
    if (+form.poids  <= 0 || +form.poids  > 300) { toast.error("Poids invalide (1–300 kg)");  return; }
    patchUi({ saving: true });
    try {
      const payload = {
        examen_clinique_id: examenId, taille: +form.taille, poids: +form.poids,
        autres_signes: form.autresSignes.map(({ appareil_id, description }) => ({ appareil_id, description })),
      };
      if (form.isModifying && form.signeId) {
        await updateSigneClinique(form.signeId, payload);
        toast.success("Signes cliniques mis à jour");
      } else {
        const res = await createSigneClinique(payload);
        patchForm({ signeId: res?.signe?.id || null });
        toast.success("Signes cliniques enregistrés");
      }
      patchUi({ showForm: false }); resetForm();
      const hr = await getSigneCliniqueByNumeroDossier(numero);
      patchData({ historique: hr?.signes || [] });
    } catch (e) { toast.error(e?.response?.data?.message || e?.message || "Erreur"); }
    finally { patchUi({ saving: false }); }
  };

  return (
    <div style={PAGE_BG}>
      <PageHeader showForm={ui.showForm} onOpen={() => { resetForm(); patchUi({ showForm: true }); }} onCancel={handleCancel} />

      <HistoriqueAccordeon title="Historique des signes cliniques" count={data.historique.length}
        open={ui.showHistory} onToggle={() => patchUi({ showHistory: !ui.showHistory })}>
        {data.historique.length === 0 ? <EmptyState message="Aucun signe clinique enregistré" /> : (
          <div className="table-responsive">
            <table className="table table-hover table-sm mb-0">
              <thead className="table-light">
                <tr>
                  {["Date", "Taille (cm)", "Poids (kg)", "IMC", "Appareil", "Description", "Action"].map((h) => (
                    <th key={h} style={STYLES.thSm}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.historique.map((s) => {
                  const si = s.taille && s.poids ? calcIMC(+s.taille, +s.poids) : null;
                  return (
                    <tr key={s.id}>
                      <td style={STYLES.tdDate}>{s.date_examen ? new Date(s.date_examen).toLocaleDateString("fr-FR") : "N/A"}</td>
                      <td><Badge bg="#dbeafe" color="#1d4ed8">{s.taille ?? "N/A"}</Badge></td>
                      <td><Badge bg="#dcfce7" color="#166534">{s.poids  ?? "N/A"}</Badge></td>
                      <td>{si ? <span style={{ color: si.color, fontWeight: 700 }}>{si.val} <small style={{ fontWeight: 400 }}>{si.label}</small></span> : "N/A"}</td>

                      <td style={{ verticalAlign: "middle" }}>
                        {s.autres_signes?.length > 0
                          ? <div className="d-flex flex-column gap-1">
                              {s.autres_signes.map((as, i) => (
                                <Badge key={i} bg="#e0f2fe" color="#0369a1">{as.appareil}</Badge>
                              ))}
                            </div>
                          : <small className="text-secondary">—</small>}
                      </td>

                      <td style={{ verticalAlign: "middle", maxWidth: 280 }}>
                        {s.autres_signes?.length > 0
                          ? <div className="d-flex flex-column gap-1">
                              {s.autres_signes.map((as, i) => (
                                <span key={i} style={{ fontSize: "0.875rem", color: "#1e293b", lineHeight: 1.5 }}>
                                  {as.description}
                                </span>
                              ))}
                            </div>
                          : <small className="text-secondary">—</small>}
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

      {ui.showForm && (
        <FormulaireWrapper isModifying={form.isModifying} labelCreate="Nouveau signe clinique" labelModify="Modifier le signe clinique">
          <p className="text-uppercase fw-bold text-secondary mb-3" style={STYLES.thSm}>Mesures anthropométriques</p>
          <div className="d-flex gap-4 flex-wrap mb-4 pb-4 border-bottom">
            <div style={STYLES.flexInput}>
              <label className={LABEL_CLS} style={STYLES.thSm}>Taille (cm) <span className="text-danger">*</span></label>
              <input type="number" className="form-control form-control-sm" placeholder="ex: 175" min={1} max={250} value={form.taille} onChange={(e) => patchForm({ taille: e.target.value })} />
            </div>
            <div style={STYLES.flexInput}>
              <label className={LABEL_CLS} style={STYLES.thSm}>Poids (kg) <span className="text-danger">*</span></label>
              <input type="number" className="form-control form-control-sm" placeholder="ex: 70" min={1} max={300} value={form.poids} onChange={(e) => patchForm({ poids: e.target.value })} />
            </div>
            <div style={STYLES.flexInputL}>
              <label className={LABEL_CLS} style={STYLES.thSm}>IMC (kg/m²)</label>
              <ImcField imc={imc} />
            </div>
          </div>
          <AutresSignesSection title="Autres signes cliniques"
            appareils={data.appareils} autresSignes={form.autresSignes}
            appareilSelectionne={form.appareilSel} descriptionSigne={form.description}
            onAppareilChange={(v) => patchForm({ appareilSel: v })}
            onDescriptionChange={(v) => patchForm({ description: v })}
            onAjouter={ajouterAutreSigne}
            onSupprimer={supprimerAutreSigne}
            onModifierDescription={modifierDescription} />
          <BoutonEnregistrer isModifying={form.isModifying} loading={ui.saving} onClick={handleEnregistrer} />
        </FormulaireWrapper>
      )}
    </div>
  );
}