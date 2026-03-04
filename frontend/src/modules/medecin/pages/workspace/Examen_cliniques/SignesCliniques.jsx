import { useState, useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAction } from "../../../../../shared/utils/uiAlerts";
import { createSigneClinique, updateSigneClinique, getSigneCliniqueByNumeroDossier } from "../../../services/examenCliniqueServices/signeCliniqueService";
import { getAppareils } from "../../../services/examenCliniqueServices/signesFonctionService";
import { calcIMC, UI_INIT, FORM_SC_INIT } from "./examenConfig";
import { PAGE_BG, LABEL_CLS, STYLES, PageHeader,
  HistoriqueAccordeon, HistoriqueTable, HistoriqueActions, EmptyState, FormulaireWrapper, AutresSignesSection, BoutonEnregistrer, Badge, ImcField, parseApiError } from "./Examencomponents";

export default function SignesCliniques() {
  const { numero } = useParams();
  const { examenId } = useOutletContext();
  const [ui, setUi] = useState({ ...UI_INIT, showHistory: false });
  const [form, setForm] = useState({ ...FORM_SC_INIT });
  const [data, setData] = useState({ appareils: [], historique: [] });
  const [detailSigne, setDetailSigne] = useState(null);

  const patchUi = (p) => setUi((s) => ({ ...s, ...p }));
  const patchForm = (p) => setForm((s) => ({ ...s, ...p }));
  const patchData = (p) => setData((s) => ({ ...s, ...p }));

  const imc = form.taille && form.poids && +form.taille > 0 && +form.poids > 0
    ? calcIMC(+form.taille, +form.poids)
    : null;

  useEffect(() => {
    if (!numero) return;
    (async () => {
      patchUi({ loading: true });
      try {
        const [ar, hr] = await Promise.all([getAppareils(), getSigneCliniqueByNumeroDossier(numero)]);
        patchData({ appareils: ar?.appareils || [], historique: hr?.signes || [] });
      } catch {
        patchData({ historique: [] });
      } finally {
        patchUi({ loading: false });
      }
    })();
  }, [numero]);

  const resetForm = () => setForm({ ...FORM_SC_INIT });
  const handleCancel = () => {
    patchUi({ showForm: false });
    resetForm();
    toast.info("Operation annulee");
  };

  const handleEdit = async (s) => {
    const ok = await confirmAction(
      "Modifier ce signe clinique ?",
      `Date : ${new Date(s.date_examen).toLocaleDateString("fr-FR")} - Taille : ${s.taille} cm - Poids : ${s.poids} kg`
    );
    if (!ok) {
      toast.info("Operation annulee");
      return;
    }
    setDetailSigne(null);
    setForm({
      signeId: s.id,
      isModifying: true,
      taille: s.taille || "",
      poids: s.poids || "",
      autresSignes: (s.autres_signes || []).map(({ id, appareil_id, appareil, description }) => ({
        id,
        appareil_id,
        appareil,
        description,
      })),
      appareilSel: "",
      description: "",
    });
    patchUi({ showForm: true });
    toast.info("Mode modification active");
  };

  const handleShowDetails = (s) => {
    patchUi({ showForm: false });
    setDetailSigne(s);
  };

  const ajouterAutreSigne = () => {
    if (!form.appareilSel) {
      toast.error("Veuillez selectionner un appareil");
      return;
    }
    if (!form.description.trim()) {
      toast.error("Veuillez saisir une description");
      return;
    }
    const app = data.appareils.find((a) => a.id === parseInt(form.appareilSel, 10));
    if (!app) {
      toast.error("Appareil non trouve");
      return;
    }
    patchForm({
      autresSignes: [...form.autresSignes, {
        id: Date.now(),
        appareil_id: app.id,
        appareil: app.libelle,
        description: form.description.trim(),
      }],
      appareilSel: "",
      description: "",
    });
    toast.success("Signe ajoute");
  };

  const supprimerAutreSigne = async (id) => {
    const ok = await confirmAction("Supprimer ce signe ?", "Cette action est irreversible.");
    if (!ok) {
      toast.info("Operation annulee");
      return;
    }
    patchForm({ autresSignes: form.autresSignes.filter((s) => s.id !== id) });
    toast.success("Signe supprime");
  };

  const modifierDescription = (id, nouvelleDesc) => {
    patchForm({ autresSignes: form.autresSignes.map((s) => (s.id === id ? { ...s, description: nouvelleDesc } : s)) });
    toast.success("Description mise a jour");
  };

  const handleEnregistrer = async () => {
    if (!form.taille || !form.poids) {
      toast.error("Veuillez renseigner la taille et le poids");
      return;
    }
    if (+form.taille <= 0 || +form.taille > 250) {
      toast.error("Taille invalide (1-250 cm)");
      return;
    }
    if (+form.poids <= 0 || +form.poids > 300) {
      toast.error("Poids invalide (1-300 kg)");
      return;
    }
    patchUi({ saving: true });
    try {
      const payload = {
        examen_clinique_id: examenId,
        taille: +form.taille,
        poids: +form.poids,
        autres_signes: form.autresSignes.map(({ appareil_id, description }) => ({ appareil_id, description })),
      };
      if (form.isModifying && form.signeId) {
        await updateSigneClinique(form.signeId, payload);
        toast.success("Signes cliniques mis a jour");
      } else {
        const res = await createSigneClinique(payload);
        patchForm({ signeId: res?.signe?.id || null });
        toast.success("Signes cliniques enregistres");
      }
      patchUi({ showForm: false });
      resetForm();
      const hr = await getSigneCliniqueByNumeroDossier(numero);
      patchData({ historique: hr?.signes || [] });
    } catch (e) {
      toast.error(parseApiError(e));
    } finally {
      patchUi({ saving: false });
    }
  };

  return (
    <div style={PAGE_BG}>
      <PageHeader
        showForm={ui.showForm}
        onOpen={() => {
          setDetailSigne(null);
          resetForm();
          patchUi({ showForm: true });
        }}
        onCancel={handleCancel}
      />

      <HistoriqueAccordeon
        title="Historique des signes cliniques"
        count={data.historique.length}
        open={ui.showHistory}
        onToggle={() => patchUi({ showHistory: !ui.showHistory })}
      >
        <HistoriqueTable
          headers={["Date", "Taille (cm)", "Poids (kg)", "IMC", "Action"]}
          items={data.historique}
          emptyMessage="Aucun signe clinique enregistre"
          renderRow={(s) => {
            const si = s.taille && s.poids ? calcIMC(+s.taille, +s.poids) : null;
            return (
              <tr key={s.id}>
                <td style={STYLES.tdDate}>{s.date_examen ? new Date(s.date_examen).toLocaleDateString("fr-FR") : "N/A"}</td>
                <td><Badge bg="#dbeafe" color="#1d4ed8">{s.taille ?? "N/A"}</Badge></td>
                <td><Badge bg="#dcfce7" color="#166534">{s.poids ?? "N/A"}</Badge></td>
                <td>{si ? <span style={{ color: si.color, fontWeight: 700 }}>{si.val} <small style={{ fontWeight: 400 }}>{si.label}</small></span> : "N/A"}</td>
                <td>
                  <HistoriqueActions onDetails={() => handleShowDetails(s)} onEdit={() => handleEdit(s)} />
                </td>
              </tr>
            );
          }}
        />
      </HistoriqueAccordeon>

      {detailSigne && (
        <FormulaireWrapper isModifying={false} labelCreate="Details du signe clinique" labelModify="Details du signe clinique">
          <div className="ec-readonly-block">
            <p className="text-uppercase fw-bold text-secondary mb-3" style={STYLES.thSm}>Mesures anthropometriques</p>
            <div className="d-flex gap-4 flex-wrap mb-4 pb-4 border-bottom">
              <div style={STYLES.flexInput}>
                <label className={LABEL_CLS} style={STYLES.thSm}>Taille (cm)</label>
                <input type="number" className="form-control form-control-sm" value={detailSigne.taille ?? ""} disabled readOnly />
              </div>
              <div style={STYLES.flexInput}>
                <label className={LABEL_CLS} style={STYLES.thSm}>Poids (kg)</label>
                <input type="number" className="form-control form-control-sm" value={detailSigne.poids ?? ""} disabled readOnly />
              </div>
              <div style={STYLES.flexInputL}>
                <label className={LABEL_CLS} style={STYLES.thSm}>IMC (kg/m2)</label>
                <ImcField imc={detailSigne.taille && detailSigne.poids ? calcIMC(+detailSigne.taille, +detailSigne.poids) : null} />
              </div>
            </div>

            <p className="text-uppercase fw-bold text-secondary mb-3" style={STYLES.thSm}>Autres signes cliniques</p>
            {detailSigne.autres_signes?.length > 0 ? (
              <table className="table table-sm table-hover mb-4">
                <thead className="table-light">
                  <tr>
                    <th className="ec-th-appareil">Appareil</th>
                    <th className="ec-th-desc">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {detailSigne.autres_signes.map((as, i) => (
                    <tr key={`${as.appareil || "app"}-${i}`}>
                      <td className="ec-td-vmiddle">
                        <Badge bg="#e0f2fe" color="#0369a1">{as.appareil || "-"}</Badge>
                      </td>
                      <td className="ec-td-vmiddle">
                        <span className="ec-desc-text">{as.description || "-"}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState message="Aucun autre signe" />
            )}
          </div>

          <div className="d-flex justify-content-end">
            <button className="btn btn-sm btn-outline-secondary" onClick={() => setDetailSigne(null)}>Fermer details</button>
          </div>
        </FormulaireWrapper>
      )}

      {ui.showForm && (
        <FormulaireWrapper isModifying={form.isModifying} labelCreate="Nouveau signe clinique" labelModify="Modifier le signe clinique">
          <p className="text-uppercase fw-bold text-secondary mb-3" style={STYLES.thSm}>Mesures anthropometriques</p>
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
              <label className={LABEL_CLS} style={STYLES.thSm}>IMC (kg/m2)</label>
              <ImcField imc={imc} />
            </div>
          </div>
          <AutresSignesSection
            title="Autres signes cliniques"
            appareils={data.appareils}
            autresSignes={form.autresSignes}
            appareilSelectionne={form.appareilSel}
            descriptionSigne={form.description}
            onAppareilChange={(v) => patchForm({ appareilSel: v })}
            onDescriptionChange={(v) => patchForm({ description: v })}
            onAjouter={ajouterAutreSigne}
            onSupprimer={supprimerAutreSigne}
            onModifierDescription={modifierDescription}
          />
          <BoutonEnregistrer isModifying={form.isModifying} loading={ui.saving} onClick={handleEnregistrer} />
        </FormulaireWrapper>
      )}
    </div>
  );
}
