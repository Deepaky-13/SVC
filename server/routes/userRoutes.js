import express from "express";
import {
  addUser,
  fetchUsers,
  editUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/", addUser); // Admin only
router.get("/", fetchUsers); // Admin only
router.put("/:id", editUser); // Admin only

export default router;
