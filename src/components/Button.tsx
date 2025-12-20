import Button from "@mui/material/Button";

export interface PrimaryButtonProps {
  type?: "submit" | "button" | "reset";
  label: string;
  onClick?: () => void;
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
  component?: React.ElementType;
  href?: string;
  target?: "_blank" | "_self" | "_top" | "_parent";
  blank?: boolean
}

export default function PrimaryButton({
  type = "button",
  label = "Button",
  onClick = () => {},
  disabled = false,
  variant = "contained",
  color = "primary",
  fullWidth = false,
  loading = false,
  Icon,
  href,
  blank,
  target
}: PrimaryButtonProps) {
  return (
    <Button
      href={href}
      target={blank ? "_blank" : target}
      rel={blank ? "noopener noreferrer" : undefined}
      size="small"
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
