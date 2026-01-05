import express from "express";
import {
  addPurchase,
  fetchPurchaseItems,
  fetchPurchases,
} from "../controllers/purchaseController.js";

const router = express.Router();

router.get("/", fetchPurchases);
router.post("/", addPurchase);
router.get("/:id/items", fetchPurchaseItems);

export default router;
