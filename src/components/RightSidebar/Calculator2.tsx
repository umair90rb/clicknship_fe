import React, { useEffect, useState } from "react";
import { Box, Button, Typography, IconButton, Divider } from "@mui/material";
import CalculateIcon from "@mui/icons-material/Calculate";
import { evaluate } from "mathjs";
import useTheme from "@/hooks/useTheme";
import PrimaryButton from "../Button";

const buttons = [
  ["AC", "±", "%", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "−"],
  ["1", "2", "3", "+"],
  ["00", "0", ".", "="],
];

export default function Calculator() {
  const { mode } = useTheme();
  const [expr, setExpr] = useState("");
  const [result, setResult] = useState("0");
  const [history, setHistory] = useState([]);

  const isDark = mode === "dark";

  const handleInput = (value) => {
    if (value === "AC") {
      setExpr("");
      setResult("0");
      return;
    }

    if (value === "=") {
      try {
        const res = evaluate(
          expr.replace("×", "*").replace("÷", "/").replace("−", "-")
        );
        setResult(res.toString());
        setHistory([{ expr, res }, ...history]);
        setExpr(res.toString());
      } catch {
        setResult("Error");
      }
      return;
    }

    if (value === "±") {
      setExpr(expr.startsWith("-") ? expr.slice(1) : "-" + expr);
      return;
    }

    if (value === "%") {
      setExpr((Number(expr) / 100).toString());
      return;
    }

    setExpr(expr + value);
  };

  /* 🎹 Keyboard support */
  useEffect(() => {
    const handler = (e) => {
      if (/[\d.+\-*/]/.test(e.key)) handleInput(e.key);
      if (e.key === "Enter") handleInput("=");
      if (e.key === "Backspace") setExpr(expr.slice(0, -1));
      if (e.key === "Escape") handleInput("AC");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [expr]);

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: isDark ? "#1c1c1e" : "#f5f5f7",
        color: isDark ? "#fff" : "#000",
        borderLeft: "1px solid",
        borderColor: isDark ? "#333" : "#ddd",
      }}
    >
      {/* History */}
      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        <Typography variant="caption" sx={{ opacity: 0.6 }}>
          History
        </Typography>
        {history.map((h, i) => (
          <Typography key={i} sx={{ fontSize: 13, opacity: 0.8 }}>
            {h.expr} = {h.res}
          </Typography>
        ))}
      </Box>

      <Divider />

      {/* Display */}
      <Box sx={{ p: 2, textAlign: "right" }}>
        <Typography sx={{ opacity: 0.5, fontSize: 14 }}>{expr}</Typography>
        <Typography sx={{ fontSize: 36, fontWeight: 500 }}>{result}</Typography>
      </Box>

      {/* Buttons */}
      <Box sx={{ p: 1 }}>
        {buttons.map((row, r) => (
          <Box key={r} sx={{ display: "flex", gap: 1, mb: 1 }}>
            {row.map((btn) => {
              const isOperator = ["+", "−", "×", "÷", "="].includes(btn);
              const isSpecial = ["AC", "±", "%"].includes(btn);

              return (
                <PrimaryButton
                  color={isOperator ? 'warning' : isSpecial ? 'primary' : 'inherit'}
                  label={btn}
                  key={btn}
                  onClick={() => handleInput(btn)}
                />
              );
            })}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
