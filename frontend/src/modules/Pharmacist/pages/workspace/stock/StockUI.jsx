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
  const accentColor = isDecrement ? "#991b1b" : "#166534";
  const label = isDecrement ? "Retirer du stock" : "Ajouter au stock";
  const verb = isDecrement ? "-" : "+";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", minWidth: "180px" }}>
      <span style={{ fontSize: "0.72rem", fontWeight: 700, color: accentColor, letterSpacing: "0.04em" }}>
        {verb} {label}
      </span>

      <span style={{ fontSize: "0.78rem", color: "#64748b" }}>
        Stock actuel :&nbsp;
        <strong style={{ color: "#0f172a" }}>{item.quantity}</strong>
        {editingQuantity !== "" && Number(editingQuantity) > 0 && (
          <span style={{ color: accentColor, fontWeight: 700 }}>
            &nbsp;-&gt;&nbsp;
            {isDecrement
              ? Math.max(0, item.quantity - Number(editingQuantity))
              : item.quantity + Number(editingQuantity)}
          </span>
        )}
      </span>

      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
        <Input
          type="number"
          min="1"
          className={`form-control form-control-sm ph-qty-input ${quantityErrors.quantite ? "is-invalid" : ""}`}
          style={{ width: "80px", borderColor: accentColor }}
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
          <div className="ph-stock-title">
            <h4>Gestion du stock de medicaments</h4>
          </div>
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
          <div className="ph-stock-add-grid" style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: "1rem" }}>
            <div className="ph-med-field" style={{ flex: "0 0 160px" }}>
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

            <div className="ph-comp-field" style={{ flex: "0 0 260px", minWidth: 0 }}>
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

            <div className="ph-qty-field" style={{ flex: "0 0 180px" }}>
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

            <div className="ph-stock-add-actions" style={{ flex: "0 0 auto", marginLeft: "auto", alignSelf: "flex-end", paddingBottom: "2px" }}>
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
                      <span style={{ fontWeight: 700, fontSize: "1rem", color: "#0f172a" }}>
                        {item.quantity}
                      </span>
                    )}
                  </td>

                  <td>{formatDateTimeFr(item.updatedAt, "-")}</td>

                  <td>
                    <StockAlert quantity={item.quantity} />
                  </td>

                  <td>
                    {isEditing ? null : (
                      <div className="ph-actions" style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "nowrap" }}>
                        <button
                          type="button"
                          className="btn btn-sm"
                          title="Augmenter le stock"
                          disabled={saving}
                          onClick={() => beginIncrement(item)}
                          style={{
                            background: "#dcfce7",
                            color: "#166534",
                            border: "1px solid #86efac",
                            borderRadius: "6px",
                            fontWeight: 800,
                            fontSize: "1rem",
                            lineHeight: 1,
                            padding: "0.3rem 0.65rem",
                          }}
                        >
                          +
                        </button>

                        <button
                          type="button"
                          className="btn btn-sm"
                          title="Diminuer le stock"
                          disabled={saving || Number(item.quantity) <= 0}
                          onClick={() => beginDecrement(item)}
                          style={{
                            background: "#fee2e2",
                            color: "#991b1b",
                            border: "1px solid #fca5a5",
                            borderRadius: "6px",
                            fontWeight: 800,
                            fontSize: "1rem",
                            lineHeight: 1,
                            padding: "0.3rem 0.65rem",
                          }}
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