import { Box, TextField, Button, Card, CardContent } from "@mui/material";
import { Search, Refresh } from "@mui/icons-material";

/**
 * Search Bar Component
 */
const SearchBar = ({
  searchPhone,
  onSearchChange,
  onSearch,
  onRefresh,
  loading,
}) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            label="Tìm kiếm theo số điện thoại"
            variant="outlined"
            value={searchPhone}
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
            Tìm kiếm
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
        </Box>
      </CardContent>
    </Card>
  );
};

export default SearchBar;
