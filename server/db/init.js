import db from "./database.js";

const initDatabase = () => {
  const settingsTable = `
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY,
      shop_name TEXT,
      address TEXT,
      phone TEXT,
      gstin TEXT,
      gst_enabled INTEGER DEFAULT 0,
      invoice_format TEXT DEFAULT 'THERMAL',
      sales_prefix TEXT DEFAULT 'SALE',
      service_prefix TEXT DEFAULT 'SRV',
      created_at TEXT,
      updated_at TEXT
    )
  `;

  db.run(settingsTable, (err) => {
    if (err) {
      console.error(" Error creating settings table:", err.message);
    } else {
      console.log(" Settings table ready");
    }
  });
};
//* ROLES
db.run(`
    CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    )
  `);

//* PERMISSIONS
db.run(`
    CREATE TABLE IF NOT EXISTS permissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      label TEXT
    )
  `);
//* USERS
db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role_id INTEGER,
      active INTEGER DEFAULT 1,
      created_at TEXT
    )
  `);

export default initDatabase;
