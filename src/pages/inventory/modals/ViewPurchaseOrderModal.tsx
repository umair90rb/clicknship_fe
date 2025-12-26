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
import type { PurchaseOrder } from "@/types/inventory";
import { PurchaseOrderStatus } from "@/types/inventory";
import { formatCurrency, formatDate } from "../utils";

interface ViewPurchaseOrderModalProps {
  open: boolean;
  setOpen: (state: boolean) => void;
  purchaseOrder: PurchaseOrder | null;
}

const statusColors: Record<string, "default" | "primary" | "warning" | "success" | "error"> = {
  [PurchaseOrderStatus.DRAFT]: "default",
  [PurchaseOrderStatus.ORDERED]: "primary",
  [PurchaseOrderStatus.PARTIAL]: "warning",
  [PurchaseOrderStatus.RECEIVED]: "success",
  [PurchaseOrderStatus.CANCELLED]: "error",
};

const statusLabels: Record<string, string> = {
  [PurchaseOrderStatus.DRAFT]: "Draft",
  [PurchaseOrderStatus.ORDERED]: "Ordered",
  [PurchaseOrderStatus.PARTIAL]: "Partially Received",
  [PurchaseOrderStatus.RECEIVED]: "Received",
  [PurchaseOrderStatus.CANCELLED]: "Cancelled",
};

export default function ViewPurchaseOrderModal({
  open,
  setOpen,
  purchaseOrder,
}: ViewPurchaseOrderModalProps) {
  if (!purchaseOrder) return null;

  const totalAmount =
    purchaseOrder.items?.reduce(
      (sum, item) => sum + item.orderedQuantity * item.unitCost,
      0
    ) || purchaseOrder.totalAmount || 0;

  return (
    <CustomDialog
      open={open}
      setOpen={setOpen}
      title={`Purchase Order: ${purchaseOrder.poNumber}`}
      hideCancelButton
      size="lg"
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Typography variant="caption" color="text.secondary">
            Status
          </Typography>
          <Box>
            <Chip
              size="small"
              color={statusColors[purchaseOrder.status] || "default"}
              label={statusLabels[purchaseOrder.status] || purchaseOrder.status}
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Typography variant="caption" color="text.secondary">
            Supplier
          </Typography>
          <Typography variant="body1">
            {purchaseOrder.supplier?.name || "-"}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Typography variant="caption" color="text.secondary">
            Order Date
          </Typography>
          <Typography variant="body1">
            {formatDate(purchaseOrder.orderDate)}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Typography variant="caption" color="text.secondary">
            Expected Date
          </Typography>
          <Typography variant="body1">
            {formatDate(purchaseOrder.expectedDate)}
          </Typography>
        </Grid>

        {purchaseOrder.receivedDate && (
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="caption" color="text.secondary">
              Received Date
            </Typography>
            <Typography variant="body1">
              {formatDate(purchaseOrder.receivedDate)}
            </Typography>
          </Grid>
        )}

        {purchaseOrder.notes && (
          <Grid size={{ xs: 12 }}>
            <Typography variant="caption" color="text.secondary">
              Notes
            </Typography>
            <Typography variant="body1">{purchaseOrder.notes}</Typography>
          </Grid>
        )}

        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
            Line Items
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell align="right">Ordered</TableCell>
                  <TableCell align="right">Received</TableCell>
                  <TableCell align="right">Unit Cost</TableCell>
                  <TableCell align="right">Line Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {purchaseOrder.items?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.product?.name || "-"}</TableCell>
                    <TableCell>{item.product?.sku || "-"}</TableCell>
                    <TableCell>{item.location?.name || "Default"}</TableCell>
                    <TableCell align="right">{item.orderedQuantity}</TableCell>
                    <TableCell align="right">
                      <Chip
                        size="small"
                        color={
                          item.receivedQuantity >= item.orderedQuantity
                            ? "success"
                            : item.receivedQuantity > 0
                            ? "warning"
                            : "default"
                        }
                        label={item.receivedQuantity}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(item.unitCost)}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(item.orderedQuantity * item.unitCost)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={5} />
                  <TableCell align="right">
                    <Typography fontWeight="bold">Total:</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontWeight="bold">
                      {formatCurrency(totalAmount)}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </CustomDialog>
  );
}
