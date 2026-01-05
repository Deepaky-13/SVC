import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  Grid,
  Paper,
} from "@mui/material";
import { useState } from "react";
import customFetch from "../../utils/customFetch";

export default function ServiceForm({ open, onClose, onSuccess }) {
  const [form, setForm] = useState({
    customer_name: "",
    phone: "",
    device_model: "",
    imei: "",
    problem: "",
    estimated_cost: "",
    advance_amount: "",
    technician: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!form.customer_name || !form.device_model || !form.problem) {
      alert("Required fields missing");
      return;
    }

    await customFetch.post("/services", form);
    setForm({
      customer_name: "",
      phone: "",
      device_model: "",
      imei: "",
      problem: "",
      estimated_cost: "",
      advance_amount: "",
      technician: "",
    });
    onSuccess();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>🛠️ New Service Job</DialogTitle>

      <DialogContent>
        <Paper sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Customer Name"
                name="customer_name"
                fullWidth
                value={form.customer_name}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Phone"
                name="phone"
                fullWidth
                value={form.phone}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Device Model"
                name="device_model"
                fullWidth
                value={form.device_model}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="IMEI (Optional)"
                name="imei"
                fullWidth
                value={form.imei}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Problem Description"
                name="problem"
                fullWidth
                multiline
                rows={3}
                value={form.problem}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Estimated Cost"
                name="estimated_cost"
                type="number"
                fullWidth
                value={form.estimated_cost}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Advance Amount"
                name="advance_amount"
                type="number"
                fullWidth
                value={form.advance_amount}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Technician"
                name="technician"
                fullWidth
                value={form.technician}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Box textAlign="right" mt={2}>
            <Button variant="contained" onClick={handleSave}>
              SAVE SERVICE JOB
            </Button>
          </Box>
        </Paper>
      </DialogContent>
    </Dialog>
  );
}
