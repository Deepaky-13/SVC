import db from "../db/database.js";

export const getNextInvoiceNo = () =>
  new Promise((resolve, reject) => {
    db.get(
      `SELECT id FROM purchases ORDER BY id DESC LIMIT 1`,
      [],
      (err, row) => {
        if (err) return reject(err);

        const next = (row?.id || 0) + 1;
        const year = new Date().getFullYear();
        resolve(`PUR-${year}-${String(next).padStart(5, "0")}`);
      }
    );
  });

/* ---------------- CREATE PURCHASE ---------------- */
export const createPurchase = (purchase, items) =>
  new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(
        `
        INSERT INTO purchases (supplier_name, invoice_no, total_amount)
        VALUES (?, ?, ?)
        `,
        [purchase.supplier_name, purchase.invoice_no, purchase.total_amount],
        function (err) {
          if (err) return reject(err);

          const purchaseId = this.lastID;

          const stmt = db.prepare(`
            INSERT INTO purchase_items
            (purchase_id, product_id, purchase_price, quantity, gst, mrp)
            VALUES (?, ?, ?, ?, ?, ?)
          `);

          items.forEach((item) => {
            stmt.run([
              purchaseId,
              item.product_id,
              item.purchase_price,
              item.quantity,
              item.gst,
              item.mrp,
            ]);
          });

          stmt.finalize();
          resolve({ purchaseId });
        }
      );
    });
  });

/* ---------------- GET ALL PURCHASES ---------------- */
export const getPurchases = () =>
  new Promise((resolve, reject) => {
    db.all(
      `
      SELECT
        id,
        supplier_name,
        invoice_no,
        total_amount,
        created_at
      FROM purchases
      ORDER BY id DESC
      `,
      [],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
/* ---------------- GET PURCHASE ITEMS ---------------- */
export const getPurchaseItems = (purchaseId) =>
  new Promise((resolve, reject) => {
    db.all(
      `
      SELECT
        pi.id,
        p.name AS product_name,
        pi.purchase_price,
        pi.quantity,
        pi.gst,
        pi.mrp
      FROM purchase_items pi
      JOIN products p ON pi.product_id = p.id
      WHERE pi.purchase_id = ?
      `,
      [purchaseId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
