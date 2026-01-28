import { useState } from "react";
import { Box, Button, Popover, Grid, Typography, Slider } from "@mui/material";
import { motion } from "framer-motion";
import PaletteIcon from "@mui/icons-material/Palette";

const PRESET_COLORS = [
  { name: "Белый", value: "#FFFFFF", rgb: { r: 255, g: 255, b: 255 } },
  { name: "Теплый", value: "#FFB74D", rgb: { r: 255, g: 183, b: 77 } },
  { name: "Красный", value: "#F44336", rgb: { r: 244, g: 67, b: 54 } },
  { name: "Зеленый", value: "#4CAF50", rgb: { r: 76, g: 175, b: 80 } },
  { name: "Синий", value: "#2196F3", rgb: { r: 33, g: 150, b: 243 } },
  { name: "Желтый", value: "#FFEB3B", rgb: { r: 255, g: 235, b: 59 } },
  { name: "Фиолетовый", value: "#9C27B0", rgb: { r: 156, g: 39, b: 176 } },
  { name: "Розовый", value: "#E91E63", rgb: { r: 233, g: 30, b: 99 } },
  { name: "Бирюзовый", value: "#00BCD4", rgb: { r: 0, g: 188, b: 212 } },
  { name: "Оранжевый", value: "#FF9800", rgb: { r: 255, g: 152, b: 0 } },
  { name: "Выкл", value: "#000000", rgb: { r: 0, g: 0, b: 0 } },
];

export default function ColorPicker({ room, onColorChange, disabled }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [customColor, setCustomColor] = useState({ r: 127, g: 127, b: 127 });
  const [brightness, setBrightness] = useState(50);

  const handleClick = (event) => {
    if (!disabled) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePresetColor = (color) => {
    onColorChange(color.rgb);
    handleClose();
  };

  const handleCustomColor = () => {
    const adjustedColor = {
      r: Math.round(customColor.r * (brightness / 100)),
      g: Math.round(customColor.g * (brightness / 100)),
      b: Math.round(customColor.b * (brightness / 100)),
    };
    onColorChange(adjustedColor);
    handleClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? `color-picker-${room.id}` : undefined;

  return (
    <>
      <motion.div
        whileHover={{ scale: disabled ? 1 : 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="contained"
          startIcon={<PaletteIcon />}
          onClick={handleClick}
          disabled={disabled}
          sx={{
            borderRadius: "20px",
            textTransform: "none",
            px: 2,
            py: 1,
            backgroundColor: "#0288d1",
            "&:hover": {
              backgroundColor: "#0277bd",
            },
          }}
        >
          Цвет
        </Button>
      </motion.div>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        sx={{
          "& .MuiPopover-paper": {
            borderRadius: "20px",
            p: 2,
            maxWidth: "320px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          },
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
          Выберите цвет для {room.name}
        </Typography>

        {/* Пресетные цвета */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: "#546e7a" }}>
            Быстрый выбор:
          </Typography>
          <Grid container spacing={1}>
            {PRESET_COLORS.map((color) => (
              <Grid item xs={3} key={color.name}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => handlePresetColor(color)}
                    sx={{
                      width: "100%",
                      height: 40,
                      backgroundColor: color.value,
                      borderRadius: "10px",
                      "&:hover": {
                        backgroundColor: color.value,
                        opacity: 0.9,
                      },
                      border:
                        color.name === "Выкл" ? "2px solid #bdbdbd" : "none",
                    }}
                    title={color.name}
                  />
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Настройка своего цвета */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: "#546e7a" }}>
            Свой цвет:
          </Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: "12px",
                backgroundColor: `rgb(${customColor.r}, ${customColor.g}, ${customColor.b})`,
                border: "2px solid #e0e0e0",
              }}
            />
            <Box sx={{ flex: 1 }}>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <Typography
                    variant="caption"
                    sx={{ display: "block", textAlign: "center" }}
                  >
                    R
                  </Typography>
                  <Slider
                    size="small"
                    value={customColor.r}
                    onChange={(e, val) =>
                      setCustomColor({ ...customColor, r: val })
                    }
                    min={0}
                    max={255}
                    sx={{ color: "#f44336" }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Typography
                    variant="caption"
                    sx={{ display: "block", textAlign: "center" }}
                  >
                    G
                  </Typography>
                  <Slider
                    size="small"
                    value={customColor.g}
                    onChange={(e, val) =>
                      setCustomColor({ ...customColor, g: val })
                    }
                    min={0}
                    max={255}
                    sx={{ color: "#4caf50" }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Typography
                    variant="caption"
                    sx={{ display: "block", textAlign: "center" }}
                  >
                    B
                  </Typography>
                  <Slider
                    size="small"
                    value={customColor.b}
                    onChange={(e, val) =>
                      setCustomColor({ ...customColor, b: val })
                    }
                    min={0}
                    max={255}
                    sx={{ color: "#2196f3" }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>

        {/* Яркость */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: "#546e7a" }}>
            Яркость: {brightness}%
          </Typography>
          <Slider
            value={brightness}
            onChange={(e, val) => setBrightness(val)}
            min={10}
            max={100}
            sx={{ color: "#ff9800" }}
          />
        </Box>

        {/* Кнопки */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{ flex: 1, borderRadius: "12px" }}
          >
            Отмена
          </Button>
          <Button
            variant="contained"
            onClick={handleCustomColor}
            sx={{
              flex: 1,
              borderRadius: "12px",
              backgroundColor: `rgb(${customColor.r}, ${customColor.g}, ${customColor.b})`,
              "&:hover": {
                backgroundColor: `rgb(${Math.min(customColor.r + 20, 255)}, ${Math.min(customColor.g + 20, 255)}, ${Math.min(customColor.b + 20, 255)})`,
              },
            }}
          >
            Применить
          </Button>
        </Box>
      </Popover>
    </>
  );
}
