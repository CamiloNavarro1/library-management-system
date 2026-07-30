import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#1565c0",
      dark: "#0d47a1",
      light: "#5e92f3",
      contrastText: "#ffffff",
    },

    secondary: {
      main: "#00897b",
    },

    background: {
      default: "#f4f7fb",
      paper: "#ffffff",
    },

    text: {
      primary: "#172033",
      secondary: "#667085",
    },

    success: {
      main: "#2e7d32",
    },

    warning: {
      main: "#ed6c02",
    },

    error: {
      main: "#d32f2f",
    },
  },

  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',

    h4: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },

    h5: {
      fontWeight: 700,
    },

    h6: {
      fontWeight: 600,
    },

    button: {
      fontWeight: 600,
      textTransform: "none",
    },
  },

  shape: {
    borderRadius: 12,
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          paddingLeft: 18,
          paddingRight: 18,
          boxShadow: "none",
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid #e7ebf0",
          boxShadow: "0 8px 24px rgba(16, 24, 40, 0.05)",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },

    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "#f8fafc",
        },
      },
    },
  },
});

export default theme;