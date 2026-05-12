import { useLocation, useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import { menuItems } from "../../../const/menu";

const DRAWER_WIDTH = 260;

/**
 * Admin Sidebar Component
 */
const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (item) => {
    return item.activeUrls?.some((url) => location.pathname === url) || false;
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          bgcolor: "#1e293b",
          color: "white",
        },
      }}
    >
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "white" }}>
            🧺 Laundry Admin
          </Typography>
        </Box>
      </Toolbar>

      <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />

      <List sx={{ px: 1, py: 2 }}>
        {menuItems.map((item) => {
          const active = isActive(item);

          return (
            <ListItem key={item.link} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.link)}
                sx={{
                  borderRadius: 2,
                  bgcolor: active ? "rgba(59, 130, 246, 0.2)" : "transparent",
                  color: active ? "#60a5fa" : "rgba(255,255,255,0.7)",
                  "&:hover": {
                    bgcolor: active
                      ? "rgba(59, 130, 246, 0.3)"
                      : "rgba(255,255,255,0.05)",
                    color: "white",
                  },
                  transition: "all 0.2s",
                }}
              >
                <ListItemIcon
                  sx={{
                    color: active ? "#60a5fa" : "rgba(255,255,255,0.7)",
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: "0.95rem",
                    fontWeight: active ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;
