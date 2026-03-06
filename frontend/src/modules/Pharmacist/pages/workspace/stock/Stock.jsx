import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
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
import {
  getStockItems,
  createStockItem as createStockItemApi,
  updateStockQuantity as updateStockQuantityApi,
  deleteStockItem as deleteStockItemApi,
  getStockContextByNumero,
} from "../../../services/stockService.jsx";
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

const toUiStockItem = (row) => ({
  id: row?.id,
  code: String(row?.code || "").toUpperCase(),
  composition: row?.composition || "",
  quantity: Number(row?.quantite ?? row?.quantity ?? 0),
  updatedAt: row?.updated_at || row?.updatedAt || null,
});

export default function Stock() {
  const { numero } = useParams();
  const [search, setSearch] = useState("");
  const [stockItems, setStockItems] = useState([]);
  const [selectedCodeToAdd, setSelectedCodeToAdd] = useState("");
  const [quantityToAdd, setQuantityToAdd] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingQuantity, setEditingQuantity] = useState("");
  const [showHistory, setShowHistory] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [patientContext, setPatientContext] = useState(null);

  const refreshStock = async () => {
    const rows = await getStockItems();
    setStockItems(Array.isArray(rows) ? rows.map(toUiStockItem) : []);
  };

  useEffect(() => {
    let alive = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [rows, context] = await Promise.all([
          getStockItems(),
          numero ? getStockContextByNumero(numero) : Promise.resolve(null),
        ]);

        if (!alive) return;

        setStockItems(Array.isArray(rows) ? rows.map(toUiStockItem) : []);

        if (numero && context?.patient) {
          const patient = context.patient?.patient || context.patient;
          setPatientContext({
            numero: patient?.numero || numero,
            name: `${patient?.surname || ""} ${patient?.name || ""}`.trim(),
          });
        } else if (numero) {
          setPatientContext({ numero, name: "" });
        } else {
          setPatientContext(null);
        }
      } catch (err) {
        if (!alive) return;
        setError(err?.message || err?.error || "Erreur lors du chargement du stock.");
      } finally {
        if (alive) setLoading(false);
      }
    };

    loadData();
    return () => {
      alive = false;
    };
  }, [numero]);

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

  const handleAddMedication = async () => {
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

    try {
      setSaving(true);
      await createStockItemApi({
        code: selectedCodeToAdd,
        composition: medication.composition,
        quantite: q,
      });
      await refreshStock();
      setSelectedCodeToAdd("");
      setQuantityToAdd("");
    } catch (err) {
      alert(err?.message || err?.error || "Erreur lors de l'ajout au stock.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMedication = async (id) => {
    if (!window.confirm("Supprimer ce medicament du stock ?")) return;

    try {
      setSaving(true);
      await deleteStockItemApi(id);
      await refreshStock();
      if (editingId === id) {
        setEditingId(null);
        setEditingQuantity("");
      }
    } catch (err) {
      alert(err?.message || err?.error || "Erreur lors de la suppression.");
    } finally {
      setSaving(false);
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

  const saveQuantity = async (item) => {
    const q = Number(editingQuantity);
    if (!Number.isInteger(q) || q < 0) {
      alert("La quantite doit etre un entier positif.");
      return;
    }
    try {
      setSaving(true);
      await updateStockQuantityApi(item.id, q);
      await refreshStock();
      cancelEditQuantity();
    } catch (err) {
      alert(err?.message || err?.error || "Erreur lors de la mise a jour de la quantite.");
    } finally {
      setSaving(false);
    }
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
          {patientContext?.numero ? (
            <p className="ph-stock-subtitle">
              Dossier: <strong>{patientContext.numero}</strong>
              {patientContext.name ? ` - ${patientContext.name}` : ""}
            </p>
          ) : null}
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

      {error ? <p className="ph-stock-error">{error}</p> : null}

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
                disabled={!availableForAdd.length || saving || loading}
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
                          label={saving ? "Enregistrement..." : "Enregistrer"}
                          onClick={() => saveQuantity(item)}
                          size="sm"
                          showIcon={false}
                          disabled={saving}
                        />
                        <button
                          type="button"
                          className="ph-btn ph-btn-muted"
                          onClick={cancelEditQuantity}
                          disabled={saving}
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
                          disabled={saving}
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
