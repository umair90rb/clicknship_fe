import PrimaryButton from "@/components/Button";
import Text from "@/components/Text";
import type { Address, Customer } from "@/types/orders/detail";
import { Box } from "@mui/material";
import useAddressForm from "./useAddressForm";
import { FormInputTextArea } from "@/components/form/FormTextArea";
import FormAutocomplete from "@/components/form/FormAutocomplete";

export default function CustomerDetail({
  customer,
  address,
}: {
  customer: Customer;
  address: Address;
}) {
  const { form, onSubmit } = useAddressForm(address);
  return (
    <>
      <Text bold>
        Name: {customer?.name}
        {customer?.email ? `(${customer?.email})` : ""}
      </Text>
      <Text bold>Phone: {customer?.phone}</Text>
      <FormInputTextArea
        name="address"
        control={form.control}
        label="Address"
        minRows={3}
      />
      <FormInputTextArea
        name="note"
        control={form.control}
        label="Note (This note will print in parcel slip)"
      />
      <FormAutocomplete
        name="city"
        control={form.control}
        label="City"
        options={["faisalabad", "lahore", "karachi"]}
      />
      {/* <Box mt={2} />
      <Text>Country: {address?.country}</Text> */}
      <Box mt={2} />
      <PrimaryButton label="Update Address Info" onClick={onSubmit} />
    </>
  );
}
