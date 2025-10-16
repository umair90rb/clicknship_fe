import PrimaryButton from "@/components/Button";
import Text from "@/components/Text";
import { Box } from "@mui/material";
import { FormInputTextArea } from "@/components/form/FormTextArea";
import FormAutocomplete from "@/components/form/FormAutocomplete";
import { FormInputText } from "@/components/form/FormInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { selectOrderById, useUpdateOrderMutation } from "@/api/orders";
import { getErrorMessage } from "@/utils";
import FormRootError from "@/components/form/FormRootError";
import { useSelector } from "react-redux";

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

export default function CustomerDetail({ orderId }: { orderId: number }) {
  const [updateOrder, { isLoading }] = useUpdateOrderMutation();
  const order = useSelector(selectOrderById(orderId));

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<IAddress>({
    defaultValues: {
      address: order?.address?.address,
      note: order?.address?.note,
      city: order?.address?.city,
      shippingCharges: order?.shippingCharges,
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
        Name: {order?.customer?.name}
        {order?.customer?.email ? `(${order?.customer?.email})` : ""}
      </Text>
      <Text bold>Phone: {order?.customer?.phone}</Text>
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
