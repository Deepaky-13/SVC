import { useEffect, useState } from "react";
import { Box, Typography, Paper, Divider } from "@mui/material";
import { useParams } from "react-router-dom";
import customFetch from "../../utils/customFetch";

export default function CustomerDetailsPage() {
  const { id } = useParams();
  const [data, setData] = useState({ sales: [], services: [] });

  useEffect(() => {
    const fetch = async () => {
      const res = await customFetch.get(`/customers/${id}/history`);
      setData(res.data);
    };
    fetch();
  }, [id]);

  return (
    <Box p={2}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Purchase History</Typography>
        {data.sales.map((s) => (
          <div key={s.id}>
            Bill: {s.bill_no} – ₹{s.total_amount}
          </div>
        ))}

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6">Service History</Typography>
        {data.services.map((s) => (
          <div key={s.id}>
            {s.device_model} – {s.status}
          </div>
        ))}
      </Paper>
    </Box>
  );
}
