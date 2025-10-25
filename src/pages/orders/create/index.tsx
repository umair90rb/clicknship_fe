import OrderDialog from "./components/dialog";
import useCreateOrderForm from "./form";

import { Box, Grid, Typography, IconButton, Divider } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import Text from "@/components/Text";

import FormAutocomplete from "@/components/form/FormAutocomplete";
import { FormInputText } from "@/components/form/FormInput";
import FormRootError from "@/components/form/FormRootError";
import CustomIconButton from "@/components/IconButton";
import { useSearchCustomerMutation } from "@/api/orders";
import { useEffect } from "react";
import { FormInputTextArea } from "@/components/form/FormTextArea";

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

function ItemRow({
  control,
  fields,
  errors,
  addItemAfter,
  removeItem,
  updateItemFromSelection,
  clearErrors,
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {fields.map((field, index) => (
        <Grid
          key={field.fieldId}
          container
          spacing={1}
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyItems: "center",
            alignItems: "center",
          }}
        >
          {/* Autocomplete */}
          <Grid size="grow">
            <FormAutocomplete
              placeholer="Select Item"
              name={`items.${index}.name`}
              control={control}
              options={mockItems}
              isOptionEqualToValue={(opt: any, val: any) => opt?.id === val?.id}
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
          <Grid>
            {/* Quantity */}
            <FormInputText
              label="Qty"
              name={`items.${index}.quantity`}
              type="number"
              control={control}
            />
          </Grid>
          <Grid>
            {/* Discount */}
            <FormInputText
              label="Discount"
              name={`items.${index}.discount`}
              type="number"
              control={control}
            />
          </Grid>
          <Grid>
            {/* Unit Price (disabled) */}
            <FormInputText
              label="Unit Price"
              name={`items.${index}.unitPrice`}
              type="number"
              control={control}
              disabled
            />
          </Grid>
          <Grid>
            {/* Total (disabled) */}
            <FormInputText
              label="Total"
              name={`items.${index}.total`}
              type="number"
              control={control}
              disabled
            />
          </Grid>
          <Grid>
            {/* Actions: add after, remove */}
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
          <FormRootError errors={errors} />
        </Grid>
      ))}
    </Box>
  );
}

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
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4, lg: 4, xl: 4 }}>
          <Grid container spacing={1}>
            <Text text="Enter Customer & Address Details" variant="h6" bold />
            <FormInputText
              label="Phone"
              name="customer.phone"
              control={control}
            />
            <FormInputText
              label="Customer name"
              name="customer.name"
              control={control}
            />
            <FormInputTextArea
              minRows={5}
              placeholder="Address"
              name="address.address"
              control={control}
            />
            <FormInputTextArea
              minRows={3}
              placeholder="Address Note (if any)"
              name="address.note"
              control={control}
            />
            <FormAutocomplete
              placeholer="City"
              name="address.city"
              control={control}
              options={["faisalabad", "lahore", "karachi"]}
            />
            <FormInputText
              label="Shipping Charges"
              name="shippingCharges"
              type="number"
              control={control}
            />
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, md: 8, lg: 8, xl: 8 }}>
          <Grid container spacing={1} flexDirection={"column"}>
            <Text text="Enter Items Details" variant="h6" bold />
            <ItemRow
              fields={fields}
              control={control}
              addItemAfter={addItemAfter}
              removeItem={removeItem}
              clearErrors={clearErrors}
              updateItemFromSelection={updateItemFromSelection}
              errors={errors}
            />
          </Grid>
        </Grid>
      </Grid>
      <br />
      <br />
      <br />
      <form onSubmit={onSubmit} noValidate>
        <Grid container spacing={2} sx={{ border: "1px solid black" }}>
          {/* Customer row (example) */}
          <Grid sx={{ border: "1px solid black" }}>
            <FormInputText
              label="Customer name"
              name="customer.name"
              control={control}
            />
          </Grid>
          <Grid sx={{ border: "1px solid black" }}>
            <FormInputText
              label="Phone"
              name="customer.phone"
              control={control}
            />
          </Grid>

          {/* Items header */}
          <Grid sx={{ border: "1px solid black" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: "1px solid black",
              }}
            >
              <Typography variant="h6">Items</Typography>
            </Box>
          </Grid>

          {/* Items list */}
          <Grid sx={{ border: "1px solid black" }}></Grid>

          {/* Summary: tax, shipping, totals */}
          <Grid sx={{ border: "1px solid black" }}>
            <FormInputText
              label="Tax"
              name="tax"
              type="number"
              control={control}
            />
          </Grid>
          <Grid sx={{ border: "1px solid black" }}>
            <FormInputText
              label="Shipping Charges"
              name="shippingCharges"
              type="number"
              control={control}
            />
          </Grid>

          <Grid sx={{ border: "1px solid black" }}>
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
                onClick={() => {
                  (
                    document.querySelector("form") as HTMLFormElement
                  )?.dispatchEvent(new Event("submit", { cancelable: true }));
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </form>
    </OrderDialog>
  );
}
