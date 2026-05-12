import { Box, TextField, Button, Card, CardContent } from "@mui/material";
import { Search, Refresh, Add } from "@mui/icons-material";

/**
 * Search Bar Component
 */
const SearchBar = ({
  searchTerm,
  onSearchChange,
  onSearch,
  onRefresh,
  onAddNew,
  loading,
}) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            label="Tìm kiếm sản phẩm (tên, mô tả...)"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && onSearch()}
            sx={{ flexGrow: 1 }}
          />
          <Button
            variant="contained"
            startIcon={<Search />}
            onClick={onSearch}
            disabled={loading}
            sx={{ height: 56 }}
          >
            Tìm
          </Button>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={onRefresh}
            disabled={loading}
            sx={{ height: 56 }}
          >
            Làm mới
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<Add />}
            onClick={onAddNew}
            sx={{ height: 56 }}
          >
            Thêm mới
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SearchBar;
