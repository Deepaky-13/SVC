import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  Paper,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Autocomplete,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import customFetch from "../../utils/customFetch";

const STATUS = ["RECEIVED", "IN_PROGRESS", "READY", "DELIVERED"];

export default function ServiceForm({ open, onClose, onSaved }) {
  /* ---------------- MASTER DATA ---------------- */
  const [customers, setCustomers] = useState([]);
  const [productOptions, setProductOptions] = useState([]);

  /* ---------------- SERVICE FIELDS ---------------- */
  const [customerId, setCustomerId] = useState(null);
  const [deviceModel, setDeviceModel] = useState("");
  const [imei, setImei] = useState("");
  const [problem, setProblem] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [advance, setAdvance] = useState("");
  const [technician, setTechnician] = useState("");

  // 🔒 ALWAYS RECEIVED ON CREATE
  const status = "RECEIVED";

  /* ---------------- SPARE PARTS ---------------- */
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");

  /* ---------------- LOAD CUSTOMERS ---------------- */
  useEffect(() => {
    customFetch.get("/customers").then((res) => {
      setCustomers(res.data || []);
    });
  }, []);

  /* ---------------- SEARCH PRODUCTS ---------------- */
  useEffect(() => {
    if (search.length < 2) return;

    const timer = setTimeout(() => {
      customFetch
        .get(`/products/search?q=${search}`)
        .then((res) => setProductOptions(res.data || []));
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  /* ---------------- ADD PART (NO DUPLICATES) ---------------- */
  const addItem = (product) => {
    setItems((prev) => {
      if (prev.find((p) => p.product_id === product.id)) return prev;

      return [
        ...prev,
        {
          product_id: product.id,
          name: product.name,
          price: 0,
          quantity: 1,
        },
      ];
    });
  };

  /* ---------------- UPDATE PART ---------------- */
  const updateItem = (i, field, val) => {
    const updated = [...items];
    updated[i][field] = Number(val);
    setItems(updated);
  };

  /* ---------------- REMOVE PART ---------------- */
  const removeItem = (i) => {
    setItems(items.filter((_, idx) => idx !== i));
  };

  /* ---------------- SAVE SERVICE ---------------- */
  const handleSave = async () => {
    if (!customerId) {
      alert("Please select a customer");
      return;
    }

    if (!deviceModel.trim()) {
      alert("Device model is required");
      return;
    }

    await customFetch.post("/services", {
      customer_id: customerId,
      device_model: deviceModel,
      imei,
      problem,
      estimated_cost: Number(estimatedCost) || 0,
      advance_amount: Number(advance) || 0,
      technician,
      status,
      items,
    });

    // RESET FORM
    setCustomerId(null);
    setDeviceModel("");
    setImei("");
    setProblem("");
    setEstimatedCost("");
    setAdvance("");
    setTechnician("");
    setItems([]);
    setSearch("");

    onSaved?.();
    onClose?.();
  };

  /* ---------------- UI ---------------- */
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>New Service Job</DialogTitle>

      <DialogContent>
        {/* CUSTOMER */}
        <Autocomplete
          options={customers}
          getOptionLabel={(c) => `${c.name} (${c.phone})`}
          onChange={(e, v) => setCustomerId(v?.id || null)}
          renderInput={(p) => <TextField {...p} label="Customer" />}
        />

        <Box display="grid" gridTemplateColumns="repeat(2,1fr)" gap={2} mt={2}>
          <TextField
            label="Device Model"
            value={deviceModel}
            onChange={(e) => setDeviceModel(e.target.value)}
          />
          <TextField
            label="IMEI"
            value={imei}
            onChange={(e) => setImei(e.target.value)}
          />
          <TextField
            label="Estimated Cost"
            type="number"
            value={estimatedCost}
            onChange={(e) => setEstimatedCost(e.target.value)}
          />
          <TextField
            label="Advance"
            type="number"
            value={advance}
            onChange={(e) => setAdvance(e.target.value)}
          />
          <TextField
            label="Technician"
            value={technician}
            onChange={(e) => setTechnician(e.target.value)}
          />
          <TextField label="Status" value={status} disabled />
        </Box>

        <TextField
          fullWidth
          multiline
          rows={2}
          label="Problem Description"
          sx={{ mt: 2 }}
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
        />

        {/* SPARE PARTS */}
        <Paper sx={{ p: 2, mt: 3 }}>
          <Autocomplete
            freeSolo
            options={productOptions}
            getOptionLabel={(o) => `${o.name} (${o.brand || "-"})`}
            inputValue={search}
            onInputChange={(e, v) => setSearch(v)}
            onChange={(e, v) => {
              if (v) {
                addItem(v);
                setSearch("");
              }
            }}
            renderInput={(p) => <TextField {...p} label="Add Spare Parts" />}
          />

          <Table size="small" sx={{ mt: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>Part</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Qty</TableCell>
                <TableCell>Remove</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((row, i) => (
                <TableRow key={i}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={row.price}
                      onChange={(e) => updateItem(i, "price", e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={row.quantity}
                      onChange={(e) =>
                        updateItem(i, "quantity", e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => removeItem(i)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

              {!items.length && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No spare parts added
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>

        <Box textAlign="right" mt={2}>
          <Button variant="contained" onClick={handleSave}>
            Save Service Job
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
  