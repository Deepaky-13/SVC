import db from "../db/database.js";

/* CREATE SERVICE JOB */
export const createServiceJob = (data) =>
  new Promise((resolve, reject) => {
    const {
      customer_id,
      device_model,
      imei,
      problem,
      estimated_cost,
      advance_amount,
      technician,
      status = "RECEIVED",
    } = data;

    db.run(
      `
      INSERT INTO service_jobs
      (customer_id, device_model, imei, problem,
       estimated_cost, advance_amount, technician, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        customer_id,
        device_model,
        imei,
        problem,
        estimated_cost,
        advance_amount,
        technician,
        status,
      ],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });

/* ADD SPARE PART */
export const addServiceItem = ({ service_id, product_id, price, quantity }) =>
  new Promise((resolve, reject) => {
    db.run(
      `
      INSERT INTO service_items
      (service_id, product_id, price, quantity)
      VALUES (?, ?, ?, ?)
      `,
      [service_id, product_id, price, quantity],
      function (err) {
        if (err) reject(err);
        else resolve(true);
      }
    );
  });

/* GET ALL SERVICES */
export const getAllServices = () =>
  new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM service_jobs ORDER BY created_at DESC`,
      [],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });

/* UPDATE SERVICE STATUS */
export const updateServiceStatus = (id, status) =>
  new Promise((resolve, reject) => {
    db.run(
      `UPDATE service_jobs SET status = ? WHERE id = ?`,
      [status, id],
      function (err) {
        if (err) reject(err);
        else resolve({ updated: this.changes });
      }
    );
  });
export const getServiceById = (id) =>
  new Promise((resolve, reject) => {
    const query = `
      SELECT
        sj.id,
        sj.status,
        sj.device_model,
        sj.imei,
        sj.problem,
        sj.estimated_cost,
        sj.advance_amount,
        sj.technician,
        sj.created_at,

        c.name AS customer_name,
        c.phone AS customer_phone,

        p.name AS product_name,
        si.price,
        si.quantity

      FROM service_jobs sj
      JOIN customers c ON c.id = sj.customer_id
      LEFT JOIN service_items si ON si.service_id = sj.id
      LEFT JOIN products p ON p.id = si.product_id

      WHERE sj.id = ?
    `;

    db.all(query, [id], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
