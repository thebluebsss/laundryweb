import { useState, useEffect, useCallback } from "react";
import { productService } from "../../../services/api";
import { usePagination, useNotification } from "../../../hooks";

export const useProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    inStock: 0,
    lowStock: 0,
    sold: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  const [dialogs, setDialogs] = useState({
    add: false,
    edit: false,
    view: false,
    delete: false,
  });

  const { page, limit, totalPages, handlePageChange, updatePagination } =
    usePagination();
  const { showSuccess, showError } = useNotification();

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await productService.getProducts({
        page,
        limit,
        search: searchTerm,
      });

      setProducts(result.products || []);
      updatePagination(result.pagination);
    } catch (error) {
      showError(error.message || "Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchTerm, updatePagination, showError]);

  console.log("Products loaded:", products);

  const loadStats = useCallback(async () => {
    try {
      const result = await productService.getProducts({ limit: 1000 });
      const allProducts = result.products || [];

      const stats = {
        total: allProducts.length,
        inStock: allProducts.filter((p) => p.stock > 10).length,
        lowStock: allProducts.filter((p) => p.stock > 0 && p.stock <= 10)
          .length,
        sold: allProducts.reduce((sum, p) => sum + (p.sold || 0), 0),
      };

      setStats(stats);
    } catch (error) {
      console.error("Lỗi thống kê:", error);
    }
  }, []);

  useEffect(() => {
    loadProducts();
    loadStats();
  }, [loadProducts, loadStats]);

  const handleSearch = () => {
    handlePageChange(1);
    loadProducts();
  };

  const handleRefresh = () => {
    setSearchTerm("");
    handlePageChange(1);
    loadProducts();
    loadStats();
    showSuccess("Đã làm mới danh sách!");
  };

  const openDialog = (type, product = null) => {
    setDialogs((prev) => ({ ...prev, [type]: true }));
    if (product) {
      if (type === "delete") {
        setProductToDelete(product);
      } else {
        setSelectedProduct(product);
      }
    }
  };

  const closeDialog = (type) => {
    setDialogs((prev) => ({ ...prev, [type]: false }));
    setSelectedProduct(null);
    setProductToDelete(null);
  };

  const handleAddProduct = async (productData) => {
    setLoading(true);
    try {
      await productService.createProduct(productData);
      showSuccess("Thêm sản phẩm thành công!");
      closeDialog("add");
      loadProducts();
      loadStats();
    } catch (error) {
      showError(error.message || "Không thể thêm sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = async (productData) => {
    setLoading(true);
    try {
      await productService.updateProduct(selectedProduct._id, productData);
      showSuccess("Cập nhật sản phẩm thành công!");
      closeDialog("edit");
      loadProducts();
      loadStats();
    } catch (error) {
      showError(error.message || "Không thể cập nhật sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await productService.deleteProduct(productToDelete._id);
      showSuccess("Xóa sản phẩm thành công!");
      closeDialog("delete");
      loadProducts();
      loadStats();
    } catch (error) {
      showError(error.message || "Không thể xóa sản phẩm");
    }
  };

  return {
    products,
    stats,
    searchTerm,
    loading,
    selectedProduct,
    productToDelete,
    dialogs,
    page,
    totalPages,
    handlePageChange,
    setSearchTerm,
    handleSearch,
    handleRefresh,
    openDialog,
    closeDialog,
    handleAddProduct,
    handleEditProduct,
    handleDeleteProduct,
  };
};

export default useProductManagement;
