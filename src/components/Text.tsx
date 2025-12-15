import type { Theme } from "@emotion/react";
import type { SxProps } from "@mui/material";
import Typography from "@mui/material/Typography";
import type { ElementType, PropsWithChildren } from "react";

interface TextProps {
  text?: string | number;
  variant?:
    | "body1"
    | "body2"
    | "button"
    | "caption"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "inherit"
    | "overline"
    | "subtitle1"
    | "subtitle2";
  textAlign?: "center" | "start" | "end";
  color?:
    | "success"
    | "error"
    | "info"
    | "primary"
    | "secondary"
    | "warning"
    | "textDisabled"
    | "textPrimary"
    | "textSecondary"
    | "";
  bold?: boolean;
  sx?: SxProps<Theme>
  component?: ElementType;
}

export default function Text({
  text,
  variant = "body1",
  textAlign = "start",
  color = "",
  bold = undefined,
  children,
  sx = {},
  component = "p"
}: PropsWithChildren<TextProps>) {
  return (
    <Typography
      fontWeight={bold ? "bold" : undefined}
      component={component}
      color={color}
      variant={variant}
      sx={{ textAlign, ...sx }}
    >
      {text || children}
    </Typography>
  );
}
