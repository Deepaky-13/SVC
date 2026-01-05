import db from "../db/database.js";

export const createSale = ({ customer_name, bill_no, total_amount }) => {
  return new Promise((resolve, reject) => {
    db.run(
      `
      INSERT INTO sales (customer_name, bill_no, total_amount)
      VALUES (?, ?, ?)
      `,
      [customer_name, bill_no, total_amount],
      function (err) {
        if (err) reject(err);
        resolve({ id: this.lastID });
      }
    );
  });
};

export const addSaleItem = ({
  sale_id,
  product_id,
  selling_price,
  quantity,
  gst,
}) => {
  return new Promise((resolve, reject) => {
    db.run(
      `
      INSERT INTO sales_items 
      (sale_id, product_id, selling_price, quantity, gst)
      VALUES (?, ?, ?, ?, ?)
      `,
      [sale_id, product_id, selling_price, quantity, gst],
      function (err) {
        if (err) reject(err);
        resolve(true);
      }
    );
  });
};

export const getAllSales = () => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM sales ORDER BY created_at DESC`, [], (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

export const getSaleById = (saleId) => {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT
        s.id AS sale_id,
        s.customer_name,
        s.bill_no,
        s.created_at,
        p.name AS product_name,
        si.selling_price,
        si.quantity,
        si.gst
      FROM sales s
      JOIN sales_items si ON s.id = si.sale_id
      JOIN products p ON p.id = si.product_id
      WHERE s.id = ?
      `,
      [saleId],
      (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      }
    );
  });
};
