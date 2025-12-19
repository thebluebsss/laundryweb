import React from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

export default function Header() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/");
  };

  if (!userRole) return null;

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          {userRole === "admin" ? (
            <AdminPanelSettingsIcon sx={{ marginRight: 1 }} />
          ) : (
            <PersonIcon sx={{ marginRight: 1 }} />
          )}
          <Typography variant="h6">
            🧺 Hệ Thống Giặt Là Prolaundry -{" "}
            {userRole === "admin" ? "Quản trị viên" : "Khách hàng"}
          </Typography>
        </Box>

        <Button
          color="inherit"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          Đăng xuất
        </Button>
      </Toolbar>
    </AppBar>
  );
}
