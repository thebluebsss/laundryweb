import React, { useState } from "react";
import { Container, Box, Tabs, Tab, Typography, Paper } from "@mui/material";
import {
  ShoppingCart,
  People,
  Inventory,
  ShoppingBag,
} from "@mui/icons-material";
import OrderManagement from "./OrderManagement";
import UserManagement from "./UserManagement";
import EquipmentManagement from "./EquipmentManagement";
import ProductManagement from "./ProductManagement";

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} style={{ paddingTop: "32px" }}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default function AdminDashboard() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              fontWeight: 800,
              color: "white",
              textShadow: "0 2px 10px rgba(0,0,0,0.2)",
            }}
          >
            🎛️ Quản Trị Hệ Thống
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: "rgba(255,255,255,0.9)",
              fontSize: "18px",
            }}
          ></Typography>
        </Box>

        {/* Main Content */}
        <Paper
          elevation={8}
          sx={{
            borderRadius: "20px",
            overflow: "hidden",
            background: "white",
          }}
        >
          <Box
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              py: 2,
            }}
          >
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              indicatorColor="secondary"
              textColor="inherit"
              variant="fullWidth"
              sx={{
                "& .MuiTab-root": {
                  color: "rgba(255,255,255,0.7)",
                  fontWeight: 600,
                  fontSize: "15px",
                  textTransform: "none",
                  minHeight: "72px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: "white",
                    background: "rgba(255,255,255,0.1)",
                  },
                  "&.Mui-selected": {
                    color: "white",
                    fontWeight: 700,
                  },
                },
                "& .MuiTabs-indicator": {
                  height: 4,
                  borderRadius: "4px 4px 0 0",
                  backgroundColor: "white",
                },
              }}
            >
              <Tab
                icon={<ShoppingCart sx={{ fontSize: 28, mb: 0.5 }} />}
                label="Quản lý Đơn hàng"
              />
              <Tab
                icon={<People sx={{ fontSize: 28, mb: 0.5 }} />}
                label="Quản lý Người dùng"
              />
              <Tab
                icon={<Inventory sx={{ fontSize: 28, mb: 0.5 }} />}
                label="Quản lý Thiết bị"
              />
              <Tab
                icon={<ShoppingBag sx={{ fontSize: 28, mb: 0.5 }} />}
                label="Quản lý Sản phẩm"
              />
            </Tabs>
          </Box>

          <Box sx={{ p: 3 }}>
            <TabPanel value={currentTab} index={0}>
              <OrderManagement />
            </TabPanel>

            <TabPanel value={currentTab} index={1}>
              <UserManagement />
            </TabPanel>

            <TabPanel value={currentTab} index={2}>
              <EquipmentManagement />
            </TabPanel>

            <TabPanel value={currentTab} index={3}>
              <ProductManagement />
            </TabPanel>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
