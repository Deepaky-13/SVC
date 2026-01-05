import db from "../db/database.js";

/* CREATE OR GET CUSTOMER */
export const upsertCustomer = (name, phone) =>
  new Promise((resolve, reject) => {
    db.get(`SELECT * FROM customers WHERE phone = ?`, [phone], (err, row) => {
      if (err) return reject(err);

      if (row) return resolve(row);

      db.run(
        `
          INSERT INTO customers (name, phone)
          VALUES (?, ?)
          `,
        [name, phone],
        function (err) {
          if (err) reject(err);
          else
            resolve({
              id: this.lastID,
              name,
              phone,
            });
        }
      );
    });
  });

/* SEARCH CUSTOMER BY PHONE */
export const searchCustomersByPhone = (phone) =>
  new Promise((resolve, reject) => {
    db.all(
      `
      SELECT * FROM customers
      WHERE phone LIKE ?
      ORDER BY created_at DESC
      `,
      [`%${phone}%`],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });

/* CUSTOMER PURCHASE HISTORY */
export const getCustomerSales = (customerId) =>
  new Promise((resolve, reject) => {
    db.all(
      `
      SELECT *
      FROM sales
      WHERE customer_id = ?
      ORDER BY created_at DESC
      `,
      [customerId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });

/* CUSTOMER SERVICE HISTORY */
export const getCustomerServices = (customerId) =>
  new Promise((resolve, reject) => {
    db.all(
      `
      SELECT *
      FROM service_jobs
      WHERE customer_id = ?
      ORDER BY created_at DESC
      `,
      [customerId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
