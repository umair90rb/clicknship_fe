import Button from "@mui/material/Button";

interface PrimaryButtonProps {
  type?: "submit" | "button" | "reset";
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "contained" | "outlined" | "text";
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
  fullWidth?: boolean;
  loading?: boolean;
}

export default function PrimaryButton({
  type = "button",
  label = "Button",
  onClick = () => {},
  disabled = false,
  variant = "contained",
  color = "primary",
  fullWidth = true,
  loading = false,
}: PrimaryButtonProps) {
  return (
    <Button
      disabled={disabled || loading}
      type={type}
      fullWidth={fullWidth}
      variant={variant}
      color={color}
      onClick={onClick}
      loading={loading}
    >
      {label}
    </Button>
  );
}
