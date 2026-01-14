import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import TimerIcon from "@mui/icons-material/Timer";
import SettingsIcon from "@mui/icons-material/Settings";
import UpdateIcon from "@mui/icons-material/SystemUpdate";
import HouseIcon from "@mui/icons-material/House";

export default function ParentZone({ onLock }) {
  const [timers, setTimers] = useState([
    { id: 1, room: "Гостиная", time: "21:00", enabled: true },
    { id: 2, room: "Спальня", time: "22:00", enabled: true },
  ]);
  const [autoOff, setAutoOff] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleLogout = () => {
    localStorage.removeItem("parentUnlocked");
    onLock();
    navigate("/");
  };

  const toggleTimer = (id) => {
    setTimers(
      timers.map((timer) =>
        timer.id === id ? { ...timer, enabled: !timer.enabled } : timer
      )
    );
  };

  return (
    <Box
      sx={{
        p: isMobile ? 2 : 3,
        background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          sx={{ fontWeight: 700, color: "#1b5e20" }}
        >
          Настройки домика
        </Typography>

        <IconButton
          color="error"
          onClick={handleLogout}
          sx={{
            width: 48,
            height: 48,
            boxShadow: "0 2px 10px rgba(244, 67, 54, 0.3)",
          }}
        >
          <LogoutIcon sx={{ fontSize: 32 }} />
        </IconButton>
      </Box>

      {/* Auto-off settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                Автоотключение
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Выключать свет через 2 часа
              </Typography>
            </Box>
            <Switch
              checked={autoOff}
              onChange={(e) => setAutoOff(e.target.checked)}
              color="success"
            />
          </Box>
        </Paper>
      </motion.div>

      {/* Timers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Paper sx={{ mb: 3 }}>
          <Box
            sx={{
              p: 2,
              borderBottom: "1px solid",
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
            }}
          >
            <TimerIcon sx={{ mr: 1, color: "#388e3c" }} />
            <Typography variant="subtitle1" fontWeight="bold">
              Таймеры отключения
            </Typography>
          </Box>

          <List>
            {timers.map((timer) => (
              <ListItem
                key={timer.id}
                secondaryAction={
                  <Switch
                    edge="end"
                    checked={timer.enabled}
                    onChange={() => toggleTimer(timer.id)}
                    color="success"
                  />
                }
                sx={{ py: 1.5 }}
              >
                <ListItemText
                  primary={
                    <Typography variant="body1" fontWeight="medium">
                      {timer.room}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      Отключение в {timer.time}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </motion.div>

      {/* Advanced settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Paper sx={{ mb: 3 }}>
          <Box
            sx={{
              p: 2,
              borderBottom: "1px solid",
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
            }}
          >
            <SettingsIcon sx={{ mr: 1, color: "#388e3c" }} />
            <Typography variant="subtitle1" fontWeight="bold">
              Дополнительные настройки
            </Typography>
          </Box>

          <List>
            <ListItem button sx={{ py: 1.5 }}>
              <ListItemText
                primary="Добавить новый домик"
                secondary="Подключить дополнительные устройства"
              />
            </ListItem>
            <ListItem button sx={{ py: 1.5 }}>
              <ListItemText
                primary="Обновить прошивку"
                secondary="Установить последнюю версию"
              />
              <ListItemSecondaryAction>
                <UpdateIcon color="primary" />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem button sx={{ py: 1.5 }}>
              <ListItemText
                primary="Калибровка датчиков"
                secondary="Настроить чувствительность"
              />
            </ListItem>
          </List>
        </Paper>
      </motion.div>

      {/* House status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                backgroundColor: "#c8e6c9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 2,
              }}
            >
              <HouseIcon sx={{ color: "#2e7d32", fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                Волшебный Домик
              </Typography>
              <Typography
                variant="body2"
                color="success.main"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "success.main",
                    mr: 1,
                  }}
                />
                Онлайн
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 2,
              p: 1.5,
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              borderRadius: "12px",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Последнее подключение:
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              Сегодня, 19:45
            </Typography>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
}
