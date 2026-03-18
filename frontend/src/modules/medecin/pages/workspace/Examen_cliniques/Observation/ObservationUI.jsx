import {
  FormulaireWrapper,
  HistoriqueAccordeon,
  HistoriqueActions,
  HistoriqueTable,
} from "../../../../../../shared/components";
import { ActionButton } from "../../../../../../shared/components";
import { formatDateFr } from "../../../../../../shared/utils/logiqueTableHistory";
import { HISTORY_HEADERS, LABEL_CLS } from "./observationConstants";

export default function ObservationUI({
  historique,
  showHistory,
  setShowHistory,
  handleShowDetails,
  handleEdit,
  detailObservation,
  setDetailObservation,
  showForm,
  remarque,
  setRemarque,
  isModifying,
  saving,
  handleSave,
}) {
  return (
    <>
      {showForm && (
        <FormulaireWrapper isModifying={isModifying} labelCreate="Nouvelle observation" labelModify="Modifier l'observation">
          <div className="mb-4">
            <label className={`${LABEL_CLS} ec-th-sm`}>Remarques observées</label>
            <textarea
              className="form-control ec-observation-textarea"
              rows={6}
              placeholder="Décrivez les observations médicales..."
              value={remarque}
              onChange={(e) => setRemarque(e.target.value)}
            />
            <div className="d-flex justify-content-end mt-1">
              <small className="text-secondary">{remarque.length} caractère{remarque.length !== 1 ? "s" : ""}</small>
            </div>
          </div>
          <ActionButton
            action="save"
            block={true}
            loading={saving}
            label={isModifying ? "Enregistrer les modifications" : "Enregistrer la fiche"}
            onClick={handleSave}
            showIcon={false}
          />
        </FormulaireWrapper>
      )}

      <HistoriqueAccordeon
        title="Historique des observations"
        count={historique.length}
        open={showHistory}
        onToggle={() => setShowHistory((v) => !v)}
      >
        <HistoriqueTable
          headers={HISTORY_HEADERS}
          items={historique}
          emptyMessage="Aucune observation enregistrée"
          renderRow={(obs) => (
            <tr key={obs.id}>
              <td className="ec-td-date">{formatDateFr(obs.date_examen)}</td>
              <td className="ec-td-max">
                {obs.remarque?.length > 120 ? (
                  <>
                    {obs.remarque.slice(0, 120)}
                    <span className="text-secondary">...</span>
                  </>
                ) : obs.remarque}
              </td>
              <td><HistoriqueActions onDetails={() => handleShowDetails(obs)} onEdit={() => handleEdit(obs)} /></td>
            </tr>
          )}
        />
      </HistoriqueAccordeon>

      {detailObservation && (
        <FormulaireWrapper isModifying={false} labelCreate="Détails de l'observation" labelModify="Détails de l'observation">
          <div className="ec-readonly-block">
            <div className="mb-4">
              <label className={`${LABEL_CLS} ec-th-sm`}>Remarques observées</label>
              <textarea
                className="form-control ec-observation-textarea"
                rows={6}
                value={detailObservation.remarque || ""}
                disabled
                readOnly
              />
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <button className="btn btn-sm btn-outline-secondary" onClick={() => setDetailObservation(null)}>Fermer les détails</button>
          </div>
        </FormulaireWrapper>
      )}
    </>
  );
}

