import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import CustomerList from "../../components/customer/CustomerList";
import CustomerForm from "../../components/customer/CustomerForm";

export default function CustomerPage() {
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  return (
    <Box p={2}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Customers</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Add Customer
        </Button>
      </Box>

      <CustomerList refresh={refresh} />

      <CustomerForm
        open={open}
        onClose={() => setOpen(false)}
        onSaved={() => {
          setOpen(false);
          setRefresh(!refresh);
        }}
      />
    </Box>
  );
}
