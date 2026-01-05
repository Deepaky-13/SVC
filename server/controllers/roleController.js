import {
  saveRolePermissions,
  getRolePermissions,
  getPermissionsByRole,
} from "../models/Role.js";

export const assignRolePermissions = async (req, res) => {
  try {
    const { role, permissions } = req.body;

    if (!role || !Array.isArray(permissions)) {
      return res.status(400).json({ message: "Invalid data" });
    }

    await saveRolePermissions(role, permissions);
    res.json({ message: "Permissions saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const fetchRolePermissions = async (req, res) => {
  try {
    res.json(await getRolePermissions());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const fetchPermissionsByRole = async (req, res) => {
  try {
    res.json(await getPermissionsByRole(req.params.role));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
