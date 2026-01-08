import express from "express";
import {
  assignUserPermissions,
  fetchUserPermissions,
  fetchPermissionsByUser,
} from "../controllers/userPermissionController.js";

const router = express.Router();

router.post("/", assignUserPermissions);
router.get("/", fetchUserPermissions);
router.get("/:userId", fetchPermissionsByUser);

export default router;
