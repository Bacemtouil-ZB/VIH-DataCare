import {
  listStockItems as listStockItemsService,
  createStockItem as createStockItemService,
  updateStockQuantity as updateStockQuantityService,
  deleteStockItem as deleteStockItemService,
  getStockItemById as getStockItemByIdService,
} from "../services/stockService.js";
import { logAction } from "../services/auditService.js";

export const listStockItemsController = async (req, res) => {
  try {
    const items = await listStockItemsService();

    await logAction(req, {
      module: "STOCK",
      action: "STOCK_VIEW",
      patient_id: null,
      entity_id: null,
      old_data: null,
      new_data: null,
    });

    res.status(200).json({ success: true, count: items.length, items });
  } catch (error) {
    console.error("List stock error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const createStockItemController = async (req, res) => {
  try {
    const item = await createStockItemService(req.body, req.user?.id);

    await logAction(req, {
      module: "STOCK",
      action: "STOCK_CREATE",
      patient_id: null,
      entity_id: item.id,
      old_data: null,
      new_data: item,
    });

    res.status(201).json({ success: true, message: "Article ajouté au stock", item });
  } catch (error) {
    console.error("Create stock error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateStockQuantityController = async (req, res) => {
  try {
    const oldItem = await getStockItemByIdService(req.params.id);

    const item = await updateStockQuantityService(
      req.params.id,
      req.body?.quantite,
      req.user?.id,
    );

    await logAction(req, {
      module: "STOCK",
      action: "STOCK_UPDATE",
      patient_id: null,
      entity_id: item.id,
      old_data: { quantite: oldItem.quantite },
      new_data: item,
    });

    res.status(200).json({ success: true, message: "Quantité de stock mise à jour", item });
  } catch (error) {
    console.error("Update stock quantity error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteStockItemController = async (req, res) => {
  try {
    const item = await deleteStockItemService(req.params.id);

    await logAction(req, {
      module: "STOCK",
      action: "STOCK_DELETE",
      patient_id: null,
      entity_id: item.id,
      old_data: item,
      new_data: null,
    });

    res.status(200).json({ success: true, message: "Article supprimé du stock", item });
  } catch (error) {
    console.error("Delete stock error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};