import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { useState } from "react";
import customFetch from "../../utils/customFetch";

export default function CustomerForm({ open, onClose, onSaved }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSave = async () => {
    if (!name || !phone) return alert("Required");

    await customFetch.post("/customers", { name, phone });
    setName("");
    setPhone("");
    onSaved();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Customer</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Customer Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
