import { useParams } from "react-router-dom";
import { useStockLogic } from "./useStockLogic";
import StockUI from "./StockUI";
import "./Stock.css";

export default function Stock() {
  const { numero } = useParams();
  const logic = useStockLogic(numero);

  return (
    <div className="ph-stock-page">
      <StockUI
        search={logic.search}
        setSearch={logic.setSearch}
        showAddForm={logic.showAddForm}
        setShowAddForm={logic.setShowAddForm}
        addForm={logic.addForm}
        setAddForm={logic.setAddForm}
        editingId={logic.editingId}
        editingMode={logic.editingMode}
        editingQuantity={logic.editingQuantity}
        setEditingQuantity={logic.setEditingQuantity}
        showHistory={logic.showHistory}
        setShowHistory={logic.setShowHistory}
        loading={logic.loading}
        saving={logic.saving}
        error={logic.error}
        filteredItems={logic.filteredItems}
        handleAddMedication={logic.handleAddMedication}
        cancelAddForm={logic.cancelAddForm}
        handleDeleteMedication={logic.handleDeleteMedication}
        beginIncrement={logic.beginIncrement}
        beginDecrement={logic.beginDecrement}
        cancelEditQuantity={logic.cancelEditQuantity}
        saveQuantity={logic.saveQuantity}
      />
    </div>
  );
}