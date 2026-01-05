import db from "./database.js";

const initDatabase = () => {
  //* ---------------- SETTINGS ----------------
  db.run(`
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
  `);

  //* ---------------- ROLES & PERMISSIONS ----------------
  db.run(`
    CREATE TABLE IF NOT EXISTS role_permissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role TEXT NOT NULL,
      permission_key TEXT NOT NULL
    )
  `);

  //* ---------------- USERS ----------------
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT CHECK(role IN ('Admin','Staff')) NOT NULL,
      active INTEGER DEFAULT 1,
      created_at TEXT
    )
  `);

  //* ---------------- CATEGORIES ----------------
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  //* ---------------- PRODUCTS ----------------
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      brand TEXT,
      category_id INTEGER,
      barcode TEXT,
      active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )
  `);

  //* ---------------- PURCHASE HEADER ----------------
  db.run(`
    CREATE TABLE IF NOT EXISTS purchases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      supplier_name TEXT,
      invoice_no TEXT,
      total_amount REAL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  //* ---------------- PURCHASE ITEMS ----------------
  db.run(`
    CREATE TABLE IF NOT EXISTS purchase_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      purchase_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      purchase_price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      gst REAL,
      mrp REAL,
      FOREIGN KEY (purchase_id) REFERENCES purchases(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);

  //* ---------------- SALES ----------------
  db.run(`
    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT,
      bill_no TEXT,
      total_amount REAL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  //* ---------------- SALES ITEMS ----------------
  db.run(`
    CREATE TABLE IF NOT EXISTS sales_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sale_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      selling_price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      gst REAL,
      FOREIGN KEY (sale_id) REFERENCES sales(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS service_jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT NOT NULL,
  phone TEXT,
  device_model TEXT,
  imei TEXT,
  problem TEXT,
  estimated_cost REAL,
  advance_amount REAL DEFAULT 0,
  technician TEXT,
  status TEXT DEFAULT 'RECEIVED',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
)
    `);
  db.run(`
    CREATE TABLE IF NOT EXISTS service_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  service_id INTEGER,
  product_id INTEGER,
  price REAL,
  quantity INTEGER,
  FOREIGN KEY (service_id) REFERENCES service_jobs(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

    `);

  db.run(`CREATE TABLE IF NOT EXISTS service_invoice (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  service_id INTEGER,
  service_charge REAL,
  total_amount REAL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (service_id) REFERENCES service_jobs(id)
);
`);

  console.log("All tables initialized successfully");
};

export default initDatabase;
