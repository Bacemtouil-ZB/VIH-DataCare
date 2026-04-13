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

// ── Boutons + / - inline ──────────────────────────────────────
function QuantityEditPanel({ item, editingMode, editingQuantity, setEditingQuantity, saving, saveQuantity, cancelEditQuantity }) {
  const isDecrement = editingMode === "decrement";
  const accentBg    = isDecrement ? "#fee2e2" : "#dcfce7";
  const accentColor = isDecrement ? "#991b1b" : "#166534";
  const label       = isDecrement ? "Retirer du stock" : "Ajouter au stock";
  const verb        = isDecrement ? "−" : "+";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", minWidth: "180px" }}>
      {/* Label contextuel */}
      <span style={{ fontSize: "0.72rem", fontWeight: 700, color: accentColor, letterSpacing: "0.04em" }}>
        {verb} {label}
      </span>

      {/* Quantité actuelle → aperçu */}
      <span style={{ fontSize: "0.78rem", color: "#64748b" }}>
        Stock actuel :&nbsp;
        <strong style={{ color: "#0f172a" }}>{item.quantity}</strong>
        {editingQuantity !== "" && Number(editingQuantity) > 0 && (
          <span style={{ color: accentColor, fontWeight: 700 }}>
            &nbsp;{isDecrement ? "→" : "→"}&nbsp;
            {isDecrement
              ? Math.max(0, item.quantity - Number(editingQuantity))
              : item.quantity + Number(editingQuantity)}
          </span>
        )}
      </span>

      {/* Input delta */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
        <Input
          type="number"
          min="1"
          className="form-control form-control-sm ph-qty-input"
          style={{ width: "80px", borderColor: accentColor }}
          value={editingQuantity}
          onChange={(e) => setEditingQuantity(e.target.value)}
          placeholder="Qté"
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
          label="✕"
          onClick={cancelEditQuantity}
          size="sm"
          showIcon={false}
          disabled={saving}
        />
      </div>
    </div>
  );
}

// ── Composant principal ───────────────────────────────────────
export default function StockUI({
  search,          setSearch,
  showAddForm,     setShowAddForm,
  addForm,         setAddForm,
  editingId,
  editingMode,
  editingQuantity, setEditingQuantity,
  showHistory,     setShowHistory,
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
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="ph-stock-header">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="ph-stock-title">
            <h2>Gestion du stock de médicaments</h2>
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

      {/* ── Erreur ─────────────────────────────────────────────────────────── */}
      {error && <p className="ph-stock-error">{error}</p>}

      {/* ── Formulaire ajout ────────────────────────────────────────────────── */}
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
                min="1"
                className="form-control ph-add-qty-input"
                value={addForm.quantityToAdd}
                onChange={(e) => setAddForm((prev) => ({ ...prev, quantityToAdd: e.target.value }))}
                placeholder="Ex: 100"
                disabled={saving}
              />
            </div>
            <div className="ph-stock-add-actions">
              <ActionButton action="save" label={saving ? "Enregistrement..." : "Enregistrer"} onClick={handleAddMedication} disabled={saving || loading} size="sm" showIcon={false} />
              <ActionButton action="annuler" label="Annuler" onClick={cancelAddForm} size="sm" showIcon={false} disabled={saving} />
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
                  {/* Code */}
                  <td>
                    <Badge bg="#dbeafe" color="#1e40af">{item.code}</Badge>
                  </td>

                  {/* Médicament */}
                  <td className="ph-comp-col">{item.composition}</td>

                  {/* Quantité — affiche le panel d'édition ou la valeur */}
                  <td>
                    {isEditing ? (
                      <QuantityEditPanel
                        item={item}
                        editingMode={editingMode}
                        editingQuantity={editingQuantity}
                        setEditingQuantity={setEditingQuantity}
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

                  {/* Dernière maj */}
                  <td>{formatDateTimeFr(item.updatedAt, "-")}</td>

                  {/* Alerte stock */}
                  <td>
                    <StockAlert quantity={item.quantity} />
                  </td>

                  {/* Actions */}
                  <td>
                    {isEditing ? null : (
                      <div className="ph-actions" style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "nowrap" }}>

                        {/* Bouton + */}
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

                        {/* Bouton − */}
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
                          −
                        </button>

                        {/* Supprimer */}
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
