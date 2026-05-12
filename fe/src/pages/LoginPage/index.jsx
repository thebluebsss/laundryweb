import { Container, Paper, Box, Alert } from "@mui/material";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import { useLogin } from "./useLogin";
import { useNotification } from "../../hooks";

/**
 * Login Page - New Structure
 * Trang đăng nhập/đăng ký theo cấu trúc mới
 */
const LoginPage = () => {
  const {
    isRegisterMode,
    loading,
    handleLogin,
    handleRegister,
    switchToRegister,
    switchToLogin,
  } = useLogin();

  const { notification, hideNotification } = useNotification();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: "100%",
            borderRadius: 2,
          }}
        >
          {notification.open && (
            <Alert
              severity={notification.severity}
              onClose={hideNotification}
              sx={{ mb: 3 }}
            >
              {notification.message}
            </Alert>
          )}

          {isRegisterMode ? (
            <RegisterForm
              onSubmit={handleRegister}
              loading={loading}
              onSwitchToLogin={switchToLogin}
            />
          ) : (
            <LoginForm
              onSubmit={handleLogin}
              loading={loading}
              onSwitchToRegister={switchToRegister}
            />
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
