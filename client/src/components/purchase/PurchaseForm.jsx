import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRef, useState } from "react";
import customFetch from "../../utils/customFetch";

export default function PurchaseForm({ open, onClose, onSaved }) {
  const [supplier, setSupplier] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [items, setItems] = useState([]);

  // 🔹 Refs for keyboard navigation
  const priceRefs = useRef([]);
  const qtyRefs = useRef([]);
  const gstRefs = useRef([]);
  const mrpRefs = useRef([]);
  const scanRef = useRef(null);

  /* ---------------- BARCODE SCAN ---------------- */
  const handleScan = async (e) => {
    if (e.key !== "Enter") return;

    const barcode = e.target.value.trim();
    if (!barcode) return;

    try {
      const res = await customFetch.get(`/products/barcode/${barcode}`);

      const product = res.data;

      setItems((prev) => {
        // 🔥 FIND EXISTING PRODUCT ROW
        const index = prev.findIndex(
          (item) => Number(item.product_id) === Number(product.id)
        );

        // ✅ IF FOUND → INCREASE QUANTITY
        if (index !== -1) {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            quantity: updated[index].quantity + 1,
          };

          // focus qty
          setTimeout(() => {
            qtyRefs.current[index]?.focus();
          }, 50);

          return updated;
        }

        // ✅ IF NOT FOUND → ADD NEW ROW
        const updated = [
          ...prev,
          {
            product_id: product.id,
            name: product.name,
            purchase_price: 0,
            quantity: 1,
            gst: 0,
            mrp: 0,
          },
        ];

        // focus price
        setTimeout(() => {
          priceRefs.current[updated.length - 1]?.focus();
        }, 50);

        return updated;
      });
    } catch (err) {
      alert("Product not found");
    }

    e.target.value = "";
  };

  /* ---------------- UPDATE ITEM ---------------- */
  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = Number(value);
    setItems(updated);
  };

  /* ---------------- REMOVE ITEM ---------------- */
  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  /* ---------------- TOTAL ---------------- */
  const totalAmount = items.reduce(
    (sum, i) => sum + i.purchase_price * i.quantity,
    0
  );

  /* ---------------- SAVE ---------------- */
  const handleSave = async () => {
    if (!supplier || items.length === 0) {
      alert("Supplier & items required");
      return;
    }

    await customFetch.post("/purchases", {
      purchase: {
        supplier_name: supplier,
        invoice_no: invoiceNo,
        invoice_date: new Date().toISOString(),
        total_amount: totalAmount,
      },
      items,
    });

    setSupplier("");
    setInvoiceNo("");
    setItems([]);
    onSaved();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>New Purchase</DialogTitle>

      <DialogContent>
        {/* Supplier & Invoice */}
        <Box display="flex" gap={2} mb={2}>
          <TextField
            label="Supplier Name"
            fullWidth
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
          />
          <TextField
            label="Invoice No"
            fullWidth
            value={invoiceNo}
            onChange={(e) => setInvoiceNo(e.target.value)}
          />
        </Box>

        {/* Scan Barcode */}
        <TextField
          fullWidth
          label="Scan Barcode"
          autoFocus
          inputRef={scanRef}
          onKeyDown={handleScan}
        />

        {/* Items Table */}
        <Table size="small" sx={{ mt: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>GST %</TableCell>
              <TableCell>MRP</TableCell>
              <TableCell align="center">Remove</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {items.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{row.name}</TableCell>

                {/* Price */}
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    inputRef={(el) => (priceRefs.current[i] = el)}
                    value={row.purchase_price}
                    onChange={(e) =>
                      updateItem(i, "purchase_price", e.target.value)
                    }
                    onKeyDown={(e) =>
                      e.key === "Enter" && qtyRefs.current[i]?.focus()
                    }
                  />
                </TableCell>

                {/* Qty */}
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    inputRef={(el) => (qtyRefs.current[i] = el)}
                    value={row.quantity}
                    onChange={(e) => updateItem(i, "quantity", e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && gstRefs.current[i]?.focus()
                    }
                  />
                </TableCell>

                {/* GST */}
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    inputRef={(el) => (gstRefs.current[i] = el)}
                    value={row.gst}
                    onChange={(e) => updateItem(i, "gst", e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && mrpRefs.current[i]?.focus()
                    }
                  />
                </TableCell>

                {/* MRP */}
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    inputRef={(el) => (mrpRefs.current[i] = el)}
                    value={row.mrp}
                    onChange={(e) => updateItem(i, "mrp", e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && priceRefs.current[i + 1]?.focus()
                    }
                  />
                </TableCell>

                {/* Remove */}
                <TableCell align="center">
                  <IconButton color="error" onClick={() => removeItem(i)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Total */}
        <Box textAlign="right" mt={2} fontWeight="bold">
          Total: ₹{totalAmount}
        </Box>

        {/* Save */}
        <Box textAlign="right" mt={2}>
          <Button variant="contained" onClick={handleSave}>
            SAVE PURCHASE
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
