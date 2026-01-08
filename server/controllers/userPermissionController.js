import {
  getAllUserPermissions,
  getPermissionsByUser,
  saveUserPermissions,
} from "../models/userPermission.js";

/* ================= ASSIGN ================= */
export const assignUserPermissions = async (req, res) => {
  try {
    const { userId, permissions } = req.body;

    if (!userId || !Array.isArray(permissions)) {
      return res.status(400).json({ message: "Invalid data" });
    }

    await saveUserPermissions(userId, permissions);
    res.json({ message: "User permissions saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= LIST ================= */
export const fetchUserPermissions = async (req, res) => {
  try {
    const data = await getAllUserPermissions();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= GET BY USER ================= */
export const fetchPermissionsByUser = async (req, res) => {
  try {
    const permissions = await getPermissionsByUser(req.params.userId);
    res.json(permissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
