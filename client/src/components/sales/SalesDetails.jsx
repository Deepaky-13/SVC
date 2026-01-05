import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  Button,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import customFetch from "../../utils/customFetch";
import { generateInvoice } from "../../utils/invoiceGenerator";

export default function SalesDetailsPage() {
  const { id } = useParams(); // ← salesId
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaleDetails = async () => {
      try {
        const res = await customFetch.get(`/sales/${id}`);
        setRows(res.data);
      } finally {
        setLoading(false);
      }
    };
    fetchSaleDetails();
  }, [id]);

  if (loading) {
    return <Typography p={2}>Loading...</Typography>;
  }

  if (!rows.length) {
    return (
      <Box p={2}>
        <Button onClick={() => navigate(-1)}>← Back</Button>
        <Typography>No sale found</Typography>
      </Box>
    );
  }

  const header = rows[0];

  const totalAmount = rows.reduce(
    (sum, r) => sum + r.selling_price * r.quantity,
    0
  );

  return (
    <Box p={2}>
      {/* BACK */}
      <Button sx={{ mb: 2 }} onClick={() => navigate(-1)}>
        ← Back
      </Button>

      <Paper sx={{ p: 3 }}>
        {/* HEADER */}
        <Box mb={2}>
          <Typography variant="h6" fontWeight={600}>
            Sale Details
          </Typography>

          <Typography>Customer: {header.customer_name}</Typography>
          <Typography>Bill No: {header.bill_no}</Typography>
          <Typography>
            Date: {new Date(header.created_at).toLocaleString()}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* ITEMS TABLE */}
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Qty</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.product_name}</TableCell>
                <TableCell align="right">₹ {row.selling_price}</TableCell>
                <TableCell align="right">{row.quantity}</TableCell>
                <TableCell align="right">
                  ₹ {(row.selling_price * row.quantity).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Divider sx={{ my: 2 }} />

        {/* TOTAL */}
        <Box display="flex" justifyContent="flex-end">
          <Typography variant="h6" fontWeight={700}>
            Total: ₹ {totalAmount.toFixed(2)}
          </Typography>
        </Box>
        <Box display="flex" gap={2} justifyContent="flex-end" mt={2}>
          {/* THERMAL PRINT */}
          <Button
            variant="outlined"
            onClick={() =>
              generateInvoice({
                sale: header,
                items: rows,
                format: "THERMAL",
                action: "print",
              })
            }
          >
            Thermal Print
          </Button>

          {/* A5 PRINT */}
          <Button
            variant="outlined"
            onClick={() =>
              generateInvoice({
                sale: header,
                items: rows,
                format: "A5",
                action: "print",
              })
            }
          >
            A5 Print
          </Button>

          {/* A4 PRINT */}
          <Button
            variant="outlined"
            onClick={() =>
              generateInvoice({
                sale: header,
                items: rows,
                format: "A4",
                action: "print",
              })
            }
          >
            A4 Print
          </Button>

          {/* A4 PDF DOWNLOAD */}
          <Button
            variant="contained"
            onClick={() =>
              generateInvoice({
                sale: header,
                items: rows,
                format: "A4",
                action: "download",
              })
            }
          >
            Download A4 PDF
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
