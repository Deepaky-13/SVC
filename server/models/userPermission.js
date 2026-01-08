import db from "../db/database.js";

/* ================= SAVE USER PERMISSIONS ================= */
export const saveUserPermissions = (userId, permissions) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run("DELETE FROM user_permissions WHERE user_id = ?", [userId]);

      const stmt = db.prepare(
        "INSERT INTO user_permissions (user_id, permission_key) VALUES (?, ?)"
      );

      permissions.forEach((p) => stmt.run(userId, p));

      stmt.finalize((err) => {
        if (err) reject(err);
        else resolve({ success: true });
      });
    });
  });
};

/* ================= GET ALL USERS + PERMISSIONS ================= */
export const getAllUserPermissions = () => {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT 
        u.id AS userId,
        u.username,
        u.role,
        GROUP_CONCAT(up.permission_key) AS permissions
      FROM users u
      LEFT JOIN user_permissions up ON up.user_id = u.id
      GROUP BY u.id
      `,
      (err, rows) => {
        if (err) reject(err);
        else {
          resolve(
            rows.map((r) => ({
              userId: r.userId,
              username: r.username,
              role: r.role,
              permissions: r.permissions ? r.permissions.split(",") : [],
            }))
          );
        }
      }
    );
  });
};

/* ================= GET BY USER ================= */
export const getPermissionsByUser = (userId) => {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT permission_key FROM user_permissions WHERE user_id = ?",
      [userId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows.map((r) => r.permission_key));
      }
    );
  });
};
