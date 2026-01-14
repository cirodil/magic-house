import { useState } from "react";
import { Box, Typography, Slider, Paper, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { useBle } from "../contexts/BleContext";
import LightIcon from "@mui/icons-material/WbSunny";

export default function RoomControl({ room, disabled }) {
  const [brightness, setBrightness] = useState(0);
  const [isTouched, setIsTouched] = useState(false);
  const { updateLight } = useBle();
  const theme = useTheme();

  const handleChange = async (event, newValue) => {
    setBrightness(newValue);
    try {
      await updateLight(room.id, newValue);
    } catch (error) {
      console.error("Light update failed:", error);
      setBrightness(0); // Reset on error
    }
  };

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

  const glowEffect = {
    boxShadow:
      brightness > 0
        ? `0 0 15px ${room.color}, inset 0 0 10px ${room.color}`
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
          background:
            brightness > 0
              ? `linear-gradient(135deg, ${room.color}20 0%, ${room.color}10 100%)`
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
        {brightness > 0 && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "30%",
              background: `linear-gradient(to bottom, ${room.color}80, transparent)`,
              pointerEvents: "none",
            }}
          />
        )}

        <Box sx={{ textAlign: "center", mb: 1 }}>
          <Box
            sx={{
              fontSize: "2.5rem",
              mb: 1,
              filter: brightness > 0 ? "drop-shadow(0 0 10px white)" : "none",
            }}
          >
            {room.icon}
          </Box>

          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{
              color: brightness > 0 ? "white" : "#0288d1",
              textShadow:
                brightness > 0 ? "0 0 5px rgba(255,255,255,0.7)" : "none",
            }}
          >
            {room.name}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: brightness > 0 ? "rgba(255,255,255,0.9)" : "#546e7a",
              mt: 0.5,
            }}
          >
            {brightness}% яркости
          </Typography>
        </Box>

        <Box sx={{ px: 1, mt: 1 }}>
          <Slider
            value={brightness}
            onChange={handleChange}
            min={0}
            max={100}
            disabled={disabled}
            size="small"
            track={false}
            sx={{
              color: room.color,
              "& .MuiSlider-thumb": {
                width: 20,
                height: 20,
                boxShadow:
                  brightness > 0
                    ? `0 0 8px ${room.color}`
                    : "0 2px 4px rgba(0,0,0,0.2)",
                "&:hover, &.Mui-focusVisible": {
                  boxShadow: `0 0 12px ${room.color}`,
                },
              },
              "& .MuiSlider-rail": {
                opacity: disabled ? 0.3 : 0.5,
                backgroundColor: disabled ? "#bdbdbd" : "#90a4ae",
              },
            }}
            aria-labelledby={`room-${room.id}-slider`}
            valueLabelDisplay="auto"
            onMouseDown={() => setIsTouched(true)}
            onTouchStart={() => setIsTouched(true)}
            onMouseUp={() => setIsTouched(false)}
            onTouchEnd={() => setIsTouched(false)}
          />
        </Box>

        {/* Light indicator */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 0.5,
            opacity: isTouched ? 0 : 1,
            transition: "opacity 0.3s",
          }}
        >
          <Box
            sx={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              backgroundColor: brightness > 0 ? room.color : "#e0e0e0",
              border: `2px solid ${brightness > 0 ? room.color : "#90a4ae"}`,
              boxShadow: brightness > 0 ? `0 0 10px ${room.color}` : "none",
            }}
          />
        </Box>
      </Paper>
    </motion.div>
  );
}
