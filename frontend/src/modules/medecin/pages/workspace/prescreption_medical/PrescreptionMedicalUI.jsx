import {
  ActionButton,
  Badge,
  EmptyState,
  FieldLabel,
  FormulaireWrapper,
  HistoriqueAccordeon,
  HistoriqueActions,
  HistoriqueTable,
  Input,
  Spinner,
} from "../../../../../shared/components";
import { toFrDate } from "../../../../../shared/utils/dateHelpers";
import { getStatutStyle } from "./prescreptionMedicalHelpers";
import { STATUT_LABELS } from "./prescreptionMedicalConstants";

export default function PrescreptionMedicalUI({
  filtered,
  loading,
  showHistory,
  setShowHistory,
  handleShowDetails,
  openEdit,
  detailItem,
  setDetailItem,
  showForm,
  formData,
  field,
  handleMedSelect,
  stockItems,
  selectedMed,
  isModifying,
  saving,
  closeForm,
  handleSubmit,
}) {
  return (
    <>
      {showForm && (
        <FormulaireWrapper
          isModifying={isModifying}
          labelCreate="Nouvelle prescription médicale"
          labelModify="Modifier la prescription"
        >
          <form onSubmit={handleSubmit}>
            <div className="pe-form-grid">
              <div className="pe-col-span-2">
                <FieldLabel required>Médicament (stock)</FieldLabel>
                <select
                  className="pe-select form-select"
                  value={formData.medicament_id}
                  onChange={handleMedSelect}
                  required
                >
                  <option value="">-- Sélectionner un médicament --</option>
                  {stockItems.map((med) => (
                    <option key={med.id} value={med.id}>
                      {med.code ? `[${med.code}]` : ""} {med.composition || med.nom || "Médicament"} - Stock : {med.quantite ?? med.quantity ?? 0}
                    </option>
                  ))}
                </select>
                {selectedMed && (
                  <p className={`pe-stock-hint ${(selectedMed.quantite ?? selectedMed.quantity ?? 0) === 0 ? "alerte" : ""}`}>
                    {(selectedMed.quantite ?? selectedMed.quantity ?? 0) === 0
                      ? "Attention : rupture de stock - médicament indisponible"
                      : `Quantité disponible : ${selectedMed.quantite ?? selectedMed.quantity}`}
                  </p>
                )}
              </div>

              <div>
                <FieldLabel required>Posologie</FieldLabel>
                <Input
                  value={formData.posologie}
                  onChange={field("posologie")}
                  placeholder="Ex : 1 comprimé matin et soir"
                />
              </div>

              <div>
                <FieldLabel>Dosage</FieldLabel>
                <Input
                  value={formData.dosage}
                  onChange={field("dosage")}
                  placeholder="Ex : 500 mg"
                />
              </div>

              <div>
                <FieldLabel required>Date de prescription</FieldLabel>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={field("date")}
                />
              </div>

              <div>
                <FieldLabel required>Quantité prescrite</FieldLabel>
                <Input
                  type="number"
                  min="1"
                  value={formData.quantite}
                  onChange={field("quantite")}
                  placeholder="Ex : 30"
                />
              </div>

              <div className="pe-col-span-2">
                <FieldLabel>Remarque</FieldLabel>
                <textarea
                  className="pe-textarea form-control"
                  rows={3}
                  value={formData.remarque}
                  onChange={field("remarque")}
                  placeholder="Observations ou instructions complémentaires (optionnel)"
                />
              </div>
            </div>

            <div className="pe-form-actions">
              <ActionButton
                action="annuler"
                label="Annuler"
                size="sm"
                onClick={closeForm}
                type="button"
              />
              <ActionButton
                action="save"
                label={isModifying ? "Mettre é jour" : "Enregistrer"}
                loading={saving}
                size="sm"
                showIcon={false}
                type="submit"
              />
            </div>
          </form>
        </FormulaireWrapper>
      )}

      <HistoriqueAccordeon
        title="Historique des prescriptions médicales"
        count={filtered.length}
        open={showHistory}
        onToggle={() => setShowHistory((v) => !v)}
      >
        {loading ? (
          <Spinner />
        ) : filtered.length === 0 ? (
          <EmptyState message="Aucune prescription enregistrée." />
        ) : (
          <HistoriqueTable
            headers={["Date", "Médicament", "Posologie", "Dosage", "Qté", "Statut", "Action"]}
            items={filtered}
            emptyMessage="Aucune prescription enregistrée."
            renderRow={(p) => (
              <tr key={p.id}>
                <td>{toFrDate(p.date)}</td>
                <td className="fw-semibold">{p.traitement || "-"}</td>
                <td>{p.posologie || "-"}</td>
                <td>{p.dosage || "-"}</td>
                <td>{p.quantite || "-"}</td>
                <td>
                  <Badge
                    bg={getStatutStyle(p.statut).bg}
                    color={getStatutStyle(p.statut).color}
                  >
                    {STATUT_LABELS[p.statut] || p.statut}
                  </Badge>
                </td>
                <td>
                  <HistoriqueActions
                    onDetails={() => handleShowDetails(p)}
                    onEdit={() => openEdit(p)}
                  />
                </td>
              </tr>
            )}
          />
        )}
      </HistoriqueAccordeon>

      {detailItem && (
        <FormulaireWrapper
          isModifying={false}
          labelCreate="Détails de la prescription"
          labelModify="Détails de la prescription"
        >
          <div className="pe-detail-grid">
            <div>
              <FieldLabel>Médicament</FieldLabel>
              <Input value={detailItem.traitement || "-"} disabled />
            </div>
            <div>
              <FieldLabel>Date</FieldLabel>
              <Input value={toFrDate(detailItem.date)} disabled />
            </div>
            <div>
              <FieldLabel>Posologie</FieldLabel>
              <Input value={detailItem.posologie || "-"} disabled />
            </div>
            <div>
              <FieldLabel>Dosage</FieldLabel>
              <Input value={detailItem.dosage || "-"} disabled />
            </div>
            <div>
              <FieldLabel>Quantité prescrite</FieldLabel>
              <Input value={detailItem.quantite || "-"} disabled />
            </div>
            <div>
              <FieldLabel>Statut</FieldLabel>
              <Input value={STATUT_LABELS[detailItem.statut] || detailItem.statut || "-"} disabled />
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <FieldLabel>Remarque</FieldLabel>
              <textarea
                className="pe-textarea form-control"
                rows={3}
                value={detailItem.remarque || "-"}
                disabled
              />
            </div>
          </div>
          <div className="pe-form-actions">
            <ActionButton
              action="annuler"
              label="Fermer"
              size="sm"
              onClick={() => setDetailItem(null)}
            />
          </div>
        </FormulaireWrapper>
      )}
    </>
  );
}
