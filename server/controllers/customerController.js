import {
  createCustomer,
  getAllCustomers,
  getCustomerById,
} from "../models/customerModel.js";

export const addCustomer = async (req, res) => {
  const { name, phone } = req.body;
  if (!name || !phone)
    return res.status(400).json({ msg: "Name & phone required" });

  const customer = await createCustomer({ name, phone });
  res.json(customer);
};

export const fetchCustomers = async (req, res) => {
  const customers = await getAllCustomers();
  res.json(customers);
};

export const fetchCustomer = async (req, res) => {
  const customer = await getCustomerById(req.params.id);
  res.json(customer);
};
