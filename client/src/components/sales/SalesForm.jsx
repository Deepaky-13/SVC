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
  Paper,
  Divider,
  Autocomplete,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useRef, useState } from "react";
import customFetch from "../../utils/customFetch";

export default function SalesForm({ open, onClose, onSuccess }) {
  /* ---------------- CUSTOMER ---------------- */
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState(null);

  /* ---------------- BILL ---------------- */
  const [billNo, setBillNo] = useState("");

  /* ---------------- ITEMS ---------------- */
  const [items, setItems] = useState([]);
  const [activeRow, setActiveRow] = useState(null);

  /* ---------------- SEARCH ---------------- */
  const [searchText, setSearchText] = useState("");
  const [options, setOptions] = useState([]);

  /* ---------------- REFS ---------------- */
  const priceRefs = useRef([]);
  const qtyRefs = useRef([]);

  /* ---------------- LOAD CUSTOMERS ---------------- */
  useEffect(() => {
    customFetch.get("/customers").then((res) => setCustomers(res.data));
  }, []);

  /* ---------------- PRODUCT SEARCH ---------------- */
  useEffect(() => {
    if (!searchText || searchText.length < 2) {
      setOptions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const res = await customFetch.get(`/products/search?q=${searchText}`);
        setOptions(res.data || []);
      } catch {
        setOptions([]);
      }
    };

    fetchSuggestions();
  }, [searchText]);

  /* ---------------- ADD PRODUCT ---------------- */
  const addProductToItems = (product) => {
    setItems((prev) => {
      const index = prev.findIndex((i) => i.product_id === product.id);

      if (index !== -1) {
        const updated = [...prev];
        updated[index].quantity += 1;
        setActiveRow(index);
        setTimeout(() => qtyRefs.current[index]?.focus(), 100);
        return updated;
      }

      const updated = [
        ...prev,
        {
          product_id: product.id,
          name: product.name,
          price: product.selling_price || 0,
          quantity: 1,
          gst: 0,
          discount: 0,
        },
      ];

      const newIndex = updated.length - 1;
      setActiveRow(newIndex);
      setTimeout(() => priceRefs.current[newIndex]?.focus(), 100);
      return updated;
    });
  };

  /* ---------------- BARCODE ENTER ---------------- */
  const handleBarcodeEnter = async (e) => {
    if (e.key !== "Enter") return;

    const value = searchText.trim();
    if (!value) return;

    try {
      const res = await customFetch.get(`/products/search?q=${value}`);
      if (res.data?.length) {
        addProductToItems(res.data[0]);
      } else {
        alert("Product not found");
      }
    } catch {
      alert("Search error");
    }

    setSearchText("");
    setOptions([]);
  };

  /* ---------------- UPDATE ITEM ---------------- */
  const updateItem = (i, field, value) => {
    const updated = [...items];
    updated[i][field] = Number(value);
    setItems(updated);
    setActiveRow(i);
  };

  /* ---------------- REMOVE ITEM ---------------- */
  const removeItem = (i) => {
    setItems(items.filter((_, idx) => idx !== i));
  };

  /* ---------------- TOTALS ---------------- */
  const rowAmount = (i) => {
    const base = i.price * i.quantity;
    const gstAmt = (base * i.gst) / 100;
    const discAmt = (base * i.discount) / 100;
    return base + gstAmt - discAmt;
  };

  const subTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const gstTotal = items.reduce(
    (sum, i) => sum + (i.price * i.quantity * i.gst) / 100,
    0
  );
  const discountTotal = items.reduce(
    (sum, i) => sum + (i.price * i.quantity * i.discount) / 100,
    0
  );
  const netTotal = subTotal + gstTotal - discountTotal;

  /* ---------------- SAVE SALE ---------------- */
  const handleSave = async () => {
    if (!customerId) {
      alert("Please select customer");
      return;
    }

    if (!items.length) {
      alert("Add at least one product");
      return;
    }

    await customFetch.post("/sales", {
      customer_id: customerId,
      bill_no: billNo,
      items: items.map((i) => ({
        product_id: i.product_id,
        selling_price: i.price,
        quantity: i.quantity,
        gst: i.gst,
      })),
    });

    setCustomerId(null);
    setBillNo("");
    setItems([]);
    setSearchText("");
    onSuccess();
  };

  /* ---------------- CTRL + S ---------------- */
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [items, customerId]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle sx={{ fontWeight: 600 }}>🧾 New Sale</DialogTitle>

      <DialogContent>
        {/* CUSTOMER & BILL */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <Box display="flex" gap={2}>
            <Autocomplete
              fullWidth
              options={customers}
              getOptionLabel={(c) => `${c.name} (${c.phone})`}
              onChange={(e, val) => setCustomerId(val?.id || null)}
              renderInput={(params) => (
                <TextField {...params} label="Select Customer" />
              )}
            />

            <TextField
              label="Bill No"
              fullWidth
              value={billNo}
              onChange={(e) => setBillNo(e.target.value)}
            />
          </Box>
        </Paper>

        {/* PRODUCT SEARCH */}
        <Paper
          sx={{
            p: 2,
            mb: 2,
            background: "#f3faff",
            border: "1px dashed #1976d2",
          }}
        >
          <Autocomplete
            freeSolo
            options={options}
            filterOptions={(x) => x}
            getOptionLabel={(o) =>
              typeof o === "string" ? o : `${o.name} (${o.brand || "-"})`
            }
            inputValue={searchText}
            onInputChange={(e, v) => setSearchText(v)}
            onChange={(e, v) => {
              if (v && typeof v !== "string") {
                addProductToItems(v);
                setSearchText("");
                setOptions([]);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Scan / Search Product"
                autoFocus
                onKeyDown={handleBarcodeEnter}
              />
            )}
          />
        </Paper>

        {/* ITEMS TABLE */}
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>GST %</TableCell>
              <TableCell>Disc %</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell align="center">Remove</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {items.map((row, i) => (
              <TableRow
                key={i}
                sx={{
                  background: activeRow === i ? "#e3f2fd" : "transparent",
                }}
              >
                <TableCell>{row.name}</TableCell>

                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    inputRef={(el) => (priceRefs.current[i] = el)}
                    value={row.price}
                    onChange={(e) => updateItem(i, "price", e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && qtyRefs.current[i]?.focus()
                    }
                  />
                </TableCell>

                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    inputRef={(el) => (qtyRefs.current[i] = el)}
                    value={row.quantity}
                    onChange={(e) => updateItem(i, "quantity", e.target.value)}
                  />
                </TableCell>

                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={row.gst}
                    onChange={(e) => updateItem(i, "gst", e.target.value)}
                  />
                </TableCell>

                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={row.discount}
                    onChange={(e) => updateItem(i, "discount", e.target.value)}
                  />
                </TableCell>

                <TableCell>₹ {rowAmount(row).toFixed(2)}</TableCell>

                <TableCell align="center">
                  <IconButton color="error" onClick={() => removeItem(i)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            {!items.length && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Scan or search products to add items
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Divider sx={{ my: 2 }} />

        {/* TOTALS */}
        <Box textAlign="right">
          <div>Subtotal: ₹ {subTotal.toFixed(2)}</div>
          <div>GST: ₹ {gstTotal.toFixed(2)}</div>
          <div>Discount: ₹ {discountTotal.toFixed(2)}</div>
          <strong style={{ fontSize: 18 }}>
            Net Total: ₹ {netTotal.toFixed(2)}
          </strong>
        </Box>

        <Box textAlign="right" mt={2}>
          <Button variant="contained" size="large" onClick={handleSave}>
            SAVE SALE
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
