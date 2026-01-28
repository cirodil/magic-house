import { useState, useCallback } from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import { motion } from "framer-motion";
import { useBle } from "../contexts/BleContext";
import ColorPicker from "./ColorPicker";

export default function RoomControl({ room, disabled }) {
  const [color, setColor] = useState({ r: 127, g: 127, b: 127 });
  const [isOn, setIsOn] = useState(false);
  const { updateColor } = useBle();

  const handleColorChange = useCallback(
    async (newColor) => {
      const oldColor = color;
      setColor(newColor);
      setIsOn(newColor.r > 0 || newColor.g > 0 || newColor.b > 0);

      try {
        await updateColor(room.id, newColor);
      } catch (error) {
        console.error("Color update failed:", error);
        setColor(oldColor);
        setIsOn(oldColor.r > 0 || oldColor.g > 0 || oldColor.b > 0);
      }
    },
    [color, room.id, updateColor],
  );

  const handleToggle = useCallback(async () => {
    const newState = !isOn;
    const newColor = newState
      ? { r: 255, g: 255, b: 255 }
      : { r: 0, g: 0, b: 0 };

    const oldColor = color;
    const oldState = isOn;

    setColor(newColor);
    setIsOn(newState);

    try {
      if (newState) {
        // Включаем с белым цветом
        await updateColor(room.id, newColor);
      } else {
        // Выключаем
        await updateColor(room.id, newColor);
      }
    } catch (error) {
      console.error("Toggle failed:", error);
      setColor(oldColor);
      setIsOn(oldState);
    }
  }, [isOn, color, room.id, updateColor]);

  const containerVariants = {
    hover: {
      scale: 1.03,
      transition: { duration: 0.3 },
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 },
    },
  };

  const rgbColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
  const glowEffect = {
    boxShadow: isOn
      ? `0 0 20px ${rgbColor}, inset 0 0 15px ${rgbColor}40`
      : "0 4px 10px rgba(0,0,0,0.1)",
  };

  return (
    <motion.div
      variants={containerVariants}
      whileHover={disabled ? {} : "hover"}
      whileTap={disabled ? {} : "tap"}
      style={{ height: "100%" }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 2,
          height: "100%",
          background: isOn
            ? `linear-gradient(135deg, ${rgbColor}20 0%, ${rgbColor}10 100%)`
            : "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          transition: "all 0.4s ease",
          cursor: disabled ? "not-allowed" : "pointer",
          position: "relative",
          overflow: "hidden",
          ...glowEffect,
        }}
      >
        {/* Light beam effect */}
        {isOn && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "30%",
              background: `linear-gradient(to bottom, ${rgbColor}80, transparent)`,
              pointerEvents: "none",
            }}
          />
        )}

        <Box sx={{ textAlign: "center", mb: 1 }}>
          <Box
            sx={{
              fontSize: "2.5rem",
              mb: 1,
              filter: isOn ? "drop-shadow(0 0 10px white)" : "none",
              opacity: isOn ? 1 : 0.5,
            }}
          >
            {room.icon}
          </Box>

          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{
              color: isOn ? "#0288d1" : "#546e7a",
              textShadow: isOn ? "0 0 5px rgba(255,255,255,0.7)" : "none",
            }}
          >
            {room.name}
          </Typography>
        </Box>

        {/* Color indicator */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              backgroundColor: rgbColor,
              border: `2px solid ${isOn ? rgbColor : "#90a4ae"}`,
              boxShadow: isOn ? `0 0 15px ${rgbColor}` : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
            }}
          >
            {isOn ? "✨" : "○"}
          </Box>
        </Box>

        {/* Controls */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <ColorPicker
            room={room}
            onColorChange={handleColorChange}
            disabled={disabled}
          />

          <Button
            variant={isOn ? "contained" : "outlined"}
            color={isOn ? "success" : "primary"}
            onClick={handleToggle}
            disabled={disabled}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              py: 1,
            }}
          >
            {isOn ? "Выключить" : "Включить"}
          </Button>
        </Box>

        {/* Status indicator */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 1,
            opacity: 0.8,
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: isOn ? "#4caf50" : "#bdbdbd",
              animation: isOn ? "pulse 2s infinite" : "none",
            }}
          />
        </Box>
      </Paper>
    </motion.div>
  );
}
