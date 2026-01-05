import db from "../db/database.js";
import bcrypt from "bcrypt";

/* ================= CREATE USER ================= */
export const createUser = async ({ username, password, role }) => {
  const hash = await bcrypt.hash(password, 10);

  return new Promise((resolve, reject) => {
    db.run(
      `
      INSERT INTO users (username, password, role, created_at)
      VALUES (?, ?, ?, datetime('now'))
      `,
      [username, hash, role],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });
};

/* ================= GET USERS ================= */
export const getUsers = () => {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT id, username, role, active
      FROM users
      `,
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
};

/* ================= UPDATE USER ================= */
export const updateUser = (id, role, active) => {
  return new Promise((resolve, reject) => {
    db.run(
      `
      UPDATE users
      SET role = ?, active = ?
      WHERE id = ?
      `,
      [role, active, id],
      (err) => {
        if (err) reject(err);
        else resolve({ success: true });
      }
    );
  });
};
