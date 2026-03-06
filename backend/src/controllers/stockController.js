import {
  listStockItems as listStockItemsService,
  createStockItem as createStockItemService,
  updateStockQuantity as updateStockQuantityService,
  deleteStockItem as deleteStockItemService,
  getStockContextByNumero as getStockContextByNumeroService,
} from "../services/stockService.js";

export const listStockItemsController = async (req, res) => {
  try {
    const items = await listStockItemsService();
    res.status(200).json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    console.error("List stock error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const createStockItemController = async (req, res) => {
  try {
    const item = await createStockItemService(req.body, req.user?.id);
    res.status(201).json({
      success: true,
      message: "Article ajouté au stock",
      item,
    });
  } catch (error) {
    console.error("Create stock error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateStockQuantityController = async (req, res) => {
  try {
    const item = await updateStockQuantityService(
      req.params.id,
      req.body?.quantite,
      req.user?.id,
    );
    res.status(200).json({
      success: true,
      message: "Quantité de stock mise à jour",
      item,
    });
  } catch (error) {
    console.error("Update stock quantity error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteStockItemController = async (req, res) => {
  try {
    const item = await deleteStockItemService(req.params.id);
    res.status(200).json({
      success: true,
      message: "Article supprimé du stock",
      item,
    });
  } catch (error) {
    console.error("Delete stock error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getStockContextByNumeroController = async (req, res) => {
  try {
    const { numero } = req.params;
    const context = await getStockContextByNumeroService(numero);
    res.status(200).json({
      success: true,
      patient: context.patient,
      ordonnances: context.ordonnances,
    });
  } catch (error) {
    console.error("Get stock context by numero error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

