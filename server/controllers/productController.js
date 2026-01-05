import {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  toggleProductStatus,
  getProductByBarcode,
  searchProducts,
} from "../models/productModel.js";

/* ---------------- GET ALL ---------------- */
export const fetchProducts = async (req, res) => {
  const data = await getProducts();
  res.json(data);
};

/* ---------------- GET ONE ---------------- */
export const fetchProductById = async (req, res) => {
  const data = await getProductById(req.params.id);
  res.json(data);
};

/* ---------------- CREATE ---------------- */
export const createProduct = async (req, res) => {
  const result = await addProduct(req.body);
  res.json({ success: true, id: result.id });
};

/* ---------------- UPDATE ---------------- */
export const editProduct = async (req, res) => {
  const { id } = req.params;
  const result = await updateProduct(id, req.body);
  res.json({ success: true, updated: result.updated });
};

/* ---------------- TOGGLE STATUS ---------------- */

export const toggleProduct = async (req, res) => {
  const { id } = req.params;
  const { active } = req.body;

  const result = await toggleProductStatus(id, active);
  res.json({ success: true, updated: result.updated });
};

/* ---------------- GET BY BARCODE ---------------- */

export const fetchByBarcode = async (req, res) => {
  const product = await getProductByBarcode(req.params.barcode);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
};

/* ---------------- FETCH STOCK REPORT ---------------- */
export const fetchStock = async (req, res) => {
  const data = await getStockReport();
  res.json(data);
};

export const searchProductsController = async (req, res) => {
  try {
    const { q } = req.query;
    console.log(q);

    if (!q || !q.trim()) {
      return res.status(400).json({ message: "Search query required" });
    }

    const products = await searchProducts(q);
    console.log(products);

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
