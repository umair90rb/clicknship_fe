import CustomDialog from "@/components/Dialog";
import {
  Box,
  Chip,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import type { StockTransfer } from "@/types/inventory";
import { TransferStatus } from "@/types/inventory";
import { formatDateTime } from "../utils";

interface ViewTransferModalProps {
  open: boolean;
  setOpen: (state: boolean) => void;
  transfer: StockTransfer | null;
}

const statusColors: Record<string, "default" | "primary" | "warning" | "success" | "error"> = {
  [TransferStatus.PENDING]: "default",
  [TransferStatus.IN_TRANSIT]: "warning",
  [TransferStatus.COMPLETED]: "success",
  [TransferStatus.CANCELLED]: "error",
};

const statusLabels: Record<string, string> = {
  [TransferStatus.PENDING]: "Pending",
  [TransferStatus.IN_TRANSIT]: "In Transit",
  [TransferStatus.COMPLETED]: "Completed",
  [TransferStatus.CANCELLED]: "Cancelled",
};

export default function ViewTransferModal({
  open,
  setOpen,
  transfer,
}: ViewTransferModalProps) {
  if (!transfer) return null;

  return (
    <CustomDialog
      open={open}
      setOpen={setOpen}
      title={`Stock Transfer: ${transfer.transferNumber}`}
      hideCancelButton
      size="md"
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="caption" color="text.secondary">
            Status
          </Typography>
          <Box>
            <Chip
              size="small"
              color={statusColors[transfer.status] || "default"}
              label={statusLabels[transfer.status] || transfer.status}
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="caption" color="text.secondary">
            Initiated
          </Typography>
          <Typography variant="body1">
            {formatDateTime(transfer.initiatedAt)}
          </Typography>
        </Grid>
        {transfer.completedAt && (
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="caption" color="text.secondary">
              Completed
            </Typography>
            <Typography variant="body1">
              {formatDateTime(transfer.completedAt)}
            </Typography>
          </Grid>
        )}

        <Grid size={{ xs: 12 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              py: 2,
              bgcolor: "grey.100",
              borderRadius: 1,
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="caption" color="text.secondary">
                From
              </Typography>
              <Typography variant="h6">
                {transfer.fromLocation?.name || "-"}
              </Typography>
            </Box>
            <ArrowForwardIcon sx={{ fontSize: 32, color: "primary.main" }} />
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="caption" color="text.secondary">
                To
              </Typography>
              <Typography variant="h6">
                {transfer.toLocation?.name || "-"}
              </Typography>
            </Box>
          </Box>
        </Grid>

        {transfer.notes && (
          <Grid size={{ xs: 12 }}>
            <Typography variant="caption" color="text.secondary">
              Notes
            </Typography>
            <Typography variant="body1">{transfer.notes}</Typography>
          </Grid>
        )}

        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
            Items
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transfer.items?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.product?.name || "-"}</TableCell>
                    <TableCell>{item.product?.sku || "-"}</TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </CustomDialog>
  );
}
