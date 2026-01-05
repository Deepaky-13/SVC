import db from "../db/database.js";

/* SAVE PERMISSIONS */
export const saveRolePermissions = (role, permissions) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run("DELETE FROM role_permissions WHERE role = ?", [role]);

      const stmt = db.prepare(
        "INSERT INTO role_permissions (role, permission_key) VALUES (?, ?)"
      );

      permissions.forEach((p) => stmt.run(role, p));

      stmt.finalize((err) => {
        if (err) reject(err);
        else resolve({ success: true });
      });
    });
  });
};

/* GET ALL */
export const getRolePermissions = () => {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT role, GROUP_CONCAT(permission_key) AS permissions
      FROM role_permissions
      GROUP BY role
      `,
      (err, rows) => {
        if (err) reject(err);
        else {
          resolve(
            rows.map((r) => ({
              role: r.role,
              permissions: r.permissions ? r.permissions.split(",") : [],
            }))
          );
        }
      }
    );
  });
};

/* GET BY ROLE */
export const getPermissionsByRole = (role) => {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT permission_key FROM role_permissions WHERE role = ?",
      [role],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows.map((r) => r.permission_key));
      }
    );
  });
};
