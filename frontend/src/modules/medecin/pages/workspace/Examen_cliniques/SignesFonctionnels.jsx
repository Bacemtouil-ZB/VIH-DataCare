import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAction } from "../../../../../shared/utils/uiAlerts";
import { getAppareils, getSignesByPatient, createSignesFonctionnels, updateSignesFonctionnels } from "../../../services/examenCliniqueServices/signesFonctionService";
import { SIGNES_KEYS, SIGNES_LABELS, SIGNES_INIT, FORM_SF_INIT, UI_INIT, getSignesPositifs } from "./examenConfig";
import { PAGE_BG, STYLES, PageHeader, HistoriqueAccordeon, EmptyState, FormulaireWrapper, AutresSignesSection, AutresSignesHistorique, BoutonEnregistrer, BtnModifier, Badge, Spinner, RasToggle, SigneCard } from "./ExamenComponents";

export default function SignesFonctionnels() {
  const { examenId, patientNumero } = useOutletContext();
  const [ui,   setUi]   = useState({ ...UI_INIT });
  const [form, setForm] = useState({ ...FORM_SF_INIT });
  const [data, setData] = useState({ appareils: [], historique: [] });

  const patchUi   = (p) => setUi  ((s) => ({ ...s, ...p }));
  const patchForm = (p) => setForm((s) => ({ ...s, ...p }));
  const patchData = (p) => setData((s) => ({ ...s, ...p }));

  useEffect(() => {
    if (!patientNumero) return;
    (async () => {
      patchUi({ loading: true });
      try {
        const [ar, hr] = await Promise.all([getAppareils(), getSignesByPatient(patientNumero)]);
        patchData({ appareils: ar?.appareils || [], historique: hr?.signes || [] });
      } catch { patchData({ historique: [] }); }
      finally  { patchUi({ loading: false }); }
    })();
  }, [patientNumero]);

  const resetForm = () => setForm({ ...FORM_SF_INIT });
  const handleCancel = () => { patchUi({ showForm: false }); resetForm(); toast.info("Opération annulée"); };

  const handleEdit = async (signe) => {
    const pos = getSignesPositifs(signe);
    const ok  = await confirmAction("Modifier ce signe fonctionnel ?",
      `Date : ${new Date(signe.date_examen).toLocaleDateString("fr-FR")}${pos.length ? " — " + pos.slice(0, 4).join(", ") : ""}`);
    if (!ok) { toast.info("Opération annulée"); return; }
    setForm({
      signesId: signe.id, isModifying: true, rasChecked: signe.ras || false,
      signes:   Object.fromEntries(SIGNES_KEYS.map((k) => [k, signe[k] || false])),
      autresSignes: (signe.autres_signes || []).map(({ id, appareil_id, appareil, description }) => ({ id, appareil_id, appareil, description })),
      appareilSel: "", description: "",
    });
    patchUi({ showForm: true });
    toast.info("Mode modification — modifiez puis enregistrez");
  };

  const ajouterAutreSigne = () => {
    if (!form.appareilSel)        { toast.error("Veuillez sélectionner un appareil"); return; }
    if (!form.description.trim()) { toast.error("Veuillez saisir une description");   return; }
    const app = data.appareils.find((a) => a.id === parseInt(form.appareilSel, 10));
    if (!app) { toast.error("Appareil non trouvé"); return; }
    patchForm({
      autresSignes: [...form.autresSignes, { id: Date.now(), appareil_id: parseInt(app.id, 10), appareil: app.libelle, description: form.description.trim() }],
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

  const handleSave = async () => {
    patchUi({ saving: true });
    try {
      const payload = {
        signes: { ...form.signes, ras: form.rasChecked },
        autres_signes: form.autresSignes.map(({ appareil_id, description }) => ({ appareil_id: parseInt(appareil_id, 10), description })),
      };
      if (form.isModifying && form.signesId) {
        await updateSignesFonctionnels(form.signesId, payload);
        toast.success("Signes fonctionnels mis à jour");
      } else {
        await createSignesFonctionnels({ ...payload, examen_clinique_id: examenId });
        toast.success("Signes fonctionnels enregistrés");
      }
      patchUi({ showForm: false }); resetForm();
      const hr = await getSignesByPatient(patientNumero);
      patchData({ historique: hr?.signes || [] });
    } catch (e) { toast.error(typeof e === "string" ? e : e?.message || "Erreur"); }
    finally { patchUi({ saving: false }); }
  };

  if (ui.loading) return <Spinner />;

  return (
    <div style={PAGE_BG}>
      <PageHeader showForm={ui.showForm} onOpen={() => { resetForm(); patchUi({ showForm: true }); }} onCancel={handleCancel} />

      <HistoriqueAccordeon title="Historique des signes fonctionnels" count={data.historique.length}
        open={ui.showHistory} onToggle={() => patchUi({ showHistory: !ui.showHistory })}>
        {data.historique.length === 0 ? <EmptyState message="Aucun signe fonctionnel enregistré" /> : (
          <div className="table-responsive">
            <table className="table table-hover table-sm mb-0">
              <thead className="table-light">
                <tr>
                  {["Date", "Signes positifs", "Appareil", "Description", "Action"].map((h) => (
                    <th key={h} style={STYLES.thSm}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.historique.map((s) => {
                  const pos = getSignesPositifs(s);
                  return (
                    <tr key={s.id}>
                      <td style={STYLES.tdDate}>{s.date_examen ? new Date(s.date_examen).toLocaleDateString("fr-FR") : "N/A"}</td>

                      {/* Signes positifs */}
                      <td>
                        {s.ras ? <Badge bg="#dcfce7" color="#166534">RAS</Badge>
                          : pos.length > 0
                            ? <div className="d-flex flex-wrap gap-1">{pos.map((n, i) => <Badge key={i} bg="#fef3c7" color="#92400e">{n}</Badge>)}</div>
                            : <small className="text-secondary">Aucun</small>}
                      </td>

                      <td style={{ verticalAlign: "middle" }}>
                        {s.autres_signes?.length > 0
                          ? <div className="d-flex flex-column gap-1">
                              {s.autres_signes.map((as, i) => (
                                <Badge key={i} bg="#dbeafe" color="#1d4ed8">{as.appareil}</Badge>
                              ))}
                            </div>
                          : <small className="text-secondary">—</small>}
                      </td>
                      <td style={{ verticalAlign: "middle", maxWidth: 300 }}>
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
        <FormulaireWrapper isModifying={form.isModifying} labelCreate="Nouveau signe fonctionnel" labelModify="Modifier le signe fonctionnel">
          <RasToggle checked={form.rasChecked} onChange={(v) => patchForm({ rasChecked: v, signes: v ? { ...SIGNES_INIT } : form.signes })} />
          <p className="text-uppercase fw-bold text-secondary mb-3" style={{ fontSize: "0.78rem" }}>Signes fonctionnels</p>
          <div className="row g-2 mb-4 pb-4 border-bottom">
            {SIGNES_KEYS.map((signe) => (
              <div key={signe} className="col-6 col-md-4 col-lg-3">
                <SigneCard label={SIGNES_LABELS[signe]} value={form.signes[signe]} disabled={form.rasChecked}
                  onChange={(val) => patchForm({ signes: { ...form.signes, [signe]: val } })} />
              </div>
            ))}
          </div>
          <AutresSignesSection title="Autres signes fonctionnels"
            appareils={data.appareils} autresSignes={form.autresSignes}
            appareilSelectionne={form.appareilSel} descriptionSigne={form.description}
            onAppareilChange={(v) => patchForm({ appareilSel: v })}
            onDescriptionChange={(v) => patchForm({ description: v })}
            onAjouter={ajouterAutreSigne}
            onSupprimer={supprimerAutreSigne}
            onModifierDescription={modifierDescription} />
          <BoutonEnregistrer isModifying={form.isModifying} loading={ui.saving} onClick={handleSave} />
        </FormulaireWrapper>
      )}
    </div>
  );
}