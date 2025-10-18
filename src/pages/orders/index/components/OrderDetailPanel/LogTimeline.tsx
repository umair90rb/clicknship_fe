// components/LogTimeline.tsx
import dayjs from "dayjs";
import { SHORT_DATE_FORMAT } from "@/constants/keys";
import { CustomTimeline } from "@/components/CustomTimeline";
import { Box } from "@mui/material";
import { selectOrderById } from "@/api/orders";
import { useSelector } from "react-redux";

export default function LogTimeline({ orderId }: { orderId: number }) {
  const order = useSelector(selectOrderById(orderId));
  return (
    <Box sx={{ minHeight: 250 }}>
      <CustomTimeline
        items={order?.logs || []}
        getDate={(log) =>
          log.createdAt ? dayjs(log.createdAt).format(SHORT_DATE_FORMAT) : "-"
        }
        getContent={(log) => log.event}
      />
    </Box>
  );
}
