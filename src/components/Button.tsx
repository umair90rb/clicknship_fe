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
}

export default function PrimaryButton({
  type = "button",
  label = "Button",
  onClick = () => {},
  disabled = false,
  variant = "contained",
  color = "inherit",
  fullWidth = true,
}: PrimaryButtonProps) {
  return (
    <Button
      disabled={disabled}
      type={type}
      fullWidth={fullWidth}
      variant={variant}
      color={color}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
