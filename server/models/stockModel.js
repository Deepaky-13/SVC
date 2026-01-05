import db from "../db/database.js";

export const getStockReport = () =>
  new Promise((resolve, reject) => {
    const query = `
      SELECT
        p.id,
        p.name,
        p.brand,
        c.name AS category,
        IFNULL(SUM(pi.quantity), 0) -
        IFNULL(SUM(si.quantity), 0) AS stock
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN purchase_items pi ON p.id = pi.product_id
      LEFT JOIN sales_items si ON p.id = si.product_id
      GROUP BY p.id
      ORDER BY p.name
    `;

    db.all(query, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
