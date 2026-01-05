import { getStockReport } from "../models/stockModel.js";

export const fetchStock = async (req, res) => {
  const data = await getStockReport();
  res.json(data);
};
