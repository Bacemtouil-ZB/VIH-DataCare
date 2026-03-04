import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAction } from "../../../../../shared/utils/uiAlerts";
import { getAppareils, getSignesByPatient, createSignesFonctionnels, updateSignesFonctionnels } from "../../../services/examenCliniqueServices/signesFonctionService";
import { SIGNES_KEYS, SIGNES_LABELS, SIGNES_INIT, FORM_SF_INIT, UI_INIT, getSignesPositifs } from "./examenConfig";
import { PAGE_BG, STYLES, PageHeader, HistoriqueAccordeon, HistoriqueTable, HistoriqueActions, EmptyState, FormulaireWrapper, AutresSignesSection, BoutonEnregistrer, Badge, Spinner, RasToggle, parseApiError } from "./Examencomponents";
import ToggleSwitch from "../../../components/buttons/ToggleSwitch";

export default function SignesFonctionnels() {
  const { examenId, patientNumero } = useOutletContext();
  const [ui, setUi] = useState({ ...UI_INIT, showHistory: false });
  const [form, setForm] = useState({ ...FORM_SF_INIT });
  const [data, setData] = useState({ appareils: [], historique: [] });
  const [detailSigne, setDetailSigne] = useState(null);

  const patchUi = (p) => setUi((s) => ({ ...s, ...p }));
  const patchForm = (p) => setForm((s) => ({ ...s, ...p }));
  const patchData = (p) => setData((s) => ({ ...s, ...p }));

  useEffect(() => {
    if (!patientNumero) return;
    (async () => {
      patchUi({ loading: true });
      try {
        const [ar, hr] = await Promise.all([getAppareils(), getSignesByPatient(patientNumero)]);
        patchData({ appareils: ar?.appareils || [], historique: hr?.signes || [] });
      } catch {
        patchData({ historique: [] });
      } finally {
        patchUi({ loading: false });
      }
    })();
  }, [patientNumero]);

  const resetForm = () => setForm({ ...FORM_SF_INIT });
  const handleCancel = () => {
    patchUi({ showForm: false });
    resetForm();
    toast.info("Operation annulee");
  };

  const handleEdit = async (signe) => {
    const pos = getSignesPositifs(signe);
    const ok = await confirmAction(
      "Modifier ce signe fonctionnel ?",
      `Date : ${new Date(signe.date_examen).toLocaleDateString("fr-FR")}${pos.length ? " - " + pos.slice(0, 4).join(", ") : ""}`
    );
    if (!ok) {
      toast.info("Operation annulee");
      return;
    }
    setDetailSigne(null);
    setForm({
      signesId: signe.id,
      isModifying: true,
      rasChecked: signe.ras || false,
      signes: Object.fromEntries(SIGNES_KEYS.map((k) => [k, signe[k] || false])),
      autresSignes: (signe.autres_signes || []).map(({ id, appareil_id, appareil, description }) => ({
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

  const handleShowDetails = (signe) => {
    patchUi({ showForm: false });
    setDetailSigne(signe);
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
        appareil_id: parseInt(app.id, 10),
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

  const handleSave = async () => {
    patchUi({ saving: true });
    try {
      const payload = {
        signes: { ...form.signes, ras: form.rasChecked },
        autres_signes: form.autresSignes.map(({ appareil_id, description }) => ({ appareil_id: parseInt(appareil_id, 10), description })),
      };
      if (form.isModifying && form.signesId) {
        await updateSignesFonctionnels(form.signesId, payload);
        toast.success("Signes fonctionnels mis a jour");
      } else {
        await createSignesFonctionnels({ ...payload, examen_clinique_id: examenId });
        toast.success("Signes fonctionnels enregistres");
      }
      patchUi({ showForm: false });
      resetForm();
      const hr = await getSignesByPatient(patientNumero);
      patchData({ historique: hr?.signes || [] });
    } catch (e) {
      toast.error(parseApiError(e));
    } finally {
      patchUi({ saving: false });
    }
  };

  if (ui.loading) return <Spinner />;

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
        title="Historique des signes fonctionnels"
        count={data.historique.length}
        open={ui.showHistory}
        onToggle={() => patchUi({ showHistory: !ui.showHistory })}
      >
        <HistoriqueTable
          headers={["Date", "Signes positifs", "Action"]}
          items={data.historique}
          emptyMessage="Aucun signe fonctionnel enregistre"
          renderRow={(s) => {
            const pos = getSignesPositifs(s);
            return (
              <tr key={s.id}>
                <td style={STYLES.tdDate}>{s.date_examen ? new Date(s.date_examen).toLocaleDateString("fr-FR") : "N/A"}</td>
                <td>
                  {s.ras ? (
                    <Badge bg="#dcfce7" color="#166534">RAS</Badge>
                  ) : pos.length > 0 ? (
                    <div className="d-flex flex-wrap gap-1">{pos.map((n, i) => <Badge key={i} bg="#fef3c7" color="#92400e">{n}</Badge>)}</div>
                  ) : (
                    <small className="text-secondary">Aucun</small>
                  )}
                </td>
                <td>
                  <HistoriqueActions onDetails={() => handleShowDetails(s)} onEdit={() => handleEdit(s)} />
                </td>
              </tr>
            );
          }}
        />
      </HistoriqueAccordeon>

      {detailSigne && (
        <FormulaireWrapper isModifying={false} labelCreate="Details du signe fonctionnel" labelModify="Details du signe fonctionnel">
          <div className="ec-readonly-block">
            <p className="text-uppercase fw-bold text-secondary mb-3" style={{ fontSize: "0.78rem" }}>Signes fonctionnels</p>
            <div className="row g-2 mb-4 pb-4 border-bottom">
              {SIGNES_KEYS.map((signe) => (
                <div key={signe} className="col-6 col-md-4 col-lg-3">
                  <div className="ec-sf-detail-toggle">
                    <ToggleSwitch
                      id={`detail-sf-${detailSigne.id || "row"}-${signe}`}
                      label={SIGNES_LABELS[signe]}
                      checked={!!detailSigne[signe]}
                      disabled={true}
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="text-uppercase fw-bold text-secondary mb-3" style={STYLES.thSm}>Autres signes fonctionnels</p>
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
                        <Badge bg="#dbeafe" color="#1d4ed8">{as.appareil || "-"}</Badge>
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
        <FormulaireWrapper isModifying={form.isModifying} labelCreate="Nouveau signe fonctionnel" labelModify="Modifier le signe fonctionnel">
          <RasToggle
            checked={form.rasChecked}
            onChange={(v) => patchForm({ rasChecked: v, signes: v ? { ...SIGNES_INIT } : form.signes })}
          />
          <p className="text-uppercase fw-bold text-secondary mb-3" style={{ fontSize: "0.78rem" }}>Signes fonctionnels</p>
          <div className="row g-2 mb-4 pb-4 border-bottom">
            {SIGNES_KEYS.map((signe) => (
              <div key={signe} className="col-6 col-md-4 col-lg-3">
                <div className="ec-sf-form-toggle">
                  <ToggleSwitch
                    id={`form-sf-${signe}`}
                    label={SIGNES_LABELS[signe]}
                    checked={!!form.signes[signe]}
                    disabled={form.rasChecked}
                    onChange={(val) => patchForm({ signes: { ...form.signes, [signe]: val } })}
                  />
                </div>
              </div>
            ))}
          </div>
          <AutresSignesSection
            title="Autres signes fonctionnels"
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
          <BoutonEnregistrer isModifying={form.isModifying} loading={ui.saving} onClick={handleSave} />
        </FormulaireWrapper>
      )}
    </div>
  );
}
