import CustomDialog from "@/components/Dialog";
import { Alert, Box, Grid, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { FormInputText } from "@/components/form/FormInput";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import FormRootError from "@/components/form/FormRootError";
import { getErrorMessage } from "@/utils";
import { useAdjustStockMutation } from "@/api/inventory";
import type { InventoryItem } from "@/types/inventory";
import { useEffect } from "react";
import { FormInputTextArea } from "@/components/form/FormTextArea";

interface StockAdjustmentModalProps {
  open: boolean;
  setOpen: (state: boolean) => void;
  item: InventoryItem | null;
}

const schema = Yup.object({
  quantity: Yup.number()
    .required("Adjustment quantity is required")
    .notOneOf([0], "Quantity cannot be 0"),
  reason: Yup.string().required("Reason is required"),
});

const defaultValues = {
  quantity: 0,
  reason: "",
};

export default function StockAdjustmentModal({
  open,
  setOpen,
  item,
}: StockAdjustmentModalProps) {
  const [adjustStock, { isLoading }] = useAdjustStockMutation();

  const {
    control,
    handleSubmit,
    setError,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const watchQuantity = watch("quantity");

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, reset]);

  const onSubmit = handleSubmit(async (data) => {
    if (!item) return;

    try {
      await adjustStock({
        productId: item.productId,
        quantity: data.quantity,
        reason: data.reason,
        locationId: item.locationId ?? undefined,
      }).unwrap();
      setOpen(false);
    } catch (error) {
      const message = getErrorMessage(error);
      setError("root", { message });
    }
  });

  const currentQty = item?.quantity || 0;
  const newQty = currentQty + (watchQuantity || 0);

  return (
    <CustomDialog
      open={open}
      setOpen={setOpen}
      title="Stock Adjustment"
      actions={[
        {
          label: "Apply Adjustment",
          onClick: onSubmit,
          loading: isLoading,
        },
      ]}
      size="sm"
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Alert severity="info">
            <Typography variant="body2">
              <strong>Product:</strong> {item?.product?.name} ({item?.product?.sku})
            </Typography>
            <Typography variant="body2">
              <strong>Location:</strong> {item?.location?.name || "Default"}
            </Typography>
          </Alert>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 1 }}>
            <Box sx={{ textAlign: "center", flex: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Current Qty
              </Typography>
              <Typography variant="h5">{currentQty}</Typography>
            </Box>
            <Typography variant="h4" color="text.secondary">
              {watchQuantity > 0 ? "+" : ""}
            </Typography>
            <Box sx={{ textAlign: "center", flex: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Adjustment
              </Typography>
              <Typography
                variant="h5"
                color={watchQuantity > 0 ? "success.main" : watchQuantity < 0 ? "error.main" : "text.primary"}
              >
                {watchQuantity || 0}
              </Typography>
            </Box>
            <Typography variant="h4" color="text.secondary">
              =
            </Typography>
            <Box sx={{ textAlign: "center", flex: 1 }}>
              <Typography variant="caption" color="text.secondary">
                New Qty
              </Typography>
              <Typography
                variant="h5"
                color={newQty < 0 ? "error.main" : "success.main"}
              >
                {newQty}
              </Typography>
            </Box>
          </Box>
        </Grid>

        {newQty < 0 && (
          <Grid size={{ xs: 12 }}>
            <Alert severity="error">
              Warning: New quantity will be negative!
            </Alert>
          </Grid>
        )}

        <Grid size={{ xs: 12 }}>
          <FormInputText
            autoFocus
            control={control}
            type="number"
            label="Adjustment Quantity"
            name="quantity"
            helperText="Use positive values to add, negative to subtract"
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormInputTextArea
            control={control}
            label="Reason"
            name="reason"
            placeholder="Enter reason for adjustment (e.g., Damaged goods, Inventory count correction)"
            minRows={3}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormRootError errors={errors} />
        </Grid>
      </Grid>
    </CustomDialog>
  );
}
