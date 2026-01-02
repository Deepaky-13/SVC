import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database path
const dbPath = path.join(__dirname, "vinayaga.db");

// Open database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(" Failed to connect to SQLite:", err.message);
  } else {
    console.log(" SQLite connected:", dbPath);
  }
});

export default db;
