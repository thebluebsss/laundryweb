import React from "react";
import { Badge, IconButton } from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import { useCart } from "../contexts/CartContext";

const CartIcon = ({ onClick }) => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  console.log("🛒 CartIcon rendered, totalItems:", totalItems);

  return (
    <IconButton
      onClick={() => {
        console.log("🛒 CartIcon clicked!");
        onClick();
      }}
      sx={{
        color: "white",
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.1)",
        },
      }}
    >
      <Badge badgeContent={totalItems} color="error">
        <ShoppingCart />
      </Badge>
    </IconButton>
  );
};

export default CartIcon;
