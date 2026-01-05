import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateInvoice = ({
  sale,
  items,
  format = "A4", // THERMAL | A5 | A4
  action = "print", // print | download
}) => {
  let doc;

  /* ---------------- PAGE SIZE ---------------- */
  if (format === "THERMAL") {
    doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [80, 200],
    });
  } else if (format === "A5") {
    doc = new jsPDF("p", "mm", "a5");
  } else {
    doc = new jsPDF("p", "mm", "a4");
  }

  let y = 10;

  /* ---------------- HEADER ---------------- */
  doc.setFontSize(14);
  doc.text("INVOICE", doc.internal.pageSize.getWidth() / 2, y, {
    align: "center",
  });

  y += 8;
  doc.setFontSize(10);
  doc.text(`Customer: ${sale.customer_name}`, 10, y);
  y += 6;
  doc.text(`Bill No: ${sale.bill_no}`, 10, y);
  y += 6;
  doc.text(`Date: ${new Date(sale.created_at).toLocaleString()}`, 10, y);

  y += 8;

  /* ---------------- ITEMS ---------------- */
  autoTable(doc, {
    startY: y,
    theme: "grid",
    styles: {
      fontSize: format === "THERMAL" ? 8 : 10,
      cellPadding: 2,
    },
    head: [["Product", "Qty", "Price", "Amount"]],
    body: items.map((i) => [
      i.product_name,
      i.quantity,
      i.selling_price,
      (i.selling_price * i.quantity).toFixed(2),
    ]),
  });

  y = doc.lastAutoTable.finalY + 6;

  /* ---------------- TOTAL ---------------- */
  const total = items.reduce((sum, i) => sum + i.selling_price * i.quantity, 0);

  doc.setFontSize(12);
  doc.text(
    `Total: ₹ ${total.toFixed(2)}`,
    doc.internal.pageSize.getWidth() - 10,
    y,
    { align: "right" }
  );

  /* ---------------- ACTION RULES ---------------- */
  if (action === "download") {
    //* PDF download ONLY for A4
    if (format !== "A4") {
      alert("PDF download is allowed only for A4 format");
      return;
    }
    doc.save(`Invoice-${sale.bill_no}.pdf`);
  } else {
    // PRINT → THERMAL / A5 / A4
    doc.autoPrint();
    window.open(doc.output("bloburl"), "_blank");
  }
};
