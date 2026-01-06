import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  Button,
  Chip,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import customFetch from "../../utils/customFetch";
import { generateServiceInvoiceA4 } from "../../utils/serviceInvoiceA4";

export default function ServiceDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH SERVICE ---------------- */
  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await customFetch.get(`/services/${id}`);
        setRows(res.data || []);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  if (loading) {
    return <Typography p={2}>Loading...</Typography>;
  }

  if (!rows.length) {
    return (
      <Box p={2}>
        <Button onClick={() => navigate(-1)}>← Back</Button>
        <Typography>No service job found</Typography>
      </Box>
    );
  }

  /* HEADER INFO */
  const header = rows[0];

  /* PARTS TOTAL */
  const partsTotal = rows.reduce(
    (sum, r) => sum + (r.price || 0) * (r.quantity || 0),
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
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h6" fontWeight={600}>
            🛠️ Service Job Details
          </Typography>

          <Chip
            label={header.status}
            color={
              header.status === "DELIVERED"
                ? "success"
                : header.status === "READY"
                ? "warning"
                : "default"
            }
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* CUSTOMER & DEVICE */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography>
              <strong>Customer:</strong> {header.customer_name}
            </Typography>
            <Typography>
              <strong>Phone:</strong> {header.customer_phone}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>
              <strong>Device Model:</strong> {header.device_model}
            </Typography>
            <Typography>
              <strong>IMEI:</strong> {header.imei || "-"}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* PROBLEM */}
        <Typography fontWeight={600}>Problem Description</Typography>
        <Typography sx={{ mt: 1 }}>{header.problem}</Typography>

        <Divider sx={{ my: 2 }} />

        {/* COST */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography>
              <strong>Estimated Cost:</strong> ₹ {header.estimated_cost || 0}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography>
              <strong>Advance Paid:</strong> ₹ {header.advance_amount || 0}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* TECHNICIAN */}
        <Typography>
          <strong>Technician:</strong> {header.technician || "-"}
        </Typography>

        <Typography sx={{ mt: 1 }}>
          <strong>Created At:</strong>{" "}
          {new Date(header.created_at).toLocaleString()}
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* SPARE PARTS */}
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Spare Parts Used
        </Typography>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Part</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Qty</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map(
              (r, i) =>
                r.product_name && (
                  <TableRow key={i}>
                    <TableCell>{r.product_name}</TableCell>
                    <TableCell align="right">₹ {r.price}</TableCell>
                    <TableCell align="right">{r.quantity}</TableCell>
                    <TableCell align="right">
                      ₹ {(r.price * r.quantity).toFixed(2)}
                    </TableCell>
                  </TableRow>
                )
            )}
          </TableBody>
        </Table>

        <Divider sx={{ my: 2 }} />

        <Typography align="right" fontWeight={600}>
          Parts Total: ₹ {partsTotal.toFixed(2)}
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* ACTIONS */}
        <Box display="flex" gap={2} justifyContent="flex-end">
          <Button
            variant="outlined"
            onClick={() =>
              generateServiceInvoiceA4({
                shop: {
                  name: "Sri Vinayaga Communication",
                  subtitle: "All Mobiles & Accessories",
                  address:
                    "9/81, Opp. RPS Hospital, Seelanaickenpatty, SALEM - 636201",
                  gstin: "33CDXPN6582Q1ZA",
                  phone: "9790000771",
                },
                service: header,
                items: rows.filter((r) => r.product_name),
                action: "print",
              })
            }
          >
            Print Service Sheet (A4)
          </Button>

          <Button variant="contained" disabled={header.status !== "READY"}>
            Create Final Invoice
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
