import {
  createPurchase,
  getPurchaseItems,
  getPurchases,
} from "../models/purchaseModel.js";

export const addPurchase = async (req, res) => {
  const { purchase, items } = req.body;
  const result = await createPurchase(purchase, items);
  res.json({ success: true, data: result });
};

export const fetchPurchases = async (req, res) => {
  console.log("sdfasdf");

  const data = await getPurchases();
  res.json(data);
};
/* ---------------- FETCH PURCHASE ITEMS ---------------- */
export const fetchPurchaseItems = async (req, res) => {
  const data = await getPurchaseItems(req.params.id);
  res.json(data);
};
