import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import PurchaseForm from "../../components/purchase/PurchaseForm";
import PurchaseList from "../../components/purchase/PurchaseList";

export default function PurchasePage() {
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">Purchases</Typography>

        <Button variant="contained" onClick={() => setOpen(true)}>
          ADD PURCHASE
        </Button>
      </Box>

      {/* ✅ LIST */}
      <PurchaseList refresh={refresh} />

      {/* ✅ FORM */}
      <PurchaseForm
        open={open}
        onClose={() => setOpen(false)}
        onSaved={() => {
          setOpen(false);
          setRefresh((prev) => !prev); // 🔥 REFRESH LIST
        }}
      />
    </Box>
  );
}
