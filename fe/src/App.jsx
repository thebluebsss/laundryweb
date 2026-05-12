import { useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import Header from "./components/Header.jsx";
import Navbar from "./components/Navbar.jsx";
import Services from "./components/Services.jsx";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import PricePage from "./pages/PricePage.jsx";
import NewsPage from "./pages/NewsPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import Footer from "./components/Footer.jsx";
import ChatBot from "./components/ChatBot";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import BookingForm from "./components/BookingForm.jsx";
import BookingSuccessPage from "./pages/BookingSuccessPage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import PaymentReturnPage from "./pages/PaymentReturnPage.jsx";
import { CartProvider } from "./contexts/CartContext.jsx";
import theme from "./theme/theme.js";
import "./index.css";

// Admin imports
import AdminLayout from "./components/templates/AdminLayout";
import Dashboard from "./pages/Admin/Dashboard";
import UserManagement from "./pages/Admin/UserManagement";
import OrderManagement from "./pages/Admin/OrderManagement";
import ProductOrderManagement from "./pages/Admin/ProductOrderManagement";
import ProductManagement from "./pages/Admin/ProductManagement";
import EquipmentManagement from "./pages/Admin/EquipmentManagement";
import Settings from "./pages/Admin/Settings";

function App() {
  const [userRole, setUserRole] = useState(() =>
    localStorage.getItem("userRole"),
  );
  const [bookingData, setBookingData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserRole = () => {
      const role = localStorage.getItem("userRole");
      setUserRole(role);
    };

    checkUserRole();

    window.addEventListener("storage", checkUserRole);

    return () => window.removeEventListener("storage", checkUserRole);
  }, [location]);

  const handleBookingSuccess = (responseData) => {
    setBookingData(responseData);
    navigate("/dat-lich-thanh-cong");
  };

  const isLoginPage = location.pathname === "/";
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        <div className="App">
          {/* User Layout */}
          {userRole && !isLoginPage && !isAdminPage && <Header />}
          {(userRole === "guest" || userRole === "user") &&
            !isLoginPage &&
            !isAdminPage && <Navbar />}

          <main>
            <Routes>
              {/* Auth Route */}
              <Route path="/" element={<LoginPage />} />

              {/* Admin Routes */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminLayout>
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/users" element={<UserManagement />} />
                        <Route path="/orders" element={<OrderManagement />} />
                        <Route
                          path="/product-orders"
                          element={<ProductOrderManagement />}
                        />
                        <Route
                          path="/products"
                          element={<ProductManagement />}
                        />
                        <Route
                          path="/equipment"
                          element={<EquipmentManagement />}
                        />
                        <Route path="/settings" element={<Settings />} />
                      </Routes>
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />

              {/* User Routes */}
              <Route
                path="/home"
                element={
                  <ProtectedRoute requiredRole={["guest", "user"]}>
                    <HomePage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/tai-khoan"
                element={
                  <ProtectedRoute requiredRole={["user"]}>
                    <UserProfile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/ve-chung-toi"
                element={
                  <ProtectedRoute requiredRole={["guest", "user"]}>
                    <AboutPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dich-vu"
                element={
                  <ProtectedRoute requiredRole={["guest", "user"]}>
                    <Services />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/bang-gia"
                element={
                  <ProtectedRoute requiredRole={["guest", "user"]}>
                    <PricePage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/tin-tuc"
                element={
                  <ProtectedRoute requiredRole={["guest", "user"]}>
                    <NewsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dat-lich"
                element={
                  <ProtectedRoute requiredRole={["guest", "user"]}>
                    <BookingForm onSuccess={handleBookingSuccess} />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dat-lich-thanh-cong"
                element={
                  <ProtectedRoute requiredRole={["guest", "user"]}>
                    {bookingData ? (
                      <BookingSuccessPage
                        bookingData={bookingData}
                        onClose={() => navigate("/home")}
                      />
                    ) : (
                      <div style={{ padding: "40px", textAlign: "center" }}>
                        <h2>⚠️ Không tìm thấy thông tin đặt lịch</h2>
                        <p>Vui lòng đặt lịch lại</p>
                        <button
                          onClick={() => navigate("/dat-lich")}
                          style={{
                            padding: "12px 24px",
                            background: "#667eea",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "16px",
                            marginTop: "20px",
                          }}
                        >
                          Đặt lịch ngay
                        </button>
                      </div>
                    )}
                  </ProtectedRoute>
                }
              />

              <Route
                path="/san-pham"
                element={
                  <ProtectedRoute requiredRole={["guest", "user"]}>
                    <ProductsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/lien-he"
                element={
                  <ProtectedRoute requiredRole={["guest", "user"]}>
                    <ContactPage />
                  </ProtectedRoute>
                }
              />

              {/* Payment Return Routes */}
              <Route
                path="/payment/vnpay/return"
                element={
                  <ProtectedRoute requiredRole={["guest", "user"]}>
                    <PaymentReturnPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/payment/momo/return"
                element={
                  <ProtectedRoute requiredRole={["guest", "user"]}>
                    <PaymentReturnPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/payment/payos/return"
                element={
                  <ProtectedRoute requiredRole={["guest", "user"]}>
                    <PaymentReturnPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/payment/return"
                element={
                  <ProtectedRoute requiredRole={["guest", "user"]}>
                    <PaymentReturnPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>

          {(userRole === "guest" || userRole === "user") &&
            !isLoginPage &&
            !isAdminPage && (
              <>
                <Footer />
                <ChatBot />
              </>
            )}
        </div>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
