// components/LogTimeline.tsx
import type { Comment } from "@/types/orders/detail";
import dayjs from "dayjs";
import { SHORT_DATE_FORMAT } from "@/constants/keys";
import { CustomTimeline } from "@/components/CustomTimeline";
import { Box } from "@mui/material";
import { FormInputText } from "@/components/form/FormInput";
import { useForm } from "react-hook-form";
import CustomIconButton from "@/components/IconButton";

export default function Comments({ comments }: { comments: Comment[] }) {
  const { control } = useForm();
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
      <CustomTimeline
        items={comments}
        getDate={(comments) =>
          comments.createdAt
            ? dayjs(comments.createdAt).format(SHORT_DATE_FORMAT)
            : "-"
        }
        getContent={(comment) => comment.comment}
        getDotText={(comment) => comment?.user?.name?.slice(0, 2)}
      />
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
        <CustomIconButton icon="send" size="large" onClick={() => {}} />
      </Box>
    </Box>
  );
}
