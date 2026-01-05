import {
  createSale,
  addSaleItem,
  getAllSales,
  getSaleById,
} from "../models/salesModel.js";

export const createSalesEntry = async (req, res) => {
  try {
    const { customer_name, bill_no, items } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ msg: "Sales items required" });
    }

    const total_amount = items.reduce(
      (sum, item) => sum + item.selling_price * item.quantity,
      0
    );

    const sale = await createSale({
      customer_name,
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const fetchAllSales = async (req, res) => {
  try {
    const sales = await getAllSales();
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const fetchSaleDetails = async (req, res) => {
  try {
    const sale = await getSaleById(req.params.id);
    console.log("Id", sale);

    res.json(sale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
