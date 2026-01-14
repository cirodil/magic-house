import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
  Fab,
  Alert,
} from "@mui/material";
import { ColorRing } from "react-loader-spinner";
import { motion } from "framer-motion";
import RoomControl from "./RoomControl";
import ConnectionStatus from "./ConnectionStatus";
import ParentIcon from "@mui/icons-material/VerifiedUser";
import WarningIcon from "@mui/icons-material/Warning";
import { useBle } from "../contexts/BleContext";
import HouseIcon from "../assets/house-icon";

export default function ChildInterface() {
  const { device, connectionStatus, connectionError, isConnecting } = useBle();
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const rooms = [
    { name: "Гостиная", id: "room1", color: "#FFD700", icon: "🛋️" },
    { name: "Спальня", id: "room2", color: "#87CEFA", icon: "🛏️" },
    { name: "Кухня", id: "room3", color: "#98FB98", icon: "🍽️" },
    { name: "Двор", id: "yard", color: "#FFA500", icon: "🌳" },
  ];

  useEffect(() => {
    if (connectionStatus === "disconnected") {
      const timer = setTimeout(() => {
        if (connectionStatus === "disconnected") {
          // Автоматическая попытка подключения через 2 секунды
          const lastDevice = localStorage.getItem("lastConnectedDevice");
          if (lastDevice) {
            // connectToDevice будет вызван в другом месте или по кнопке
          }
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [connectionStatus]);

  if (isLoading || isConnecting) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        sx={{ background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)" }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              width: isMobile ? 120 : 180,
              mb: 3,
              "& svg": {
                filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
              },
            }}
          >
            <HouseIcon size={isMobile ? 120 : 180} />
          </Box>
        </motion.div>

        <ColorRing
          visible={true}
          height="80"
          width="80"
          ariaLabel="color-ring-loading"
          wrapperStyle={{ margin: "20px 0" }}
          colors={["#4CAF50", "#2196F3", "#FFC107", "#F44336"]}
        />

        <Typography
          variant={isMobile ? "h6" : "h5"}
          color="primary"
          sx={{ mt: 2 }}
        >
          Подключаемся к волшебному домику...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: isMobile ? 2 : 3,
        background: "linear-gradient(135deg, #e0f7fa 0%, #bbdefb 100%)",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "200px",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Единый компонент статуса с кнопками управления */}
      <ConnectionStatus showControls={true} />

      {/* Состояние когда устройство не подключено и нет сохраненного устройства */}
      {!device &&
        connectionStatus === "disconnected" &&
        !localStorage.getItem("lastConnectedDevice") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              sx={{
                p: isMobile ? 3 : 4,
                textAlign: "center",
                mt: 2,
                background: "rgba(255,255,255,0.92)",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: -50,
                  right: -50,
                  width: 150,
                  height: 150,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, #81d4fa 0%, transparent 70%)",
                  opacity: 0.5,
                }}
              />

              <Box
                sx={{
                  width: isMobile ? 150 : 220,
                  height: isMobile ? 150 : 220,
                  mx: "auto",
                  mb: 2,
                  position: "relative",
                }}
              >
                <HouseIcon size={isMobile ? 150 : 220} />
              </Box>

              <Typography
                variant={isMobile ? "h4" : "h3"}
                sx={{
                  mb: 1,
                  color: "#0288d1",
                  fontWeight: 700,
                  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                Добро пожаловать в Волшебный Домик!
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  fontSize: isMobile ? "1rem" : "1.2rem",
                  color: "#546e7a",
                  mb: 3,
                  px: 2,
                }}
              >
                Это интерактивный деревянный домик с управлением освещением
                через Bluetooth. Нажмите кнопку ниже, чтобы найти и подключиться
                к вашему домику.
              </Typography>

              <Alert severity="info" sx={{ mb: 3, borderRadius: "12px" }}>
                <Typography variant="body2" fontWeight="medium">
                  Убедитесь, что ваш домик включен и находится рядом с
                  устройством
                </Typography>
              </Alert>
            </Paper>
          </motion.div>
        )}

      {/* Управление комнатами (отображается только при подключенном устройстве) */}
      {device && connectionStatus === "connected" && (
        <Grid
          container
          spacing={isMobile ? 2 : 3}
          sx={{ mt: isMobile ? 1 : 2 }}
        >
          {rooms.map((room) => (
            <Grid item xs={6} sm={3} key={room.id}>
              <RoomControl
                room={room}
                disabled={connectionStatus !== "connected"}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Состояние ошибки с предложением переподключиться */}
      {connectionStatus === "error" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            sx={{
              p: 3,
              textAlign: "center",
              mt: 3,
              background: "rgba(255, 235, 235, 0.9)",
              border: "1px solid #ffcdd2",
            }}
          >
            <WarningIcon sx={{ fontSize: 48, color: "#f44336", mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 1, color: "#d32f2f" }}>
              Возникла проблема с подключением
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: "#546e7a" }}>
              {connectionError || "Не удалось установить соединение с домиком"}
            </Typography>
            <Typography
              variant="body2"
              sx={{ mb: 3, fontStyle: "italic", color: "#78909c" }}
            >
              Попробуйте перезагрузить домик и повторить попытку подключения
            </Typography>
          </Paper>
        </motion.div>
      )}

      {/* Parent access button - всегда виден */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          position: "fixed",
          bottom: isMobile ? 16 : 24,
          right: isMobile ? 16 : 24,
          zIndex: 1000,
        }}
      >
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Fab
            color="secondary"
            aria-label="parent zone"
            onClick={() => (window.location.href = "/parent-zone")}
            sx={{
              width: 64,
              height: 64,
              boxShadow: "0 4px 15px rgba(255, 152, 0, 0.4)",
              "&:hover": {
                boxShadow: "0 6px 20px rgba(255, 152, 0, 0.6)",
              },
            }}
          >
            <ParentIcon sx={{ fontSize: 32 }} />
          </Fab>
        </motion.div>
      </motion.div>
    </Box>
  );
}
