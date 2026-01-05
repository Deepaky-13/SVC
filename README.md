import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { NavLink } from "react-router-dom";

const menu = [
  { label: "Dashboard", path: "/" },
  { label: "Settings", path: "/settings" },
  { label: "Categories", path: "/categories" },
  { label: "Product", path: "/products" },
  { label: "Purchase", path: "/purchases" },
  { label: "Stock", path: "/stocks" },
  { label: "Sales", path: "/sales" },
  { label: "Services", path: "/services" },
];

export default function Sidebar() {
  return (
    <Box
      sx={{
        width: 250,
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bgcolor: "#1e1e2f",
        color: "#fff",
      }}
    >
      <Typography variant="h6" mb={3}>
        SVC Billing
      </Typography>

      <List>
        {menu.map((item) => (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            sx={{
              color: "#fff",
              mb: 1,
              borderRadius: 1,
              "&.active": {
                bgcolor: "#343454",
              },
              "&:hover": {
                bgcolor: "#2a2a45",
              },
            }}
          >
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
