import { useState, useCallback } from "react";

/**
 * Hook quản lý notifications (success, error, info, warning)
 */
export const useNotification = () => {
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info", // 'success' | 'error' | 'warning' | 'info'
  });

  const showNotification = useCallback((message, severity = "info") => {
    setNotification({
      open: true,
      message,
      severity,
    });
  }, []);

  const showSuccess = useCallback(
    (message) => {
      showNotification(message, "success");
    },
    [showNotification],
  );

  const showError = useCallback(
    (message) => {
      showNotification(message, "error");
    },
    [showNotification],
  );

  const showWarning = useCallback(
    (message) => {
      showNotification(message, "warning");
    },
    [showNotification],
  );

  const showInfo = useCallback(
    (message) => {
      showNotification(message, "info");
    },
    [showNotification],
  );

  const hideNotification = useCallback(() => {
    setNotification((prev) => ({ ...prev, open: false }));
  }, []);

  return {
    notification,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideNotification,
  };
};

export default useNotification;
