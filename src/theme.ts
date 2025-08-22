import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6EC1E4", // pastel blue
      contrastText: "#fff",
    },
    secondary: {
      main: "#F9D976", // pastel yellow
      contrastText: "#2D2D2D",
    },
    success: {
      main: "#A8E6CF", // pastel green
    },
    error: {
      main: "#FF8B94", // pastel red
    },
    background: {
      default: "#FDFDFD",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#2D2D2D",
      secondary: "#6D6D6D",
    },
  },
  typography: {
    fontFamily: "'Quicksand', 'Roboto', sans-serif", // playful but clean
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12, // more rounded for a cute feel
  },
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          padding: "16px 20px",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            "&:hover fieldset": {
              borderColor: "#6EC1E4", // pastel blue
            },
            "&.Mui-focused fieldset": {
              borderColor: "#A8E6CF", // pastel green
              borderWidth: 2,
            },
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#6EC1E4",
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          marginBottom: 16,
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "#6EC1E4",
          "&.Mui-checked": {
            color: "#A8E6CF",
          },
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: "1.25rem",
          color: "#2D2D2D",
          marginBottom: 8,
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: "12px 16px",
          gap: 12,
        },
      },
    },
  },
});

export default theme;
