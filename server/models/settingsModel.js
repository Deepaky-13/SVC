import db from "../db/database.js";

export const getSettings = () => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM settings WHERE id = 1", (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const saveSettings = (data) => {
  const {
    shop_name,
    address,
    phone,
    gstin,
    gst_enabled,
    invoice_format,
    sales_prefix,
    service_prefix,
  } = data;

  const sql = `
    INSERT INTO settings (
      id, shop_name, address, phone, gstin,
      gst_enabled, invoice_format, sales_prefix, service_prefix,
      created_at, updated_at
    )
    VALUES (
      1,?,?,?,?,?,?,?,?,datetime('now'),datetime('now')
    )
    ON CONFLICT(id) DO UPDATE SET
      shop_name=excluded.shop_name,
      address=excluded.address,
      phone=excluded.phone,
      gstin=excluded.gstin,
      gst_enabled=excluded.gst_enabled,
      invoice_format=excluded.invoice_format,
      sales_prefix=excluded.sales_prefix,
      service_prefix=excluded.service_prefix,
      updated_at=datetime('now')
  `;

  return new Promise((resolve, reject) => {
    db.run(
      sql,
      [
        shop_name,
        address,
        phone,
        gstin,
        gst_enabled,
        invoice_format,
        sales_prefix,
        service_prefix,
      ],
      (err) => {
        if (err) reject(err);
        else resolve({ success: true });
      }
    );
  });
};
