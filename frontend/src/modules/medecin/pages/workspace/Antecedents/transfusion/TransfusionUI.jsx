import {
  FormulaireWrapper,
  FieldLabel,
  ActionButton,
} from "../../../../../../shared/components/index.js";
import HistoriqueTable from "../../../../../../shared/components/UI/Table/HistoriqueTable.jsx";
import HistoriqueAccordeon from "../../../../../../shared/components/UI/Table/HistoriqueAccordeon.jsx";

// ─── Styles ───────────────────────────────────────────────────────────────────
const inputStyle = {
  width: "100%",
  padding: "6px 10px",
  borderRadius: 6,
  border: "1px solid #e5e7eb",
  fontSize: 13,
  color: "#111827",
  background: "#fafafa",
  outline: "none",
  boxSizing: "border-box",
};

// ─── Sub-components ───────────────────────────────────────────────────────────
const SectionTitle = ({ children }) => (
  <div style={{ borderBottom: "2px solid #e5e7eb", marginBottom: 12, paddingBottom: 4 }}>
    <span style={{ fontSize: 13, fontWeight: 700, color: "#1a7a5e", textTransform: "uppercase", letterSpacing: 0.5 }}>
      {children}
    </span>
  </div>
);

// ─── Main UI ──────────────────────────────────────────────────────────────────
export default function TransfusionUI({
  items,
  form,
  editingItem,
  showForm,
  saving,
  deleting,
  accordeonOpen,
  onAccordeonToggle,
  onChange,
  onOpenAdd,
  onOpenEdit,
  onCancel,
  onSave,
  onUpdate,
  onDelete,
}) {
  const isEditing = !!editingItem;

  const TABLE_HEADERS = ["Date de transfusion", "Remarque", "Actions"];

  const renderRow = (item) => (
    <tr key={item.id}>
      <td style={{ fontSize: 13, verticalAlign: "middle", whiteSpace: "nowrap" }}>
        {item.date_transfusion
          ? new Date(item.date_transfusion).toLocaleDateString("fr-FR")
          : <span className="text-muted fst-italic">—</span>}
      </td>
      <td style={{ fontSize: 13, verticalAlign: "middle" }}>
        {item.remarque || <span className="text-muted fst-italic">—</span>}
      </td>
      <td style={{ verticalAlign: "middle", whiteSpace: "nowrap" }}>
        <div className="d-flex gap-2">
          <ActionButton
            action="edit"
            label="Modifier"
            variant="outline"
            size="sm"
            onClick={() => onOpenEdit(item)}
          />
          <ActionButton
            action="delete"
            label="Supprimer"
            variant="outline"
            size="sm"
            loading={deleting}
            onClick={() => onDelete(item.id)}
          />
        </div>
      </td>
    </tr>
  );

  return (
    <div>
      {/* ── Bouton Ajouter ── */}
      {!showForm && (
        <div className="d-flex justify-content-end mb-3">
          <ActionButton
            action="add"
            label="Ajouter"
            onClick={onOpenAdd}
          />
        </div>
      )}

      {/* ── Formulaire ajout / édition ── */}
      {showForm && (
        <FormulaireWrapper
          isModifying={isEditing}
          labelCreate="Ajouter un antécédent de transfusion"
          labelModify="Modifier l'antécédent de transfusion"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <SectionTitle>Informations de la transfusion</SectionTitle>

            <div className="d-flex gap-3">
              <div style={{ flex: 1 }}>
                <FieldLabel>Date de transfusion</FieldLabel>
                <input
                  type="date"
                  value={form.date_transfusion}
                  onChange={(e) => onChange("date_transfusion", e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={{ flex: 1 }}>
                <FieldLabel>Remarque</FieldLabel>
                <input
                  type="text"
                  value={form.remarque}
                  onChange={(e) => onChange("remarque", e.target.value)}
                  placeholder="Remarque éventuelle..."
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="d-flex justify-content-end gap-2">
              <ActionButton
                action="annuler"
                label="Annuler"
                onClick={onCancel}
                disabled={saving}
              />
              {isEditing ? (
                <ActionButton
                  action="edit"
                  label="Mettre à jour"
                  loading={saving}
                  loadingLabel="Enregistrement..."
                  onClick={onUpdate}
                />
              ) : (
                <ActionButton
                  action="add"
                  label="Enregistrer"
                  loading={saving}
                  loadingLabel="Enregistrement..."
                  onClick={onSave}
                />
              )}
            </div>
          </div>
        </FormulaireWrapper>
      )}

      {/* ── Historique ── */}
      <HistoriqueAccordeon
        title="Historique des transfusions"
        count={items.length}
        open={accordeonOpen}
        onToggle={onAccordeonToggle}
      >
        <HistoriqueTable
          headers={TABLE_HEADERS}
          items={items}
          renderRow={renderRow}
          emptyMessage="Aucun antécédent de transfusion enregistré."
        />
      </HistoriqueAccordeon>
    </div>
  );
}