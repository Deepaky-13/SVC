import express from "express";
import {
  searchCustomers,
  fetchCustomerDetails,
} from "../controllers/customerController.js";

const router = express.Router();

router.get("/", searchCustomers);
router.get("/:id/history", fetchCustomerDetails);

export default router;
