import { useLocation, useNavigate } from "react-router";
import OrderDialog from "./components/dialog";
import useCreateOrderForm from "./form";

import { Box, Grid } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DeleteIcon from "@mui/icons-material/Delete";
import Text from "@/components/Text";

import FormAutocomplete from "@/components/form/FormAutocomplete";
import { FormInputText } from "@/components/form/FormInput";
import FormRootError from "@/components/form/FormRootError";
import CustomIconButton from "@/components/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { FormInputTextArea } from "@/components/form/FormTextArea";
import FormToggleButtons from "@/components/form/FormToggleButtons";
import { useEffect } from "react";

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
  return fields.map((field, index) => (
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
      <Grid size={4.5}>
        <FormAutocomplete
          placeholer="Select Item"
          name={`items.${index}.name`}
          control={control}
          options={mockItems}
          setValue={(value, options) =>
            options.find((opt) => opt.name === value)
          }
          isOptionEqualToValue={(opt: any, val: any) => opt?.name === val?.name}
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
      <Grid size={1}>
        {/* Quantity */}
        <FormInputText
          label="Qty"
          name={`items.${index}.quantity`}
          type="number"
          control={control}
        />
      </Grid>
      <Grid size={1.5}>
        {/* Discount */}
        <FormInputText
          label="Discount"
          name={`items.${index}.discount`}
          type="number"
          control={control}
        />
      </Grid>
      <Grid size={1.5}>
        {/* Unit Price (disabled) */}
        <FormInputText
          label="Unit Price"
          name={`items.${index}.unitPrice`}
          type="number"
          control={control}
          disabled
        />
      </Grid>
      <Grid size={2}>
        {/* Total (disabled) */}
        <FormInputText
          label="Total"
          name={`items.${index}.total`}
          type="number"
          control={control}
          disabled
        />
      </Grid>
      <Grid size={1.5} container justifyContent={"space-evenly"}>
        {/* Actions: add after, remove */}
        <CustomIconButton
          size="medium"
          tooltip="Add row after"
          Icon={AddBoxIcon}
          onClick={() => addItemAfter(index)}
        />
        <CustomIconButton
          size="medium"
          color="error"
          tooltip="Remove"
          Icon={DeleteIcon}
          onClick={() => removeItem(index)}
        />
      </Grid>
      {/* Optional error row */}
      <FormRootError errors={errors} />
    </Grid>
  ));
}

function PaymentRow({ control }) {
  return (
    <Grid
      container
      spacing={1}
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyItems: "center",
        alignItems: "center",
      }}
    >
      <Grid size="grow">
        <FormInputText label="TId" name="payment.tId" control={control} />
      </Grid>
      <Grid>
        <FormInputText label="Bank" name="payment.bank" control={control} />
      </Grid>
      <Grid>
        <FormInputText
          label="Amount"
          name="payment.amount"
          type="number"
          control={control}
        />
      </Grid>
      <Grid>
        <FormToggleButtons
          options={["Cash", "Transfer"]}
          name="payment.type"
          control={control}
        />
      </Grid>

      <Grid>
        <FormInputText label="Note" name="payment.note" control={control} />
      </Grid>
    </Grid>
  );
}

export default function CreateOrder() {
  const {
    form,
    fields,
    addItemAfter,
    removeItem,
    updateItemFromSelection,
    onSearchCustomer,
    isSearchingCustomer,
    orderItemsTotal,
    orderItemsTotalDisc,
    watchedPaymentAmount,
    watchedShipping,
    orderOverallTotal,
    handleSubmit,
    onSubmit,
    isCreatingOrder,
    orderCreatedSuccessfully,
    orderCreationError,
  } = useCreateOrderForm();

  const { control, clearErrors, formState } = form;
  const { errors, isSubmitting } = formState;

  const navigate = useNavigate();

  const onClose = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (orderCreatedSuccessfully) {
      onClose();
    }
  }, [orderCreatedSuccessfully]);

  return (
    <OrderDialog
      loading={isCreatingOrder}
      onSaveAsConfirm={handleSubmit((data) => onSubmit(data, "confirmed"))}
      onSaveAsDraft={handleSubmit((data) => onSubmit(data, "draft"))}
      handleClose={onClose}
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4, lg: 4, xl: 4 }}>
          <Grid container spacing={1}>
            <Text text="Enter Customer & Address Details" variant="h6" bold />
            <Box
              sx={{
                width: "100%",
                border: "0px solid black",
                display: "flex",
                flexDirection: "row",
              }}
            >
              <FormInputText
                label="Customer Phone"
                name="customer.phone"
                control={control}
              />
              <CustomIconButton
                loading={isSearchingCustomer}
                Icon={SearchIcon}
                onClick={onSearchCustomer}
              />
            </Box>
            <FormInputText
              label="Customer Name"
              name="customer.name"
              control={control}
            />
            <FormInputText
              label="Customer Email"
              name="customer.email"
              control={control}
            />
            <FormAutocomplete
              name="channel"
              placeholer="Order Channel"
              control={control}
              errorKey={"name"}
              isOptionEqualToValue={(opt: any, val: any) => opt?.id === val?.id}
              getOptionLabel={(opt: any) => opt?.name ?? ""}
              options={[
                { id: 1, name: "Store", brandId: 1 },
                { id: 2, name: "Other Store", brandId: 2 },
              ]}
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
            <FormInputTextArea
              minRows={3}
              placeholder="Order Remarks/Note (if any)"
              name="remarks"
              control={control}
            />
            <FormAutocomplete
              multiple
              name="tags"
              placeholer="Tags"
              control={control}
              options={["tag1", "tag2"]}
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
            <Text text="Add Payment Detail (if required)" variant="h6" bold />
            <PaymentRow control={control} />
          </Grid>
        </Grid>

        <Grid
          container
          direction={"row"}
          justifyContent={"space-evenly"}
          size="grow"
        >
          <Grid>
            <Text bold>Subtotal</Text>
            <Text bold>Rs.{orderItemsTotal}</Text>
          </Grid>
          <Grid>
            <FormInputText
              label="Tax"
              name="tax"
              type="number"
              control={control}
            />
          </Grid>
          <Grid>
            <Text bold>Shipping</Text>
            <Text bold>Rs.{watchedShipping}</Text>
          </Grid>
          <Grid>
            <Text bold>T.Discount</Text>
            <Text bold>Rs.{orderItemsTotalDisc}</Text>
          </Grid>
          <Grid>
            <Text bold>T.Payments</Text>
            <Text bold>Rs.{watchedPaymentAmount}</Text>
          </Grid>
          <Grid>
            <Text bold>G.Total</Text>
            <Text bold>Rs.{orderOverallTotal}</Text>
          </Grid>
        </Grid>
      </Grid>
    </OrderDialog>
  );
}
