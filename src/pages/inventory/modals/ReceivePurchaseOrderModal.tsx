import CustomDialog from "@/components/Dialog";
import {
  Alert,
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { getErrorMessage } from "@/utils";
import { useReceivePurchaseOrderMutation } from "@/api/inventory";
import type { PurchaseOrder, PurchaseOrderItem } from "@/types/inventory";

interface ReceivePurchaseOrderModalProps {
  open: boolean;
  setOpen: (state: boolean) => void;
  purchaseOrder: PurchaseOrder | null;
}

interface ReceiveQuantity {
  purchaseOrderItemId: number;
  receivedQuantity: number;
  maxQuantity: number;
}

export default function ReceivePurchaseOrderModal({
  open,
  setOpen,
  purchaseOrder,
}: ReceivePurchaseOrderModalProps) {
  const [receivePO, { isLoading }] = useReceivePurchaseOrderMutation();
  const [quantities, setQuantities] = useState<ReceiveQuantity[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && purchaseOrder?.items) {
      setQuantities(
        purchaseOrder.items.map((item: PurchaseOrderItem) => ({
          purchaseOrderItemId: item.id,
          receivedQuantity: item.orderedQuantity - item.receivedQuantity,
          maxQuantity: item.orderedQuantity - item.receivedQuantity,
        }))
      );
      setError(null);
    }
  }, [open, purchaseOrder]);

  const handleQuantityChange = (itemId: number, value: number) => {
    setQuantities((prev) =>
      prev.map((q) =>
        q.purchaseOrderItemId === itemId
          ? { ...q, receivedQuantity: Math.max(0, Math.min(value, q.maxQuantity)) }
          : q
      )
    );
  };

  const handleSubmit = async () => {
    if (!purchaseOrder) return;

    const itemsToReceive = quantities.filter((q) => q.receivedQuantity > 0);

    if (itemsToReceive.length === 0) {
      setError("Please enter at least one item quantity to receive");
      return;
    }

    try {
      await receivePO({
        id: purchaseOrder.id,
        body: {
          items: itemsToReceive.map((q) => ({
            purchaseOrderItemId: q.purchaseOrderItemId,
            receivedQuantity: q.receivedQuantity,
          })),
        },
      }).unwrap();
      setOpen(false);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (!purchaseOrder) return null;

  const hasItemsToReceive = purchaseOrder.items?.some(
    (item) => item.receivedQuantity < item.orderedQuantity
  );

  return (
    <CustomDialog
      open={open}
      setOpen={setOpen}
      title={`Receive Items: ${purchaseOrder.poNumber}`}
      actions={
        hasItemsToReceive
          ? [
              {
                label: "Receive Items",
                onClick: handleSubmit,
                loading: isLoading,
              },
            ]
          : []
      }
      size="lg"
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Alert severity="info">
            <Typography variant="body2">
              <strong>Supplier:</strong> {purchaseOrder.supplier?.name || "-"}
            </Typography>
          </Alert>
        </Grid>

        {!hasItemsToReceive && (
          <Grid size={{ xs: 12 }}>
            <Alert severity="success">
              All items have been fully received!
            </Alert>
          </Grid>
        )}

        <Grid size={{ xs: 12 }}>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell align="center">Ordered</TableCell>
                  <TableCell align="center">Previously Received</TableCell>
                  <TableCell align="center">Remaining</TableCell>
                  <TableCell align="center" width={150}>
                    Receive Now
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {purchaseOrder.items?.map((item) => {
                  const remaining = item.orderedQuantity - item.receivedQuantity;
                  const quantityState = quantities.find(
                    (q) => q.purchaseOrderItemId === item.id
                  );
                  return (
                    <TableRow key={item.id}>
                      <TableCell>{item.product?.name || "-"}</TableCell>
                      <TableCell>{item.product?.sku || "-"}</TableCell>
                      <TableCell>{item.location?.name || "Default"}</TableCell>
                      <TableCell align="center">{item.orderedQuantity}</TableCell>
                      <TableCell align="center">{item.receivedQuantity}</TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            color: remaining > 0 ? "warning.main" : "success.main",
                            fontWeight: "bold",
                          }}
                        >
                          {remaining}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        {remaining > 0 ? (
                          <TextField
                            type="number"
                            size="small"
                            value={quantityState?.receivedQuantity || 0}
                            onChange={(e) =>
                              handleQuantityChange(
                                item.id,
                                parseInt(e.target.value) || 0
                              )
                            }
                            inputProps={{
                              min: 0,
                              max: remaining,
                              style: { textAlign: "center" },
                            }}
                            sx={{ width: 100 }}
                          />
                        ) : (
                          <Typography color="success.main" variant="body2">
                            Complete
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {error && (
          <Grid size={{ xs: 12 }}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}
      </Grid>
    </CustomDialog>
  );
}
