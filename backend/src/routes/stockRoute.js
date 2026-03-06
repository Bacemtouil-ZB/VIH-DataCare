import express from "express";
import {
  listStockItemsController,
  createStockItemController,
  updateStockQuantityController,
  deleteStockItemController,
  getStockContextByNumeroController,
} from "../controllers/stockController.js";
import { protect, authorizePharmacien } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect, authorizePharmacien);

router.get("/", listStockItemsController);
router.get("/context/:numero", getStockContextByNumeroController);
router.post("/", createStockItemController);
router.patch("/:id/quantity", updateStockQuantityController);
router.delete("/:id", deleteStockItemController);

export default router;

