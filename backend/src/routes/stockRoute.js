import express from "express";
import {
  listStockItemsController,
  createStockItemController,
  updateStockQuantityController,
  deleteStockItemController,
} from "../controllers/stockController.js";
import { protect, authorizePharmacien } from "../middlewares/authMiddleware.js";
import {
  validateCreateStockItem,
  validateDeleteStockItem,
  validateUpdateStockQuantity,
} from "../middlewares/validators/stockValidator.js";

const router = express.Router();


router.get("/", protect, listStockItemsController);

router.post(
  "/add",
  protect,
  authorizePharmacien,
  validateCreateStockItem,
  createStockItemController,
);
router.patch(
  "/:id/quantity",
  protect,
  authorizePharmacien,
  validateUpdateStockQuantity,
  updateStockQuantityController,
);
router.delete(
  "/:id",
  protect,
  authorizePharmacien,
  validateDeleteStockItem,
  deleteStockItemController,
);

export default router;
