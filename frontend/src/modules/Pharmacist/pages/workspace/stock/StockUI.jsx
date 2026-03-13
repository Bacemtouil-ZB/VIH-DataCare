import {
  ActionButton,
  Badge,
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

export default function StockUI({
  // états
  search,          setSearch,
  showAddForm,     setShowAddForm,
  addForm,         setAddForm,
  editingId,
  editingQuantity, setEditingQuantity,
  showHistory,     setShowHistory,
  loading,
  saving,
  error,
  filteredItems,
  // actions
  handleAddMedication,
  cancelAddForm,
  handleDeleteMedication,
  beginEditQuantity,
  cancelEditQuantity,
  saveQuantity,
}) {
  return (
    <>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="ph-stock-header">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="ph-stock-title">
            <h2>Gestion du stock de médicaments</h2>
          </div>
          <ActionButton
            action="add"
            label={"Ajouter au stock"}
            onClick={() => setShowAddForm((v) => !v)}
            disabled={loading}
            size="md"
            showIcon={true}
          />
        </div>
      </div>

      {/* ── Erreur ─────────────────────────────────────────────────────────── */}
      {error && <p className="ph-stock-error">{error}</p>}

      {/* ── Formulaire ajout collapsible ────────────────────────────────────── */}
      {showAddForm && (
        <div className="ph-stock-add-card">
          <div className="ph-stock-add-grid">
            <div className="ph-med-field">
              <FieldLabel required>Code médicament</FieldLabel>
              <Input
                type="text"
                className="form-control"
                value={addForm.medicamentCode}
                onChange={(e) => setAddForm((prev) => ({ ...prev, medicamentCode: e.target.value }))}
                placeholder="Ex: TDF, 3TC, DTG..."
                disabled={saving}
              />
            </div>

            <div className="ph-comp-field">
              <FieldLabel required>Médicament</FieldLabel>
              <Input
                type="text"
                className="form-control"
                value={addForm.medicamentComposition}
                onChange={(e) => setAddForm((prev) => ({ ...prev, medicamentComposition: e.target.value }))}
                placeholder="Ex: Tenofovir (TDF)"
                disabled={saving}
              />
            </div>

            <div className="ph-qty-field">
              <FieldLabel required>Quantité initiale</FieldLabel>
              <Input
                type="number"
                min="0"
                className="form-control ph-add-qty-input"
                value={addForm.quantityToAdd}
                onChange={(e) => setAddForm((prev) => ({ ...prev, quantityToAdd: e.target.value }))}
                placeholder="Ex: 100"
                disabled={saving}
              />
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
        </div>
      )}

      {/* ── SearchBar ──────────────────────────────────────────────────────── */}
      <div className="ph-stock-search-wrapper">
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Ex: TDF, Lamivudine..."
          wrapperClassName="ph-stock-header-search"
        />
      </div>

      {/* ── Tableau ────────────────────────────────────────────────────────── */}
      <HistoriqueAccordeon
        title="Stock des médicaments"
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
            headers={["Code", "Médicament", "Quantité", "Dernière maj", "Alerte", "Action"]}
            items={filteredItems}
            emptyMessage="Aucun médicament en stock pour le moment."
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
                      <Input
                        type="number"
                        min="0"
                        className="form-control form-control-sm ph-qty-input"
                        value={editingQuantity}
                        onChange={(e) => setEditingQuantity(e.target.value)}
                      />
                    ) : (
                      <span>{item.quantity}</span>
                    )}
                  </td>
                  <td>{formatDateTimeFr(item.updatedAt, "-")}</td>
                  <td>
                    <StockAlert quantity={item.quantity} />
                  </td>
                  <td>
                    <div className="ph-actions">
                      {isEditing ? (
                        <>
                          <ActionButton
                            action="save"
                            label={saving ? "Enregistrement..." : "Enregistrer"}
                            onClick={() => saveQuantity(item)}
                            size="sm"
                            showIcon={false}
                            disabled={saving}
                          />
                          <ActionButton
                            action="annuler"
                            label="Annuler"
                            onClick={cancelEditQuantity}
                            size="sm"
                            showIcon={false}
                            disabled={saving}
                          />
                        </>
                      ) : (
                        <HistoriqueActions
                          onEdit={() => beginEditQuantity(item)}
                          onDelete={() => handleDeleteMedication(item.id)}
                        />
                      )}
                    </div>
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