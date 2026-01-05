import express from "express";
import {
  createService,
  fetchServices,
  changeServiceStatus,
  fetchServiceDetails,
} from "../controllers/serviceController.js";

const router = express.Router();

router.post("/", createService);
router.get("/", fetchServices);
router.get("/:id", fetchServiceDetails);
router.patch("/:id/status", changeServiceStatus);

export default router;
