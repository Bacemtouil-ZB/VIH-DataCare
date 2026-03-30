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
  PageTitle,
  SearchBar,
  Spinner,
} from "../../../../../shared/components";
import { toFrDate, toInputDate } from "../../../../../shared/utils/dateHelpers";
import { getStatutStyle } from "./prescreptionMedicalHelpers";
import { STATUT_LABELS } from "./prescreptionMedicalConstants";
import ConfirmPrescriptionModal from "../../../components/UI/Confirmprescriptionmodal";

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
  searchTerm,
  setSearchTerm,
  searchDate,
  setSearchDate,
  openCreate,
  confirmationModal,
  closeConfirmationModal,
  confirmPrescription,
  medecinDisplayName,
}) {
  const today = toInputDate(new Date());

  return (
    <div className="ec-page-bg pe-page">
      <PageTitle title="Prescription medicale" />

      <div className="pe-toolbar">
        <div className="pe-toolbar-left">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un medicament, .."
            wrapperClassName="pe-search"
          />
          <SearchBar
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            wrapperClassName="pe-search pe-search-date"
            max={today}
          />
        </div>
        {!showForm ?
          <ActionButton action="add" label="Ajouter" size="sm" onClick={openCreate} />
          : <ActionButton action="annuler" label="Annuler" size="sm" onClick={closeForm} />}
      </div>

      {showForm && (
        <FormulaireWrapper
          isModifying={isModifying}
          labelCreate="Nouvelle prescription medicale"
          labelModify="Modifier la prescription"
        >
          <form onSubmit={handleSubmit}>
            <div className="pe-form-grid">
              <div className="pe-col-span-2">
                <div className="pe-med-row">
                  <div className="pe-med-col">
                    <FieldLabel required>Medicament</FieldLabel>
                    <select
                      className="pe-select form-select"
                      value={formData.medicament_id}
                      onChange={handleMedSelect}
                      required
                    >
                      <option value="">-- Selectionner un medicament --</option>
                      {stockItems.map((med) => (
                        <option
                          key={med.id}
                          value={med.id}
                          disabled={(med.quantite ?? med.quantity ?? 0) === 0}  // Désactive les médicaments en stock 0
                        >
                          {med.code ? `[${med.code}] : ` : ""}
                          {med.composition || med.nom || "Medicament"}
                          —Stock : {med.quantite ?? med.quantity ?? 0}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pe-med-qty">
                    <FieldLabel>Qte stock</FieldLabel>
                    <Input
                      type="text"
                      value={selectedMed ? (selectedMed.quantite ?? selectedMed.quantity ?? 0) : ""}
                      placeholder="--"
                      disabled
                      className="pe-qty-mini"
                    />
                  </div>
                </div>
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
                <FieldLabel required>Quantite prescrite</FieldLabel>
                <Input
                  type="number"
                  min="1"
                  value={formData.quantite}
                  onChange={field("quantite")}
                />
              </div>

              <div className="pe-col-span-2">
                <FieldLabel>Remarque</FieldLabel>
                <textarea
                  className="pe-textarea form-control"
                  rows={3}
                  value={formData.remarque}
                  onChange={field("remarque")}
                  placeholder="Observations ou instructions complementaires (optionnel)"
                />
              </div>
            </div>

            <div className="pe-form-actions">
              <ActionButton
                action="save"
                label={isModifying ? "Mettre a jour" : "Confirmer"}
                loading={saving}
                size="sm"
                showIcon={false}
                block={true}
                type="submit"
              />
            </div>
          </form>
        </FormulaireWrapper>
      )}

      <HistoriqueAccordeon
        title="Historique des prescriptions medicales"
        count={filtered.length}
        open={showHistory}
        onToggle={() => setShowHistory((v) => !v)}
      >
        {loading ?
          <Spinner />
          : filtered.length === 0 ?
            <EmptyState message="Aucune prescription enregistree." />
            : <HistoriqueTable
              headers={["Date", "Medicament","Dosage", "Qte", "Statut", "Action"]}
              items={filtered}
              emptyMessage="Aucune prescription enregistree."
              renderRow={(p) => (
                <tr key={p.id}>
                  <td>{toFrDate(p.date)}</td>
                  <td className="fw-semibold">{p.traitement || "-"}</td>
                  <td>{p.dosage || "-"}</td>
                  <td>{p.quantite || "-"}</td>
                  <td>
                    <Badge bg={getStatutStyle(p.statut).bg} color={getStatutStyle(p.statut).color}>
                      {STATUT_LABELS[p.statut] || p.statut || "-"}
                    </Badge>
                  </td>
                  <td>
                    <HistoriqueActions
                      onDetails={() => handleShowDetails(p)}
                    />
                  </td>
                </tr>
              )}
            />}
      </HistoriqueAccordeon>

      {detailItem && (
        <FormulaireWrapper
          isModifying={false}
          labelCreate="Details de la prescription"
          labelModify="Details de la prescription"
        >
          <div className="pe-detail-grid">
            <div>
              <FieldLabel>Medicament</FieldLabel>
              <Input value={detailItem.traitement || "-"} disabled />
            </div>
            <div>
              <FieldLabel>Date</FieldLabel>
              <Input value={toFrDate(detailItem.date)} disabled />
            </div>
            <div>
              <FieldLabel>Dosage</FieldLabel>
              <Input value={detailItem.dosage || "-"} disabled />
            </div>
            <div>
              <FieldLabel>Quantite prescrite</FieldLabel>
              <Input value={detailItem.quantite || "-"} disabled />
            </div>
            <div>
              <FieldLabel>Statut</FieldLabel>
              <Input value={STATUT_LABELS[detailItem.statut] || detailItem.statut || "-"} disabled />
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <FieldLabel>Remarque</FieldLabel>
              <textarea className="pe-textarea form-control" rows={3} value={detailItem.remarque || "-"} disabled />
            </div>
          </div>
          <div className="pe-form-actions">
            <ActionButton action="annuler" label="Fermer" size="sm" onClick={() => setDetailItem(null)} />
          </div>
        </FormulaireWrapper>
      )}

      <ConfirmPrescriptionModal
        show={!!confirmationModal}
        data={confirmationModal?.data}
        saving={saving}
        medecinDisplayName={medecinDisplayName}
        onConfirm={confirmPrescription}
        onClose={closeConfirmationModal}
      />
    </div>
  );
}