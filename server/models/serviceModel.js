import db from "../db/database.js";

/* CREATE SERVICE JOB */
export const createServiceJob = (data) =>
  new Promise((resolve, reject) => {
    const {
      customer_name,
      phone,
      device_model,
      imei,
      problem,
      estimated_cost,
      advance_amount,
      technician,
    } = data;

    db.run(
      `
      INSERT INTO service_jobs
      (customer_name, phone, device_model, imei, problem,
       estimated_cost, advance_amount, technician)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        customer_name,
        phone,
        device_model,
        imei,
        problem,
        estimated_cost,
        advance_amount,
        technician,
      ],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
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

/* UPDATE STATUS */
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
/* ---------------- GET SERVICE BY ID ---------------- */
export const getServiceById = (id) =>
  new Promise((resolve, reject) => {
    db.get(
      `
      SELECT *
      FROM service_jobs
      WHERE id = ?
      `,
      [id],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      }
    );
  });
