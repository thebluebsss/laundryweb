import React from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Chip,
} from "@mui/material";
import { ExitToApp, Person } from "@mui/icons-material";

export default function Header() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");
  const userName = localStorage.getItem("userName");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  const handleProfileClick = () => {
    navigate("/tai-khoan");
  };

  return (
    <AppBar
      position="static"
      sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: "bold", cursor: "pointer" }}
          onClick={() => navigate(userRole === "admin" ? "/admin" : "/home")}
        >
          🧺 Hệ Thống Giặt Là Prolaundry
          {userRole === "admin" && " - Quản trị"}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {(userRole === "guest" || userRole === "user") && (
            <Chip
              avatar={
                <Avatar
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.3)",
                    fontSize: 14,
                  }}
                >
                  {userName?.charAt(0)?.toUpperCase() || "U"}
                </Avatar>
              }
              label={userName || "Người dùng"}
              onClick={handleProfileClick}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                color: "white",
                fontWeight: 500,
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.25)",
                },
                "& .MuiChip-label": {
                  px: 1,
                },
              }}
            />
          )}

          <Button
            color="inherit"
            startIcon={<ExitToApp />}
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            Đăng xuất
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
