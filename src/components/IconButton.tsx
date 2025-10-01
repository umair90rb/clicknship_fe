import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import Badge, { badgeClasses } from "@mui/material/Badge";
import Icon from "@mui/material/Icon";

const CustomBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -12px;
    right: -6px;
  }
`;

interface IconButtonProps {
  icon: string;
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
  icon,
  type = "button",
  size = "medium",
  onClick = () => {},
  tooltip,
  disabled = false,
  color = "primary",
  loading = false,
  badge,
}: IconButtonProps) {
  return (
    <Tooltip title={tooltip}>
      <IconButton
        disabled={disabled}
        type={type}
        color={color}
        onClick={onClick}
        size={size}
        loading={loading}
      >
        <Icon fontSize={size}>{icon}</Icon>
        {badge && (
          <CustomBadge
            badgeContent={badge}
            color="primary"
            overlap="circular"
          />
        )}
      </IconButton>
    </Tooltip>
  );
}
