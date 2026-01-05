import db from "../db/database.js";

export const getCategories = () =>
  new Promise((resolve, reject) => {
    db.all("SELECT * FROM categories", [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

export const addCategory = (name) =>
  new Promise((resolve, reject) => {
    db.run("INSERT INTO categories (name) VALUES (?)", [name], function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, name });
    });
  });
