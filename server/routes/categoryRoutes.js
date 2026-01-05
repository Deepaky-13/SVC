import express from "express";
import {
  fetchCategories,
  createCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.get("/", fetchCategories);
router.post("/", createCategory);

export default router;
