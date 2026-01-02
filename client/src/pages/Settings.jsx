import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  MenuItem,
  Typography,
  Paper,
} from "@mui/material";
import customFetch from "../utils/customFetch";

export default function Settings() {
  const [form, setForm] = useState({
    shop_name: "",
    address: "",
    phone: "",
    gstin: "",
    gst_enabled: 0,
    invoice_format: "THERMAL",
    sales_prefix: "SALE",
    service_prefix: "SRV",
  });

  const [loading, setLoading] = useState(false);

  // 🔹 Load settings on page load
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await customFetch.get("/settings");
        if (res.data) {
          setForm((prev) => ({ ...prev, ...res.data }));
        }
      } catch (err) {
        console.error("Failed to load settings", err);
      }
    };

    loadSettings();
  }, []);

  // 🔹 Handle text change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // 🔹 GST toggle
  const handleGSTToggle = (e) => {
    setForm({ ...form, gst_enabled: e.target.checked ? 1 : 0 });
  };

  // 🔹 Save settings
  const handleSave = async () => {
    try {
      setLoading(true);
      await customFetch.post("/settings", form);
      alert("Settings saved successfully");
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 4,
      }}
    >
      <Paper
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 800,
        }}
      >
        <Typography variant="h5" mb={3}>
          Shop Settings
        </Typography>

        <TextField
          fullWidth
          label="Shop Name"
          name="shop_name"
          value={form.shop_name}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Address"
          name="address"
          value={form.address}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          fullWidth
          label="GSTIN"
          name="gstin"
          value={form.gstin}
          onChange={handleChange}
          margin="normal"
          disabled={!form.gst_enabled}
        />

        <FormControlLabel
          sx={{ mt: 1 }}
          control={
            <Switch
              checked={form.gst_enabled === 1}
              onChange={handleGSTToggle}
            />
          }
          label="GST Enabled"
        />

        <TextField
          select
          fullWidth
          label="Invoice Format"
          name="invoice_format"
          value={form.invoice_format}
          onChange={handleChange}
          margin="normal"
        >
          <MenuItem value="THERMAL">Thermal</MenuItem>
          <MenuItem value="A4">A4</MenuItem>
          <MenuItem value="A5">A5</MenuItem>
        </TextField>

        <TextField
          fullWidth
          label="Sales Bill Prefix"
          name="sales_prefix"
          value={form.sales_prefix}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Service Prefix"
          name="service_prefix"
          value={form.service_prefix}
          onChange={handleChange}
          margin="normal"
        />

        <Box mt={4}>
          <Button
            variant="contained"
            size="large"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Settings"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
