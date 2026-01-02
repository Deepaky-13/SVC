import express from "express";
import {
  fetchSettings,
  updateSettings,
} from "../controllers/settingsController.js";

const router = express.Router();

router.get("/", fetchSettings);
router.post("/", updateSettings);

export default router;
