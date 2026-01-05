// import { Outlet } from "react-router-dom";
// import Sidebar from "../components/Sidebar";
// import { useAuth } from "../context/AuthContext";

// const DashboardLayout = () => {
//   const { user, loading } = useAuth();

//   if (loading) return null;
//   console.log(user);

//   // * Not logged in → don't show layout
//   // if (!user) return <Outlet />;

//   return (
//     <div style={{ display: "flex", minHeight: "100vh" }}>
//       <Sidebar />
//       <div style={{ flex: 1, padding: 16 }}>
//         <Outlet />
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;

import { Box, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const [mobileOpen, setMobileOpen] = useState(false);

  if (isLoginPage) {
    return <Outlet />;
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* MAIN CONTENT */}
      <Box
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          bgcolor: "#f5f6fa",
          p: { xs: 2, sm: 3 },
          ml: { md: "260px" },
        }}
      >
        {/* MOBILE TOP BAR */}
        <Box sx={{ display: { xs: "flex", md: "none" }, mb: 2 }}>
          <IconButton onClick={() => setMobileOpen(true)}>
            <MenuIcon />
          </IconButton>
        </Box>

        <Outlet />
      </Box>
    </Box>
  );
}
