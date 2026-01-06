import { useState } from "react";
import { Box, Button } from "@mui/material";
import ServiceForm from "../../components/service/SeriviceForm";
import ServiceList from "../../components/service/ServiceList";

export default function ServicePage() {
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  return (
    <Box p={2}>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          + New Service
        </Button>
      </Box>

      <ServiceForm
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={() => {
          setOpen(false);
          setRefresh(!refresh);
        }}
      />

      <ServiceList refresh={refresh} />
    </Box>
  );
}
