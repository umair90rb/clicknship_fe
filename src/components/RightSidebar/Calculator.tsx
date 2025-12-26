import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  useTheme,
} from "@mui/material";
import { evaluate } from "mathjs";
import HistoryIcon from "@mui/icons-material/History";

const keys = [
  ["AC", "+/-", "%", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "−"],
  ["1", "2", "3", "+"],
  ["0", ".", "="],
];

const operatorMap = {
  "÷": "/",
  "×": "*",
  "−": "-",
};

export default function Calculator() {
  const theme = useTheme();

  const [input, setInput] = useState("");
  const [result, setResult] = useState("0");
  const [history, setHistory] = useState([]);

  // ---------- Logic ----------
  const calculate = () => {
    try {
      const expr = input.replace(/[÷×−]/g, (m) => operatorMap[m]);
      const res = evaluate(expr);
      setResult(String(res));
      setHistory((prev) => [{ expr: input, res }, ...prev]);
      setInput(String(res));
    } catch {
      setResult("Error");
    }
  };

  const handleKey = (key) => {
    if (key === "AC") {
      setInput("");
      setResult("0");
      return;
    }
    if (key === "=") {
      calculate();
      return;
    }
    if (key === "+/-") {
      setInput((prev) =>
        prev.startsWith("-") ? prev.slice(1) : `-${prev}`
      );
      return;
    }
    if (key === "%") {
      setInput((prev) => String(Number(prev) / 100));
      return;
    }
    setInput((prev) => prev + key);
  };

  // ---------- Keyboard support ----------
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Enter") return handleKey("=");
      if (e.key === "Backspace")
        return setInput((prev) => prev.slice(0, -1));
      if (/[\d.+\-*/]/.test(e.key))
        setInput((prev) => prev + e.key);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ---------- UI ----------
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(180deg,#2b2b2b,#1c1c1c)"
            : "#f5f5f5",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      {/* HISTORY */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 2,
          py: 1,
          opacity: 0.8,
        }}
      >
        <Typography variant="caption">
          <HistoryIcon fontSize="inherit" /> History
        </Typography>

        {history.map((h, i) => (
          <Typography key={i} variant="body2" sx={{ mt: 1 }}>
            {h.expr} = <b>{h.res}</b>
          </Typography>
        ))}
      </Box>

      {/* DISPLAY */}
      <Box sx={{ px: 2, pb: 1 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="right"
        >
          {input}
        </Typography>
        <Typography variant="h3" textAlign="right">
          {result}
        </Typography>
      </Box>

      {/* KEYPAD */}
      <Box sx={{ p: 1 }}>
        {keys.map((row, i) => (
          <Box key={i} sx={{ display: "flex", gap: 1, mb: 1 }}>
            {row.map((key) => {
              const isOperator = ["+", "−", "×", "÷", "="].includes(key);
              return (
                <Button
                  key={key}
                  onClick={() => handleKey(key)}
                  sx={{
                    flex: key === "0" ? 2 : 1,
                    height: 52,
                    borderRadius: "50%",
                    fontSize: 18,
                    bgcolor: isOperator
                      ? "#f2994a"
                      : theme.palette.mode === "dark"
                      ? "#4b4b4b"
                      : "#e0e0e0",
                    color: isOperator ? "#fff" : "text.primary",
                    "&:hover": {
                      bgcolor: isOperator
                        ? "#f5a75a"
                        : theme.palette.mode === "dark"
                        ? "#5a5a5a"
                        : "#d5d5d5",
                    },
                  }}
                >
                  {key}
                </Button>
              );
            })}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
