import OrderDialog from "./components/dialog";
import useCreateOrderForm from "./form";

import { Box, Grid, Typography, IconButton, Divider } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";

// --- replace these imports with your actual component paths ---
import FormAutocomplete from "@/components/form/FormAutocomplete";
import { FormInputText } from "@/components/form/FormInput";
import FormRootError from "@/components/form/FormRootError";
import CustomIconButton from "@/components/IconButton";
import { useSearchCustomerMutation } from "@/api/orders";
import { useEffect } from "react";
// -------------------------------------------------------------

// mock items you provided
const mockItems = [
  {
    id: 1,
    name: "JOINT ON 50 ML",
    unitPrice: 2000,
    grams: 10,
    sku: "JNT-50",
    productId: "abc",
    variantId: "cde",
  },
  {
    id: 2,
    name: "JOINT ON 20 ML",
    unitPrice: 1500,
    grams: 20,
    sku: "JNT-20",
    productId: "abc",
    variantId: "cde",
  },
  {
    id: 3,
    name: "FLEX ON 20 ML",
    unitPrice: 2500,
    grams: 30,
    sku: "FLX-50",
    productId: "abc",
    variantId: "cde",
  },
];

export default function CreateOrder() {
  const [searchCustomer, { isLoading, data }] = useSearchCustomerMutation();
  const {
    form,
    fields,
    addItem,
    addItemAfter,
    removeItem,
    updateItemFromSelection,
    orderItemsTotal,
    orderOverallTotal,
    onSubmit,
  } = useCreateOrderForm();

  const { control, setValue, clearErrors, formState } = form;
  const { errors, isSubmitting } = formState;

  const search = () =>
    searchCustomer({ phone: "03051866823", withAddress: true }).unwrap();

  useEffect(() => {
    console.log(data);
  }, [isLoading]);

  return (
    <OrderDialog>
      <form onSubmit={onSubmit} noValidate>
        <Grid container spacing={2}>
          {/* Customer row (example) */}
          <Grid item xs={12} md={6}>
            <FormInputText
              label="Customer name"
              name="customer.name"
              control={control}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormInputText
              label="Phone"
              name="customer.phone"
              control={control}
            />
          </Grid>

          {/* Items header */}
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6">Items</Typography>
              <CustomIconButton
                Icon={AddBoxIcon}
                size="large"
                onClick={addItem}
              />
            </Box>
          </Grid>

          {/* Items list */}
          <Grid item xs={12}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {fields.map((field, index) => (
                <Box
                  key={field.fieldId}
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  <Grid container spacing={1} alignItems="flex-end">
                    {/* Autocomplete */}
                    <Grid item xs={12} md={5}>
                      <FormAutocomplete
                        label="Select Item"
                        placeholder="Select Item"
                        name={`items.${index}.name`}
                        control={control}
                        options={mockItems}
                        isOptionEqualToValue={(opt: any, val: any) =>
                          opt?.id === val?.id
                        }
                        getOptionLabel={(opt: any) => opt?.name ?? ""}
                        onChange={(_e: any, value: any) => {
                          // clear errors on name field
                          clearErrors([`items.${index}.name`]);
                          // update the whole item except quantity & discount
                          updateItemFromSelection(
                            index,
                            value
                              ? {
                                  name: value.name,
                                  sku: value.sku,
                                  grams: value.grams,
                                  unitPrice: value.unitPrice,
                                  productId: value.productId,
                                  variantId: value.variantId,
                                }
                              : null
                          );
                        }}
                      />
                    </Grid>

                    {/* Quantity */}
                    <Grid item xs={6} sm={3} md={1}>
                      <FormInputText
                        label="Qty"
                        name={`items.${index}.quantity`}
                        type="number"
                        control={control}
                      />
                    </Grid>

                    {/* Discount */}
                    <Grid item xs={6} sm={3} md={1}>
                      <FormInputText
                        label="Discount"
                        name={`items.${index}.discount`}
                        type="number"
                        control={control}
                      />
                    </Grid>

                    {/* Unit Price (disabled) */}
                    <Grid item xs={6} sm={3} md={2}>
                      <FormInputText
                        label="Unit Price"
                        name={`items.${index}.unitPrice`}
                        type="number"
                        control={control}
                        disabled
                      />
                    </Grid>

                    {/* Total (disabled) */}
                    <Grid item xs={6} sm={3} md={2}>
                      <FormInputText
                        label="Total"
                        name={`items.${index}.total`}
                        type="number"
                        control={control}
                        disabled
                      />
                    </Grid>

                    {/* Actions: add after, remove */}
                    <Grid item xs={12} md={1} sx={{ display: "flex", gap: 1 }}>
                      <IconButton
                        size="small"
                        title="Add row after"
                        onClick={() => addItemAfter(index)}
                      >
                        <AddBoxIcon />
                      </IconButton>

                      <IconButton
                        size="small"
                        title="Remove"
                        onClick={() => removeItem(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>

                    {/* Optional error row */}
                    <Grid item xs={12}>
                      <FormRootError errors={errors} />
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Summary: tax, shipping, totals */}
          <Grid item xs={12} md={6}>
            <FormInputText
              label="Tax"
              name="tax"
              type="number"
              control={control}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormInputText
              label="Shipping Charges"
              name="shippingCharges"
              type="number"
              control={control}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider />
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                alignItems: "center",
                py: 1,
              }}
            >
              <Box>
                <Typography variant="body2">Items total:</Typography>
                <Typography variant="h6">{orderItemsTotal}</Typography>
              </Box>
              <Box>
                <Typography variant="body2">
                  Order total (incl. tax & shipping):
                </Typography>
                <Typography variant="h5">{orderOverallTotal}</Typography>
              </Box>
              <CustomIconButton
                Icon={SaveIcon}
                size="large"
                loading={isSubmitting}
                onClick={search}
                // onClick={() => {
                //   // trigger submission via hook
                //   // call form.handleSubmit by submitting the form
                //   // but since this button isn't type="submit", call onSubmit directly
                //   // onSubmit already wraps handleSubmit
                //   (
                //     document.querySelector("form") as HTMLFormElement
                //   )?.dispatchEvent(new Event("submit", { cancelable: true }));
                // }}
              />
            </Box>
          </Grid>
        </Grid>
      </form>
    </OrderDialog>
  );
}
