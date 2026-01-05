import { createUser, getUsers, updateUser } from "../models/User.js";

/* ================= CREATE ================= */
export const addUser = async (req, res) => {
  try {
    console.log(req.body);

    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ message: "All fields required" });
    }

    await createUser({ username, password, role });
    res.json({ message: "User created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

/* ================= LIST ================= */
export const fetchUsers = async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= UPDATE ================= */
export const editUser = async (req, res) => {
  try {
    const { role, active } = req.body;

    await updateUser(req.params.id, role, active);
    res.json({ message: "User updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
