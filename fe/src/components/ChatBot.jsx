import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Fab,
  Slide,
  Fade,
  CircularProgress,
  Chip,
  useTheme,
  Button,
  Divider,
  Badge,
} from "@mui/material";
import {
  Chat,
  Send,
  Close,
  SmartToy,
  Person,
  Minimize,
  Schedule,
  AttachMoney,
  Phone,
  LocationOn,
  Refresh,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import config from "../config/api";

const ChatBotImproved = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Xin chào! 👋 Tôi là trợ lý AI của Prolaundry. Tôi có thể giúp bạn:",
      timestamp: new Date(),
    },
    {
      type: "bot",
      text: "• Tư vấn dịch vụ giặt là\n• Hướng dẫn đặt lịch\n• Giải đáp thắc mắc về giá cả\n• Hỗ trợ khách hàng 24/7\n• Theo dõi đơn hàng\n• Tư vấn sản phẩm",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  const theme = useTheme();
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  const minimizeChat = () => {
    setIsMinimized(!isMinimized);
  };

  const clearChat = () => {
    setMessages([
      {
        type: "bot",
        text: "Xin chào! 👋 Tôi là trợ lý AI của Prolaundry. Tôi có thể giúp bạn:",
        timestamp: new Date(),
      },
      {
        type: "bot",
        text: "• Tư vấn dịch vụ giặt là\n• Hướng dẫn đặt lịch\n• Giải đáp thắc mắc về giá cả\n• Hỗ trợ khách hàng 24/7\n• Theo dõi đơn hàng\n• Tư vấn sản phẩm",
        timestamp: new Date(),
      },
    ]);
  };

  // Intelligent response system
  const getIntelligentResponse = (message) => {
    const lowerMessage = message.toLowerCase();

    // Pricing related
    if (
      lowerMessage.includes("giá") ||
      lowerMessage.includes("bảng giá") ||
      lowerMessage.includes("chi phí")
    ) {
      return "💰 **BẢNG GIÁ DỊCH VỤ PROLAUNDRY**\n\n🧺 **Giặt thường:**\n• Áo: 15,000đ/chiếc\n• Quần: 20,000đ/chiếc\n• Đầm/váy: 25,000đ/chiếc\n\n👔 **Giặt khô:**\n• Vest/Blazer: 80,000đ/bộ\n• Áo khoác: 60,000đ/chiếc\n• Chăn/mền: 50,000đ/chiếc\n\n🚚 **Phí vận chuyển:** MIỄN PHÍ trong bán kính 5km\n\nBạn có muốn đặt lịch ngay không? 😊";
    }

    // Booking related
    if (
      lowerMessage.includes("đặt lịch") ||
      lowerMessage.includes("book") ||
      lowerMessage.includes("hẹn")
    ) {
      return "📅 **HƯỚNG DẪN ĐẶT LỊCH**\n\n1️⃣ Chọn 'ĐẶT LỊCH NGAY' trên menu\n2️⃣ Điền thông tin liên hệ\n3️⃣ Chọn dịch vụ cần thiết\n4️⃣ Chọn thời gian phù hợp\n5️⃣ Xác nhận đặt lịch\n\n⏰ **Giờ làm việc:** 7:00 - 22:00 hàng ngày\n🚚 **Thời gian nhận/trả:** Linh hoạt theo yêu cầu\n\nBạn có muốn tôi chuyển đến trang đặt lịch không?";
    }

    // Time related
    if (
      lowerMessage.includes("thời gian") ||
      lowerMessage.includes("bao lâu") ||
      lowerMessage.includes("hoàn thành")
    ) {
      return "⏱️ **THỜI GIAN HOÀN THÀNH**\n\n🧺 **Giặt thường:** 24-48 giờ\n👔 **Giặt khô:** 2-3 ngày\n🧸 **Giặt đồ đặc biệt:** 3-5 ngày\n⚡ **Dịch vụ gấp:** +50% phí, hoàn thành trong 12-24h\n\n📞 **Hotline:** 0969263238 (24/7)\n\nCó gì khẩn cấp, bạn gọi trực tiếp nhé! 😊";
    }

    // Location related
    if (
      lowerMessage.includes("địa chỉ") ||
      lowerMessage.includes("khu vực") ||
      lowerMessage.includes("phục vụ")
    ) {
      return "📍 **KHU VỰC PHỤC VỤ**\n\n🏢 **Trụ sở chính:** 123 Đường ABC, Quận 1, TP.HCM\n\n🚚 **Miễn phí vận chuyển:**\n• Quận 1, 3, 5, 10, Bình Thạnh\n• Trong bán kính 5km từ trụ sở\n\n💰 **Có phí vận chuyển:**\n• Các quận khác: 20,000đ/lượt\n• Ngoại thành: 30,000đ/lượt\n\n📞 **Liên hệ:** 0969263238";
    }

    // Contact related
    if (
      lowerMessage.includes("liên hệ") ||
      lowerMessage.includes("hotline") ||
      lowerMessage.includes("số điện thoại")
    ) {
      return "📞 **THÔNG TIN LIÊN HỆ**\n\n☎️ **Hotline:** 0969263238 (24/7)\n📧 **Email:** support@prolaundry.vn\n🌐 **Website:** www.prolaundry.vn\n📱 **Zalo:** 0969263238\n\n🏢 **Địa chỉ:** 123 Đường ABC, Quận 1, TP.HCM\n⏰ **Giờ làm việc:** 7:00 - 22:00 hàng ngày\n\nChúng tôi luôn sẵn sàng hỗ trợ bạn! 😊";
    }

    // Products related
    if (
      lowerMessage.includes("sản phẩm") ||
      lowerMessage.includes("mua") ||
      lowerMessage.includes("bán")
    ) {
      return "🛍️ **SẢN PHẨM PROLAUNDRY**\n\n🧴 **Nước giặt cao cấp:**\n• Ariel Professional: 150,000đ\n• Downy Premium: 120,000đ\n• Comfort Concentrate: 100,000đ\n\n🧽 **Phụ kiện giặt là:**\n• Túi giặt bảo vệ: 50,000đ\n• Móc treo đồ: 25,000đ\n• Giá phơi di động: 200,000đ\n\nBạn có muốn xem thêm sản phẩm không?";
    }

    // Default response
    return "Tôi hiểu bạn đang cần hỗ trợ! 😊 Để tôi có thể giúp bạn tốt nhất, bạn có thể hỏi về:\n\n• Bảng giá dịch vụ\n• Cách đặt lịch\n• Thời gian hoàn thành\n• Khu vực phục vụ\n• Thông tin liên hệ\n• Sản phẩm bán kèm\n\nHoặc gọi hotline: 0969263238 để được tư vấn trực tiếp! 📞";
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      type: "user",
      text: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    // Try intelligent response first
    try {
      const intelligentResponse = getIntelligentResponse(currentInput);

      // Simulate thinking time for better UX
      setTimeout(
        () => {
          const botMessage = {
            type: "bot",
            text: intelligentResponse,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, botMessage]);

          // If chat is closed, show notification
          if (!isOpen) {
            setUnreadCount((prev) => prev + 1);
          }

          setIsLoading(false);
        },
        1000 + Math.random() * 1000,
      ); // 1-2 seconds delay
    } catch (error) {
      console.error("Lỗi:", error);
      setTimeout(() => {
        const errorMessage = {
          type: "bot",
          text: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau hoặc liên hệ hotline: 0969263238 🙏",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const quickReplies = [
    "Bảng giá dịch vụ",
    "Cách đặt lịch",
    "Thời gian hoàn thành",
    "Khu vực phục vụ",
    "Thông tin liên hệ",
    "Sản phẩm bán kèm",
  ];

  const quickActions = [
    {
      label: "Đặt lịch ngay",
      icon: <Schedule />,
      action: () => navigate("/dat-lich"),
    },
    {
      label: "Xem bảng giá",
      icon: <AttachMoney />,
      action: () => navigate("/bang-gia"),
    },
    {
      label: "Gọi hotline",
      icon: <Phone />,
      action: () => window.open("tel:0969263238"),
    },
  ];

  const handleQuickReply = (reply) => {
    setInput(reply);
  };

  if (!isOpen) {
    return (
      <Badge badgeContent={unreadCount} color="error">
        <Fab
          color="primary"
          onClick={toggleChat}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            background: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #45a049 0%, #1B5E20 100%)",
              transform: "scale(1.1)",
            },
            transition: "all 0.3s ease",
            zIndex: 1000,
            boxShadow: "0 8px 25px rgba(76, 175, 80, 0.3)",
            animation: unreadCount > 0 ? "pulse 2s infinite" : "none",
            "@keyframes pulse": {
              "0%": {
                transform: "scale(1)",
                boxShadow: "0 8px 25px rgba(76, 175, 80, 0.3)",
              },
              "50%": {
                transform: "scale(1.05)",
                boxShadow: "0 12px 35px rgba(76, 175, 80, 0.5)",
              },
              "100%": {
                transform: "scale(1)",
                boxShadow: "0 8px 25px rgba(76, 175, 80, 0.3)",
              },
            },
          }}
        >
          <Chat />
        </Fab>
      </Badge>
    );
  }

  return (
    <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
      <Paper
        elevation={12}
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          width: { xs: "calc(100vw - 40px)", sm: 420, md: 450 },
          height: isMinimized ? 70 : 600,
          borderRadius: 4,
          overflow: "hidden",
          zIndex: 1300,
          background: "#ffffff",
          border: "3px solid #4CAF50",
          boxShadow: "0 20px 60px rgba(76, 175, 80, 0.25)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: "#ffffff",
            color: "#2E7D32",
            p: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: 70,
            borderBottom: "3px solid #4CAF50",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              sx={{
                bgcolor: "#4CAF50",
                width: 40,
                height: 40,
                color: "white",
              }}
            >
              <SmartToy />
            </Avatar>
            <Box>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                  fontSize: "1.1rem",
                  color: "#2E7D32",
                }}
              >
                Trợ lý AI Prolaundry
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.85rem",
                  fontWeight: "500",
                  color: "#4CAF50",
                }}
              >
                🟢 Đang hoạt động • Phản hồi ngay lập tức
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={clearChat}
              sx={{ color: "#4CAF50" }}
              title="Làm mới cuộc trò chuyện"
            >
              <Refresh />
            </IconButton>
            <IconButton
              size="small"
              onClick={minimizeChat}
              sx={{ color: "#4CAF50" }}
            >
              <Minimize />
            </IconButton>
            <IconButton
              size="small"
              onClick={toggleChat}
              sx={{ color: "#4CAF50" }}
            >
              <Close />
            </IconButton>
          </Box>
        </Box>

        {!isMinimized && (
          <>
            {/* Messages Container */}
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                p: 2,
                background: "#f5f5f5",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "#f1f1f1",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#4CAF50",
                  borderRadius: "4px",
                  "&:hover": {
                    background: "#45a049",
                  },
                },
              }}
            >
              {messages.map((msg, index) => (
                <Fade key={index} in timeout={300}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent:
                        msg.type === "user" ? "flex-end" : "flex-start",
                      alignItems: "flex-start",
                      gap: 1,
                    }}
                  >
                    {msg.type === "bot" && (
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: "#4CAF50",
                          border: "2px solid white",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        }}
                      >
                        <SmartToy />
                      </Avatar>
                    )}

                    <Box sx={{ maxWidth: "75%" }}>
                      <Paper
                        elevation={3}
                        sx={{
                          p: msg.type === "user" ? 2.5 : 2,
                          borderRadius: msg.type === "user" ? 4 : 3,
                          background: msg.type === "user" ? "#fff" : "#ffffff",
                          color: msg.type === "user" ? "#FFFFFF" : "#333333",
                          border:
                            msg.type === "bot" ? "1px solid #e5e5ea" : "none",
                          boxShadow:
                            msg.type === "user"
                              ? "0 2px 12px rgba(0, 122, 255, 0.3), 0 1px 3px rgba(0, 122, 255, 0.2)"
                              : "0 1px 2px rgba(0,0,0,0.1)",
                          position: "relative",
                          overflow: "hidden",
                          "&::before":
                            msg.type === "user"
                              ? {
                                  content: '""',
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  background:
                                    "linear-gradient(135deg, rgba(248, 237, 237, 0.1) 0%, rgba(255,255,255,0.05) 100%)",
                                  pointerEvents: "none",
                                }
                              : {},
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            whiteSpace: "pre-line",
                            lineHeight: msg.type === "user" ? 1.6 : 1.5,
                            fontWeight: msg.type === "user" ? "700" : "400",
                            fontSize: msg.type === "user" ? "1rem" : "0.9rem",
                            textShadow:
                              msg.type === "user"
                                ? "0 1px 3px #ffff, 0 0 1px #fff"
                                : "none",
                            letterSpacing:
                              msg.type === "user" ? "0.3px" : "normal",
                            wordSpacing: msg.type === "user" ? "1px" : "normal",
                            textRendering: "optimizeLegibility",
                            WebkitFontSmoothing: "antialiased",
                            MozOsxFontSmoothing: "grayscale",
                            fontFamily:
                              msg.type === "user"
                                ? "'Inter', 'Segoe UI', 'Roboto', sans-serif"
                                : "inherit",
                            textAlign: msg.type === "user" ? "left" : "left",
                            userSelect: "text",
                            cursor: "text",
                            "& strong": {
                              fontWeight: "bold",
                              color: msg.type === "user" ? "#FFFFFF" : "#fff",
                              textShadow:
                                msg.type === "user"
                                  ? "0 1px 2px rgba(0,0,0,0.9)"
                                  : "none",
                            },
                          }}
                        >
                          {msg.text}
                        </Typography>
                      </Paper>

                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          mt: 0.5,
                          textAlign: msg.type === "user" ? "right" : "left",
                          color: "#999999",
                          fontSize: "0.75rem",
                        }}
                      >
                        {formatTime(msg.timestamp)}
                      </Typography>
                    </Box>

                    {msg.type === "user" && (
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: "#007AFF",
                          border: "2px solid white",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        }}
                      >
                        <Person />
                      </Avatar>
                    )}
                  </Box>
                </Fade>
              ))}

              {isLoading && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    gap: 1,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: "#4CAF50",
                      border: "2px solid white",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}
                  >
                    <SmartToy />
                  </Avatar>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      border: "1px solid #e5e5ea",
                    }}
                  >
                    <CircularProgress size={16} sx={{ color: "#4CAF50" }} />
                    <Typography
                      variant="body2"
                      sx={{ color: "#666666", fontWeight: "500" }}
                    >
                      Đang trả lời...
                    </Typography>
                  </Paper>
                </Box>
              )}

              <div ref={messagesEndRef} />
            </Box>

            {/* Quick Replies & Actions */}
            {messages.length <= 2 && (
              <Box
                sx={{
                  p: 2,
                  borderTop: "1px solid #e0e0e0",
                  background: "#ffffff",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    mb: 1.5,
                    display: "block",
                    color: "#2E7D32",
                    fontWeight: "600",
                    fontSize: "0.8rem",
                  }}
                >
                  Câu hỏi thường gặp:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                  {quickReplies.map((reply, index) => (
                    <Chip
                      key={index}
                      label={reply}
                      size="small"
                      onClick={() => handleQuickReply(reply)}
                      sx={{
                        cursor: "pointer",
                        backgroundColor: "#f8f9fa",
                        color: "#2E7D32",
                        fontWeight: "500",
                        fontSize: "0.75rem",
                        border: "1px solid #4CAF50",
                        "&:hover": {
                          bgcolor: "#4CAF50",
                          color: "#ffffff",
                          transform: "translateY(-1px)",
                          boxShadow: "0 4px 8px rgba(76, 175, 80, 0.3)",
                        },
                      }}
                    />
                  ))}
                </Box>

                <Divider sx={{ my: 1.5 }} />

                <Typography
                  variant="caption"
                  sx={{
                    mb: 1.5,
                    display: "block",
                    color: "#2E7D32",
                    fontWeight: "600",
                    fontSize: "0.8rem",
                  }}
                >
                  Thao tác nhanh:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      size="small"
                      variant="outlined"
                      startIcon={action.icon}
                      onClick={action.action}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                        borderColor: "#4CAF50",
                        color: "#2E7D32",
                        "&:hover": {
                          bgcolor: "#4CAF50",
                          color: "#ffffff",
                          borderColor: "#4CAF50",
                          transform: "translateY(-1px)",
                          boxShadow: "0 4px 8px rgba(76, 175, 80, 0.3)",
                        },
                      }}
                    >
                      {action.label}
                    </Button>
                  ))}
                </Box>
              </Box>
            )}

            {/* Input Area */}
            <Box
              sx={{
                p: 2,
                borderTop: "2px solid #4CAF50",
                background: "#ffffff",
                display: "flex",
                gap: 1,
                alignItems: "flex-end",
              }}
            >
              <TextField
                fullWidth
                size="small"
                placeholder="Nhập tin nhắn..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                multiline
                maxRows={3}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    backgroundColor: "#f8f9fa",
                    "&:hover fieldset": {
                      borderColor: "#4CAF50",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#4CAF50",
                    },
                  },
                }}
              />
              <IconButton
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                sx={{
                  background:
                    "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)",
                  color: "white",
                  width: 40,
                  height: 40,
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #45a049 0%, #1B5E20 100%)",
                  },
                  "&:disabled": {
                    background: "rgba(0, 0, 0, 0.12)",
                    color: "rgba(0, 0, 0, 0.26)",
                  },
                }}
              >
                <Send />
              </IconButton>
            </Box>
          </>
        )}
      </Paper>
    </Slide>
  );
};

export default ChatBotImproved;
