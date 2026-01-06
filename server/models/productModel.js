import db from "../db/database.js";

/* ---------------- GET ALL PRODUCTS (WITH CATEGORY) ---------------- */
export const getProducts = () =>
  new Promise((resolve, reject) => {
    const query = `
      SELECT
        p.id,
        p.name,
        p.brand,
        p.barcode,
        p.active,
        p.category_id,
        c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `;

    db.all(query, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

/* ---------------- GET SINGLE PRODUCT ---------------- */
export const getProductById = (id) =>
  new Promise((resolve, reject) => {
    db.get(
      `
      SELECT
        p.id,
        p.name,
        p.brand,
        p.barcode,
        p.active,
        p.category_id,
        c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
      `,
      [id],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      }
    );
  });

/* ---------------- CREATE PRODUCT ---------------- */
export const addProduct = (data) =>
  new Promise((resolve, reject) => {
    const { name, brand, category_id } = data;

    db.run(
      `
      INSERT INTO products (name, brand, category_id)
      VALUES (?, ?, ?)
      `,
      [name, brand, category_id],
      function (err) {
        if (err) return reject(err);

        const productId = this.lastID;
        const barcode = `SVC-${String(productId).padStart(6, "0")}`;

        db.run(
          `UPDATE products SET barcode = ? WHERE id = ?`,
          [barcode, productId],
          () => resolve({ id: productId, barcode })
        );
      }
    );
  });

/* ---------------- UPDATE PRODUCT ---------------- */
export const updateProduct = (id, data) =>
  new Promise((resolve, reject) => {
    const { name, brand, category_id, barcode, active } = data;

    const query = `
      UPDATE products SET
        name = ?,
        brand = ?,
        category_id = ?,
        barcode = ?,
        active = ?
      WHERE id = ?
    `;

    db.run(
      query,
      [name, brand, category_id, barcode, active, id],
      function (err) {
        if (err) reject(err);
        else resolve({ updated: this.changes });
      }
    );
  });

/* ---------------- TOGGLE PRODUCT STATUS ---------------- */
export const toggleProductStatus = (id, active) =>
  new Promise((resolve, reject) => {
    db.run(
      `UPDATE products SET active = ? WHERE id = ?`,
      [active, id],
      function (err) {
        if (err) reject(err);
        else resolve({ updated: this.changes });
      }
    );
  });

export const getProductByBarcode = (barcode) =>
  new Promise((resolve, reject) => {
    db.get(
      `
      SELECT
        p.id,
        p.name,
        p.brand,
        p.barcode,
        p.category_id,
        c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.barcode = ?
        AND p.active = 1
      `,
      [barcode.trim()],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      }
    );
  });
export const getStockReport = () =>
  new Promise((resolve, reject) => {
    const query = `
      SELECT
        p.id,
        c.name AS category,
        p.name AS product,
        p.brand,
        IFNULL(SUM(pi.quantity), 0)
        - IFNULL(SUM(si.quantity), 0)
        - IFNULL(SUM(
          CASE
            WHEN sj.status = 'DELIVERED'
            THEN svi.quantity
            ELSE 0
          END
        ), 0) AS stock
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      LEFT JOIN purchase_items pi ON p.id = pi.product_id
      LEFT JOIN sales_items si ON p.id = si.product_id
      LEFT JOIN service_items svi ON p.id = svi.product_id
      LEFT JOIN service_jobs sj ON sj.id = svi.service_id
      GROUP BY p.id
      ORDER BY p.name;
    `;

    db.all(query, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

export const searchProducts = (query) =>
  new Promise((resolve, reject) => {
    const q = query.trim();

    const sql = `
      SELECT
        p.id,
        p.name,
        p.brand,
        p.barcode,
        p.category_id,
        c.name AS category_name,
        p.active
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.active = 1
        AND (
          p.name LIKE ?
          OR p.brand LIKE ?
          OR p.barcode = ?
        )
      ORDER BY p.name
      LIMIT 20
    `;

    db.all(sql, [`%${q}%`, `%${q}%`, q], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
