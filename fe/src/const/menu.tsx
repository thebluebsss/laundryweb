import { ReactNode } from "react";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  ShoppingCart as OrdersIcon,
  Inventory as ProductsIcon,
  Build as EquipmentIcon,
  Settings as SettingsIcon,
  LocalShipping as ShippingIcon,
} from "@mui/icons-material";

export type MenuItem = {
  label: string;
  link: string;
  icon: ReactNode;
  activeUrls?: string[];
};

export const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    link: "/admin/dashboard",
    icon: <DashboardIcon />,
    activeUrls: ["/admin/dashboard", "/admin"],
  },
  {
    label: "Quản lý người dùng",
    link: "/admin/users",
    icon: <PeopleIcon />,
    activeUrls: ["/admin/users"],
  },
  {
    label: "Đơn dịch vụ",
    link: "/admin/orders",
    icon: <ShippingIcon />,
    activeUrls: ["/admin/orders"],
  },
  {
    label: "Đơn sản phẩm",
    link: "/admin/product-orders",
    icon: <OrdersIcon />,
    activeUrls: ["/admin/product-orders"],
  },
  {
    label: "Sản phẩm",
    link: "/admin/products",
    icon: <ProductsIcon />,
    activeUrls: ["/admin/products"],
  },
  {
    label: "Thiết bị",
    link: "/admin/equipment",
    icon: <EquipmentIcon />,
    activeUrls: ["/admin/equipment"],
  },
  {
    label: "Cài đặt",
    link: "/admin/settings",
    icon: <SettingsIcon />,
    activeUrls: ["/admin/settings"],
  },
];
