import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Alert,
  useTheme,
  useMediaQuery,
  Paper,
} from "@mui/material";
import { motion } from "framer-motion";
import BluetoothIcon from "@mui/icons-material/Bluetooth";
import BluetoothConnectedIcon from "@mui/icons-material/BluetoothConnected";
import WarningIcon from "@mui/icons-material/Warning";
import SyncIcon from "@mui/icons-material/Sync";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { useBle } from "../contexts/BleContext";

export default function ConnectionStatus({ showControls = true }) {
  const {
    connectionStatus,
    connectionError,
    isConnecting,
    connect,
    disconnect,
  } = useBle();
  const [showError, setShowError] = useState(!!connectionError);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (connectionError) {
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
      }, 8000);
      return () => clearTimeout(timer);
    } else {
      setShowError(false);
    }
  }, [connectionError]);

  const handleReconnect = useCallback(async () => {
    try {
      await connect();
    } catch (error) {
      // Ошибка уже обрабатывается в контексте
    }
  }, [connect]);

  const getStatusInfo = () => {
    switch (connectionStatus) {
      case "disconnected":
        return {
          icon: <BluetoothIcon sx={{ color: "#546e7a", fontSize: 24 }} />,
          title: "Домик не подключен",
          description: "Нажмите кнопку для подключения",
          color: "#e0e0e0",
          borderColor: "#90a4ae",
        };
      case "connecting":
        return {
          icon: (
            <SyncIcon
              sx={{
                color: "#0288d1",
                fontSize: 24,
                animation: "spin 1s linear infinite",
              }}
            />
          ),
          title: "Подключение к домику...",
          description: "Поиск и подключение к устройству",
          color: "#e3f2fd",
          borderColor: "rgba(2, 136, 209, 0.5)",
        };
      case "connected":
        return {
          icon: (
            <BluetoothConnectedIcon sx={{ color: "#4caf50", fontSize: 24 }} />
          ),
          title: "Домик готов к управлению!",
          description: "Можно изменять яркость света в комнатах",
          color: "#e8f5e8",
          borderColor: "rgba(76, 175, 80, 0.5)",
        };
      case "error":
        return {
          icon: <WarningIcon sx={{ color: "#f44336", fontSize: 24 }} />,
          title: "Ошибка подключения",
          description: connectionError || "Не удалось подключиться к домику",
          color: "#ffcdd2",
          borderColor: "rgba(244, 67, 54, 0.5)",
        };
      default:
        return {
          icon: <BluetoothIcon sx={{ color: "#546e7a", fontSize: 24 }} />,
          title: "Статус неизвестен",
          description: "Проверьте подключение",
          color: "#e0e0e0",
          borderColor: "#90a4ae",
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Box sx={{ mb: 3 }}>
      {showError && connectionError && connectionStatus !== "connected" && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          style={{ marginBottom: "16px" }}
        >
          <Alert
            severity="error"
            icon={<WarningIcon fontSize="inherit" />}
            sx={{
              mb: 2,
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(244, 67, 54, 0.2)",
            }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => setShowError(false)}
              >
                Закрыть
              </Button>
            }
          >
            {connectionError}
          </Alert>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={2}
          sx={{
            p: 2,
            background: statusInfo.color,
            border: `1px solid ${statusInfo.borderColor}`,
            borderRadius: "16px",
            transition: "all 0.3s ease",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                flex: 1,
                minWidth: "200px",
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "12px",
                  backgroundColor: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  flexShrink: 0,
                }}
              >
                {statusInfo.icon}
              </Box>

              <Box>
                <Typography
                  variant={isMobile ? "subtitle1" : "h6"}
                  fontWeight="bold"
                >
                  {statusInfo.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {statusInfo.description}
                </Typography>
              </Box>
            </Box>

            {showControls && (
              <Box sx={{ display: "flex", gap: 1 }}>
                {connectionStatus === "connected" && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<PowerSettingsNewIcon />}
                      onClick={disconnect}
                      disabled={isConnecting}
                      sx={{
                        borderRadius: "12px",
                        textTransform: "none",
                        borderColor: "#f44336",
                        "&:hover": {
                          borderColor: "#d32f2f",
                          backgroundColor: "rgba(244, 67, 54, 0.04)",
                        },
                      }}
                    >
                      Отключить
                    </Button>
                  </motion.div>
                )}

                {(connectionStatus === "disconnected" ||
                  connectionStatus === "error") && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={
                        isConnecting ? (
                          <SyncIcon
                            sx={{ animation: "spin 1s linear infinite" }}
                          />
                        ) : (
                          <BluetoothIcon />
                        )
                      }
                      onClick={handleReconnect}
                      disabled={isConnecting}
                      sx={{
                        borderRadius: "12px",
                        textTransform: "none",
                        boxShadow: "0 4px 12px rgba(2, 136, 209, 0.3)",
                        "&:hover": {
                          boxShadow: "0 6px 16px rgba(2, 136, 209, 0.4)",
                        },
                      }}
                    >
                      {isConnecting ? "Подключение..." : "Подключиться"}
                    </Button>
                  </motion.div>
                )}

                {connectionStatus === "connecting" && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outlined"
                      color="warning"
                      startIcon={
                        <SyncIcon
                          sx={{ animation: "spin 1s linear infinite" }}
                        />
                      }
                      disabled
                      sx={{ borderRadius: "12px", textTransform: "none" }}
                    >
                      Подключение...
                    </Button>
                  </motion.div>
                )}
              </Box>
            )}
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
}
