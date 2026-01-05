import express from "express";
import {
  assignRolePermissions,
  fetchRolePermissions,
  fetchPermissionsByRole,
} from "../controllers/roleController.js";

const router = express.Router();

router.post("/", assignRolePermissions);
router.get("/", fetchRolePermissions);
router.get("/:role", fetchPermissionsByRole);

export default router;
