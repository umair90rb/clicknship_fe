import PrimaryButton from "@/components/Button";
import Text from "@/components/Text";
import type { Address, Customer } from "@/types/orders/detail";
import { Box } from "@mui/material";
import { FormInputTextArea } from "@/components/form/FormTextArea";
import FormAutocomplete from "@/components/form/FormAutocomplete";
import { FormInputText } from "@/components/form/FormInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { useUpdateOrderMutation } from "@/api/orders";
import { getErrorMessage } from "@/utils";
import FormRootError from "@/components/form/FormRootError";

const schema = Yup.object({
  address: Yup.string().required("Enter valid address!"),
  note: Yup.string().nullable(),
  city: Yup.string().required("Select a city!"),
  shippingCharges: Yup.number().min(0),
});

interface IAddress {
  address: string;
  city: string;
  note?: string | null;
  shippingCharges?: number;
}

export default function CustomerDetail({
  orderId,
  customer,
  address,
  shippingCharges,
}: {
  orderId: number;
  customer: Customer;
  address: Address;
  shippingCharges: number;
}) {
  const [updateOrder, { isLoading }] = useUpdateOrderMutation();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<IAddress>({
    defaultValues: {
      address: address?.address,
      note: address?.note,
      city: address?.city,
      shippingCharges,
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async ({ shippingCharges, ...address }: any) => {
    updateOrder({ id: orderId, body: { address, shippingCharges } })
      .unwrap()
      .then(() => {})
      .catch((error) => setError("root", { message: getErrorMessage(error) }));
  };

  return (
    <>
      <Text bold>
        Name: {customer?.name}
        {customer?.email ? `(${customer?.email})` : ""}
      </Text>
      <Text bold>Phone: {customer?.phone}</Text>
      <FormInputTextArea
        name="address"
        control={control}
        label="Address"
        minRows={3}
      />
      <FormInputTextArea
        name="note"
        control={control}
        label="Note (This note will print in parcel slip)"
      />
      <FormAutocomplete
        name="city"
        control={control}
        label="City"
        options={["faisalabad", "lahore", "karachi"]}
      />
      <Box mt={2} />
      <FormInputText
        type="number"
        name="shippingCharges"
        control={control}
        label="Shipping Charges"
      />
      {/* <Box mt={2} />
      <Text>Country: {address?.country}</Text> */}
      <FormRootError errors={errors} />
      <Box mt={2} />
      <PrimaryButton
        loading={isLoading}
        label="Update Address Info"
        onClick={handleSubmit(onSubmit)}
      />
    </>
  );
}
