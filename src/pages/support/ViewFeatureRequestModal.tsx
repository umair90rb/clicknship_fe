import CustomDialog from "@/components/Dialog";
import { useGetFeatureRequestQuery } from "@/api/support";
import {
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { FeatureRequestStatus, type Attachment } from "@/types/support";
import dayjs from "dayjs";
import AttachFileIcon from "@mui/icons-material/AttachFile";

const statusColors: Record<
  FeatureRequestStatus,
  "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"
> = {
  submitted: "info",
  under_review: "primary",
  planned: "secondary",
  in_development: "warning",
  completed: "success",
  rejected: "error",
};

const statusLabels: Record<FeatureRequestStatus, string> = {
  submitted: "Submitted",
  under_review: "Under Review",
  planned: "Planned",
  in_development: "In Development",
  completed: "Completed",
  rejected: "Rejected",
};

interface ViewFeatureRequestModalProps {
  open: boolean;
  setOpen: (state: boolean) => void;
  requestId: string | null;
}

function AttachmentsList({ attachments }: { attachments: Attachment[] }) {
  if (!attachments || attachments.length === 0) return null;

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Attachments
      </Typography>
      <List dense>
        {attachments.map((attachment) => (
          <ListItem key={attachment.id}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <AttachFileIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={attachment.fileName}
              secondary={`${(attachment.fileSize / 1024).toFixed(1)} KB`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default function ViewFeatureRequestModal({
  open,
  setOpen,
  requestId,
}: ViewFeatureRequestModalProps) {
  const { data, isLoading } = useGetFeatureRequestQuery(requestId!, {
    skip: !requestId,
  });

  const featureRequest = data?.data;

  return (
    <CustomDialog
      open={open}
      setOpen={setOpen}
      title="Feature Request Details"
      loading={isLoading}
      size="md"
      hideCancelButton
    >
      {featureRequest && (
        <Box>
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <Chip
              label={statusLabels[featureRequest.status]}
              color={statusColors[featureRequest.status]}
              size="small"
            />
          </Box>

          <Typography variant="h6" gutterBottom>
            {featureRequest.title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ whiteSpace: "pre-wrap", mb: 2 }}
          >
            {featureRequest.description}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Submitted
              </Typography>
              <Typography variant="body2">
                {dayjs(featureRequest.createdAt).format("MMM D, YYYY h:mm A")}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Last Updated
              </Typography>
              <Typography variant="body2">
                {dayjs(featureRequest.updatedAt).format("MMM D, YYYY h:mm A")}
              </Typography>
            </Box>
          </Box>

          <AttachmentsList attachments={featureRequest.attachments} />
        </Box>
      )}
    </CustomDialog>
  );
}
