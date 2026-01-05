import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import ProductList from "../../components/products/ProductList";
import ProductForm from "../../components/products/ProductForm";

export default function ProductPage() {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const handleAdd = () => {
    setEditData(null);
    setOpen(true);
  };

  const handleEdit = (row) => {
    setEditData(row);
    setOpen(true);
  };

  const handleSaved = () => {
    setOpen(false);
    setEditData(null);
    setRefresh((prev) => !prev); // 🔥 refresh list
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Products</Typography>

        <Button variant="contained" onClick={handleAdd}>
          Add Product
        </Button>
      </Box>

      {/* PRODUCT LIST */}
      <ProductList onEdit={handleEdit} refresh={refresh} />

      {/* PRODUCT FORM */}
      <ProductForm
        open={open}
        onClose={() => setOpen(false)}
        editData={editData}
        onSaved={handleSaved}
      />
    </Box>
  );
}
