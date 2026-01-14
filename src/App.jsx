import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import {
  ThemeProvider,
  createTheme,
  Alert,
  Box,
  Button,
  Typography,
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import ChildInterface from "./components/ChildInterface";
import ParentZone from "./components/ParentZone";
import ParentLock from "./components/ParentLock";
import { BleProvider } from "./contexts/BleContext";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0288d1",
    },
    secondary: {
      main: "#ff9800",
    },
    success: {
      main: "#4caf50",
    },
    error: {
      main: "#f44336",
    },
    background: {
      default: "#e0f7fa",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "20px",
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        },
      },
    },
  },
});

function App() {
  const [isParentUnlocked, setIsParentUnlocked] = useState(false);
  const [bluetoothSupported, setBluetoothSupported] = useState(true);
  const [showBluetoothError, setShowBluetoothError] = useState(false);

  useEffect(() => {
    // Проверка поддержки Web Bluetooth API
    if (!("bluetooth" in navigator)) {
      setBluetoothSupported(false);
      setShowBluetoothError(true);
      console.error("Web Bluetooth API not supported");
    }
  }, []);

  useEffect(() => {
    const unlocked = localStorage.getItem("parentUnlocked");
    if (unlocked && Date.now() - parseInt(unlocked) < 30 * 60 * 1000) {
      setIsParentUnlocked(true);
    }
  }, []);

  const unlockParentZone = () => {
    localStorage.setItem("parentUnlocked", Date.now().toString());
    setIsParentUnlocked(true);
  };

  const reloadPage = () => {
    window.location.reload();
  };

  if (!bluetoothSupported) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            p: 3,
            background: "linear-gradient(135deg, #e0f7fa 0%, #bbdefb 100%)",
          }}
        >
          <Box
            sx={{
              mb: 4,
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                fontSize: "5rem",
                mb: 2,
                color: "#f44336",
              }}
            >
              ❌
            </Box>
            <Typography
              variant="h4"
              sx={{ mb: 1, fontWeight: 700, color: "#d32f2f" }}
            >
              Bluetooth не поддерживается
            </Typography>
            <Typography variant="body1" sx={{ color: "#546e7a", mb: 3 }}>
              Ваш браузер не поддерживает технологию Web Bluetooth, необходимую
              для управления домиком
            </Typography>
          </Box>

          <Alert severity="info" sx={{ mb: 3, maxWidth: 600 }}>
            <Typography variant="body1" fontWeight="medium">
              Для работы с волшебным домиком используйте современный браузер:
              <ul style={{ margin: "8px 0 0 20px" }}>
                <li>Google Chrome (версия 70+)</li>
                <li>Microsoft Edge (версия 79+)</li>
                <li>Opera (версия 57+)</li>
              </ul>
            </Typography>
          </Alert>

          <Button
            variant="contained"
            color="primary"
            onClick={reloadPage}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(2, 136, 209, 0.3)",
            }}
          >
            Проверить снова
          </Button>

          <Box
            sx={{
              mt: 4,
              p: 2,
              background: "rgba(255,255,255,0.7)",
              borderRadius: "16px",
              maxWidth: 400,
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontStyle: "italic", color: "#546e7a" }}
            >
              Если вы используете Chrome, убедитесь, что флаг Web Bluetooth
              включен: перейдите по адресу
              chrome://flags/#enable-experimental-web-platform-features и
              включите эту опцию
            </Typography>
          </Box>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BleProvider>
        <Routes>
          <Route path="/" element={<ChildInterface />} />
          <Route
            path="/parent-zone"
            element={
              isParentUnlocked ? (
                <ParentZone onLock={() => setIsParentUnlocked(false)} />
              ) : (
                <ParentLock onSuccess={unlockParentZone} />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BleProvider>

      {showBluetoothError && (
        <Alert
          severity="error"
          sx={{
            position: "fixed",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            maxWidth: "90%",
            borderRadius: "16px",
          }}
          onClose={() => setShowBluetoothError(false)}
        >
          Bluetooth не поддерживается в этом браузере. Используйте Chrome или
          Edge.
        </Alert>
      )}
    </ThemeProvider>
  );
}

export default App;
