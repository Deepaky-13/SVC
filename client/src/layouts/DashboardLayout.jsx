import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout() {
  const SIDEBAR_WIDTH = 256; // same as lg:ml-64

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          bgcolor: "#f5f6fa",
          p: 3,
          ml: { lg: `${SIDEBAR_WIDTH}px` }, // lg:ml-64
          transition: "margin 0.3s ease",
          overflowY: "auto",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
