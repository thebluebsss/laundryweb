import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useNotification } from "../../hooks";

/**
 * Custom hook for Login page logic
 */
export const useLogin = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (credentials) => {
    setLoading(true);
    try {
      const result = await login(credentials);

      if (result.success) {
        showSuccess("Đăng nhập thành công!");

        // Redirect based on role
        if (result.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } else {
        showError(result.error || "Đăng nhập thất bại");
      }
    } catch (error) {
      showError("Đã xảy ra lỗi khi đăng nhập");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (userData) => {
    setLoading(true);
    try {
      const result = await register(userData);

      if (result.success) {
        showSuccess("Đăng ký thành công!");
        navigate("/");
      } else {
        showError(result.error || "Đăng ký thất bại");
      }
    } catch (error) {
      showError("Đã xảy ra lỗi khi đăng ký");
    } finally {
      setLoading(false);
    }
  };

  const switchToRegister = () => {
    setIsRegisterMode(true);
  };

  const switchToLogin = () => {
    setIsRegisterMode(false);
  };

  return {
    isRegisterMode,
    loading,
    handleLogin,
    handleRegister,
    switchToRegister,
    switchToLogin,
  };
};

export default useLogin;
