import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  Chip,
  TextField,
  Stack,
  Button,
  Box,
} from "@mui/material";
import { useEffect, useMemo, useState, useRef } from "react";
import customFetch from "../../utils/customFetch";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export default function StockPage() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");

  // 🔒 Prevent duplicate low-stock toasts
  const alertedProducts = useRef(new Set());

  useEffect(() => {
    const fetchStock = async () => {
      const res = await customFetch.get("/stock");
      setRows(res.data || []);
    };
    fetchStock();
  }, []);

  /* ================= LOW STOCK TOAST ================= */
  useEffect(() => {
    rows.forEach((row) => {
      if (row.stock <= 3 && !alertedProducts.current.has(row.id)) {
        toast.warn(`⚠️ Low stock: ${row.name} (${row.stock})`);
        alertedProducts.current.add(row.id);
      }
    });
  }, [rows]);

  /* ================= SEARCH FILTER ================= */
  const filteredRows = useMemo(() => {
    if (!search) return rows;

    const q = search.toLowerCase();
    return rows.filter((row) =>
      [row.category, row.name, row.brand, String(row.stock)].some((field) =>
        field?.toLowerCase().includes(q)
      )
    );
  }, [rows, search]);

  /* ================= PDF EXPORT ================= */
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Stock Report", 14, 10);

    autoTable(doc, {
      startY: 20,
      head: [["Category", "Product", "Brand", "Stock"]],
      body: filteredRows.map((r) => [r.category, r.name, r.brand, r.stock]),
    });

    doc.save("stock-report.pdf");
  };

  /* ================= EXCEL EXPORT ================= */
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredRows.map((r) => ({
        Category: r.category,
        Product: r.name,
        Brand: r.brand,
        Stock: r.stock,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Stock");

    XLSX.writeFile(workbook, "stock-report.xlsx");
  };

  return (
    <Paper sx={{ p: 2 }}>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* HEADER */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        mb={2}
      >
        <Typography variant="h6">Stock Report</Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Button variant="outlined" onClick={downloadPDF}>
            Download PDF
          </Button>
          <Button variant="outlined" onClick={downloadExcel}>
            Download Excel
          </Button>
        </Stack>
      </Stack>

      {/* SEARCH */}
      <TextField
        size="small"
        placeholder="Search category / product / brand / stock"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
      />

      {/* TABLE */}
      <Box sx={{ overflowX: "auto" }}>
        <Table size="small" sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Stock</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No records found
                </TableCell>
              </TableRow>
            )}

            {filteredRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.category}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.brand}</TableCell>
                <TableCell>
                  <Chip
                    label={row.stock}
                    size="small"
                    color={
                      row.stock <= 0
                        ? "error"
                        : row.stock <= 3
                        ? "warning"
                        : "success"
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Paper>
  );
}
