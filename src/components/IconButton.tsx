import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Badge from "@mui/material/Badge";

export interface CustomIconButtonProps {
  Icon: any;
  onClick: () => void;
  type?: "submit" | "button" | "reset";
  size?: "small" | "medium" | "large";
  tooltip?: string;
  disabled?: boolean;
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
  loading?: boolean;
  badge?: number;
}

export default function CustomIconButton({
  Icon,
  type = "button",
  size = "medium",
  onClick = () => {},
  tooltip,
  disabled = false,
  color = "primary",
  loading = false,
  badge,
  ...props
}: CustomIconButtonProps) {
  return (
    <Tooltip title={tooltip}>
      <IconButton
        disabled={disabled}
        type={type}
        color={color}
        onClick={onClick}
        size={size}
        loading={loading}
        {...props}
      >
        {badge ? (
          <Badge badgeContent={badge} color="error">
            <Icon fontSize={size} />
          </Badge>
        ) : (
          <Icon fontSize={size} />
        )}
      </IconButton>
    </Tooltip>
  );
}
