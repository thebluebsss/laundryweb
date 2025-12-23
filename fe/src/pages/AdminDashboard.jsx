import React, { useState } from "react";
import {
  Container,
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  AppBar,
} from "@mui/material";
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
    <div hidden={value !== index} style={{ paddingTop: "24px" }}>
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
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: "bold" }}>
          🎛️ Quản Trị Hệ Thống
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Chào mừng bạn đến với trang quản trị ProLaundry
        </Typography>
      </Box>

      <Paper elevation={3}>
        <AppBar
          position="static"
          color="default"
          sx={{ borderRadius: "8px 8px 0 0" }}
        >
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            sx={{ backgroundColor: "white" }}
          >
            <Tab
              icon={<ShoppingCart />}
              label="Quản lý đơn hàng"
              sx={{ fontWeight: "bold", fontSize: "16px" }}
            />
            <Tab
              icon={<People />}
              label="Quản lý người dùng"
              sx={{ fontWeight: "bold", fontSize: "16px" }}
            />
            <Tab
              icon={<Inventory />}
              label="Quản lý thiết bị"
              sx={{ fontWeight: "bold", fontSize: "16px" }}
            />
            <Tab
              icon={<ShoppingBag />}
              label="Quản lý sản phẩm"
              sx={{ fontWeight: "bold", fontSize: "16px" }}
            />
          </Tabs>
        </AppBar>

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
      </Paper>
    </Container>
  );
}
