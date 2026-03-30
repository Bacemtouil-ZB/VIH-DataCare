
import {
  ActionButton,
  FieldLabel,
  FormulaireWrapper,
  HistoriqueAccordeon,
  HistoriqueActions,
  HistoriqueTable,
  Spinner,
} from "../../../../../shared/components/index";
import Toggle   from "../../../components/UI/Toggle";
import Textarea from "../../../components/UI/Textarea";
import PageTitle from "../../../components/UI/PageTitle";
import { BILANS }              from "./bilanExamenConstants";
import { formatBilanSummary }  from "./bilanExamenHelpers";


function BilanGrid({ formData, onToggle, disabled }) {
  return (
    <div className="bilan-grid">
      {BILANS.map((bilan) => (
        <div
          key={bilan.key}
          className={`bilan-item ${bilan.isMaster ? "bilan-item--master" : ""}`}
        >
          <Toggle
            label={bilan.label}
            checked={!!formData[bilan.key]}
            onChange={() => onToggle(bilan.key)}
            disabled={disabled}
          />
        </div>
      ))}
    </div>
  );
}


export default function BilanExamenUI({
  // données
  bilans,
  loading,
  saving,
  showForm,
  showHistory,  setShowHistory,
  isModifying,
  detailItem,
  formData,     setFormData,
  // actions
  openCreate,
  closeForm,
  openEdit,
  handleShowDetails,
  closeDetail,
  handleToggle,
  handleSubmit,
}) {
  return (
    <div className="ec-page-bg bilan-page">
      <PageTitle title="Prescription des bilans d'examens" />

      {/* ── Toolbar ─────────────────────────────────────────── */}
      <div className="bilan-toolbar">
        {!showForm ? (
          <ActionButton action="add" label="Nouveau bilan" size="sm" onClick={openCreate} />
        ) : (
          <ActionButton action="annuler" label="Annuler" size="sm" onClick={() => closeForm()} />
        )}
      </div>

      {/* ── Formulaire création / modification ──────────────── */}
      {showForm && (
        <FormulaireWrapper
          isModifying={isModifying}
          labelCreate="Nouveau bilan d'examens"
          labelModify="Modifier le bilan d'examens"
        >
          <form onSubmit={handleSubmit}>
            <BilanGrid formData={formData} onToggle={handleToggle} disabled={saving} />

            <div className="bilan-observations">
              <FieldLabel>Remarques</FieldLabel>
              <Textarea
                value={formData.observations}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, observations: e.target.value }))
                }
                placeholder="Observations cliniques, instructions particulières..."
                disabled={saving}
              />
            </div>

            <div className="bilan-form-actions">
              <ActionButton
                action="save"
                label={isModifying ? "Mettre à jour" : "Enregistrer"}
                showIcon={false}
                size="sm"
                block
                loading={saving}
                loadingLabel="Enregistrement..."
              />
            </div>
          </form>
        </FormulaireWrapper>
      )}

      {/* ── Historique ──────────────────────────────────────── */}
      <HistoriqueAccordeon
        title="Historique des bilans prescrits"
        count={bilans.length}
        open={showHistory}
        onToggle={() => setShowHistory((v) => !v)}
      >
        {loading ? (
          <Spinner />
        ) : (
          <HistoriqueTable
            headers={["Date", "Bilans", "Observations", "Action"]}
            items={bilans}
            emptyMessage="Aucun bilan prescrit."
            renderRow={(b) => (
              <tr key={b.id}>
                <td>{new Date(b.created_at).toLocaleDateString("fr-FR")}</td>
                <td>
                  <span className="bilan-summary">{formatBilanSummary(b)}</span>
                </td>
                <td className="bilan-obs-cell">
                  {b.observations
                    ? b.observations
                    : <span className="text-muted">—</span>}
                </td>
                <td>
                  <HistoriqueActions
                    onDetails={() => handleShowDetails(b)}
                    onEdit={() => openEdit(b)}
                  />
                </td>
              </tr>
            )}
          />
        )}
      </HistoriqueAccordeon>

      {/* ── Détail (lecture seule) ───────────────────────────── */}
      {detailItem && (
        <FormulaireWrapper
          isModifying={false}
          labelCreate="Détails du bilan"
          labelModify="Détails du bilan"
        >
          <div className="ec-readonly-block">
            <BilanGrid
              formData={detailItem}
              onToggle={() => {}}
              disabled
            />

            {detailItem.observations && (
              <div className="bilan-observations">
                <FieldLabel>Observations</FieldLabel>
                <Textarea value={detailItem.observations} disabled />
              </div>
            )}

            <div className="bilan-form-actions">
              <ActionButton
                action="annuler"
                label="Fermer"
                size="sm"
                onClick={closeDetail}
              />
            </div>
          </div>
        </FormulaireWrapper>
      )}
    </div>
  );
}