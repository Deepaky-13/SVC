import {
  createPurchase,
  getNextInvoiceNo,
  getPurchaseItems,
  getPurchases,
} from "../models/purchaseModel.js";

export const addPurchase = async (req, res) => {
  const { purchase, items } = req.body;

  const invoiceNo = await getNextInvoiceNo();

  const result = await createPurchase(
    {
      ...purchase,
      invoice_no: invoiceNo,
    },
    items
  );

  res.json({
    success: true,
    invoice_no: invoiceNo,
    data: result,
  });
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
