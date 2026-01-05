import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  Button,
  Chip,
  Grid,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import customFetch from "../../utils/customFetch";
import { generateInvoice } from "../../utils/invoiceGenerator"; // reuse printer
import { generateServiceInvoiceA4 } from "../../utils/serviceInvoiceA4";

export default function ServiceDetailsPage() {
  const { id } = useParams(); // service_id
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH SERVICE ---------------- */
  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await customFetch.get(`/services/${id}`);
        setService(res.data);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  if (loading) {
    return <Typography p={2}>Loading...</Typography>;
  }

  if (!service) {
    return (
      <Box p={2}>
        <Button onClick={() => navigate(-1)}>← Back</Button>
        <Typography>No service job found</Typography>
      </Box>
    );
  }

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
            label={service.status}
            color={
              service.status === "DELIVERED"
                ? "success"
                : service.status === "READY"
                ? "warning"
                : "default"
            }
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* CUSTOMER & DEVICE INFO */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography>
              <strong>Customer:</strong> {service.customer_name}
            </Typography>
            <Typography>
              <strong>Phone:</strong> {service.phone || "-"}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>
              <strong>Device Model:</strong> {service.device_model}
            </Typography>
            <Typography>
              <strong>IMEI:</strong> {service.imei || "-"}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* PROBLEM DETAILS */}
        <Typography>
          <strong>Problem Description</strong>
        </Typography>
        <Typography sx={{ mt: 1 }}>{service.problem}</Typography>

        <Divider sx={{ my: 2 }} />

        {/* COST DETAILS */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography>
              <strong>Estimated Cost:</strong> ₹ {service.estimated_cost || 0}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography>
              <strong>Advance Paid:</strong> ₹ {service.advance_amount || 0}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* TECHNICIAN */}
        <Typography>
          <strong>Technician:</strong> {service.technician || "-"}
        </Typography>

        <Typography sx={{ mt: 1 }}>
          <strong>Created At:</strong>{" "}
          {new Date(service.created_at).toLocaleString()}
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
                service,
                action: "print",
              })
            }
          >
            Print Service Sheet (A4)
          </Button>

          {/* NEXT PHASE */}
          <Button variant="contained" disabled={service.status !== "READY"}>
            Create Final Invoice
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
