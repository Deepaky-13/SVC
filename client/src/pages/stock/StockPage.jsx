import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  Chip,
} from "@mui/material";
import { useEffect, useState } from "react";
import customFetch from "../../utils/customFetch";

export default function StockPage() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchStock = async () => {
      const res = await customFetch.get("/stock");
      setRows(res.data);
    };
    fetchStock();
  }, []);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" mb={2}>
        Stock Report
      </Typography>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Category</TableCell>
            <TableCell>Product</TableCell>
            <TableCell>Brand</TableCell>
            <TableCell>Stock</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.category}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.brand}</TableCell>
              <TableCell>
                <Chip
                  label={row.stock}
                  color={row.stock <= 0 ? "error" : "success"}
                  size="small"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
