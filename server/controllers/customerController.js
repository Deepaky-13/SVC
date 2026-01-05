import {
  searchCustomersByPhone,
  getCustomerSales,
  getCustomerServices,
} from "../models/customerModel.js";

export const searchCustomers = async (req, res) => {
  const { phone } = req.query;
  const customers = await searchCustomersByPhone(phone || "");
  res.json(customers);
};

export const fetchCustomerDetails = async (req, res) => {
  const { id } = req.params;

  const sales = await getCustomerSales(id);
  const services = await getCustomerServices(id);

  res.json({
    sales,
    services,
  });
};
