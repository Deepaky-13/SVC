import express from "express";
import { fetchStock } from "../controllers/stockController.js";

const router = express.Router();

router.get("/", fetchStock);

export default router;
