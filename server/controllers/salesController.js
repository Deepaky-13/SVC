import {
  createSale,
  addSaleItem,
  getAllSales,
  getSaleById,
} from "../models/salesModel.js";

/* CREATE SALE */
export const createSalesEntry = async (req, res) => {
  try {
    const { customer_id, bill_no, items } = req.body;

    if (!customer_id) return res.status(400).json({ msg: "Customer required" });

    if (!items || !items.length)
      return res.status(400).json({ msg: "Sales items required" });

    const total_amount = items.reduce(
      (sum, i) => sum + i.selling_price * i.quantity,
      0
    );

    const sale = await createSale({
      customer_id,
      bill_no,
      total_amount,
    });

    for (const item of items) {
      await addSaleItem({
        sale_id: sale.id,
        product_id: item.product_id,
        selling_price: item.selling_price,
        quantity: item.quantity,
        gst: item.gst || 0,
      });
    }

    res.status(201).json({
      msg: "Sale created successfully",
      sale_id: sale.id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* GET ALL SALES */
export const fetchAllSales = async (req, res) => {
  const sales = await getAllSales();
  res.json(sales);
};

/* GET SALE DETAILS */
export const fetchSaleDetails = async (req, res) => {
  const sale = await getSaleById(req.params.id);
  res.json(sale);
};
