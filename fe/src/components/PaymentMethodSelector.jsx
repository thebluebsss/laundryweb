import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Fade,
  Zoom,
} from "@mui/material";
import { LocalShipping, QrCode2 } from "@mui/icons-material";

const PaymentMethodSelector = ({ value, onChange, totalAmount }) => {
  const [hoveredMethod, setHoveredMethod] = useState(null);

  const paymentMethods = [
    {
      value: "cod",
      label: "Thanh toán khi nhận hàng (COD)",
      description: "Thanh toán bằng tiền mặt khi nhận đồ",
      icon: <LocalShipping />,
      color: "#4CAF50",
      available: true,
      gradient: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
    },
    {
      value: "bank_transfer",
      label: "Chuyển khoản ngân hàng",
      description: "Quét mã QR để chuyển khoản nhanh chóng",
      icon: <QrCode2 />,
      color: "#2196F3",
      available: true,
      gradient: "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
    },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <Box>
      <FormControl component="fieldset" fullWidth>
        <FormLabel
          component="legend"
          sx={{
            mb: 3,
            fontSize: "1.2rem",
            fontWeight: 700,
            color: "primary.main",
            textAlign: "center",
          }}
        >
          💳 Chọn phương thức thanh toán
        </FormLabel>

        {totalAmount > 0 && (
          <Fade in timeout={500}>
            <Box
              sx={{
                mb: 3,
                p: 3,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: 2,
                color: "white",
                textAlign: "center",
                boxShadow: 3,
              }}
            >
              <Typography variant="h5" fontWeight="bold">
                Tổng tiền: {formatCurrency(totalAmount)}
              </Typography>
            </Box>
          </Fade>
        )}

        <RadioGroup
          value={value}
          onChange={(e) => onChange(e.target.value)}
          sx={{ gap: 2 }}
        >
          {paymentMethods.map((method, index) => (
            <Zoom key={method.value} in timeout={300 + index * 100}>
              <Card
                variant="outlined"
                sx={{
                  cursor: method.available ? "pointer" : "not-allowed",
                  opacity: method.available ? 1 : 0.5,
                  border:
                    value === method.value
                      ? `3px solid ${method.color}`
                      : "2px solid #e0e0e0",
                  borderRadius: 3,
                  transition: "all 0.3s ease",
                  transform:
                    hoveredMethod === method.value
                      ? "translateY(-4px)"
                      : "translateY(0)",
                  boxShadow:
                    value === method.value
                      ? `0 8px 25px ${method.color}40`
                      : hoveredMethod === method.value
                        ? `0 6px 20px ${method.color}30`
                        : 1,
                  background:
                    value === method.value
                      ? `linear-gradient(135deg, ${method.color}10 0%, ${method.color}05 100%)`
                      : "white",
                  "&:hover": method.available
                    ? {
                        borderColor: method.color,
                        boxShadow: `0 6px 20px ${method.color}30`,
                      }
                    : {},
                }}
                onClick={() => method.available && onChange(method.value)}
                onMouseEnter={() => setHoveredMethod(method.value)}
                onMouseLeave={() => setHoveredMethod(null)}
              >
                <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
                  <FormControlLabel
                    value={method.value}
                    control={
                      <Radio
                        sx={{
                          color: method.color,
                          "&.Mui-checked": {
                            color: method.color,
                          },
                        }}
                      />
                    }
                    disabled={!method.available}
                    label={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          width: "100%",
                        }}
                      >
                        <Box
                          sx={{
                            background:
                              value === method.value
                                ? method.gradient
                                : `${method.color}20`,
                            color:
                              value === method.value ? "white" : method.color,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 50,
                            height: 50,
                            borderRadius: 2,
                            transition: "all 0.3s ease",
                          }}
                        >
                          {method.icon}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="h6"
                            fontWeight={700}
                            sx={{
                              color:
                                value === method.value
                                  ? method.color
                                  : "text.primary",
                              mb: 0.5,
                            }}
                          >
                            {method.label}
                            {!method.available && (
                              <Chip
                                label="Sắp có"
                                size="small"
                                sx={{ ml: 1 }}
                                color="warning"
                              />
                            )}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ lineHeight: 1.4 }}
                          >
                            {method.description}
                          </Typography>
                        </Box>
                        {value === method.value && (
                          <Chip
                            label="Đã chọn"
                            size="small"
                            sx={{
                              background: method.gradient,
                              color: "white",
                              fontWeight: "bold",
                            }}
                          />
                        )}
                      </Box>
                    }
                    sx={{ m: 0, width: "100%" }}
                  />
                </CardContent>
              </Card>
            </Zoom>
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default PaymentMethodSelector;
