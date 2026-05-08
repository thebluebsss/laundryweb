import { useState } from "react";
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
import { ExitToApp } from "@mui/icons-material";
import CartIcon from "./CartIcon";
import CartDrawerImproved from "./CartDrawer";

export default function Header() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");
  const userName = localStorage.getItem("userName");
  const [cartOpen, setCartOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  const handleProfileClick = () => {
    navigate("/tai-khoan");
  };

  return (
    <>
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          boxShadow: "0 4px 20px rgba(102, 126, 234, 0.15)",
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Typography
            variant="h5"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
              cursor: "pointer",
              letterSpacing: "-0.5px",
            }}
            onClick={() => navigate(userRole === "admin" ? "/admin" : "/home")}
          >
            🧺 Hệ Thống Giặt Là Prolaundry
            {userRole === "admin" && " - Quản trị"}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            {(userRole === "guest" || userRole === "user") && (
              <>
                <CartIcon onClick={() => setCartOpen(true)} />

                <Chip
                  avatar={
                    <Avatar
                      sx={{
                        bgcolor: "rgba(255, 255, 255, 0.3)",
                        fontSize: 14,
                        width: 32,
                        height: 32,
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
                    fontWeight: 600,
                    cursor: "pointer",
                    height: 40,
                    borderRadius: 3,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.25)",
                      transform: "translateY(-1px)",
                    },
                    "& .MuiChip-label": {
                      px: 2,
                    },
                  }}
                />
              </>
            )}

            <Button
              color="inherit"
              startIcon={<ExitToApp />}
              onClick={handleLogout}
              sx={{
                borderRadius: 3,
                textTransform: "none",
                fontWeight: "bold",
                px: 3,
                py: 1,
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              Đăng xuất
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <CartDrawerImproved open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
