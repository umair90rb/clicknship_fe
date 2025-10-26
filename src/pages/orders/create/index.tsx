import OrderDialog from "./components/dialog";
import useCreateOrderForm from "./form";

import { Divider, Grid, IconButton } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DeleteIcon from "@mui/icons-material/Delete";
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
        <FormInputText label="TId" name="payments.tId" control={control} />
      </Grid>
      <Grid>
        <FormInputText label="Bank" name="payments.bank" control={control} />
      </Grid>
      <Grid>
        <FormInputText
          label="Amount"
          name="payments.amount"
          type="number"
          control={control}
        />
      </Grid>
      <Grid>
        <FormInputText label="Type" name="payments.type" control={control} />
      </Grid>

      <Grid>
        <FormInputText label="Note" name="payments.note" control={control} />
      </Grid>
    </Grid>
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
    orderItemsTotalDisc,
    watchedPaymentAmount,
    watchedShipping,
    orderOverallTotal,
    onSubmit,
  } = useCreateOrderForm();

  const { control, getValues, setValue, clearErrors, formState } = form;
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
