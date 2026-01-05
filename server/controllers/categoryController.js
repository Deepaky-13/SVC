import { getCategories, addCategory } from "../models/categoryModel.js";

export const fetchCategories = async (req, res) => {
  const data = await getCategories();
  res.json(data);
};

export const createCategory = async (req, res) => {
  const { name } = req.body;
  const data = await addCategory(name);
  res.json(data);
};
