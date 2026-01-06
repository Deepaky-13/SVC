import db from "../db/database.js";

/* CREATE CUSTOMER */
export const createCustomer = ({ name, phone }) =>
  new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO customers (name, phone) VALUES (?, ?)`,
      [name, phone],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });

/* GET ALL CUSTOMERS */
export const getAllCustomers = () =>
  new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM customers ORDER BY created_at DESC`,
      [],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });

/* SEARCH BY PHONE / NAME */
export const searchCustomers = (q) =>
  new Promise((resolve, reject) => {
    db.all(
      `
      SELECT * FROM customers
      WHERE name LIKE ? OR phone LIKE ?
      LIMIT 10
      `,
      [`%${q}%`, `%${q}%`],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });

/* GET CUSTOMER DETAILS */
export const getCustomerById = (id) =>
  new Promise((resolve, reject) => {
    db.get(`SELECT * FROM customers WHERE id = ?`, [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
