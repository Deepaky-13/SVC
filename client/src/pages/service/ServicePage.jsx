import { useState } from "react";
import { Box, Button } from "@mui/material";
import ServiceList from "../../components/service/ServiceList";
import ServiceForm from "../../components/service/SeriviceForm";

export default function ServicePage() {
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  return (
    <Box p={2}>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          + New Service Job
        </Button>
      </Box>

      <ServiceList refresh={refresh} />

      <ServiceForm
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={() => {
          setOpen(false);
          setRefresh(!refresh);
        }}
      />
    </Box>
  );
}
