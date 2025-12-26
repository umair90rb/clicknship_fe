import CustomDialog from "@/components/Dialog";
import { useGetSupportCaseQuery } from "@/api/support";
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
import {
  SupportCaseStatus,
  SupportCasePriority,
  type Attachment,
} from "@/types/support";
import dayjs from "dayjs";
import AttachFileIcon from "@mui/icons-material/AttachFile";

const statusColors: Record<
  SupportCaseStatus,
  "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"
> = {
  open: "info",
  in_progress: "primary",
  pending_info: "warning",
  resolved: "success",
  closed: "default",
};

const statusLabels: Record<SupportCaseStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  pending_info: "Pending Info",
  resolved: "Resolved",
  closed: "Closed",
};

const priorityColors: Record<
  SupportCasePriority,
  "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"
> = {
  low: "default",
  medium: "info",
  high: "warning",
  critical: "error",
};

const priorityLabels: Record<SupportCasePriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

interface ViewSupportCaseModalProps {
  open: boolean;
  setOpen: (state: boolean) => void;
  caseId: string | null;
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

export default function ViewSupportCaseModal({
  open,
  setOpen,
  caseId,
}: ViewSupportCaseModalProps) {
  const { data, isLoading } = useGetSupportCaseQuery(caseId!, {
    skip: !caseId,
  });

  const supportCase = data?.data;

  return (
    <CustomDialog
      open={open}
      setOpen={setOpen}
      title="Support Case Details"
      loading={isLoading}
      size="md"
      hideCancelButton
    >
      {supportCase && (
        <Box>
          <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
            <Chip
              label={statusLabels[supportCase.status]}
              color={statusColors[supportCase.status]}
              size="small"
            />
            <Chip
              label={priorityLabels[supportCase.priority]}
              color={priorityColors[supportCase.priority]}
              size="small"
              variant="outlined"
            />
          </Box>

          <Typography variant="h6" gutterBottom>
            {supportCase.title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ whiteSpace: "pre-wrap", mb: 2 }}
          >
            {supportCase.description}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Created
              </Typography>
              <Typography variant="body2">
                {dayjs(supportCase.createdAt).format("MMM D, YYYY h:mm A")}
              </Typography>
            </Box>
            {supportCase.resolvedAt && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Resolved
                </Typography>
                <Typography variant="body2">
                  {dayjs(supportCase.resolvedAt).format("MMM D, YYYY h:mm A")}
                </Typography>
              </Box>
            )}
          </Box>

          <AttachmentsList attachments={supportCase.attachments} />
        </Box>
      )}
    </CustomDialog>
  );
}
