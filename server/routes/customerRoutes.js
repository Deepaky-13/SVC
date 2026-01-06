import express from "express";
import {
  addCustomer,
  fetchCustomers,
  fetchCustomer,
} from "../controllers/customerController.js";

const router = express.Router();

router.post("/", addCustomer);
router.get("/", fetchCustomers);
router.get("/:id", fetchCustomer);

export default router;
