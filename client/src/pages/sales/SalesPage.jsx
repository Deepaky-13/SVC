import { useState } from "react";
import { Box, Button } from "@mui/material";
import SalesForm from "../../components/sales/SalesForm";
import SalesList from "../../components/sales/SalesList";

export default function SalesPage() {
  const [refresh, setRefresh] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  return (
    <Box p={2}>
      {/* ACTION BAR */}
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" onClick={() => setOpenForm(true)}>
          + New Sale
        </Button>
      </Box>

      {/* SALES LIST */}
      <SalesList refresh={refresh} />

      {/* SALES FORM DIALOG */}
      <SalesForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSuccess={() => {
          setOpenForm(false);
          setRefresh(!refresh);
        }}
      />
    </Box>
  );
}
