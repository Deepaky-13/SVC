import express from "express";
import {
  fetchProducts,
  fetchProductById,
  createProduct,
  editProduct,
  toggleProduct,
  fetchByBarcode,
  searchProductsController,
} from "../controllers/productController.js";
const router = express.Router();

router.get("/", fetchProducts);
router.post("/", createProduct);
router.get("/search", searchProductsController);
router.get("/barcode/:barcode", fetchByBarcode);
router.get("/:id", fetchProductById);
router.put("/:id", editProduct);
router.patch("/:id/status", toggleProduct);
export default router;
