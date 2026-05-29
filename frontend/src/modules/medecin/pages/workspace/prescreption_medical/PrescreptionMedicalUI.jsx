
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
import { 
  getStatutStyle,
  getMedicineDisplayName,
  getMedicineStockQuantity,
  getMultiSelectFooterLabel,
  isOutOfStock,
} from "./prescreptionMedicalHelpers";
import { STATUT_LABELS, UI_TEXTS, FORM_FIELDS, TABLE_HEADERS, STATUS_FILTER_OPTIONS } from "./prescreptionMedicalConstants";
import ConfirmPrescriptionModal from "../../../components/UI/Confirmprescriptionmodal";
import { useMedicationMultiSelect } from "./usePrescreptionMedicalLogic";


// Affiche une liste de médicaments sous forme de badge
function TraitementPills({ medicaments }) {
  if (!medicaments || medicaments.length === 0)
    return <span className="text-muted">-</span>;

  return (
    <div className="pe-traitement-pills">
      {medicaments.map((m, i) => (
        <span key={i} className="pe-traitement-pill">
          {m.medicament_nom_snapshot || "-"}
        </span>
      ))}
    </div>
  );
}


// Sélecteur multi-médicaments avec dropdown et checkboxes
function MedMultiSelect({ stockItems, selectedIds, onChange }) {
  const {
    open,
    search,
    filtered,
    selectedMeds,
    wrapperRef,
    setSearch,
    closeDropdown,
    toggleDropdown,
    toggleMedicine,
    removeMedicine,
  } = useMedicationMultiSelect(stockItems, selectedIds, onChange);

  return (
    <div className="pe-col-span-2">
      <FieldLabel required>{FORM_FIELDS.medicaments.label}</FieldLabel>

      <div ref={wrapperRef} className="pe-ms-wrapper">
        {/* Trigger */}
        <div
          className={`pe-ms-trigger${open ? " open" : ""}`}
          onClick={toggleDropdown}
        >
          <div className="pe-ms-trigger-inner">
            {selectedMeds.length === 0 ? (
              <span className="pe-ms-placeholder">
                {UI_TEXTS.selectMedicines}
              </span>
            ) : (
              selectedMeds.map((m) => (
                <span key={m.id} className="pe-ms-tag">
                  [{m.code || m.composition}]
                  <span
                    className="pe-ms-tag-remove"
                    onClick={(e) => {
                      //pour éviter que les clics internes ferment le dropdown.
                      e.stopPropagation();
                      removeMedicine(m.id);
                    }}
                  >
                    ×
                  </span>
                </span>
              ))
            )}
          </div>
          <span className={`pe-ms-chevron${open ? " open" : ""}`}>▼</span>
        </div>

        {/* Dropdown */}
        {open && (
          <div className="pe-ms-dropdown">
            <input
              autoFocus
              className="pe-ms-search"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />

            <div className="pe-ms-list">
              {filtered.length === 0 && (
                <div className="pe-ms-empty">{UI_TEXTS.noResults}</div>
              )}

              {filtered.map((med) => {
                const disabled = isOutOfStock(med);
                const checked = selectedIds.includes(String(med.id));
                const qty = getMedicineStockQuantity(med);

                return (
                  <label
                    key={med.id}
                    className={`pe-ms-option${disabled ? " disabled" : ""}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={disabled}
                      onChange={() => !disabled && toggleMedicine(med.id)}
                    />
                    <span className="pe-ms-option-label">
                      {med.code && <strong>[{med.code}]</strong>}{" "}
                      {getMedicineDisplayName(med)}
                    </span>
                    <span className={`pe-ms-stock${disabled ? " out" : ""}`}>
                      Stock : {qty}
                    </span>
                  </label>
                );
              })}
            </div>

            {/* Footer */}
            <div className="pe-ms-footer">
              <button
                type="button"
                className="pe-ms-close-btn"
                onClick={closeDropdown}
              >
                {getMultiSelectFooterLabel(selectedMeds.length)}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


export default function PrescreptionMedicalUI({
  // Données
  filtered,
  loading,
  stockItems,
  formData,
  detailItem,
  confirmationModal,
  medecinDisplayName,

  // État d'affichage
  showHistory,
  showForm,
  saving,
  isModifying,

  // Handlers
  setShowHistory,
  handleShowDetails,
  setDetailItem,
  openCreate,
  closeForm,
  handleSubmit,
  confirmPrescription,
  closeConfirmationModal,

  // Champs de formulaire
  field,
  setMedicamentIds,
  setStatusFilter,
  setSearchDate,

  // Props dynamiques
  statusFilter,
  searchDate,
}) {
  const today = toInputDate(new Date());

  return (
    <div className="ec-page-bg pe-page">
      <PageTitle title={UI_TEXTS.pageTitle} />

      {/* ── Toolbar ── */}
      <div className="pe-toolbar">
        <div className="pe-toolbar-left">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pe-status-filter"
          >
            {STATUS_FILTER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <SearchBar
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            wrapperClassName="pe-search pe-search-date"
            max={today}
          />
        </div>
        {!showForm ? (
          <ActionButton
            action="add"
            label={UI_TEXTS.addButton}
            size="sm"
            onClick={openCreate}
          />
        ) : (
          <ActionButton
            action="annuler"
            label={UI_TEXTS.cancelButton}
            size="sm"
            onClick={closeForm}
          />
        )}
      </div>

      {/* ── Formulaire ── */}
      {showForm && (
        <FormulaireWrapper
          isModifying={isModifying}
          labelCreate={UI_TEXTS.createLabel}
          labelModify={UI_TEXTS.modifyLabel}
        >
          <form onSubmit={handleSubmit}>
            <div className="pe-form-grid">
              <MedMultiSelect
                stockItems={stockItems}
                selectedIds={formData.medicament_ids}
                onChange={setMedicamentIds}
              />

              <div>
                <FieldLabel>{FORM_FIELDS.posologie.label}</FieldLabel>
                <Input
                  value={formData.posologie}
                  onChange={field("posologie")}
                  placeholder={FORM_FIELDS.posologie.placeholder}
                />
              </div>

              <div>
                <FieldLabel required>{FORM_FIELDS.periode.label}</FieldLabel>
                <Input
                  type="number"
                  min={FORM_FIELDS.periode.min}
                  value={formData.periode}
                  onChange={field("periode")}
                />
              </div>

              <div className="pe-col-span-2">
                <FieldLabel>{FORM_FIELDS.remarque.label}</FieldLabel>
                <textarea
                  className="pe-textarea form-control"
                  rows={3}
                  value={formData.remarque}
                  onChange={field("remarque")}
                  placeholder={FORM_FIELDS.remarque.placeholder}
                />
              </div>
            </div>

            <div className="pe-form-actions">
              <ActionButton
                action="save"
                label={isModifying ? UI_TEXTS.submitModify : UI_TEXTS.submitCreate}
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

      {/* ── Historique ── */}
      <HistoriqueAccordeon
        title={UI_TEXTS.historyTitle}
        count={filtered.length}
        open={showHistory}
        onToggle={() => setShowHistory((v) => !v)}
      >
        {loading ? (
          <Spinner />
        ) : filtered.length === 0 ? (
          <EmptyState message={UI_TEXTS.emptyHistory} />
        ) : (
          <HistoriqueTable
            headers={TABLE_HEADERS}
            items={filtered}
            emptyMessage={UI_TEXTS.emptyHistory}
            renderRow={(p) => (
              <tr key={p.id}>
                <td style={{ whiteSpace: "nowrap" }}>{toFrDate(p.date)}</td>
                <td>
                  <TraitementPills medicaments={p.medicaments} />
                </td>
                <td>{p.posologie || "-"}</td>
                <td>{p.periode || "-"}</td>
                <td>
                  <Badge
                    bg={getStatutStyle(p.statut).bg}
                    color={getStatutStyle(p.statut).color}
                  >
                    {STATUT_LABELS[p.statut] || p.statut || "-"}
                  </Badge>
                </td>
                <td>
                  <HistoriqueActions onDetails={() => handleShowDetails(p)} />
                </td>
              </tr>
            )}
          />
        )}
      </HistoriqueAccordeon>

      {/* ── Détail ── */}
      {detailItem && (
        <FormulaireWrapper
          isModifying={false}
          labelCreate={UI_TEXTS.detailsLabel}
          labelModify={UI_TEXTS.detailsLabel}
        >
          <div className="pe-detail-grid">
            <div className="pe-col-span-2">
              <FieldLabel>{FORM_FIELDS.medicaments.label}</FieldLabel>
              <div className="pe-detail-pills-box">
                <TraitementPills medicaments={detailItem.medicaments} />
              </div>
            </div>

            <div>
              <FieldLabel>Date</FieldLabel>
              <Input value={toFrDate(detailItem.date)} disabled />
            </div>
            <div>
              <FieldLabel>{FORM_FIELDS.posologie.label}</FieldLabel>
              <Input value={detailItem.posologie || "-"} disabled />
            </div>
            <div>
              <FieldLabel>{FORM_FIELDS.periode.label}</FieldLabel>
              <Input value={detailItem.periode || "-"} disabled />
            </div>
            <div>
              <FieldLabel>Statut</FieldLabel>
              <Input
                value={
                  STATUT_LABELS[detailItem.statut] ||
                  detailItem.statut ||
                  "-"
                }
                disabled
              />
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <FieldLabel>{FORM_FIELDS.remarque.label}</FieldLabel>
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
              label={UI_TEXTS.closeButton}
              size="sm"
              onClick={() => setDetailItem(null)}
            />
          </div>
        </FormulaireWrapper>
      )}

      {/* ── Modal de Confirmation ── */}
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
