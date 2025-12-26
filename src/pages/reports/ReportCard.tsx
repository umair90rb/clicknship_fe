import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import type { SvgIconComponent } from "@mui/icons-material";

interface ReportCardProps {
  title: string;
  description: string;
  Icon: SvgIconComponent;
  onClick: () => void;
}

export default function ReportCard({
  title,
  description,
  Icon,
  onClick,
}: ReportCardProps) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardActionArea onClick={onClick} sx={{ height: "100%" }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
            <Icon color="primary" />
            <Typography variant="subtitle1" fontWeight={600}>
              {title}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
