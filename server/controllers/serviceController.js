import {
  createServiceJob,
  getAllServices,
  getServiceById,
  updateServiceStatus,
} from "../models/serviceModel.js";

export const createService = async (req, res) => {
  try {
    const service = await createServiceJob(req.body);
    res.status(201).json(service);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const fetchServices = async (req, res) => {
  const services = await getAllServices();
  res.json(services);
};

export const changeServiceStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  await updateServiceStatus(id, status);
  res.json({ success: true });
};

/* ---------------- FETCH SERVICE DETAILS ---------------- */
export const fetchServiceDetails = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id", "asdf");

    const service = await getServiceById(id);
    console.log(service);

    if (!service) {
      return res.status(404).json({ message: "Service job not found" });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
