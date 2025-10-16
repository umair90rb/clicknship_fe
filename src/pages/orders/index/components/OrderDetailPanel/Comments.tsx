// components/LogTimeline.tsx
import dayjs from "dayjs";
import { SHORT_DATE_FORMAT } from "@/constants/keys";
import { Box, Divider } from "@mui/material";
import { FormInputText } from "@/components/form/FormInput";
import { useForm } from "react-hook-form";
import CustomIconButton from "@/components/IconButton";
import SendIcon from "@mui/icons-material/Send";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { selectOrderById, usePostOrderCommentMutation } from "@/api/orders";
import { getErrorMessage } from "@/utils";
import { useSelector } from "react-redux";

const schema = Yup.object({
  comment: Yup.string().required("Comment is required"),
});

export default function Comments({ orderId }: { orderId: number }) {
  const order = useSelector(selectOrderById(orderId));
  const { control, setValue, setError, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });
  const [postComment, { isLoading }] = usePostOrderCommentMutation();

  const onSubmit = async (data: { comment: string }) =>
    postComment({ orderId, data })
      .unwrap()
      .then(() => setValue("comment", ""))
      .catch((error) =>
        setError("comment", { message: getErrorMessage(error) })
      );

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
      <div>
        {order?.comments?.map((c) => (
          <div key={c?.id}>
            <strong>
              {c?.user?.name || "You"}(
              {dayjs(c?.createdAt).format(SHORT_DATE_FORMAT)})
            </strong>
            : {c?.comment}
            <Divider />
          </div>
        ))}
      </div>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Box sx={{ flexBasis: "400%" }}>
          <FormInputText
            name="comment"
            control={control}
            placeholer="Comment"
          />
        </Box>
        <CustomIconButton
          loading={isLoading}
          Icon={SendIcon}
          size="large"
          onClick={handleSubmit(onSubmit)}
        />
      </Box>
    </Box>
  );
}
