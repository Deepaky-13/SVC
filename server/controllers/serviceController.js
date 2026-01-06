import {
  createServiceJob,
  addServiceItem,
  getAllServices,
  getServiceById,
  updateServiceStatus,
} from "../models/serviceModel.js";

/* CREATE SERVICE */
export const createService = async (req, res) => {
  try {
    const {
      customer_id,
      device_model,
      imei,
      problem,
      estimated_cost,
      advance_amount,
      technician,
      items = [],
    } = req.body;

    if (!customer_id) {
      return res.status(400).json({ msg: "Customer is required" });
    }

    const service = await createServiceJob({
      customer_id,
      device_model,
      imei,
      problem,
      estimated_cost,
      advance_amount,
      technician,
    });

    for (const item of items) {
      await addServiceItem({
        service_id: service.id,
        product_id: item.product_id,
        price: item.price,
        quantity: item.quantity,
      });
    }

    res.status(201).json({
      msg: "Service job created",
      service_id: service.id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* GET ALL SERVICES */
export const fetchAllServices = async (req, res) => {
  try {
    const services = await getAllServices();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* GET SERVICE DETAILS */
export const fetchServiceDetails = async (req, res) => {
  try {
    const service = await getServiceById(req.params.id);

    if (!service) {
      return res.status(404).json({ msg: "Service not found" });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* UPDATE STATUS */
export const changeServiceStatus = async (req, res) => {
  let { status } = req.body;

  if (!status) {
    return res.status(400).json({ msg: "Status required" });
  }

  status = status.toUpperCase(); // 🔥 IMPORTANT

  await updateServiceStatus(req.params.id, status);

  res.json({ msg: "Service status updated" });
};
