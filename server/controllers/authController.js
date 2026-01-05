import bcrypt from "bcrypt";
import db from "../db/database.js";

/* ================= LOGIN ================= */
export const login = (req, res) => {
  const { username, password } = req.body;

  /* ================= STATIC ADMIN ================= */
  if (username === "admin" && password === "admin123") {
    req.session.user = {
      id: 0,
      username: "admin",
      role: "Admin",
    };

    req.session.permissions = ["*"];
    return res.json({ success: true });
  }

  /* ================= STAFF (DB USERS) ================= */
  db.get(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, user) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      if (user.active === 0) {
        return res
          .status(403)
          .json({ message: "You are now inactive , please contact for Admin" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.user = {
        id: user.id,
        username: user.username,
        role: "Staff",
      };

      // Load staff permissions
      db.all(
        "SELECT permission_key FROM role_permissions WHERE role = 'Staff'",
        (err, rows) => {
          if (err) {
            return res.status(500).json({ message: err.message });
          }

          req.session.permissions = rows.map((r) => r.permission_key);
          res.json({ success: true });
        }
      );
    }
  );
};

/* ================= ME ================= */
export const me = (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ authenticated: false });
  }

  res.json({
    authenticated: true,
    user: req.session.user,
    permissions: req.session.permissions,
  });
};

/* ================= LOGOUT ================= */
export const logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("svc.sid");
    res.json({ success: true });
  });
};
