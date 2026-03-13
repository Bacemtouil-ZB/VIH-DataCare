import {
  HistoriqueAccordeon,
  HistoriqueActions,
  HistoriqueTable,
  EmptyState,
  FormulaireWrapper,
  Badge,
  AutresSignesSection,
  RasToggle,
} from "../index";
import { ActionButton } from "../../../../../../shared/components";
import ToggleSwitch from "../../../../components/buttons/ToggleSwitch";
import { formatDateFr } from "../../../../../../shared/utils/logiqueTableHistory";
import { HISTORY_HEADERS ,SIGNES_KEYS, SIGNES_LABELS, SIGNES_INIT, getSignesPositifs } from "./signesFonctionnelsConstants";

export default function SignesFonctionnelsUI({
  historique,
  showHistory,
  setShowHistory,
  handleShowDetails,
  handleEdit,
  detailSigne,
  setDetailSigne,
  showForm,
  isModifying,
  saving,
  rasChecked,
  setRasChecked,
  signes,
  setSignes,
  appareils,
  autresSignes,
  appareilSel,
  description,
  setAppareilSel,
  setDescription,
  ajouterAutreSigne,
  supprimerAutreSigne,
  modifierDescription,
  handleSave,
}) {
  return (
    <>
      {showForm && (
        <FormulaireWrapper isModifying={isModifying} labelCreate="Nouveau signe fonctionnel" labelModify="Modifier le signe fonctionnel">
          <RasToggle
            checked={rasChecked}
            onChange={(v) => {
              setRasChecked(v);
              if (v) setSignes({ ...SIGNES_INIT });
            }}
          />
          <p className="text-uppercase fw-bold text-secondary mb-3 ec-section-title-mini">Signes fonctionnels</p>
          <div className="row g-2 mb-4 pb-4 border-bottom">
            {SIGNES_KEYS.map((signeKey) => (
              <div key={signeKey} className="col-6 col-md-4 col-lg-3">
                <div className="ec-sf-form-toggle">
                  <ToggleSwitch
                    id={`form-sf-${signeKey}`}
                    label={SIGNES_LABELS[signeKey]}
                    checked={!!signes[signeKey]}
                    disabled={rasChecked}
                    onChange={(val) => setSignes((prev) => ({ ...prev, [signeKey]: val }))}
                  />
                </div>
              </div>
            ))}
          </div>

          <AutresSignesSection
            title="Autres signes fonctionnels"
            appareils={appareils}
            autresSignes={autresSignes}
            appareilSelectionne={appareilSel}
            descriptionSigne={description}
            onAppareilChange={setAppareilSel}
            onDescriptionChange={setDescription}
            onAjouter={ajouterAutreSigne}
            onSupprimer={supprimerAutreSigne}
            onModifierDescription={modifierDescription}
          />
          <ActionButton
            action="save"
            block={true}
            loading={saving}
            label={isModifying ? "Enregistrer les modifications" : "Enregistrer la fiche"}
            onClick={handleSave}
            showIcon={false}
            height="40px"
          />
        </FormulaireWrapper>
      )}

      <HistoriqueAccordeon
        title="Historique des signes fonctionnels"
        count={historique.length}
        open={showHistory}
        onToggle={() => setShowHistory((v) => !v)}
      >
        <HistoriqueTable
          headers={HISTORY_HEADERS}
          items={historique}
          emptyMessage="Aucun signe fonctionnel enregistré"
          renderRow={(s) => {
            const pos = getSignesPositifs(s);
            return (
              <tr key={s.id}>
                <td className="ec-td-date">{formatDateFr(s.date_examen)}</td>
                <td>
                  {s.ras ? (
                    <Badge bg="#dcfce7" color="#166534">RAS</Badge>
                  ) : pos.length > 0 ? (
                    <div className="d-flex flex-wrap gap-1">{pos.map((n, i) => <Badge key={i} bg="#fef3c7" color="#92400e">{n}</Badge>)}</div>
                  ) : (
                    <small className="text-secondary">Aucun</small>
                  )}
                </td>
                <td><HistoriqueActions onDetails={() => handleShowDetails(s)} onEdit={() => handleEdit(s)} /></td>
              </tr>
            );
          }}
        />
      </HistoriqueAccordeon>

      {detailSigne && (
        <FormulaireWrapper isModifying={false} labelCreate="Détails du signe fonctionnel" labelModify="Détails du signe fonctionnel">
          <div className="ec-readonly-block">
            <p className="text-uppercase fw-bold text-secondary mb-3 ec-section-title-mini">Signes fonctionnels</p>
            <div className="row g-2 mb-4 pb-4 border-bottom">
              {SIGNES_KEYS.map((signeKey) => (
                <div key={signeKey} className="col-6 col-md-4 col-lg-3">
                  <div className="ec-sf-detail-toggle">
                    <ToggleSwitch
                      id={`detail-sf-${detailSigne.id || "row"}-${signeKey}`}
                      label={SIGNES_LABELS[signeKey]}
                      checked={!!detailSigne[signeKey]}
                      disabled={true}
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="text-uppercase fw-bold text-secondary mb-3 ec-th-sm">Autres signes fonctionnels</p>
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
                      <td className="ec-td-vmiddle"><Badge bg="#dbeafe" color="#1d4ed8">{as.appareil || "-"}</Badge></td>
                      <td className="ec-td-vmiddle"><span className="ec-desc-text">{as.description || "-"}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState message="Aucun autre signe" />
            )}
          </div>

          <div className="d-flex justify-content-end">
            <button className="btn btn-sm btn-outline-secondary" onClick={() => setDetailSigne(null)}>Fermer détails</button>
          </div>
        </FormulaireWrapper>
      )}
    </>
  );
}

