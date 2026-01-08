import { useState } from "react";
import ProductList from "../../components/products/ProductList";
import ProductForm from "../../components/products/ProductForm";

export default function ProductPage() {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="space-y-4 p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-semibold">Products</h1>
        <button
          onClick={() => {
            setEditData(null);
            setOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer"
        >
          + Add Product
        </button>
      </div>

      <ProductList
        onEdit={(row) => {
          setEditData(row);
          setOpen(true);
        }}
        refresh={refresh}
      />

      <ProductForm
        open={open}
        onClose={() => setOpen(false)}
        editData={editData}
        onSaved={() => setRefresh((p) => !p)}
      />
    </div>
  );
}
