import React, { useState, useEffect } from "react";
import Header from "./components/Header.jsx";
import Navbar from "./components/Navbar.jsx";
import Services from "./components/Services.jsx";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import PricePage from "./pages/PricePage.jsx";
import Footer from "./components/Footer.jsx";
import ChatBot from "./components/ChatBot";
import LoginPage from "./pages/LoginPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import BookingForm from "./components/BookingForm.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import BookingSuccessPage from "./pages/BookingSuccessPage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import "./index.css";

function App() {
  const [userRole, setUserRole] = useState(() =>
    localStorage.getItem("userRole")
  );
  const [bookingData, setBookingData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserRole = () => {
      const role = localStorage.getItem("userRole");
      console.log("App.jsx - Current user role:", role);
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

  return (
    <div className="App">
      {userRole && !isLoginPage && <Header />}

      {(userRole === "guest" || userRole === "user") && !isLoginPage && (
        <Navbar />
      )}

      <main>
        <Routes>
          <Route path="/" element={<LoginPage />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/home"
            element={
              <ProtectedRoute requiredRole={["guest", "user"]}>
                <HomePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ve-chung-toi"
            element={
              <ProtectedRoute requiredRole={["guest", "user"]}>
                <div style={{ padding: "20px", textAlign: "center" }}>
                  <h2>Về Chúng Tôi</h2>
                  <p>Đang load ...</p>
                </div>
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
                <div style={{ padding: "20px", textAlign: "center" }}>
                  <h2>Tin Tức</h2>
                  <p>Đang load ...</p>
                </div>
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
                <div style={{ padding: "20px", textAlign: "center" }}>
                  <h2>Liên Hệ</h2>
                  <p>Đang load ...</p>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {(userRole === "guest" || userRole === "user") && !isLoginPage && (
        <>
          <Footer />
          <ChatBot />
        </>
      )}
    </div>
  );
}

export default App;
