import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  Button,
  Container,
  Skeleton,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Pagination,
  Avatar,
  Divider,
} from "@mui/material";
import {
  Search,
  AccessTime,
  Person,
  Visibility,
  TrendingUp,
  LocalOffer,
  Announcement,
  Lightbulb,
} from "@mui/icons-material";
import config from "../config/api";

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    { value: "all", label: "Tất cả", icon: <Announcement /> },
    { value: "promotion", label: "Khuyến mãi", icon: <LocalOffer /> },
    { value: "tips", label: "Mẹo hay", icon: <Lightbulb /> },
    { value: "trending", label: "Xu hướng", icon: <TrendingUp /> },
  ];

  // Mock data - trong thực tế sẽ fetch từ API
  const mockNews = [
    {
      _id: "1",
      title: "Khuyến mãi đặc biệt tháng 12 - Giảm giá 30% cho khách hàng mới",
      excerpt:
        "Chào mừng tháng cuối năm, chúng tôi dành tặng khách hàng mới chương trình khuyến mãi hấp dẫn với mức giảm giá lên đến 30%...",
      content: "Nội dung chi tiết về chương trình khuyến mãi...",
      category: "promotion",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500",
      author: "Admin",
      publishedAt: "2024-12-25T10:00:00Z",
      views: 1250,
      tags: ["khuyến mãi", "giảm giá", "khách hàng mới"],
    },
    {
      _id: "2",
      title: "5 Mẹo giặt đồ trắng sạch như mới không cần tẩy trắng",
      excerpt:
        "Bạn đang lo lắng về việc quần áo trắng bị ố vàng theo thời gian? Hãy cùng khám phá 5 mẹo đơn giản giúp giữ đồ trắng luôn sạch sẽ...",
      content: "Chi tiết 5 mẹo giặt đồ trắng...",
      category: "tips",
      image:
        "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=500",
      author: "Chuyên gia giặt là",
      publishedAt: "2024-12-20T14:30:00Z",
      views: 890,
      tags: ["mẹo hay", "giặt đồ", "đồ trắng"],
    },
    {
      _id: "3",
      title: "Xu hướng dịch vụ giặt là thông minh 2024",
      excerpt:
        "Công nghệ AI và IoT đang thay đổi ngành dịch vụ giặt là như thế nào? Cùng tìm hiểu những xu hướng mới nhất trong năm 2024...",
      content: "Phân tích xu hướng công nghệ trong giặt là...",
      category: "trending",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
      author: "Tech Expert",
      publishedAt: "2024-12-18T09:15:00Z",
      views: 2100,
      tags: ["công nghệ", "xu hướng", "AI"],
    },
    {
      _id: "4",
      title: "Cách bảo quản quần áo mùa đông đúng cách",
      excerpt:
        "Mùa đông đến rồi! Làm thế nào để bảo quản áo khoác, áo len và các trang phục mùa đông để chúng luôn bền đẹp?",
      content: "Hướng dẫn chi tiết cách bảo quản quần áo mùa đông...",
      category: "tips",
      image:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500",
      author: "Fashion Care",
      publishedAt: "2024-12-15T16:45:00Z",
      views: 1580,
      tags: ["bảo quản", "mùa đông", "áo khoác"],
    },
    {
      _id: "5",
      title: "Giới thiệu dịch vụ giặt khô cao cấp mới",
      excerpt:
        "Chúng tôi tự hào giới thiệu dịch vụ giặt khô cao cấp với công nghệ mới nhất từ Đức, đảm bảo chất lượng tốt nhất cho quần áo của bạn...",
      content: "Chi tiết về dịch vụ giặt khô cao cấp...",
      category: "promotion",
      image:
        "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=500",
      author: "Service Team",
      publishedAt: "2024-12-10T11:20:00Z",
      views: 950,
      tags: ["dịch vụ mới", "giặt khô", "cao cấp"],
    },
    {
      _id: "6",
      title: "Tại sao nên chọn dịch vụ giặt là chuyên nghiệp?",
      excerpt:
        "So với việc giặt tại nhà, dịch vụ giặt là chuyên nghiệp mang lại những lợi ích gì? Hãy cùng phân tích chi tiết...",
      content: "Phân tích lợi ích của dịch vụ giặt là chuyên nghiệp...",
      category: "trending",
      image:
        "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=500",
      author: "Business Analyst",
      publishedAt: "2024-12-08T13:10:00Z",
      views: 1320,
      tags: ["chuyên nghiệp", "so sánh", "lợi ích"],
    },
  ];

  useEffect(() => {
    fetchNews();
  }, [selectedCategory, page, searchTerm]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      let filteredNews = mockNews;

      // Filter by category
      if (selectedCategory !== "all") {
        filteredNews = filteredNews.filter(
          (item) => item.category === selectedCategory
        );
      }

      // Filter by search term
      if (searchTerm) {
        filteredNews = filteredNews.filter(
          (item) =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.tags.some((tag) =>
              tag.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
      }

      // Pagination
      const itemsPerPage = 6;
      const startIndex = (page - 1) * itemsPerPage;
      const paginatedNews = filteredNews.slice(
        startIndex,
        startIndex + itemsPerPage
      );

      setNews(paginatedNews);
      setTotalPages(Math.ceil(filteredNews.length / itemsPerPage));
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatViews = (views) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`;
    }
    return views.toString();
  };

  const getCategoryColor = (category) => {
    const colors = {
      promotion: "error",
      tips: "success",
      trending: "warning",
      all: "primary",
    };
    return colors[category] || "default";
  };

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
    setPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const renderNewsCard = (article) => (
    <Grid item xs={12} sm={6} md={4} key={article._id}>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: 6,
          },
        }}
      >
        <CardMedia
          component="img"
          height="200"
          image={article.image}
          alt={article.title}
          sx={{ objectFit: "cover" }}
        />

        <CardContent
          sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
        >
          <Box sx={{ mb: 1 }}>
            <Chip
              label={
                categories.find((cat) => cat.value === article.category)?.label
              }
              color={getCategoryColor(article.category)}
              size="small"
              sx={{ mb: 1 }}
            />
          </Box>

          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              fontWeight: 600,
            }}
          >
            {article.title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              mb: 2,
              flexGrow: 1,
            }}
          >
            {article.excerpt}
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}>
            {article.tags.slice(0, 3).map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.7rem" }}
              />
            ))}
          </Box>

          <Divider sx={{ mb: 1 }} />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar sx={{ width: 24, height: 24, fontSize: "0.8rem" }}>
                {article.author[0]}
              </Avatar>
              <Typography variant="caption" color="text.secondary">
                {article.author}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Visibility sx={{ fontSize: 16 }} />
              <Typography variant="caption" color="text.secondary">
                {formatViews(article.views)}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <AccessTime sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="caption" color="text.secondary">
                {formatDate(article.publishedAt)}
              </Typography>
            </Box>

            <Button size="small" variant="outlined">
              Đọc thêm
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );

  const renderSkeleton = () => (
    <Grid item xs={12} sm={6} md={4}>
      <Card sx={{ height: "100%" }}>
        <Skeleton variant="rectangular" height={200} />
        <CardContent>
          <Skeleton variant="text" sx={{ fontSize: "1rem", mb: 1 }} />
          <Skeleton variant="text" sx={{ fontSize: "1.5rem", mb: 1 }} />
          <Skeleton variant="text" sx={{ fontSize: "1rem", mb: 2 }} />
          <Skeleton variant="text" sx={{ fontSize: "0.875rem" }} />
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          📰 Tin Tức & Cập Nhật
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Cập nhật những thông tin mới nhất về dịch vụ giặt là và mẹo hay hữu
          ích
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Tìm kiếm tin tức..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        <Tabs
          value={selectedCategory}
          onChange={handleCategoryChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              minHeight: 48,
              textTransform: "none",
              fontWeight: 600,
            },
          }}
        >
          {categories.map((category) => (
            <Tab
              key={category.value}
              value={category.value}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {category.icon}
                  {category.label}
                </Box>
              }
            />
          ))}
        </Tabs>
      </Box>

      {/* News Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {loading
          ? Array.from(new Array(6)).map((_, index) => (
              <React.Fragment key={index}>{renderSkeleton()}</React.Fragment>
            ))
          : news.map(renderNewsCard)}
      </Grid>

      {/* Empty State */}
      {!loading && news.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Không tìm thấy tin tức nào
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Thử thay đổi từ khóa tìm kiếm hoặc danh mục
          </Typography>
        </Box>
      )}

      {/* Pagination */}
      {!loading && news.length > 0 && totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Container>
  );
};

export default NewsPage;
