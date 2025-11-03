import Button from "@mui/material/Button";

export interface PrimaryButtonProps {
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
  Icon?: any;
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
  Icon,
}: PrimaryButtonProps) {
  return (
    <Button
      startIcon={Icon && <Icon />}
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
