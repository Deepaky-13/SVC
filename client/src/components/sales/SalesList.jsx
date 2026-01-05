import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  TableContainer,
  Chip,
  Typography,
} from "@mui/material";
import { Visibility, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import customFetch from "../../utils/customFetch";

export default function SalesList({ refresh }) {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  const fetchSales = async () => {
    const res = await customFetch.get("/sales");
    setRows(res.data);
  };

  const handleCancel = async (row) => {
    if (!window.confirm("Cancel this sale?")) return;
    await customFetch.patch(`/sales/${row.id}/cancel`);
    fetchSales();
  };

  useEffect(() => {
    fetchSales();
  }, [refresh]);

  return (
    <TableContainer component={Paper}>
      <Typography sx={{ p: 2 }} variant="h6">
        Sales List
      </Typography>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Customer</TableCell>
            <TableCell>Bill No</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Total</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} hover>
              <TableCell>{row.customer_name}</TableCell>
              <TableCell>{row.bill_no}</TableCell>
              <TableCell>{new Date(row.created_at).toLocaleString()}</TableCell>

              <TableCell>
                <Chip
                  label={row.cancelled ? "Cancelled" : "Completed"}
                  color={row.cancelled ? "default" : "success"}
                  size="small"
                />
              </TableCell>

              <TableCell align="right">
                ₹ {Number(row.total_amount).toFixed(2)}
              </TableCell>

              <TableCell align="right">
                <IconButton onClick={() => navigate(`/sales/${row.id}`)}>
                  <Visibility />
                </IconButton>

                {!row.cancelled && (
                  <IconButton color="error" onClick={() => handleCancel(row)}>
                    <Delete />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}

          {!rows.length && (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No sales found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
