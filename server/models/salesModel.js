import db from "../db/database.js";

/* CREATE SALE */
export const createSale = ({ customer_id, bill_no, total_amount }) =>
  new Promise((resolve, reject) => {
    db.run(
      `
      INSERT INTO sales (customer_id, bill_no, total_amount)
      VALUES (?, ?, ?)
      `,
      [customer_id, bill_no, total_amount],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });

/* ADD SALE ITEM */
export const addSaleItem = ({
  sale_id,
  product_id,
  selling_price,
  quantity,
  gst,
}) =>
  new Promise((resolve, reject) => {
    db.run(
      `
      INSERT INTO sales_items
      (sale_id, product_id, selling_price, quantity, gst)
      VALUES (?, ?, ?, ?, ?)
      `,
      [sale_id, product_id, selling_price, quantity, gst],
      function (err) {
        if (err) reject(err);
        else resolve(true);
      }
    );
  });

/* GET ALL SALES */
export const getAllSales = () =>
  new Promise((resolve, reject) => {
    db.all(
      `
      SELECT
        s.id,
        s.bill_no,
        s.total_amount,
        s.created_at,
        c.name AS customer_name,
        c.phone
      FROM sales s
      JOIN customers c ON s.customer_id = c.id
      ORDER BY s.created_at DESC
      `,
      [],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });

/* GET SALE DETAILS */
export const getSaleById = (id) =>
  new Promise((resolve, reject) => {
    const query = `
      SELECT
        s.id AS sale_id,
        s.bill_no,
        s.created_at,

        c.name AS customer_name,
        c.phone AS customer_phone,

        p.name AS product_name,
        si.selling_price,
        si.quantity

      FROM sales s
      JOIN customers c ON s.customer_id = c.id
      JOIN sales_items si ON si.sale_id = s.id
      JOIN products p ON p.id = si.product_id
      WHERE s.id = ?
    `;

    db.all(query, [id], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

/* GET SALE ITEMS */
export const getSaleItems = (sale_id) =>
  new Promise((resolve, reject) => {
    db.all(
      `
      SELECT
        si.quantity,
        si.selling_price,
        si.gst,
        p.name AS product_name
      FROM sales_items si
      JOIN products p ON si.product_id = p.id
      WHERE si.sale_id = ?
      `,
      [sale_id],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
