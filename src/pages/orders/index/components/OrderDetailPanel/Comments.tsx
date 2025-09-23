// components/LogTimeline.tsx
import type { Comment } from "@/types/orders/detail";
import dayjs from "dayjs";
import { SHORT_DATE_FORMAT } from "@/constants/keys";
import { CustomTimeline } from "@/components/CustomTimeline";

export default function Comments({ comments }: { comments: Comment[] }) {
  return (
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
  );
}
