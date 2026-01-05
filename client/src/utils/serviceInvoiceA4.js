import jsPDF from "jspdf";

export const generateServiceInvoiceA4 = ({
  shop,
  service,
  tax = { sgst: 9, cgst: 9 },
  action = "print", // print | download
}) => {
  const doc = new jsPDF("p", "mm", "a4");

  const left = 10;
  let y = 10;

  // BORDER
  doc.setLineWidth(0.8);
  doc.rect(5, 5, 200, 287);

  // HEADER
  doc.setFontSize(14);
  doc.setFont("times", "bold");
  doc.text(shop.name.toUpperCase(), 105, y, { align: "center" });
  y += 7;

  doc.setFontSize(10);
  doc.setFont("times", "normal");
  doc.text(shop.subtitle, 105, y, { align: "center" });
  y += 5;

  doc.text(`${shop.address}`, 105, y, { align: "center" });
  y += 5;

  doc.text(`GSTIN : ${shop.gstin}      Cell : ${shop.phone}`, 105, y, {
    align: "center",
  });

  // LINE
  y += 4;
  doc.line(5, y, 205, y);
  y += 6;

  // BILL INFO
  doc.text(`No : SRV-${service.id}`, left, y);
  doc.text(
    `Date : ${new Date(service.created_at).toLocaleDateString()}`,
    150,
    y
  );
  y += 8;

  // CUSTOMER
  doc.text(`Name : ${service.customer_name}`, left, y);
  y += 7;
  doc.text(`Cell No : ${service.phone || ""}`, left, y);
  y += 8;

  // DEVICE DETAILS BOX
  doc.rect(left, y, 120, 80);
  doc.text(`Model : ${service.device_model}`, left + 3, y + 8);
  doc.text(`IMEI No.1 : ${service.imei || ""}`, left + 3, y + 18);
  doc.text(`IMEI No.2 :`, left + 3, y + 28);
  doc.text(`Battery No :`, left + 3, y + 38);
  doc.text(`Charger No :`, left + 3, y + 48);

  doc.text(`Charger`, left + 60, y + 58);
  doc.text(`Battery`, left + 60, y + 68);
  doc.text(`Head Phone`, left + 60, y + 78);

  // RIGHT EMPTY BOX
  doc.rect(left + 120, y, 75, 80);

  y += 90;

  // TAX BOX
  doc.rect(left + 120, y, 75, 40);
  doc.text(`SGST ${tax.sgst}%`, left + 123, y + 10);
  doc.text(`CGST ${tax.cgst}%`, left + 123, y + 20);
  doc.text(`TOTAL`, left + 123, y + 30);

  // TERMS
  y += 50;
  doc.setFontSize(9);
  doc.text("• No Warranty for water Damage and physical damage.", left, y);
  y += 5;
  doc.text("• Goods once sold cannot be taken back.", left, y);
  y += 5;
  doc.text("• Service only at our authorized service center.", left, y);

  // SIGNATURE
  y += 15;
  doc.text("Receiver's Signature", left, y);
  doc.text(`For ${shop.name}`, 150, y);

  if (action === "download") {
    doc.save(`Service_${service.id}.pdf`);
  } else {
    doc.autoPrint();
    window.open(doc.output("bloburl"));
  }
};
