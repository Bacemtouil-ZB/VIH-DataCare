import {
  ActionButton,
  Badge,
  FieldError,
  FieldLabel,
  HistoriqueAccordeon,
  HistoriqueActions,
  HistoriqueTable,
  Input,
  SearchBar,
  Spinner,
  StockAlert,
} from "../../../../../shared/components";
import { formatDateTimeFr } from "../../../../../shared/utils/logiqueTableHistory";
import PageHeader from "../../../components/UI/StockTitle";

function QuantityEditPanel({
  item,
  editingMode,
  editingQuantity,
  quantityErrors,
  handleEditingQuantityChange,
  saving,
  saveQuantity,
  cancelEditQuantity,
}) {
  const isDecrement = editingMode === "decrement";
  const modifier = isDecrement ? "decrement" : "increment";
  const label = isDecrement ? "Retirer du stock" : "Ajouter au stock";
  const verb = isDecrement ? "-" : "+";

  return (
    <div className="ph-qty-panel">
      <span className={`ph-qty-panel__label ph-qty-panel__label--${modifier}`}>
        {verb} {label}
      </span>

      <span className="ph-qty-panel__current">
        Stock actuel :&nbsp;
        <strong>{item.quantity}</strong>
        {editingQuantity !== "" && Number(editingQuantity) > 0 && (
          <span className={`ph-qty-panel__preview ph-qty-panel__preview--${modifier}`}>
            &nbsp;-&gt;&nbsp;
            {isDecrement
              ? Math.max(0, item.quantity - Number(editingQuantity))
              : item.quantity + Number(editingQuantity)}
          </span>
        )}
      </span>

      <div className="ph-qty-panel__row">
        <Input
          type="number"
          min="1"
          className={`form-control form-control-sm ph-qty-input ph-qty-input--${modifier} ${quantityErrors.quantite ? "is-invalid" : ""}`}
          value={editingQuantity}
          onChange={handleEditingQuantityChange}
          placeholder="Qte"
          disabled={saving}
          autoFocus
        />
        <ActionButton
          action="save"
          label={saving ? "..." : "OK"}
          onClick={() => saveQuantity(item)}
          size="sm"
          showIcon={false}
          disabled={saving}
        />
        <ActionButton
          action="annuler"
          label="X"
          onClick={cancelEditQuantity}
          size="sm"
          showIcon={false}
          disabled={saving}
        />
      </div>

      {quantityErrors.quantite && <FieldError error={quantityErrors.quantite} />}
      {quantityErrors._form && <FieldError error={quantityErrors._form} />}
    </div>
  );
}

export default function StockUI({
  search,
  setSearch,
  showAddForm,
  setShowAddForm,
  addForm,
  addErrors,
  handleAddFormChange,
  editingId,
  editingMode,
  editingQuantity,
  quantityErrors,
  handleEditingQuantityChange,
  showHistory,
  setShowHistory,
  loading,
  saving,
  error,
  filteredItems,
  handleAddMedication,
  cancelAddForm,
  handleDeleteMedication,
  beginIncrement,
  beginDecrement,
  cancelEditQuantity,
  saveQuantity,
}) {
  return (
    <>
      <div className="ph-stock-header">
        <div className="d-flex justify-content-between align-items-center mb-3">
            <PageHeader title="Gestion du stock de medicaments" noBorder />
          <ActionButton
            action="add"
            label="Ajouter au stock"
            onClick={() => setShowAddForm((v) => !v)}
            disabled={loading}
            size="md"
            showIcon={true}
          />
        </div>
      </div>

      {error && <p className="ph-stock-error">{error}</p>}

      {showAddForm && (
        <div className="ph-stock-add-card">
          <div className="ph-stock-add-grid">
            <div className="ph-med-field">
              <FieldLabel required>Code medicament</FieldLabel>
              <Input
                type="text"
                className={`form-control ${addErrors.medicamentCode ? "is-invalid" : ""}`}
                value={addForm.medicamentCode}
                onChange={handleAddFormChange("medicamentCode")}
                placeholder="Ex: TDF, 3TC, DTG..."
                disabled={saving}
              />
              <FieldError error={addErrors.medicamentCode} />
            </div>

            <div className="ph-comp-field">
              <FieldLabel required>Medicament</FieldLabel>
              <Input
                type="text"
                className={`form-control ${addErrors.medicamentComposition ? "is-invalid" : ""}`}
                value={addForm.medicamentComposition}
                onChange={handleAddFormChange("medicamentComposition")}
                placeholder="Ex: Tenofovir (TDF)"
                disabled={saving}
              />
              <FieldError error={addErrors.medicamentComposition} />
            </div>

            <div className="ph-qty-field">
              <FieldLabel required>Quantite initiale</FieldLabel>
              <Input
                type="number"
                min="1"
                className={`form-control ph-add-qty-input ${addErrors.quantityToAdd ? "is-invalid" : ""}`}
                value={addForm.quantityToAdd}
                onChange={handleAddFormChange("quantityToAdd")}
                placeholder="Ex: 100"
                disabled={saving}
              />
              <FieldError error={addErrors.quantityToAdd} />
            </div>

            <div className="ph-stock-add-actions">
              <ActionButton
                action="save"
                label={saving ? "Enregistrement..." : "Enregistrer"}
                onClick={handleAddMedication}
                disabled={saving || loading}
                size="sm"
                showIcon={false}
              />
              <ActionButton
                action="annuler"
                label="Annuler"
                onClick={cancelAddForm}
                size="sm"
                showIcon={false}
                disabled={saving}
              />
            </div>
          </div>

          {addErrors._form && <FieldError error={addErrors._form} className="mt-2" />}
        </div>
      )}

      <div className="ph-stock-search-wrapper">
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Ex: TDF, Lamivudine..."
          wrapperClassName="ph-stock-header-search"
        />
      </div>

      <HistoriqueAccordeon
        title="Stock des medicaments"
        count={filteredItems.length}
        showCount={true}
        open={showHistory}
        onToggle={() => setShowHistory((v) => !v)}
        contentClassName="stock-acc-body"
      >
        {loading ? (
          <Spinner />
        ) : (
          <HistoriqueTable
            headers={["Code", "Medicament", "Quantite", "Derniere maj", "Alerte", "Action"]}
            items={filteredItems}
            emptyMessage="Aucun medicament en stock pour le moment."
            renderRow={(item) => {
              const isEditing = editingId === item.id;

              return (
                <tr key={item.id}>
                  <td>
                    <Badge bg="#dbeafe" color="#1e40af">{item.code}</Badge>
                  </td>

                  <td className="ph-comp-col">{item.composition}</td>

                  <td>
                    {isEditing ? (
                      <QuantityEditPanel
                        item={item}
                        editingMode={editingMode}
                        editingQuantity={editingQuantity}
                        quantityErrors={quantityErrors}
                        handleEditingQuantityChange={handleEditingQuantityChange}
                        saving={saving}
                        saveQuantity={saveQuantity}
                        cancelEditQuantity={cancelEditQuantity}
                      />
                    ) : (
                      <span className="ph-qty-display">{item.quantity}</span>
                    )}
                  </td>

                  <td>{formatDateTimeFr(item.updatedAt, "-")}</td>

                  <td>
                    <StockAlert quantity={item.quantity} />
                  </td>

                  <td>
                    {isEditing ? null : (
                      <div className="ph-actions">
                        <button
                          type="button"
                          className="ph-btn-increment"
                          title="Augmenter le stock"
                          disabled={saving}
                          onClick={() => beginIncrement(item)}
                        >
                          +
                        </button>

                        <button
                          type="button"
                          className="ph-btn-decrement"
                          title="Diminuer le stock"
                          disabled={saving || Number(item.quantity) <= 0}
                          onClick={() => beginDecrement(item)}
                        >
                          -
                        </button>

                        <HistoriqueActions
                          onDelete={() => handleDeleteMedication(item.id)}
                        />
                      </div>
                    )}
                  </td>
                </tr>
              );
            }}
          />
        )}
      </HistoriqueAccordeon>
    </>
  );
}