import { useMemo, useState } from "react";
import {
  ActionButton,
  Badge,
  DashboardStatCard,
  FieldLabel,
  HistoriqueAccordeon,
  HistoriqueTable,
  Input,
  SearchBar,
} from "../../../../../shared/components/layouts";
import "./Stock.css";

const MEDICATION_CATALOG = [
  { code: "TDF", composition: "Tenofovir (TDF)" },
  { code: "3TC", composition: "Lamivudine (3TC)" },
  { code: "DTG", composition: "Dolutegravir (DTG)" },
  { code: "ABC", composition: "Abacavir (ABC)" },
  { code: "AZT", composition: "Zidovudine (AZT)" },
  { code: "ATV", composition: "Atazanavir (ATV)" },
  { code: "RTV", composition: "Ritonavir (RTV)" },
  { code: "DRV", composition: "Darunavir (DRV)" },
  { code: "FTC", composition: "Emtricitabine (FTC)" },
  { code: "EFV", composition: "Efavirenz (EFV)" },
];

const buildStockItem = (medication, quantity = 0) => ({
  id: medication.code,
  code: medication.code,
  composition: medication.composition,
  quantity: Number(quantity),
  updatedAt: null,
});

export default function Stock() {
  const [search, setSearch] = useState("");
  const [stockItems, setStockItems] = useState([]);
  const [selectedCodeToAdd, setSelectedCodeToAdd] = useState("");
  const [quantityToAdd, setQuantityToAdd] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingQuantity, setEditingQuantity] = useState("");
  const [showHistory, setShowHistory] = useState(true);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return stockItems;
    return stockItems.filter(
      (item) =>
        item.code.toLowerCase().includes(q) ||
        item.composition.toLowerCase().includes(q)
    );
  }, [stockItems, search]);

  const availableForAdd = useMemo(() => {
    const existingCodes = new Set(stockItems.map((item) => item.code));
    return MEDICATION_CATALOG.filter((med) => !existingCodes.has(med.code));
  }, [stockItems]);

  const totalMedicationTypes = stockItems.length;
  const totalQuantity = stockItems.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockCount = stockItems.filter((item) => item.quantity <= 5).length;

  const handleAddMedication = () => {
    if (!selectedCodeToAdd) {
      alert("Selectionne un composant a ajouter.");
      return;
    }

    const q = Number(quantityToAdd);
    if (!Number.isInteger(q) || q < 0) {
      alert("La quantite doit etre un entier positif.");
      return;
    }

    const medication = MEDICATION_CATALOG.find((m) => m.code === selectedCodeToAdd);
    if (!medication) return;

    setStockItems((prev) => [
      ...prev,
      { ...buildStockItem(medication, q), updatedAt: new Date().toISOString() },
    ]);
    setSelectedCodeToAdd("");
    setQuantityToAdd("");
  };

  const handleDeleteMedication = (id) => {
    if (!window.confirm("Supprimer ce medicament du stock ?")) return;
    setStockItems((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditingQuantity("");
    }
  };

  const beginEditQuantity = (item) => {
    setEditingId(item.id);
    setEditingQuantity(String(item.quantity));
  };

  const cancelEditQuantity = () => {
    setEditingId(null);
    setEditingQuantity("");
  };

  const saveQuantity = (item) => {
    const q = Number(editingQuantity);
    if (!Number.isInteger(q) || q < 0) {
      alert("La quantite doit etre un entier positif.");
      return;
    }
    setStockItems((prev) =>
      prev.map((row) =>
        row.id === item.id ? { ...row, quantity: q, updatedAt: new Date().toISOString() } : row
      )
    );
    cancelEditQuantity();
  };

  const formatDateTime = (iso) => {
    if (!iso) return "-";
    return new Date(iso).toLocaleString("fr-FR");
  };

  return (
    <div className="ph-stock-page">
      <div className="ph-stock-header">
        <div className="ph-stock-title">
          <h2>Gestion du stock de medicaments</h2>
        </div>
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Ex: TDF, Lamivudine..."
          wrapperClassName="ph-stock-header-search"
        />
      </div>

      <div className="ph-stock-kpis">
        <DashboardStatCard label="Medicaments en stock" value={totalMedicationTypes} tone="success" />
        <DashboardStatCard label="Quantite totale" value={totalQuantity} tone="success" />
        <DashboardStatCard label="Stock faible (0-5)" value={lowStockCount} tone="warning" />
      </div>

      <div className="ph-stock-toolbar">
        <div className="ph-stock-add-card">
          <div className="ph-stock-add-grid">
            <div className="ph-med-field">
              <FieldLabel required>Medicament</FieldLabel>
              <select
                className="form-select"
                value={selectedCodeToAdd}
                onChange={(e) => setSelectedCodeToAdd(e.target.value)}
              >
                <option value="">-- Selectionner --</option>
                {availableForAdd.map((med) => (
                  <option key={med.code} value={med.code}>
                    {med.code} - {med.composition}
                  </option>
                ))}
              </select>
            </div>

            <div className="ph-qty-field">
              <FieldLabel required>Quantite initiale</FieldLabel>
              <Input
                type="number"
                min="0"
                className="form-control ph-add-qty-input"
                value={quantityToAdd}
                onChange={(e) => setQuantityToAdd(e.target.value)}
                placeholder="Ex: 100"
              />
            </div>
            <div className="ph-stock-add-actions">
              <ActionButton
                action="add"
                label="Ajouter au stock"
                onClick={handleAddMedication}
                disabled={!availableForAdd.length}
                size="sm"
                showIcon={false}
              />
            </div>
          </div>
        </div>
      </div>

      <HistoriqueAccordeon
        title="Stock des medicaments"
        count={filteredItems.length}
        showCount={false}
        open={showHistory}
        onToggle={() => setShowHistory((v) => !v)}
        contentClassName="stock-acc-body"
      >
        <HistoriqueTable
          headers={["Code", "Medicament", "Quantite", "Derniere maj", "Action"]}
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
                    <Input
                      type="number"
                      min="0"
                      className="form-control form-control-sm ph-qty-input"
                      value={editingQuantity}
                      onChange={(e) => setEditingQuantity(e.target.value)}
                    />
                  ) : (
                    <Badge
                      bg={item.quantity <= 5 ? "#fee2e2" : "#dcfce7"}
                      color={item.quantity <= 5 ? "#991b1b" : "#166534"}
                    >
                      {item.quantity}
                    </Badge>
                  )}
                </td>
                <td>{formatDateTime(item.updatedAt)}</td>
                <td>
                  <div className="ph-actions">
                    {isEditing ? (
                      <>
                        <ActionButton
                          action="save"
                          label="Enregistrer"
                          onClick={() => saveQuantity(item)}
                          size="sm"
                          showIcon={false}
                        />
                        <button
                          type="button"
                          className="ph-btn ph-btn-muted"
                          onClick={cancelEditQuantity}
                        >
                          Annuler
                        </button>
                      </>
                    ) : (
                      <>
                        <ActionButton
                          action="edit"
                          label="Modifier quantite"
                          onClick={() => beginEditQuantity(item)}
                          variant="outline"
                          size="sm"
                          showIcon={false}
                        />
                        <button
                          type="button"
                          className="ph-btn ph-btn-danger"
                          onClick={() => handleDeleteMedication(item.id)}
                        >
                          Supprimer
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          }}
        />
      </HistoriqueAccordeon>
    </div>
  );
}
