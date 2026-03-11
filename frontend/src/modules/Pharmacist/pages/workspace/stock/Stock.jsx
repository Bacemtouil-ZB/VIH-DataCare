import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ActionButton,
  Badge,
  FieldLabel,
  HistoriqueAccordeon,
  HistoriqueTable,
  Input,
  SearchBar,
  HistoriqueActions
} from "../../../../../shared/components/layouts";
import {
  getStockItems,
  createStockItem as createStockItemApi,
  updateStockQuantity as updateStockQuantityApi,
  deleteStockItem as deleteStockItemApi,
} from "../../../services/stockService.jsx";
import { formatDateTimeFr } from "../../../../../shared/utils/logiqueTableHistory";
import StockAlert from "../../../../../shared/components/layouts/feedback/Stockalert";
import "./Stock.css";
import { toast } from "react-toastify";
import { confirmDelete } from "../../../../../shared/utils/uiAlerts";

const toUiStockItem = (row) => ({
  id: row?.id,
  code: String(row?.code || "").toUpperCase(),
  composition: row?.composition || "",
  quantity: Number(row?.quantite ?? row?.quantity ?? 0),
  updatedAt: row?.updated_at || row?.updatedAt || null,
});

export default function Stock() {
  const { numero } = useParams();

  // États
  const [search, setSearch] = useState("");
  const [stockItems, setStockItems] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [medicamentCode, setMedicamentCode] = useState("");
  const [medicamentComposition, setMedicamentComposition] = useState("");
  const [quantityToAdd, setQuantityToAdd] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingQuantity, setEditingQuantity] = useState("");
  const [showHistory, setShowHistory] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
        ]);

        if (!alive) return;

        setStockItems(Array.isArray(rows) ? rows.map(toUiStockItem) : []);
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

  const handleAddMedication = async () => {
    if (!medicamentCode.trim()) {
      toast.error("Veuillez saisir un code de médicament.");
      return;
    }

    if (!medicamentComposition.trim()) {
      toast.error("Veuillez saisir la composition du médicament.");
      return;
    }

    const q = Number(quantityToAdd);
    if (!Number.isInteger(q) || q < 0) {
      toast.error("La quantité doit être un entier positif.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        code: medicamentCode.trim().toUpperCase(),
        composition: medicamentComposition.trim(),
        quantite: q,
      };
      await createStockItemApi(payload);

      await refreshStock();

      setMedicamentCode("");
      setMedicamentComposition("");
      setQuantityToAdd("");
      setShowAddForm(false);

      toast.success("Médicament ajouté avec succès");
    } catch (err) {
      console.error(" Détails erreur:", {
        response: err?.response?.data,
        message: err?.message,
        status: err?.response?.status
      });
      
      const errorMessage = err?.response?.data?.message 
        || err?.response?.data?.error 
        || err?.message 
        || "Erreur lors de l'ajout au stock.";
      
      console.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMedication = async (id) => {
    const confirmed = await confirmDelete(
      "Supprimer ce médicament ?",
      "Etes-vous sûr de vouloir supprimer ce médicament du stock ? "
    );

    if (!confirmed) {
      toast.info("Suppression annulée");
      return;
    }

    try {
      setSaving(true);
      await deleteStockItemApi(id);
      await refreshStock();
      toast.success("Médicament supprimé avec succès");

      if (editingId === id) {
        setEditingId(null);
        setEditingQuantity("");
      }
    } catch (err) {
      const errorMessage = err?.response?.data?.message 
        || err?.response?.data?.error 
        || err?.message 
        || "Erreur lors de la suppression.";
      
      toast.error(errorMessage);
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
      toast.error("La quantité doit être un entier positif.");
      return;
    }

    try {
      setSaving(true);      
      await updateStockQuantityApi(item.id, q);
      await refreshStock();
      cancelEditQuantity();
      toast.success("Quantité mise à jour avec succès");
    } catch (err) {
      console.error(" Erreur mise à jour:", err);
      
      const errorMessage = err?.response?.data?.message 
        || err?.response?.data?.error 
        || err?.message 
        || "Erreur lors de la mise à jour de la quantité.";
      
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ph-stock-page">
      {/* Header avec bouton au même niveau */}
      <div className="ph-stock-header">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="ph-stock-title">
            <h2>Gestion du stock de médicaments</h2>
          </div>
          <ActionButton
            action="add"
            label={showAddForm ? "Masquer" : "Ajouter au stock"}
            onClick={() => setShowAddForm((v) => !v)}
            disabled={loading}
            size="md"
            showIcon={true}
          />
        </div>
      </div>

      {error ? <p className="ph-stock-error">{error}</p> : null}

      {/* Formulaire collapsible */}
      {showAddForm && (
        <div className="ph-stock-add-card">
          <div className="ph-stock-add-grid">
            <div className="ph-med-field">
              <FieldLabel required>Code médicament</FieldLabel>
              <Input
                type="text"
                className="form-control"
                value={medicamentCode}
                onChange={(e) => setMedicamentCode(e.target.value)}
                placeholder="Ex: TDF, 3TC, DTG..."
                disabled={saving}
              />
            </div>

            <div className="ph-comp-field">
              <FieldLabel required>Composition</FieldLabel>
              <Input
                type="text"
                className="form-control"
                value={medicamentComposition}
                onChange={(e) => setMedicamentComposition(e.target.value)}
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
                value={quantityToAdd}
                onChange={(e) => setQuantityToAdd(e.target.value)}
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
                  onClick={() => {
                    setShowAddForm(false);
                    setMedicamentCode("");
                    setMedicamentComposition("");
                    setQuantityToAdd("");
                    toast.info("Opération annulée");

                  }}
                  size="sm"
                  showIcon={false}
                  disabled={saving}
                />
            </div>
          </div>
        </div>
      )}

      {/* SearchBar */}
      <div className="ph-stock-search-wrapper">
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Ex: TDF, Lamivudine..."
          wrapperClassName="ph-stock-header-search"
        />
      </div>

      {/* Tableau avec colonne ALERTE */}
      <HistoriqueAccordeon
        title="Stock des médicaments"
        count={filteredItems.length}
        showCount={true}
        open={showHistory}
        onToggle={() => setShowHistory((v) => !v)}
        contentClassName="stock-acc-body"
      >
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
                    <label>
                      {item.quantity}
                    </label>
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
                          onClick={() => {cancelEditQuantity();
                          toast.info("Opération annulée");}}
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
      </HistoriqueAccordeon>
    </div>
  );
}
