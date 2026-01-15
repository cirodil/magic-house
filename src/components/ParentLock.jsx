import { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { motion } from "framer-motion";
import StarIcon from "@mui/icons-material/Star";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

export default function ParentLock({ onSuccess }) {
  const [stage, setStage] = useState("swipe");
  const [answer, setAnswer] = useState("");
  const [swipeSequence, setSwipeSequence] = useState([]);
  const [isComplete, setIsComplete] = useState(false);

  // Генерация простой математической задачи
  const [problem] = useState(() => {
    const a = Math.floor(Math.random() * 5) + 1;
    const b = Math.floor(Math.random() * 5) + 1;
    return { a, b, answer: a + b };
  });

  const stars = [
    { id: 1, position: { top: "30%", left: "20%" } },
    { id: 2, position: { top: "50%", left: "70%" } },
    { id: 3, position: { top: "70%", left: "40%" } },
  ];

  const handleStarTouch = (id) => {
    if (!swipeSequence.includes(id)) {
      const newSequence = [...swipeSequence, id];
      setSwipeSequence(newSequence);

      if (newSequence.length === stars.length) {
        // Проверяем правильность последовательности
        const isCorrect = newSequence.join("") === "123";
        setIsComplete(true);

        if (isCorrect) {
          setTimeout(() => {
            setStage("math");
          }, 1000);
        } else {
          setTimeout(() => {
            setSwipeSequence([]);
            setIsComplete(false);
          }, 1500);
        }
      }
    }
  };

  const handleMathSubmit = (e) => {
    e.preventDefault();
    if (parseInt(answer) === problem.answer) {
      onSuccess();
    } else {
      setAnswer("");
      alert("Неправильно! Попробуй еще раз");
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        textAlign: "center",
        background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background dots */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle, rgba(76, 175, 80, 0.05) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          pointerEvents: "none",
        }}
      />

      <Typography
        variant="h5"
        sx={{
          mb: 3,
          color: "#2E7D32",
          fontWeight: 700,
          position: "relative",
          zIndex: 2,
        }}
      >
        Родительская зона
      </Typography>

      {stage === "swipe" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          style={{ position: "relative", zIndex: 2 }}
        >
          <Paper
            sx={{
              p: 3,
              mb: 4,
              background: "rgba(255, 255, 255, 0.9)",
              position: "relative",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, color: "#388e3c" }}>
              Проведи по звездочкам в правильном порядке
            </Typography>

            <Box
              sx={{
                position: "relative",
                height: 300,
                border: "2px dashed #81c784",
                borderRadius: "16px",
                mb: 3,
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                overflow: "hidden",
              }}
            >
              {stars.map((star) => (
                <motion.div
                  key={star.id}
                  initial={{ scale: 0.8, opacity: 0.7 }}
                  animate={{
                    scale: swipeSequence.includes(star.id) ? 1.2 : 1,
                    opacity: swipeSequence.includes(star.id) ? 1 : 0.7,
                    backgroundColor: swipeSequence.includes(star.id)
                      ? "#4caf50"
                      : "#ffeb3b",
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleStarTouch(star.id)}
                  style={{
                    position: "absolute",
                    top: star.position.top,
                    left: star.position.left,
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.8rem",
                    cursor: "pointer",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                    zIndex: swipeSequence.includes(star.id) ? 10 : 1,
                    transition: "all 0.3s ease",
                  }}
                >
                  <StarIcon
                    sx={{
                      color: swipeSequence.includes(star.id)
                        ? "white"
                        : "#f57f17",
                      fontSize: 36,
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: -5,
                      right: -5,
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      backgroundColor: "#2e7d32",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {star.id}
                  </Box>
                </motion.div>
              ))}

              {swipeSequence.length > 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 16,
                    left: 0,
                    right: 0,
                    display: "flex",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  {swipeSequence.map((id, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        backgroundColor: "#4caf50",
                        border: "2px solid white",
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>

            {isComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ mb: 2 }}
              >
                {swipeSequence.join("") === "123" ? (
                  <Box
                    sx={{
                      color: "#4caf50",
                      display: "flex",
                      justifyContent: "center",
                      mb: 2,
                    }}
                  >
                    <CheckIcon sx={{ fontSize: 48 }} />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      color: "#f44336",
                      display: "flex",
                      justifyContent: "center",
                      mb: 2,
                    }}
                  >
                    <CloseIcon sx={{ fontSize: 48 }} />
                  </Box>
                )}
              </motion.div>
            )}
          </Paper>
        </motion.div>
      )}

      {stage === "math" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          style={{ position: "relative", zIndex: 2 }}
        >
          <Paper
            sx={{
              p: 3,
              mb: 4,
              background: "rgba(255, 255, 255, 0.9)",
            }}
          >
            <Typography
              variant="h4"
              sx={{ mb: 3, color: "#2E7D32", fontWeight: 700 }}
            >
              {problem.a} + {problem.b} = ?
            </Typography>

            <Box component="form" onSubmit={handleMathSubmit} sx={{ mt: 3 }}>
              <TextField
                fullWidth
                variant="outlined"
                size="large"
                value={answer}
                onChange={(e) => setAnswer(e.target.value.replace(/\D/g, ""))}
                inputProps={{
                  style: { fontSize: "2rem", textAlign: "center" },
                  inputMode: "numeric",
                }}
                placeholder="0"
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "16px",
                  },
                  "& input": {
                    py: 2,
                    borderRadius: "12px",
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                color="success"
                fullWidth
                disabled={!answer}
                sx={{
                  py: 2,
                  fontSize: "1.3rem",
                  borderRadius: "16px",
                  height: 60,
                  boxShadow: "0 4px 15px rgba(76, 175, 80, 0.4)",
                  "&:hover": {
                    boxShadow: "0 6px 20px rgba(76, 175, 80, 0.6)",
                  },
                }}
              >
                Подтвердить
              </Button>
            </Box>
          </Paper>
        </motion.div>
      )}
    </Box>
  );
}
