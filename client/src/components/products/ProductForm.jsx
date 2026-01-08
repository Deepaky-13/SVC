import { useEffect, useState } from "react";
import customFetch from "../../utils/customFetch";

export default function ProductForm({ open, onClose, editData, onSaved }) {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    brand: "",
    category_id: "",
    active: 1,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await customFetch.get("/categories");
      setCategories(res.data || []);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (editData) {
      setForm({
        id: editData.id,
        name: editData.name || "",
        brand: editData.brand || "",
        category_id: editData.category_id || "",
        active: editData.active ?? 1,
      });
    } else {
      setForm({ name: "", brand: "", category_id: "", active: 1 });
    }
  }, [editData]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.name || !form.category_id) {
      alert("Model & Category are required");
      return;
    }

    editData
      ? await customFetch.put(`/products/${form.id}`, form)
      : await customFetch.post("/products", form);

    onSaved();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-3">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl">
        <div className="flex justify-between items-center px-5 py-4 border-b">
          <h2 className="text-lg font-semibold">
            {editData ? "Edit Product" : "Add Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-xl text-gray-400 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-4">
          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Model"
            className="w-full border rounded-lg px-4 py-2"
          />

          <input
            name="brand"
            value={form.brand}
            onChange={handleChange}
            placeholder="Brand"
            className="w-full border rounded-lg px-4 py-2"
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.active === 1}
              onChange={(e) =>
                setForm({ ...form, active: e.target.checked ? 1 : 0 })
              }
            />
            Active
          </label>
        </div>

        <div className="flex justify-end gap-3 px-5 py-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   TextField,
//   Button,
//   Box,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   IconButton,
//   Paper,
// } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { useRef, useState } from "react";
// import customFetch from "../../utils/customFetch";

// export default function PurchaseForm({ open, onClose, onSaved }) {
//   const [supplier, setSupplier] = useState("");
//   const [invoiceNo, setInvoiceNo] = useState("");
//   const [items, setItems] = useState([]);

//   // 🔍 search
//   const [search, setSearch] = useState("");
//   const [suggestions, setSuggestions] = useState([]);

//   const priceRefs = useRef([]);
//   const qtyRefs = useRef([]);
//   const gstRefs = useRef([]);
//   const mrpRefs = useRef([]);

//   /* ---------------- SEARCH PRODUCT (NAME / BARCODE) ---------------- */
//   const handleSearchChange = async (e) => {
//     const value = e.target.value;
//     setSearch(value);

//     if (value.length < 2) {
//       setSuggestions([]);
//       return;
//     }

//     const res = await customFetch.get(`/products/search?q=${value}`);
//     setSuggestions(res.data || []);
//   };

//   /* ---------------- ADD PRODUCT ---------------- */
//   const addProduct = (product) => {
//     setItems((prev) => {
//       const index = prev.findIndex((i) => i.product_id === product.id);

//       if (index !== -1) {
//         const updated = [...prev];
//         updated[index].quantity += 1;
//         return updated;
//       }

//       return [
//         ...prev,
//         {
//           product_id: product.id,
//           name: product.name,
//           purchase_price: 0,
//           quantity: 1,
//           gst: 0,
//           mrp: 0,
//         },
//       ];
//     });

//     setSearch("");
//     setSuggestions([]);
//   };

//   /* ---------------- ENTER KEY (SCANNER SUPPORT) ---------------- */
//   const handleSearchKey = async (e) => {
//     if (e.key !== "Enter") return;

//     try {
//       const res = await customFetch.get(`/products/barcode/${search}`);
//       addProduct(res.data);
//     } catch {
//       // ignore if not barcode
//     }
//   };

//   /* ---------------- UPDATE ITEM ---------------- */
//   const updateItem = (index, field, value) => {
//     const updated = [...items];
//     updated[index][field] = Number(value);
//     setItems(updated);
//   };

//   /* ---------------- REMOVE ITEM ---------------- */
//   const removeItem = (index) => {
//     setItems(items.filter((_, i) => i !== index));
//   };

//   /* ---------------- TOTAL WITH GST ---------------- */
//   const totalAmount = items.reduce((sum, i) => {
//     const base = i.purchase_price * i.quantity;
//     const gstAmt = (base * i.gst) / 100;
//     return sum + base + gstAmt;
//   }, 0);

//   /* ---------------- SAVE ---------------- */
//   const handleSave = async () => {
//     if (!supplier || items.length === 0) {
//       alert("Supplier & items required");
//       return;
//     }

//     await customFetch.post("/purchases", {
//       purchase: {
//         supplier_name: supplier,
//         total_amount: totalAmount,
//       },
//       items,
//     });

//     setSupplier("");
//     setInvoiceNo("");
//     setItems([]);
//     onSaved();
//   };

//   return (
//     <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
//       <DialogTitle>New Purchase</DialogTitle>

//       <DialogContent>
//         {/* Supplier */}
//         <Box display="flex" gap={2} mb={2}>
//           <TextField
//             label="Supplier Name"
//             fullWidth
//             value={supplier}
//             onChange={(e) => setSupplier(e.target.value)}
//           />
//           <TextField
//             label="Invoice No (Auto)"
//             fullWidth
//             value={invoiceNo}
//             disabled
//           />
//         </Box>

//         {/* Search */}
//         <TextField
//           fullWidth
//           label="Search Product / Scan Barcode"
//           value={search}
//           onChange={handleSearchChange}
//           onKeyDown={handleSearchKey}
//         />

//         {/* Suggestions */}
//         {suggestions.length > 0 && (
//           <Paper sx={{ maxHeight: 200, overflow: "auto" }}>
//             {suggestions.map((p) => (
//               <Box
//                 key={p.id}
//                 sx={{ p: 1, cursor: "pointer" }}
//                 onClick={() => addProduct(p)}
//               >
//                 {p.name}
//               </Box>
//             ))}
//           </Paper>
//         )}

//         {/* Items Table */}
//         <Table size="small" sx={{ mt: 2 }}>
//           <TableHead>
//             <TableRow>
//               <TableCell>Product</TableCell>
//               <TableCell>Price</TableCell>
//               <TableCell>Qty</TableCell>
//               <TableCell>GST %</TableCell>
//               <TableCell>GST Amt</TableCell>
//               <TableCell>MRP</TableCell>
//               <TableCell />
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {items.map((row, i) => {
//               const base = row.purchase_price * row.quantity;
//               const gstAmt = (base * row.gst) / 100;

//               return (
//                 <TableRow key={i}>
//                   <TableCell>{row.name}</TableCell>

//                   <TableCell>
//                     <TextField
//                       size="small"
//                       type="number"
//                       value={row.purchase_price}
//                       onChange={(e) =>
//                         updateItem(i, "purchase_price", e.target.value)
//                       }
//                     />
//                   </TableCell>

//                   <TableCell>
//                     <TextField
//                       size="small"
//                       type="number"
//                       value={row.quantity}
//                       onChange={(e) =>
//                         updateItem(i, "quantity", e.target.value)
//                       }
//                     />
//                   </TableCell>

//                   <TableCell>
//                     <TextField
//                       size="small"
//                       type="number"
//                       value={row.gst}
//                       onChange={(e) => updateItem(i, "gst", e.target.value)}
//                     />
//                   </TableCell>

//                   <TableCell>{gstAmt.toFixed(2)}</TableCell>

//                   <TableCell>
//                     <TextField
//                       size="small"
//                       type="number"
//                       value={row.mrp}
//                       onChange={(e) => updateItem(i, "mrp", e.target.value)}
//                     />
//                   </TableCell>

//                   <TableCell>
//                     <IconButton color="error" onClick={() => removeItem(i)}>
//                       <DeleteIcon />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               );
//             })}
//           </TableBody>
//         </Table>

//         {/* Total */}
//         <Box textAlign="right" mt={2} fontWeight="bold">
//           Total (Incl GST): ₹{totalAmount.toFixed(2)}
//         </Box>

//         <Box textAlign="right" mt={2}>
//           <Button variant="contained" onClick={handleSave}>
//             SAVE PURCHASE
//           </Button>
//         </Box>
//       </DialogContent>
//     </Dialog>
//   );
// }
