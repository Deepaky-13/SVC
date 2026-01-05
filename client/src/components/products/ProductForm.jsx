import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  MenuItem,
  Grid,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useEffect, useState } from "react";
import customFetch from "../../utils/customFetch";

export default function ProductForm({ open, onClose, editData, onSaved }) {
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    brand: "",
    category_id: "",
    barcode: "",
    active: 1,
  });

  /* ---------------- LOAD CATEGORIES ---------------- */
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await customFetch.get("/categories");
      setCategories(res.data);
    };
    fetchCategories();
  }, []);

  /* ---------------- EDIT MODE ---------------- */
  useEffect(() => {
    if (editData) {
      setForm({
        id: editData.id,
        name: editData.name || "",
        brand: editData.brand || "",
        category_id: editData.category_id || "",
        barcode: editData.barcode || "",
        active: editData.active ?? 1,
      });
    } else {
      setForm({
        name: "",
        brand: "",
        category_id: "",
        barcode: "",
        active: 1,
      });
    }
  }, [editData]);

  /* ---------------- HANDLE CHANGE ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  /* ---------------- SAVE ---------------- */
  const handleSubmit = async () => {
    if (!form.name || !form.category_id) {
      alert("Product name & category are required");
      return;
    }

    if (editData) {
      await customFetch.put(`/products/${form.id}`, form);
    } else {
      await customFetch.post("/products", form);
    }

    onSaved();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{editData ? "Edit Product" : "Add Product"}</DialogTitle>

      <DialogContent>
        <Grid container spacing={2} mt={1}>
          {/* CATEGORY */}
          <Grid item xs={12}>
            <TextField
              select
              label="Category"
              name="category_id"
              fullWidth
              value={form.category_id}
              onChange={handleChange}
            >
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* PRODUCT NAME */}
          <Grid item xs={12}>
            <TextField
              label="Product Name"
              name="name"
              fullWidth
              value={form.name}
              onChange={handleChange}
            />
          </Grid>

          {/* BRAND */}
          <Grid item xs={12}>
            <TextField
              label="Brand"
              name="brand"
              fullWidth
              value={form.brand}
              onChange={handleChange}
            />
          </Grid>

          {/* BARCODE */}
          <Grid item xs={12}>
            <TextField
              label="Barcode"
              name="barcode"
              fullWidth
              value={form.barcode}
              onChange={handleChange}
              placeholder="Scan or enter barcode"
            />
          </Grid>

          {/* ACTIVE / INACTIVE */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={form.active === 1}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      active: e.target.checked ? 1 : 0,
                    })
                  }
                />
              }
              label="Active"
            />
          </Grid>

          {/* ACTION */}
          <Grid item xs={12} textAlign="right">
            <Button variant="contained" onClick={handleSubmit}>
              Save
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
