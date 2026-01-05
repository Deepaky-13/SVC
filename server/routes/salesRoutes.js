import express from "express";
import {
  createSalesEntry,
  fetchAllSales,
  fetchSaleDetails,
} from "../controllers/salesController.js";

const router = express.Router();

router.post("/", createSalesEntry);
router.get("/", fetchAllSales);
router.get("/:id", fetchSaleDetails);

export default router;
