import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#667eea",
      light: "#8fa4f3",
      dark: "#4c63d2",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#764ba2",
      light: "#9575cd",
      dark: "#512da8",
      contrastText: "#ffffff",
    },
    background: {
      default: "#fafbfc",
      paper: "#ffffff",
    },
    text: {
      primary: "#2d3748",
      secondary: "#4a5568",
    },
    success: {
      main: "#48bb78",
      light: "#68d391",
      dark: "#38a169",
    },
    warning: {
      main: "#ed8936",
      light: "#f6ad55",
      dark: "#dd6b20",
    },
    error: {
      main: "#f56565",
      light: "#fc8181",
      dark: "#e53e3e",
    },
    info: {
      main: "#4299e1",
      light: "#63b3ed",
      dark: "#3182ce",
    },
    grey: {
      50: "#f7fafc",
      100: "#edf2f7",
      200: "#e2e8f0",
      300: "#cbd5e0",
      400: "#a0aec0",
      500: "#718096",
      600: "#4a5568",
      700: "#2d3748",
      800: "#1a202c",
      900: "#171923",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "3.5rem",
      fontWeight: 800,
      lineHeight: 1.1,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontSize: "2.75rem",
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontSize: "2.25rem",
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: "1.875rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.7,
      color: "#4a5568",
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.6,
      color: "#718096",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
      letterSpacing: "0.025em",
    },
  },
  shape: {
    borderRadius: 16,
  },
  spacing: 8,
  shadows: [
    "none",
    "0px 1px 3px rgba(0, 0, 0, 0.05), 0px 1px 2px rgba(0, 0, 0, 0.1)",
    "0px 4px 6px rgba(0, 0, 0, 0.05), 0px 2px 4px rgba(0, 0, 0, 0.06)",
    "0px 10px 15px rgba(0, 0, 0, 0.1), 0px 4px 6px rgba(0, 0, 0, 0.05)",
    "0px 20px 25px rgba(0, 0, 0, 0.1), 0px 10px 10px rgba(0, 0, 0, 0.04)",
    "0px 25px 50px rgba(0, 0, 0, 0.15), 0px 12px 18px rgba(0, 0, 0, 0.08)",
    "0px 35px 60px rgba(0, 0, 0, 0.2), 0px 15px 25px rgba(0, 0, 0, 0.1)",
    "0px 45px 80px rgba(0, 0, 0, 0.25), 0px 20px 35px rgba(0, 0, 0, 0.12)",
    "0px 55px 100px rgba(0, 0, 0, 0.3), 0px 25px 45px rgba(0, 0, 0, 0.15)",
    "0px 65px 120px rgba(0, 0, 0, 0.35), 0px 30px 55px rgba(0, 0, 0, 0.18)",
    "0px 75px 140px rgba(0, 0, 0, 0.4), 0px 35px 65px rgba(0, 0, 0, 0.2)",
    "0px 85px 160px rgba(0, 0, 0, 0.45), 0px 40px 75px rgba(0, 0, 0, 0.22)",
    "0px 95px 180px rgba(0, 0, 0, 0.5), 0px 45px 85px rgba(0, 0, 0, 0.25)",
    "0px 105px 200px rgba(0, 0, 0, 0.55), 0px 50px 95px rgba(0, 0, 0, 0.28)",
    "0px 115px 220px rgba(0, 0, 0, 0.6), 0px 55px 105px rgba(0, 0, 0, 0.3)",
    "0px 125px 240px rgba(0, 0, 0, 0.65), 0px 60px 115px rgba(0, 0, 0, 0.32)",
    "0px 135px 260px rgba(0, 0, 0, 0.7), 0px 65px 125px rgba(0, 0, 0, 0.35)",
    "0px 145px 280px rgba(0, 0, 0, 0.75), 0px 70px 135px rgba(0, 0, 0, 0.38)",
    "0px 155px 300px rgba(0, 0, 0, 0.8), 0px 75px 145px rgba(0, 0, 0, 0.4)",
    "0px 165px 320px rgba(0, 0, 0, 0.85), 0px 80px 155px rgba(0, 0, 0, 0.42)",
    "0px 175px 340px rgba(0, 0, 0, 0.9), 0px 85px 165px rgba(0, 0, 0, 0.45)",
    "0px 185px 360px rgba(0, 0, 0, 0.95), 0px 90px 175px rgba(0, 0, 0, 0.48)",
    "0px 195px 380px rgba(0, 0, 0, 1), 0px 95px 185px rgba(0, 0, 0, 0.5)",
    "0px 205px 400px rgba(0, 0, 0, 1), 0px 100px 195px rgba(0, 0, 0, 0.52)",
    "0px 215px 420px rgba(0, 0, 0, 1), 0px 105px 205px rgba(0, 0, 0, 0.55)",
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "12px 32px",
          fontSize: "0.95rem",
          fontWeight: 600,
          textTransform: "none",
          boxShadow: "none",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: "0px 8px 25px rgba(102, 126, 234, 0.25)",
          },
          "&:active": {
            transform: "translateY(0px)",
          },
        },
        contained: {
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
          },
        },
        outlined: {
          borderWidth: "2px",
          "&:hover": {
            borderWidth: "2px",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
          border: "1px solid rgba(226, 232, 240, 0.8)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.12)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundImage: "none",
        },
        elevation1: {
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.06)",
        },
        elevation2: {
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
        },
        elevation3: {
          boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            transition: "all 0.2s ease",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#667eea",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#667eea",
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 600,
          height: 32,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0px 4px 20px rgba(102, 126, 234, 0.15)",
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: "24px",
          paddingRight: "24px",
          "@media (min-width: 600px)": {
            paddingLeft: "32px",
            paddingRight: "32px",
          },
        },
      },
    },
  },
});

export default theme;
