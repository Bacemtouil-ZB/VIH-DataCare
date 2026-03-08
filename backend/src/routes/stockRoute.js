import express from "express";
import {
  listStockItemsController,
  createStockItemController,
  updateStockQuantityController,
  deleteStockItemController,
} from "../controllers/stockController.js";
import { protect, authorizePharmacien } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect, authorizePharmacien);

router.get("/", protect, authorizePharmacien , listStockItemsController);
router.post("/add", protect, authorizePharmacien , createStockItemController);
router.patch("/:id/quantity", protect, authorizePharmacien , updateStockQuantityController);
router.delete("/:id", protect, authorizePharmacien , deleteStockItemController);

export default router;

