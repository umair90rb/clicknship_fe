import PrimaryButton from "@/components/Button";
import FormAutocomplete from "@/components/form/FormAutocomplete";
import { FormInputTextArea } from "@/components/form/FormTextArea";
import { Box } from "@mui/material";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { getErrorMessage } from "@/utils";
import { selectOrderById, useUpdateOrderMutation } from "@/api/orders";
import { yupResolver } from "@hookform/resolvers/yup";
import FormRootError from "@/components/form/FormRootError";
import { useSelector } from "react-redux";

const schema = Yup.object({
  tags: Yup.array().of(Yup.string()).nullable(),
  remarks: Yup.string().nullable(),
});

interface ITagsAndRemarks {
  tags: string[] | null;
  remarks: string | null;
}

export default function RemarksAndTags({ orderId }: { orderId: number }) {
  const [updateOrder, { isLoading }] = useUpdateOrderMutation();
  const order = useSelector(selectOrderById(orderId));

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ITagsAndRemarks>({
    defaultValues: {
      remarks: order?.remarks,
      tags: order?.tags,
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (body: any) => {
    updateOrder({ id: orderId, body })
      .unwrap()
      .then(() => {})
      .catch((error) => setError("root", { message: getErrorMessage(error) }));
  };
  return (
    <Box
      sx={{
        minHeight: 250,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
      }}
    >
      <FormInputTextArea
        name="remarks"
        control={control}
        placeholder="Remarks"
        minRows={5}
      />
      <FormAutocomplete
        multiple
        name="tags"
        label="Tags"
        control={control}
        options={["tag1", "tag2"]}
      />
      <FormRootError errors={errors} />
      <PrimaryButton
        label="Update"
        loading={isLoading}
        onClick={handleSubmit(onSubmit)}
      />
    </Box>
  );
}
