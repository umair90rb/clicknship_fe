import CustomTable from "@/components/CustomTable";
import { FormInputText } from "@/components/form/FormInput";
import CustomIconButton from "@/components/IconButton";
import type { Payment } from "@/types/orders/detail";
import { Box } from "@mui/material";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { getErrorMessage } from "@/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import FormRootError from "@/components/form/FormRootError";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { selectOrderById, useCreateOrderPaymentMutation } from "@/api/orders";
import { useSelector } from "react-redux";

const schema = Yup.object({
  tId: Yup.string(),
  bank: Yup.string(),
  amount: Yup.number().required().min(0, "Must be greater than 0"),
  type: Yup.string().nullable().required("Please enter payment type"),
  note: Yup.string().nullable(),
});

const columns = [
  { id: "tId", label: "Tid#" },
  { id: "bank", label: "Bank" },
  { id: "amount", label: "Amount" },
  { id: "type", label: "Type" },
  { id: "note", label: "Note" },
];

type TPaymentForm = Payment;

export default function PaymentsTable({ orderId }: { orderId: number }) {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<TPaymentForm>({
    resolver: yupResolver(schema),
  });

  const order = useSelector(selectOrderById(orderId));
  const [postPayment, { isLoading }] = useCreateOrderPaymentMutation();

  const onSubmit = async (body: TPaymentForm) => {
    postPayment({ orderId, body })
      .unwrap()
      .then(() => {})
      .catch((error) => setError("root", { message: getErrorMessage(error) }));
  };
  return (
    <Box
      sx={{
        minHeight: 250,
        display: "flex",
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <CustomTable
        rowIdKey="id"
        columns={columns}
        rows={order?.payments || []}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 1,
        }}
      >
        <FormInputText name="tId" control={control} placeholer="Tid" />
        <FormInputText name="bank" control={control} placeholer="Bank" />
        <FormInputText
          name="amount"
          type="number"
          control={control}
          placeholer="Amount"
        />
        <FormInputText name="type" control={control} placeholer="Type" />
        <Box sx={{ flexBasis: "300%" }}>
          <FormInputText name="note" control={control} placeholer="Note" />
        </Box>
        <FormRootError errors={errors} />
        <CustomIconButton
          Icon={AddBoxIcon}
          size="large"
          loading={isLoading}
          onClick={handleSubmit(onSubmit)}
        />
      </Box>
    </Box>
  );
}
