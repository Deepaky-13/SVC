import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Divider,
  Drawer,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import customFetch from "../utils/customFetch";

/* ================= MENU CONFIG ================= */
const menu = [
  { label: "Dashboard", path: "/dashboard", permission: "dashboard_view" },
  { label: "Settings", path: "/settings", permission: "settings_view" },
  {
    label: "Roles & Permissions",
    path: "/access-control",
    permission: "access_manage",
  },
  { label: "User Management", path: "/users", permission: "users_manage" },

  { label: "Categories", path: "/categories", permission: "categories_view" },
  { label: "Products", path: "/products", permission: "products_view" },
  { label: "Purchases", path: "/purchases", permission: "purchases_view" },
  { label: "Stocks", path: "/stocks", permission: "stocks_view" },

  { label: "Sales", path: "/sales", permission: "sales_view" },
  { label: "Services", path: "/services", permission: "services_view" },
];

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const navigate = useNavigate();
  const { permissions } = useAuth();

  /* ================= PERMISSION CHECK ================= */
  const hasPermission = (key) =>
    permissions?.includes("*") || permissions?.includes(key);

  /* ================= LOGOUT ================= */
  const logout = async () => {
    try {
      await customFetch.post("/auth/logout");
    } finally {
      navigate("/login", { replace: true });
    }
  };

  /* ================= SIDEBAR CONTENT ================= */
  const content = (
    <Box
      sx={{
        width: { xs: 240, md: 260 },
        height: "100vh",
        bgcolor: "#1e1e2f",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ---------- HEADER ---------- */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #2f2f45",
        }}
      >
        <Typography fontWeight={600}>SVC Billing</Typography>

        {/* MOBILE CLOSE */}
        <IconButton
          onClick={onMobileClose}
          sx={{
            color: "#fff",
            display: { xs: "inline-flex", md: "none" },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* ---------- MENU ---------- */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", px: 1, py: 1 }}>
        <List disablePadding>
          {menu.map(
            (item) =>
              hasPermission(item.permission) && (
                <ListItemButton
                  key={item.path}
                  component={NavLink}
                  to={item.path}
                  onClick={onMobileClose}
                  sx={{
                    color: "#e5e7eb",
                    mb: 0.5,
                    borderRadius: 1,
                    "&.active": {
                      bgcolor: "#343454",
                      color: "#fff",
                    },
                    "&:hover": {
                      bgcolor: "#2a2a45",
                    },
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontSize: 14 }}
                  />
                </ListItemButton>
              )
          )}
        </List>
      </Box>

      {/* ---------- FOOTER ---------- */}
      <Divider sx={{ bgcolor: "#444" }} />

      <Box sx={{ p: 2 }}>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-all duration-200 shadow-md hover:shadow-red-500/30"
        >
          <LogOut size={18} />
          <span className="text-sm">Logout</span>
        </button>
      </Box>
    </Box>
  );

  return (
    <>
      {/* ---------- DESKTOP ---------- */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: 1200,
        }}
      >
        {content}
      </Box>

      {/* ---------- MOBILE ---------- */}
      <Drawer
        open={mobileOpen}
        onClose={onMobileClose}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        {content}
      </Drawer>
    </>
  );
}
