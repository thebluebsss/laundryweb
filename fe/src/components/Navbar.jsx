import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Box,
  Paper,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  Home,
  Info,
  Build,
  AttachMoney,
  Article,
  Schedule,
  ShoppingBag,
  Menu,
  Close,
} from "@mui/icons-material";

const NavbarImproved = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { path: "/home", label: "TRANG CHỦ", icon: <Home /> },
    { path: "/ve-chung-toi", label: "VỀ CHÚNG TÔI", icon: <Info /> },
    { path: "/dich-vu", label: "DỊCH VỤ", icon: <Build /> },
    { path: "/bang-gia", label: "BẢNG GIÁ", icon: <AttachMoney /> },
    { path: "/tin-tuc", label: "TIN TỨC", icon: <Article /> },
    { path: "/dat-lich", label: "ĐẶT LỊCH NGAY", icon: <Schedule /> },
    { path: "/san-pham", label: "SẢN PHẨM", icon: <ShoppingBag /> },
  ];

  const getCurrentTabValue = () => {
    const currentItem = navItems.find(
      (item) => item.path === location.pathname,
    );
    return currentItem ? navItems.indexOf(currentItem) : 0;
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Mobile Drawer
  const drawer = (
    <Box sx={{ width: 280, height: "100%" }}>
      <Box
        sx={{
          p: 2,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          🧺 Menu
        </Typography>
        <IconButton onClick={handleDrawerToggle} sx={{ color: "white" }}>
          <Close />
        </IconButton>
      </Box>

      <List sx={{ pt: 0 }}>
        {navItems.map((item, index) => (
          <ListItem
            key={item.path}
            component={NavLink}
            to={item.path}
            onClick={handleDrawerToggle}
            sx={{
              color: "inherit",
              textDecoration: "none",
              borderRadius: 2,
              mx: 1,
              my: 0.5,
              transition: "all 0.3s ease",
              "&.active": {
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                "& .MuiListItemIcon-root": {
                  color: "white",
                },
              },
              "&:hover": {
                backgroundColor: "rgba(103, 126, 234, 0.1)",
                transform: "translateX(8px)",
              },
            }}
          >
            <ListItemIcon
              sx={{
                color:
                  location.pathname === item.path ? "white" : "primary.main",
                minWidth: 40,
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontWeight: location.pathname === item.path ? "bold" : "medium",
                fontSize: "0.9rem",
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  if (isMobile) {
    return (
      <>
        <Paper
          elevation={2}
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1000,
            background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
            borderRadius: 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 1,
            }}
          >
            <Typography variant="h6" fontWeight="bold" color="primary">
              Navigation
            </Typography>
            <IconButton
              onClick={handleDrawerToggle}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                },
              }}
            >
              <Menu />
            </IconButton>
          </Box>
        </Paper>

        <Drawer
          variant="temporary"
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          PaperProps={{
            sx: {
              background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
            },
          }}
        >
          {drawer}
        </Drawer>
      </>
    );
  }

  return (
    <Paper
      elevation={2}
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
        borderRadius: 0,
        borderBottom: "1px solid rgba(103, 126, 234, 0.08)",
        backdropFilter: "blur(20px)",
      }}
    >
      <Box sx={{ px: { xs: 2, md: 4 } }}>
        <Tabs
          value={getCurrentTabValue()}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            minHeight: 72,
            "& .MuiTabs-indicator": {
              height: 4,
              borderRadius: 2,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.95rem",
              minHeight: 72,
              color: "text.secondary",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              px: 3,
              "&:hover": {
                color: "primary.main",
                transform: "translateY(-2px)",
                bgcolor: "rgba(103, 126, 234, 0.04)",
              },
              "&.Mui-selected": {
                color: "primary.main",
                fontWeight: "bold",
              },
            },
          }}
        >
          {navItems.map((item, index) => (
            <Tab
              key={item.path}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {item.icon}
                  {item.label}
                </Box>
              }
              component={NavLink}
              to={item.path}
              sx={{
                "&.active": {
                  color: "primary.main",
                  fontWeight: "bold",
                },
              }}
            />
          ))}
        </Tabs>
      </Box>
    </Paper>
  );
};

export default NavbarImproved;
